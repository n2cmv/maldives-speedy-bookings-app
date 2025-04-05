
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Island } from "@/types/island";
import { Time } from "@/types/booking";
import { toast } from "sonner";
import PopularDestinations from "./PopularDestinations";
import { allTimes, fallbackIslands } from "./booking/constants";
import BookingForm from "./booking/BookingForm";

interface BookingSectionProps {
  preSelectedIsland?: string;
}

const BookingSection = ({ preSelectedIsland }: BookingSectionProps = {}) => {
  const [islandsData, setIslandsData] = useState<Island[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  useEffect(() => {
    const fetchIslands = async () => {
      setIsLoading(true);
      try {
        // First get routes in the correct display order
        const { data: routesData, error: routesError } = await supabase
          .from('routes')
          .select('from_location, to_location')
          .order('display_order', { ascending: true });
          
        if (routesError) {
          console.error('Error fetching routes:', routesError);
          throw routesError;
        }
        
        // Extract unique islands from routes
        const uniqueIslands = new Set<string>();
        if (routesData) {
          routesData.forEach(route => {
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
          return;
        }
        
        if (data && data.length > 0) {
          // Sort islands according to route display order if possible
          const sortedIslands = [...data];
          if (uniqueIslands.size > 0) {
            sortedIslands.sort((a, b) => {
              // If island is in routes, sort by route order
              const aIndex = Array.from(uniqueIslands).indexOf(a.name);
              const bIndex = Array.from(uniqueIslands).indexOf(b.name);
              if (aIndex >= 0 && bIndex >= 0) return aIndex - bIndex;
              if (aIndex >= 0) return -1;
              if (bIndex >= 0) return 1;
              return a.name.localeCompare(b.name);
            });
          }
          
          setIslandsData(sortedIslands);
        }
      } catch (error) {
        console.error('Error fetching islands:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Set up real-time subscription to listen for route changes
    const channel = supabase
      .channel('routes-changes')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'routes' },
        () => {
          // Refresh the islands data when routes are updated
          fetchIslands();
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
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-md mx-auto booking-card">
        <h2 className="text-2xl font-bold text-ocean-dark mb-6">Book Your Speedboat</h2>
        
        <PopularDestinations onSelectDestination={(island) => {}} />
        
        <BookingForm 
          preSelectedIsland={preSelectedIsland}
          islandNames={islandNames}
          isLoading={isLoading}
          timeRestrictions={{}}
          allTimes={validatedAllTimes}
        />
      </div>
    </div>
  );
};

export default BookingSection;
