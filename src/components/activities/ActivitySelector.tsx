
import { useState } from "react";
import { Activity } from "./ActivityForm";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { 
  Anchor,  // Replace Fish with Anchor 
  Sailboat, 
  Turtle, 
  Umbrella, 
  Building, 
  Sunset, 
  ChevronRight
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ActivitySelectorProps {
  selectedActivity: Activity | null;
  onSelectActivity: (activity: Activity) => void;
  passengers: number;
  onPassengerChange: (passengers: number) => void;
}

const activities: Activity[] = [
  {
    id: "manta",
    name: "Manta",
    price: 70,
    description: "Swim with magnificent manta rays in their natural habitat."
  },
  {
    id: "whaleshark",
    name: "Whaleshark",
    price: 80,
    description: "Experience the thrill of swimming alongside the gentle giants of the ocean."
  },
  {
    id: "turtle",
    name: "Turtle",
    price: 50,
    description: "Explore turtle habitats and swim with these amazing creatures."
  },
  {
    id: "sandbank_trip",
    name: "Sand Bank Trip",
    price: 120,
    description: "Visit a secluded sandbank near Machafushi resort for a private beach experience."
  },
  {
    id: "resort_day_trip",
    name: "Resort Day Trip",
    price: 75,
    description: "Spend a relaxing day at one of the luxury resorts in the Maldives."
  },
  {
    id: "resort_transfer",
    name: "Resort Transfer",
    price: 45,
    description: "Comfortable speedboat transfer to your chosen resort. Price per way."
  },
  {
    id: "sunset_fishing",
    name: "Sunset Fishing",
    price: 55,
    description: "Traditional line fishing experience while enjoying a breathtaking Maldivian sunset."
  },
  {
    id: "nurse_shark",
    name: "Nurse Shark Trip",
    price: 80,
    description: "See nurse sharks up close in their natural environment."
  }
];

const getActivityIcon = (id: string) => {
  switch (id) {
    case "manta":
      return <Anchor className="h-5 w-5 text-blue-600" />; // Changed from Fish to Anchor
    case "whaleshark":
      return <Sailboat className="h-5 w-5 text-blue-800" />;
    case "turtle":
      return <Turtle className="h-5 w-5 text-green-600" />;
    case "sandbank_trip":
      return <Umbrella className="h-5 w-5 text-yellow-600" />;
    case "resort_day_trip":
      return <Building className="h-5 w-5 text-purple-600" />;
    case "resort_transfer":
      return <Sailboat className="h-5 w-5 text-teal-600" />;
    case "sunset_fishing":
      return <Sunset className="h-5 w-5 text-orange-600" />;
    case "nurse_shark":
      return <Anchor className="h-5 w-5 text-gray-600" />; // Also changed to Anchor
    default:
      return <Anchor className="h-5 w-5 text-blue-600" />; // Default changed to Anchor
  }
};

const ActivitySelector = ({ 
  selectedActivity,
  onSelectActivity,
  passengers,
  onPassengerChange
}: ActivitySelectorProps) => {
  const passengerOptions = Array.from({ length: 10 }, (_, i) => i + 1);
  
  const handleActivityChange = (activityId: string) => {
    const activity = activities.find(a => a.id === activityId);
    if (activity) {
      onSelectActivity(activity);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-ocean-dark mb-6">Choose an Activity</h2>
        
        <RadioGroup 
          value={selectedActivity?.id || ""}
          onValueChange={handleActivityChange}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {activities.map((activity) => (
            <div key={activity.id} className="relative">
              <RadioGroupItem 
                value={activity.id} 
                id={activity.id}
                className="peer sr-only" 
              />
              <Label
                htmlFor={activity.id}
                className="flex items-center gap-3 border rounded-lg p-4 cursor-pointer transition-all 
                  peer-data-[state=checked]:border-ocean peer-data-[state=checked]:bg-ocean/5
                  hover:border-ocean/50 hover:bg-ocean/5"
              >
                <div className="flex-shrink-0">
                  {getActivityIcon(activity.id)}
                </div>
                <div className="flex-grow">
                  <div className="font-medium">{activity.name}</div>
                  <div className="text-sm text-gray-500">{activity.description}</div>
                </div>
                <div className="flex items-center gap-1 text-ocean-dark font-bold">
                  ${activity.price}
                  {activity.id === "resort_transfer" ? "/way" : "/person"}
                </div>
                <ChevronRight className="h-4 w-4 text-ocean-dark opacity-70" />
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      
      <div className="max-w-xs">
        <Label htmlFor="passengers" className="block text-sm font-medium mb-2">
          Number of Passengers
        </Label>
        <Select 
          value={passengers.toString()} 
          onValueChange={(value) => onPassengerChange(parseInt(value))}
        >
          <SelectTrigger id="passengers" className="w-full">
            <SelectValue placeholder="Select number of passengers" />
          </SelectTrigger>
          <SelectContent>
            {passengerOptions.map((num) => (
              <SelectItem key={num} value={num.toString()}>
                {num} {num === 1 ? 'passenger' : 'passengers'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-gray-500 mt-1">Maximum 10 passengers allowed</p>
      </div>
    </div>
  );
};

export default ActivitySelector;
