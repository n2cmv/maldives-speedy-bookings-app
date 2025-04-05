
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

interface DateSelectorProps {
  label: string;
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  minDate?: Date;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  placeholder?: string;
}

const DateSelector = ({
  label,
  selectedDate,
  onDateSelect,
  minDate,
  isOpen,
  setIsOpen,
  placeholder
}: DateSelectorProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <div className="passenger-picker cursor-pointer">
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 text-ocean mr-2" />
                <span className="text-base">
                  {selectedDate ? format(selectedDate, 'PPP') : placeholder || t("booking.form.selectDate", "Select date")}
                </span>
              </div>
              <ChevronDown className="h-5 w-5 text-ocean/70" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={onDateSelect}
              initialFocus
              disabled={(date) => minDate ? date < minDate : false}
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default DateSelector;
