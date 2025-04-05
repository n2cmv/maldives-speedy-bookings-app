
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Island } from "@/types/island";
import { Time } from "@/types/booking";
import { toast } from "sonner";
import PopularDestinations from "./PopularDestinations";
import { allTimes, fallbackIslands } from "./booking/constants";
import BookingForm from "./booking/BookingForm";
import { Card } from "./ui/card";

interface BookingSectionProps {
  preSelectedIsland?: string;
}

const BookingSection = ({ preSelectedIsland }: BookingSectionProps = {}) => {
  const [islandsData, setIslandsData] = useState<Island[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const fetchIslands = async () => {
    setIsLoading(true);
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
      
      console.log('BookingSection - Routes data with display order and timings:', routesData);
      
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
          
          // Enhanced logging for route timings
          console.log(`BookingSection - Route ${route.from_location} to ${route.to_location} timings:`, route.timings);
        });
      }
      
      console.log('BookingSection - Unique islands with order:', Array.from(islandOrder.entries()));
      
      // Then get island details from islands table
      const { data, error } = await supabase
        .from('islands')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching islands:', error);
        return;
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
        
        console.log('BookingSection - Sorted islands:', sortedIslands.map(i => i.name));
        setIslandsData(sortedIslands);
      }
    } catch (error) {
      console.error('Error fetching islands:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
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
    
    fetchIslands();
    
    // Clean up subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  const islandNames = islandsData.length > 0 
    ? islandsData.map(island => island.name) 
    : fallbackIslands;

  const validatedAllTimes = Object.values(Time);

  return (
    <div className="min-h-screen pb-16 px-4">
      <div className="max-w-lg mx-auto">
        <Card className="p-6 md:p-8 shadow-lg bg-white/95 backdrop-blur-sm border border-ocean/10 rounded-xl">
          <h2 className="text-2xl font-bold text-ocean-dark mb-6 text-center">Book Your Speedboat</h2>
          
          <PopularDestinations onSelectDestination={() => {}} />
          
          <div className="mt-6">
            <BookingForm 
              preSelectedIsland={preSelectedIsland}
              islandNames={islandNames}
              isLoading={isLoading}
              timeRestrictions={{}}
              allTimes={validatedAllTimes}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BookingSection;
