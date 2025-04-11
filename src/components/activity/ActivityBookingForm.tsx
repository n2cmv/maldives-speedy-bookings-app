
import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ArrowRight } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import PassengerSelection from "@/components/booking/PassengerSelection";
import { PassengerCount } from "@/types/booking";

interface ActivityBookingFormProps {
  preSelectedActivity?: string;
  activities: string[];
  isLoading: boolean;
  onSubmit: (data: any) => void;
}

const ActivityBookingForm = ({ 
  preSelectedActivity, 
  activities, 
  isLoading,
  onSubmit 
}: ActivityBookingFormProps) => {
  const [selectedActivity, setSelectedActivity] = useState(preSelectedActivity || "");
  const [activityDate, setActivityDate] = useState<Date | undefined>(undefined);
  const [activityTime, setActivityTime] = useState("");
  const [passengerCounts, setPassengerCounts] = useState<PassengerCount>({
    adults: 1,
    children: 0,
    seniors: 0
  });
  const [dateOpen, setDateOpen] = useState(false);
  
  const availableTimes = [
    "Morning (8:00 AM)", 
    "Mid-Morning (10:00 AM)", 
    "Afternoon (1:00 PM)", 
    "Evening (4:00 PM)"
  ];
  
  const MAX_PASSENGERS = 10;
  
  const handlePassengerCountChange = (counts: PassengerCount) => {
    setPassengerCounts(counts);
  };
  
  const totalPassengers = Object.values(passengerCounts).reduce((a, b) => a + b, 0);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedActivity || !activityDate || !activityTime) {
      alert("Please fill all required fields.");
      return;
    }
    
    const bookingData = {
      activity: selectedActivity,
      date: activityDate,
      time: activityTime,
      passengerCounts,
      seats: totalPassengers,
    };
    
    onSubmit(bookingData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="space-y-4">
        <div>
          <Label htmlFor="activity">Select Activity</Label>
          <Select
            value={selectedActivity}
            onValueChange={setSelectedActivity}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose an activity" />
            </SelectTrigger>
            <SelectContent>
              {activities.map((activity) => (
                <SelectItem key={activity} value={activity}>
                  {activity}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Select Date</Label>
          <Popover open={dateOpen} onOpenChange={setDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
                disabled={isLoading}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {activityDate ? format(activityDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={activityDate}
                onSelect={(date) => {
                  setActivityDate(date);
                  setDateOpen(false);
                }}
                disabled={(date) => 
                  date < new Date(new Date().setHours(0, 0, 0, 0))
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div>
          <Label htmlFor="time">Select Time</Label>
          <Select
            value={activityTime}
            onValueChange={setActivityTime}
            disabled={isLoading || !activityDate}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a time" />
            </SelectTrigger>
            <SelectContent>
              {availableTimes.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="pt-4 border-t border-gray-100">
          <Label className="mb-2 block">Number of Participants</Label>
          <PassengerSelection
            onChange={handlePassengerCountChange}
            initialCount={passengerCounts}
            maxPassengers={MAX_PASSENGERS}
          />
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-[#0AB3B8] hover:bg-[#0AB3B8]/90 text-white"
        disabled={isLoading || !selectedActivity || !activityDate || !activityTime || totalPassengers === 0}
      >
        Continue to Passenger Details
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </form>
  );
};

export default ActivityBookingForm;
