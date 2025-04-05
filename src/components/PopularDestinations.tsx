
import { Island } from "@/types/booking";
import { Button } from "@/components/ui/button";
import { Sun, Ship, Anchor } from "lucide-react";

interface PopularDestinationsProps {
  onSelectDestination: (island: Island) => void;
}

const PopularDestinations = ({ onSelectDestination }: PopularDestinationsProps) => {
  const destinations = [
    { name: "A.Dh Dhigurah", icon: <Sun className="h-4 w-4 text-amber-500" /> },
    { name: "A.Dh Dhangethi", icon: <Ship className="h-4 w-4 text-blue-500" /> },
    { name: "Aa. Mathiveri", icon: <Anchor className="h-4 w-4 text-teal-500" /> }
  ];

  return (
    <div className="mb-12 flex flex-col items-center">
      <h3 className="text-lg font-semibold text-ocean-dark mb-3">Quick Select</h3>
      <div className="flex flex-wrap justify-center gap-2">
        {destinations.map((dest) => (
          <Button 
            key={dest.name} 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1.5 bg-white border-primary/30 hover:bg-white hover:border-primary hover:text-primary"
            onClick={() => onSelectDestination(dest.name as Island)}
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
