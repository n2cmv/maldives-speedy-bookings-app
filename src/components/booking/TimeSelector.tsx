
import { SelectContent, SelectItem, SelectTrigger, SelectValue, Select } from "@/components/ui/select";
import { Time } from "@/types/booking";
import { Clock, ChevronDown, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

interface TimeSelectorProps {
  label: string;
  selectedTime: string;
  availableTimes: Time[];
  onTimeChange: (time: Time) => void;
  id?: string;
}

const TimeSelector = ({
  label,
  selectedTime,
  availableTimes,
  onTimeChange,
  id = "time-select"
}: TimeSelectorProps) => {
  const { t } = useTranslation();
  
  // Enhanced logging for debugging timing issues
  useEffect(() => {
    console.log(`TimeSelector - Available times for ${label}:`, availableTimes);
    console.log(`TimeSelector - Currently selected time: ${selectedTime}`);
  }, [availableTimes, label, selectedTime]);
  
  // Format time string for consistent display
  const formatTimeForDisplay = (timeString: string): string => {
    // If timeString already has AM/PM format (like "11:00 AM"), return as is
    if (timeString.includes("AM") || timeString.includes("PM")) {
      return timeString;
    }
    
    // For 24-hour format (like "16:00"), convert to AM/PM format
    try {
      const [hours, minutes] = timeString.split(':').map(part => parseInt(part, 10));
      
      if (isNaN(hours) || isNaN(minutes)) {
        return timeString; // Return original if parsing fails
      }
      
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
      return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    } catch (e) {
      console.error("Error formatting time:", e);
      return timeString; // Return original on error
    }
  };
  
  return (
    <div className="space-y-2 relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <div className="passenger-picker" onClick={() => document.getElementById(id)?.click()}>
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-ocean mr-2" />
            <span className="text-base">{selectedTime ? formatTimeForDisplay(selectedTime) : t("booking.form.selectTime", "Select a time")}</span>
          </div>
          <ChevronDown className="h-5 w-5 text-ocean/70" />
        </div>
        <Select
          value={selectedTime}
          onValueChange={(value) => {
            console.log(`TimeSelector - Time selected: ${value}`);
            onTimeChange(value as Time);
          }}
        >
          <SelectTrigger id={id} className="custom-select-trigger opacity-0 absolute top-0 left-0 w-full h-full" />
          <SelectContent
            className="select-content max-h-[300px] overflow-auto bg-white z-50 shadow-lg"
            position="popper"
            sideOffset={5}
          >
            {availableTimes && availableTimes.length > 0 ? (
              availableTimes.map((time) => (
                <SelectItem 
                  key={time} 
                  value={time}
                  className="select-item"
                >
                  {formatTimeForDisplay(time)}
                </SelectItem>
              ))
            ) : (
              <div className="p-3 text-sm flex items-center text-amber-600">
                <AlertCircle className="h-4 w-4 mr-2" />
                {t("booking.form.noTimingsAvailable", "No ferry timings available for this route")}
              </div>
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TimeSelector;
