
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Clock, Plus, Trash2 } from "lucide-react";

interface RouteTimingsProps {
  timings: string[];
  onChange: (timings: string[]) => void;
}

const RouteTimings = ({ timings, onChange }: RouteTimingsProps) => {
  const [newTiming, setNewTiming] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleAddTiming = () => {
    // Validate time format (HH:MM AM/PM)
    const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i;
    if (!timeRegex.test(newTiming)) {
      setError("Please enter a valid time in 12-hour format (e.g., 9:00 AM)");
      return;
    }

    // Check if time already exists
    if (timings.includes(newTiming)) {
      setError("This time is already added");
      return;
    }

    // Add new timing
    const updatedTimings = [...timings, newTiming].sort((a, b) => {
      // Convert to 24-hour for sorting
      const timeToMinutes = (time: string) => {
        const [hourMin, period] = time.split(" ");
        let [hours, minutes] = hourMin.split(":").map(Number);
        if (period.toLowerCase() === "pm" && hours !== 12) hours += 12;
        if (period.toLowerCase() === "am" && hours === 12) hours = 0;
        return hours * 60 + minutes;
      };
      return timeToMinutes(a) - timeToMinutes(b);
    });

    onChange(updatedTimings);
    setNewTiming("");
    setError(null);
  };

  const handleRemoveTiming = (timing: string) => {
    onChange(timings.filter(t => t !== timing));
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="text-sm font-medium">Ferry Timings</div>
      
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            <Clock className="h-4 w-4" />
          </div>
          <Input
            value={newTiming}
            onChange={(e) => setNewTiming(e.target.value)}
            placeholder="Add timing (e.g., 9:00 AM)"
            className="pl-10"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTiming();
              }
            }}
          />
        </div>
        <Button onClick={handleAddTiming} size="sm" type="button">
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      
      {timings.length > 0 ? (
        <ScrollArea className="h-[100px] border rounded-md p-2">
          <div className="flex flex-wrap gap-2">
            {timings.map((time, index) => (
              <Badge 
                key={index} 
                variant="outline"
                className="flex items-center gap-1 px-3 py-1"
              >
                <Clock className="h-3 w-3" />
                {time}
                <button 
                  onClick={() => handleRemoveTiming(time)}
                  className="ml-1 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <p className="text-sm text-gray-500 italic">No timings added</p>
      )}
    </div>
  );
};

export default RouteTimings;
