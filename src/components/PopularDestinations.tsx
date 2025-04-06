
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Sun, Ship, Anchor } from "lucide-react";

interface PopularDestinationsProps {
  onSelectDestination: (island: string) => void;
}

const PopularDestinations = ({ onSelectDestination }: PopularDestinationsProps) => {
  const [popularIslands, setPopularIslands] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Map for translating between display names and actual locations
  const islandMappings: Record<string, string> = {
    "A.Dh Dhigurah": "A.Dh Dhigurah",
    "A.Dh Dhangethi": "A.Dh Dhangethi",
    "Male": "Male' City"
  };

  // Fallback destinations with icons in case the DB fetch fails
  const fallbackDestinations = [
    { name: "A.Dh Dhigurah", icon: <Sun className="h-4 w-4 text-amber-500" /> },
    { name: "A.Dh Dhangethi", icon: <Ship className="h-4 w-4 text-blue-500" /> },
    { name: "Male", icon: <Anchor className="h-4 w-4 text-teal-500" /> }
  ];
  
  useEffect(() => {
    const fetchPopularIslands = async () => {
      setIsLoading(true);
      try {
        // Explicitly set Dhigurah and Dhangethi as popular islands
        const popularNames = ["A.Dh Dhigurah", "A.Dh Dhangethi", "Male"];
        setPopularIslands(popularNames);
      } catch (error) {
        console.error('Error fetching popular islands:', error);
        setPopularIslands(["A.Dh Dhigurah", "A.Dh Dhangethi", "Male"]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPopularIslands();
  }, []);

  // Use DB islands or fallbacks if not available
  const displayDestinations = popularIslands.length > 0 
    ? popularIslands.map((name, index) => ({
        name,
        icon: [
          <Sun key="sun" className="h-4 w-4 text-amber-500" />,
          <Ship key="ship" className="h-4 w-4 text-blue-500" />,
          <Anchor key="anchor" className="h-4 w-4 text-teal-500" />
        ][index % 3]
      })) 
    : fallbackDestinations;

  if (isLoading) {
    return (
      <div className="mb-12 flex flex-col items-center">
        <h3 className="text-lg font-semibold text-ocean-dark mb-3">Popular Islands</h3>
        <div className="flex flex-wrap justify-center gap-2">
          <div className="h-8 w-8 border-2 border-t-ocean border-opacity-50 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12 flex flex-col items-center">
      <h3 className="text-lg font-semibold text-ocean-dark mb-3">Popular Islands</h3>
      <div className="flex flex-wrap justify-center gap-2">
        {displayDestinations.map((dest) => (
          <Button 
            key={dest.name} 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1.5 bg-white border-primary/30 hover:bg-white hover:border-primary hover:text-primary"
            onClick={() => {
              console.log("Popular island selected:", dest.name);
              // Map to the correct island name if needed
              const mappedName = islandMappings[dest.name] || dest.name;
              console.log("Mapped to:", mappedName);
              onSelectDestination(mappedName);
            }}
          >
            {dest.icon}
            <span>{dest.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default PopularDestinations;
