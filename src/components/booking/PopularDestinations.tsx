
import { Button } from "@/components/ui/button";
import { Sun, Building, Anchor, Plane } from "lucide-react";

interface PopularDestinationsProps {
  onSelectFromIsland: (island: string) => void;
}

const PopularDestinations = ({ onSelectFromIsland }: PopularDestinationsProps) => {
  const popularIslands = [
    { name: "Dhigurah", icon: <Sun className="text-yellow-500" size={16} /> },
    { name: "Dhangethi", icon: <Building className="text-blue-500" size={16} /> },
    { name: "Male' City", icon: <Anchor className="text-teal-500" size={16} /> },
    { name: "Male' Airport", icon: <Plane className="text-gray-500" size={16} /> }
  ];

  return (
    <div className="mt-4 mb-6">
      <p className="text-lg font-medium text-ocean-dark dark:text-white/90 mb-4 text-center">Popular Islands</p>
      <div className="flex flex-wrap justify-center gap-3">
        {popularIslands.map((island) => (
          <Button
            key={island.name}
            variant="outline"
            size="sm"
            className="bg-white dark:bg-gray-800 text-ocean-dark dark:text-white/90 border-ocean-light/30 
                      hover:bg-ocean/5 dark:hover:bg-ocean/10 rounded-full pl-3 pr-4 py-5 flex gap-2 
                      items-center font-medium transition-all shadow-sm"
            onClick={() => onSelectFromIsland(island.name)}
          >
            {island.icon}
            {island.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default PopularDestinations;
