
import { Button } from "@/components/ui/button";
import { Sun, TreePine, Anchor, Plane, ChevronRight } from "lucide-react";

interface PopularDestinationsProps {
  onSelectToIsland: (island: string) => void;
  fromLocation?: string;
}

const PopularDestinations = ({ onSelectToIsland, fromLocation }: PopularDestinationsProps) => {
  const popularIslands = [
    { name: "Dhigurah", icon: <Sun className="text-yellow-500" size={16} /> },
    { name: "Dhangethi", icon: <TreePine className="text-green-500" size={16} /> },
    { name: "Male' City", icon: <Anchor className="text-teal-500" size={16} /> },
    { name: "Male' Airport", icon: <Plane className="text-gray-500" size={16} /> }
  ];
  
  // Filter destinations based on selected origin
  const filteredIslands = popularIslands.filter(island => {
    // Can't select same island as origin
    if (island.name === fromLocation) return false;
    // Can't select Male' Airport if origin is Male' City
    if (fromLocation === "Male' City" && island.name === "Male' Airport") return false;
    // Can't select Male' City if origin is Male' Airport
    if (fromLocation === "Male' Airport" && island.name === "Male' City") return false;
    return true;
  });

  return (
    <div className="mt-4 mb-6">
      <p className="text-lg font-medium text-ocean-dark mb-4 text-center">Popular Destinations</p>
      <div className="flex flex-wrap justify-center gap-3">
        {filteredIslands.map((island) => (
          <Button
            key={island.name}
            variant="outline"
            size="sm"
            className="bg-white hover:bg-ocean/5 hover:text-ocean text-ocean-dark border-ocean-light/30 rounded-full pl-3 pr-4 py-5 flex gap-2 items-center font-medium transition-all"
            onClick={() => onSelectToIsland(island.name)}
          >
            {island.icon}
            {island.name}
            <ChevronRight className="h-3 w-3 ml-1 opacity-70" />
          </Button>
        ))}
      </div>
    </div>
  );
};

export default PopularDestinations;
