
import { useState, useEffect } from "react";
import { Activity } from "./ActivityForm";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Anchor, 
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
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const passengerOptions = Array.from({ length: 10 }, (_, i) => i + 1);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;

      const formattedActivities: Activity[] = (data || []).map(activity => ({
        id: activity.activity_id,
        name: activity.name,
        price: Number(activity.price),
        description: activity.description
      }));

      setActivities(formattedActivities);
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast.error('Failed to load activities');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleActivityChange = (activityId: string) => {
    const activity = activities.find(a => a.id === activityId);
    if (activity) {
      onSelectActivity(activity);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
          <SelectTrigger 
            id="passengers" 
            className="w-full bg-white" // Added explicit white background
          >
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
