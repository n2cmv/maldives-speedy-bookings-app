
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Ship, Calendar, Users, ChevronRight } from "lucide-react";
import { Island } from "@/types/island";

interface IslandCardsProps {
  onSelectDestination: (island: string) => void;
}

const IslandCards = ({ onSelectDestination }: IslandCardsProps) => {
  const [islandsData, setIslandsData] = useState<Island[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fallback islands in case the DB fetch fails
  const fallbackIslands = [
    {
      name: "A.Dh Dhigurah",
      image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb",
      description: "Famous for its pristine beaches and stunning coral reefs. Perfect for snorkeling enthusiasts.",
      travelTime: "1.5 hours",
      bestFor: "Snorkeling & Beach"
    },
    {
      name: "A.Dh Dhangethi",
      image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21",
      description: "A tranquil island with rich cultural heritage and traditional Maldivian lifestyle.",
      travelTime: "2 hours",
      bestFor: "Cultural Experience"
    }
  ];
  
  useEffect(() => {
    const fetchIslands = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('islands')
          .select('*')
          .limit(2);
        
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

  // Mapping db islands to display format or use fallback if needed
  const displayIslands = islandsData.length > 0 
    ? islandsData.map((island, index) => ({
        name: island.name,
        image: island.image_url || fallbackIslands[index % 2].image,
        description: island.description,
        // Using fixed values for these as they're not in the DB schema
        travelTime: fallbackIslands[index % 2].travelTime,
        bestFor: fallbackIslands[index % 2].bestFor
      }))
    : fallbackIslands;

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-10 w-10 border-4 border-t-ocean border-opacity-50 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {displayIslands.map((island) => (
        <Card key={island.name} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div className="relative h-48">
            <img
              src={island.image}
              alt={`${island.name} Island`}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-white/90 rounded-full py-1 px-3 flex items-center">
              <Ship className="w-4 h-4 text-ocean mr-1" />
              <span className="text-xs font-medium text-ocean-dark">{island.travelTime}</span>
            </div>
          </div>
          
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl font-bold text-ocean-dark">{island.name}</CardTitle>
            </div>
            <div className="flex items-center text-gray-500 text-sm">
              <MapPin className="w-4 h-4 mr-1" />
              <span>Maldives</span>
            </div>
          </CardHeader>
          
          <CardContent className="py-2">
            <CardDescription className="text-gray-600">{island.description}</CardDescription>
            
            <div className="mt-3 flex items-center text-sm text-gray-500">
              <span className="bg-ocean/10 text-ocean px-2 py-1 rounded-full text-xs font-medium">
                Best for: {island.bestFor}
              </span>
            </div>
          </CardContent>
          
          <CardFooter className="pt-2">
            <Button 
              onClick={() => onSelectDestination(island.name)} 
              className="w-full bg-ocean hover:bg-ocean-dark text-white flex items-center justify-center gap-2"
            >
              Book This Destination
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default IslandCards;
