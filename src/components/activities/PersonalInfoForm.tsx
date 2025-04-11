
import { useState } from "react";
import { ActivityBookingForm } from "./ActivityForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import CountryCodeSelector from "@/components/CountryCodeSelector";

interface PersonalInfoFormProps {
  formData: ActivityBookingForm;
  onChange: (data: Partial<ActivityBookingForm>) => void;
}

const PersonalInfoForm = ({ formData, onChange }: PersonalInfoFormProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const threeMonthsLater = new Date();
  threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
  
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-ocean-dark mb-6">
        Personal Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={(e) => onChange({ fullName: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => onChange({ email: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <div className="flex">
            <div className="flex-shrink-0 mr-2">
              <CountryCodeSelector
                value={formData.countryCode}
                onChange={(code) => onChange({ countryCode: code })}
              />
            </div>
            <Input
              id="phone"
              type="tel"
              placeholder="Phone number"
              value={formData.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
              className="flex-grow"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="passportNumber">ID/Passport Number</Label>
          <Input
            id="passportNumber"
            placeholder="Enter your ID or passport number"
            value={formData.passportNumber}
            onChange={(e) => onChange({ passportNumber: e.target.value })}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="date">Trip Date</Label>
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.date ? format(formData.date, "PPP") : <span>Select a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.date || undefined}
                onSelect={(date) => {
                  onChange({ date: date || null });
                  setIsCalendarOpen(false);
                }}
                disabled={(date) => {
                  const yesterday = new Date();
                  yesterday.setDate(yesterday.getDate() - 1);
                  return date < tomorrow || date > threeMonthsLater;
                }}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          <p className="text-xs text-gray-500 mt-1">Booking available from tomorrow up to 3 months in advance</p>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
