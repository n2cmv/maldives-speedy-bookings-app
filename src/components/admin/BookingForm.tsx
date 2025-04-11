
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookingData } from "@/types/database";
import { Time } from "@/types/booking";
import { Checkbox } from "@/components/ui/checkbox";

interface BookingFormProps {
  booking?: BookingData | null;
  onSaved: () => void;
  onCancel: () => void;
  activityBookingMode?: boolean;
}

const BookingForm = ({ booking, onSaved, onCancel, activityBookingMode }: BookingFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Omit<BookingData, 'created_at' | 'updated_at'>>({
    id: '',
    user_email: '',
    from_location: '',
    to_location: '',
    departure_time: '',
    departure_date: new Date().toISOString().split('T')[0],
    return_trip: false,
    return_from_location: null,
    return_to_location: null,
    return_time: null,
    return_date: null,
    passenger_count: 1,
    payment_complete: false,
    payment_reference: null,
    passenger_info: [],
    activity: null,
    is_activity_booking: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [date, setDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);

  useEffect(() => {
    if (booking) {
      setFormData({
        id: booking.id || '',
        user_email: booking.user_email || '',
        from_location: booking.from_location || '',
        to_location: booking.to_location || '',
        departure_time: booking.departure_time || '',
        departure_date: booking.departure_date || new Date().toISOString().split('T')[0],
        return_trip: booking.return_trip || false,
        return_from_location: booking.return_from_location || null,
        return_to_location: booking.return_to_location || null,
        return_time: booking.return_time || null,
        return_date: booking.return_date || null,
        passenger_count: booking.passenger_count || 1,
        payment_complete: booking.payment_complete || false,
        payment_reference: booking.payment_reference || null,
        passenger_info: booking.passenger_info || [],
        activity: booking.activity || null,
        is_activity_booking: booking.is_activity_booking || activityBookingMode || false,
      });
      setDate(booking.departure_date ? new Date(booking.departure_date) : undefined);
      setReturnDate(booking.return_date ? new Date(booking.return_date) : undefined);
      setSelectedActivity(booking.activity || null);
    } else {
      // Reset form data when creating a new booking
      setFormData({
        id: '',
        user_email: '',
        from_location: '',
        to_location: '',
        departure_time: '',
        departure_date: new Date().toISOString().split('T')[0],
        return_trip: false,
        return_from_location: null,
        return_to_location: null,
        return_time: null,
        return_date: null,
        passenger_count: 1,
        payment_complete: false,
        payment_reference: null,
        passenger_info: [],
        activity: null,
        is_activity_booking: activityBookingMode || false,
      });
      setDate(undefined);
      setReturnDate(undefined);
      setSelectedActivity(null);
    }
  }, [booking, activityBookingMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const { id, ...rest } = formData;
      const payload = {
        ...rest,
        departure_date: date ? format(date, 'yyyy-MM-dd') : null,
        return_date: returnDate ? format(returnDate, 'yyyy-MM-dd') : null,
      };

      // Ensure activity booking flags are set correctly
      if (activityBookingMode) {
        payload.is_activity_booking = true;
        
        // Make sure activity field is never empty for an activity booking
        if (!payload.activity || payload.activity.trim() === '') {
          payload.activity = selectedActivity || "Unspecified Activity";
        }
        
        console.log("Saving activity booking with payload:", payload);
      }

      let response;
      if (id) {
        response = await supabase
          .from('bookings')
          .update(payload)
          .eq('id', id)
          .select();
      } else {
        response = await supabase
          .from('bookings')
          .insert([payload])
          .select();
      }

      if (response.error) {
        throw response.error;
      }
      
      console.log("Booking saved successfully:", response.data);

      toast({
        title: "Success",
        description: `Booking ${id ? 'updated' : 'created'} successfully`,
      });
      onSaved();
    } catch (error: any) {
      console.error("Error saving booking:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save booking",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };
  
  const handleActivityChange = (value: string) => {
    setSelectedActivity(value);
    setFormData(prev => ({
      ...prev,
      activity: value,
      // Always ensure the activity booking flag is set when an activity is selected
      is_activity_booking: true
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {activityBookingMode && (
        <div>
          <Label htmlFor="activity">Activity Name</Label>
          <Input
            type="text"
            id="activity"
            name="activity"
            value={formData.activity || ''}
            onChange={handleInputChange}
            required={activityBookingMode}
            placeholder="Enter activity name"
            className="mt-1"
          />
        </div>
      )}
      
      <div>
        <Label htmlFor="user_email">User Email</Label>
        <Input
          type="email"
          id="user_email"
          name="user_email"
          value={formData.user_email}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="from_location">From Location</Label>
        <Input
          type="text"
          id="from_location"
          name="from_location"
          value={formData.from_location}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="to_location">To Location</Label>
        <Input
          type="text"
          id="to_location"
          name="to_location"
          value={formData.to_location}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <Label>Departure Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(date) =>
                date < new Date(new Date().setHours(0, 0, 0, 0))
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <Label htmlFor="departure_time">Departure Time</Label>
        <Input
          type="text"
          id="departure_time"
          name="departure_time"
          value={formData.departure_time}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="passenger_count">Participant Count</Label>
        <Input
          type="number"
          id="passenger_count"
          name="passenger_count"
          value={formData.passenger_count}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="payment_reference">Payment Reference</Label>
        <Input
          type="text"
          id="payment_reference"
          name="payment_reference"
          value={formData.payment_reference || ''}
          onChange={handleInputChange}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="payment_complete"
          name="payment_complete"
          checked={formData.payment_complete || false}
          onCheckedChange={(checked) => {
            setFormData(prev => ({
              ...prev,
              payment_complete: !!checked
            }));
          }}
        />
        <Label htmlFor="payment_complete">Payment Complete</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="return_trip"
          name="return_trip"
          checked={formData.return_trip || false}
          onCheckedChange={(checked) => {
            setFormData(prev => ({
              ...prev,
              return_trip: !!checked
            }));
          }}
        />
        <Label htmlFor="return_trip">Return Trip</Label>
      </div>
      {formData.return_trip && (
        <>
          <div>
            <Label htmlFor="return_from_location">Return From Location</Label>
            <Input
              type="text"
              id="return_from_location"
              name="return_from_location"
              value={formData.return_from_location || ''}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="return_to_location">Return To Location</Label>
            <Input
              type="text"
              id="return_to_location"
              name="return_to_location"
              value={formData.return_to_location || ''}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label>Return Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !returnDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {returnDate ? format(returnDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={returnDate}
                  onSelect={setReturnDate}
                  disabled={(date) =>
                    date < new Date(new Date().setHours(0, 0, 0, 0))
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label htmlFor="return_time">Return Time</Label>
            <Input
              type="text"
              id="return_time"
              name="return_time"
              value={formData.return_time || ''}
              onChange={handleInputChange}
            />
          </div>
        </>
      )}
      
      {/* Always include a hidden field for is_activity_booking when in activity mode */}
      {activityBookingMode && (
        <input 
          type="hidden" 
          name="is_activity_booking" 
          value="true" 
        />
      )}
      
      <div className="flex justify-end space-x-2">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
};

export default BookingForm;
