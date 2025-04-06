
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Island } from "@/types/island";
import { Time } from "@/types/booking";
import { toast } from "sonner";
import { allTimes, fallbackIslands } from "./constants";
import BookingForm from "./BookingForm";
import { Card } from "@/components/ui/card";
import PopularDestinations from "./PopularDestinations";
import { motion } from "framer-motion";

interface BookingSectionProps {
  preSelectedIsland?: string;
}

const BookingSection = ({ preSelectedIsland }: BookingSectionProps = {}) => {
  const [islandsData, setIslandsData] = useState<Island[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedFromIsland, setSelectedFromIsland] = useState<string>("");
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  
  const fetchIslands = async () => {
    if (!isInitialized) setIsLoading(true);
    
    try {
      // First get routes in the correct display order
      const { data: routesData, error: routesError } = await supabase
        .from('routes')
        .select('from_location, to_location, display_order, timings')
        .order('display_order', { ascending: true });
        
      if (routesError) {
        console.error('Error fetching routes:', routesError);
        throw routesError;
      }
      
      // Extract unique islands from routes
      const uniqueIslands = new Set<string>();
      const islandOrder = new Map<string, number>();
      
      if (routesData) {
        routesData.forEach(route => {
          if (!islandOrder.has(route.from_location)) {
            islandOrder.set(route.from_location, route.display_order || 0);
          }
          if (!islandOrder.has(route.to_location)) {
            // Use the same order for destination or increment it slightly
            islandOrder.set(route.to_location, (route.display_order || 0) + 0.1);
          }
          
          uniqueIslands.add(route.from_location);
          uniqueIslands.add(route.to_location);
        });
      }
      
      // Then get island details from islands table
      const { data, error } = await supabase
        .from('islands')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching islands:', error);
        throw error;
      }
      
      if (data && data.length > 0) {
        // Sort islands according to route display order if possible
        const sortedIslands = [...data];
        if (uniqueIslands.size > 0) {
          sortedIslands.sort((a, b) => {
            // If island is in routes, sort by route order
            const aOrder = islandOrder.get(a.name);
            const bOrder = islandOrder.get(b.name);
            
            if (aOrder !== undefined && bOrder !== undefined) {
              return aOrder - bOrder;
            }
            if (aOrder !== undefined) return -1;
            if (bOrder !== undefined) return 1;
            return a.name.localeCompare(b.name);
          });
        }
        
        setIslandsData(sortedIslands);
        setIsInitialized(true);
      }
    } catch (error) {
      console.error('Error fetching islands:', error);
      // Use fallback islands if there's an error
      if (!isInitialized) {
        setIslandsData([]);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    // Initial data fetch
    fetchIslands();
    
    // Set up real-time subscription to listen for route changes
    const channel = supabase
      .channel('routes-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'routes' },
        (payload) => {
          console.log('Route update detected in booking section:', payload);
          // Refresh the islands data when routes are updated
          fetchIslands();
          toast.info('Routes have been updated', {
            description: 'Route information has been refreshed'
          });
        }
      )
      .subscribe();
    
    // Clean up subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  const islandNames = islandsData.length > 0 
    ? islandsData.map(island => island.name) 
    : fallbackIslands;

  const validatedAllTimes = Object.values(Time);
  
  const handleSelectFromIsland = (island: string) => {
    setSelectedFromIsland(island);
  };

  return (
    <div className="min-h-screen pb-16 px-4">
      <div className="max-w-lg mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 100,
            damping: 20
          }}
        >
          <Card className="p-6 md:p-8 shadow-xl bg-white/95 dark:bg-gray-800/90 backdrop-blur-md border border-ocean/10 dark:border-ocean/5 rounded-2xl apple-card">
            <h2 className="text-2xl font-bold text-ocean-dark dark:text-white mb-6 text-center">Book Your Speedboat</h2>
            
            <PopularDestinations onSelectFromIsland={handleSelectFromIsland} />
            
            <div className="mt-6">
              <BookingForm 
                preSelectedIsland={preSelectedIsland}
                preSelectedFrom={selectedFromIsland}
                islandNames={islandNames}
                isLoading={isLoading}
                timeRestrictions={{}}
                allTimes={validatedAllTimes}
              />
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default BookingSection;
