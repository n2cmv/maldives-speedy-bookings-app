
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Island, Time } from "@/types/booking";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Json } from "@/integrations/supabase/types";

interface BookingFormProps {
  booking?: any;
  onSaved: () => void;
  onCancel: () => void;
}

interface Passenger {
  id: number;
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  passport: string;
  type: 'adult' | 'child' | 'senior';
}

const availableTimes: Time[] = [
  Time.AM_630, Time.AM_700, Time.AM_800, Time.AM_1000, Time.AM_1100,
  Time.PM_1200, Time.PM_110, Time.PM_130, Time.PM_200, Time.PM_400, Time.PM_600, Time.PM_800
];

const availableIslands: Island[] = [
  'Male', 'Hulhumale', 'Maafushi', 'Baa Atoll', 'Ari Atoll',
  'A.Dh Dhigurah', 'A.Dh Dhangethi', 'Aa. Mathiveri', 'Male\' City', 'Male\' Airport'
];

const BookingForm = ({ booking, onSaved, onCancel }: BookingFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [fromLocation, setFromLocation] = useState<Island | ''>(
    booking?.from_location || ''
  );
  const [toLocation, setToLocation] = useState<Island | ''>(
    booking?.to_location || ''
  );
  const [departureDate, setDepartureDate] = useState<Date | undefined>(
    booking?.departure_date ? new Date(booking.departure_date) : undefined
  );
  const [departureTime, setDepartureTime] = useState<Time | ''>(
    booking?.departure_time || ''
  );
  const [passengerCount, setPassengerCount] = useState(
    booking?.passenger_count || 1
  );
  const [userEmail, setUserEmail] = useState(booking?.user_email || '');
  const [hasReturnTrip, setHasReturnTrip] = useState(Boolean(booking?.return_trip));
  const [returnFromLocation, setReturnFromLocation] = useState<Island | ''>(
    booking?.return_from_location || ''
  );
  const [returnToLocation, setReturnToLocation] = useState<Island | ''>(
    booking?.return_to_location || ''
  );
  const [returnDate, setReturnDate] = useState<Date | undefined>(
    booking?.return_date ? new Date(booking.return_date) : undefined
  );
  const [returnTime, setReturnTime] = useState<Time | ''>(
    booking?.return_time || ''
  );
  const [paymentReference, setPaymentReference] = useState(
    booking?.payment_reference || ''
  );
  const [paymentComplete, setPaymentComplete] = useState(
    Boolean(booking?.payment_complete)
  );
  const [passengers, setPassengers] = useState<Passenger[]>(
    booking?.passenger_info || [
      {
        id: 1,
        name: '',
        email: '',
        phone: '',
        countryCode: '+960',
        passport: '',
        type: 'adult'
      }
    ]
  );

  const handleAddPassenger = () => {
    const newPassenger: Passenger = {
      id: passengers.length + 1,
      name: '',
      email: '',
      phone: '',
      countryCode: '+960',
      passport: '',
      type: 'adult'
    };
    setPassengers([...passengers, newPassenger]);
    setPassengerCount(passengerCount + 1);
  };

  const handleRemovePassenger = (id: number) => {
    const updatedPassengers = passengers.filter(p => p.id !== id);
    setPassengers(updatedPassengers);
    setPassengerCount(updatedPassengers.length);
  };

  const handlePassengerChange = (id: number, field: keyof Passenger, value: any) => {
    setPassengers(passengers.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fromLocation || !toLocation || !departureDate || !departureTime || !userEmail) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    if (hasReturnTrip && (!returnFromLocation || !returnToLocation || !returnDate || !returnTime)) {
      toast({
        title: "Error",
        description: "Please fill in all return trip fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Convert passenger info to a format that can be stored as Json
      const passengerInfoAsJson: Json = JSON.parse(JSON.stringify(passengers));

      const bookingData = {
        from_location: fromLocation as string,
        to_location: toLocation as string,
        departure_date: format(departureDate, 'yyyy-MM-dd'),
        departure_time: departureTime as string,
        passenger_count: Number(passengerCount),
        user_email: userEmail,
        return_trip: hasReturnTrip,
        return_from_location: hasReturnTrip ? returnFromLocation as string : null,
        return_to_location: hasReturnTrip ? returnToLocation as string : null,
        return_date: hasReturnTrip && returnDate ? format(returnDate, 'yyyy-MM-dd') : null,
        return_time: hasReturnTrip ? returnTime as string : null,
        payment_complete: paymentComplete,
        payment_reference: paymentReference || null,
        passenger_info: passengerInfoAsJson
      };

      if (booking) {
        // Update existing booking
        const { error } = await supabase
          .from('bookings')
          .update(bookingData)
          .eq('id', booking.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Booking has been updated",
        });
      } else {
        // Create new booking
        const { error } = await supabase
          .from('bookings')
          .insert(bookingData);

        if (error) throw error;

        toast({
          title: "Success",
          description: "New booking has been created",
        });
      }

      onSaved();
    } catch (error) {
      console.error("Error saving booking:", error);
      toast({
        title: "Error",
        description: "Failed to save booking",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="userEmail">Customer Email</Label>
          <Input
            id="userEmail"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            placeholder="customer@example.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentReference">Payment Reference</Label>
          <Input
            id="paymentReference"
            value={paymentReference}
            onChange={(e) => setPaymentReference(e.target.value)}
            placeholder="ABC123"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="paymentComplete"
          checked={paymentComplete}
          onCheckedChange={(checked) => setPaymentComplete(checked as boolean)}
        />
        <label
          htmlFor="paymentComplete"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Payment Complete
        </label>
      </div>

      <div className="border-t pt-4">
        <h3 className="text-lg font-medium mb-4">Outbound Trip</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fromLocation">From</Label>
            <Select
              value={fromLocation}
              onValueChange={(value) => setFromLocation(value as Island)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {availableIslands.map((island) => (
                  <SelectItem key={island} value={island}>
                    {island}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="toLocation">To</Label>
            <Select
              value={toLocation}
              onValueChange={(value) => setToLocation(value as Island)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select destination" />
              </SelectTrigger>
              <SelectContent>
                {availableIslands.map((island) => (
                  <SelectItem key={island} value={island}>
                    {island}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Departure Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {departureDate ? (
                    format(departureDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={departureDate}
                  onSelect={setDepartureDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="departureTime">Departure Time</Label>
            <Select
              value={departureTime}
              onValueChange={(value) => setDepartureTime(value as Time)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select time" />
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
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="hasReturnTrip"
          checked={hasReturnTrip}
          onCheckedChange={(checked) => setHasReturnTrip(checked as boolean)}
        />
        <label
          htmlFor="hasReturnTrip"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Include Return Trip
        </label>
      </div>

      {hasReturnTrip && (
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium mb-4">Return Trip</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="returnFromLocation">From</Label>
              <Select
                value={returnFromLocation}
                onValueChange={(value) => setReturnFromLocation(value as Island)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {availableIslands.map((island) => (
                    <SelectItem key={island} value={island}>
                      {island}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="returnToLocation">To</Label>
              <Select
                value={returnToLocation}
                onValueChange={(value) => setReturnToLocation(value as Island)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent>
                  {availableIslands.map((island) => (
                    <SelectItem key={island} value={island}>
                      {island}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Return Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {returnDate ? (
                      format(returnDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={returnDate}
                    onSelect={setReturnDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="returnTime">Return Time</Label>
              <Select
                value={returnTime}
                onValueChange={(value) => setReturnTime(value as Time)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
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
          </div>
        </div>
      )}

      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Passengers</h3>
          {passengers.length < 10 && (
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={handleAddPassenger}
            >
              Add Passenger
            </Button>
          )}
        </div>
        
        {passengers.map((passenger, index) => (
          <div key={passenger.id} className="border p-4 rounded-md mb-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium">Passenger {index + 1}</h4>
              {passengers.length > 1 && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleRemovePassenger(passenger.id)}
                >
                  Remove
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  value={passenger.name}
                  onChange={(e) => handlePassengerChange(passenger.id, 'name', e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={passenger.email}
                  onChange={(e) => handlePassengerChange(passenger.id, 'email', e.target.value)}
                  placeholder="john@example.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Phone</Label>
                <div className="flex space-x-2">
                  <Input
                    className="w-20"
                    value={passenger.countryCode}
                    onChange={(e) => handlePassengerChange(passenger.id, 'countryCode', e.target.value)}
                    placeholder="+960"
                  />
                  <Input
                    className="flex-1"
                    value={passenger.phone}
                    onChange={(e) => handlePassengerChange(passenger.id, 'phone', e.target.value)}
                    placeholder="7777777"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Passport</Label>
                <Input
                  value={passenger.passport}
                  onChange={(e) => handlePassengerChange(passenger.id, 'passport', e.target.value)}
                  placeholder="AB123456"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={passenger.type}
                  onValueChange={(value) => handlePassengerChange(passenger.id, 'type', value as 'adult' | 'child' | 'senior')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="adult">Adult</SelectItem>
                    <SelectItem value="child">Child</SelectItem>
                    <SelectItem value="senior">Senior</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              Saving...
            </>
          ) : booking ? "Update Booking" : "Create Booking"}
        </Button>
      </div>
    </form>
  );
};

export default BookingForm;
