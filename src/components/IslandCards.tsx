
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Ship, CalendarDays, Users } from "lucide-react";
import { Island } from "@/types/booking";

interface IslandCardsProps {
  onSelectDestination: (island: Island) => void;
}

const IslandCards = ({ onSelectDestination }: IslandCardsProps) => {
  const islands = [
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
    },
    {
      name: "Aa. Mathiveri",
      image: "https://images.unsplash.com/photo-1518877593221-1f28583780b4",
      description: "Known for its marine biodiversity and vibrant underwater ecosystem.",
      travelTime: "2.5 hours",
      bestFor: "Diving & Marine Life"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {islands.map((island) => (
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
              onClick={() => onSelectDestination(island.name as Island)} 
              className="w-full bg-ocean hover:bg-ocean-dark text-white"
            >
              Book This Destination
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default IslandCards;
