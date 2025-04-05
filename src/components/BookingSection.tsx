
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Island } from "@/types/island";
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
        const { data, error } = await supabase
          .from('islands')
          .select('*')
          .order('name');
        
        if (error) {
          console.error('Error fetching islands:', error);
          return;
        }
        
        if (data && data.length > 0) {
          setIslandsData(data);
        }
      } catch (error) {
        console.error('Error fetching islands:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchIslands();
  }, []);
  
  const islandNames = islandsData.length > 0 
    ? islandsData.map(island => island.name) 
    : fallbackIslands;

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
          allTimes={allTimes}
        />
      </div>
    </div>
  );
};

export default BookingSection;
