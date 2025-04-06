
import { Button } from "@/components/ui/button";

interface PopularDestinationsProps {
  onSelectFromIsland: (island: string) => void;
}

const PopularDestinations = ({ onSelectFromIsland }: PopularDestinationsProps) => {
  const popularIslands = [
    "A.Dh Dhigurah",
    "A.Dh Dhangethi",
    "Male' City"
  ];

  return (
    <div className="mt-4 mb-6">
      <p className="text-sm font-medium text-gray-700 mb-2">Popular Islands:</p>
      <div className="flex flex-wrap gap-2">
        {popularIslands.map((island) => (
          <Button
            key={island}
            variant="outline"
            size="sm"
            className="text-ocean border-ocean hover:bg-ocean/10"
            onClick={() => onSelectFromIsland(island)}
          >
            {island}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default PopularDestinations;
