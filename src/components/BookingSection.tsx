
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { MapPin, Clock, Navigation, ChevronDown, Calendar } from "lucide-react";
import { BookingInfo, Island, Time, PassengerCount } from "@/types/booking";
import PopularDestinations from "./PopularDestinations";
import SeatPicker from "./SeatPicker";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

const fromLocations: Island[] = [
  'Male\' City',
  'Male\' Airport'
];

const islands: Island[] = [
  'Male', 
  'Hulhumale', 
  'Maafushi', 
  'Baa Atoll', 
  'Ari Atoll', 
  'Male\' City', 
  'Male\' Airport',
  'A.Dh Dhigurah',
  'A.Dh Dhangethi',
  'Aa. Mathiveri'
];
const allTimes: Time[] = ['8:00 AM', '10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM', '8:00 PM'];

const islandTimeRestrictions: Record<Island, Time[]> = {
  'A.Dh Dhigurah': ['11:00 AM', '4:00 PM'],
  'A.Dh Dhangethi': ['11:00 AM', '4:00 PM'],
  'Male': allTimes,
  'Hulhumale': allTimes,
  'Maafushi': allTimes,
  'Baa Atoll': allTimes,
  'Ari Atoll': allTimes,
  'Male\' City': allTimes,
  'Male\' Airport': allTimes,
  'Aa. Mathiveri': allTimes
};

const MAX_PASSENGERS = 15;

interface BookingSectionProps {
  preSelectedIsland?: Island;
}

const BookingSection = ({ preSelectedIsland }: BookingSectionProps = {}) => {
  const [booking, setBooking] = useState<BookingInfo>({
    from: 'Male\' Airport',
    island: '',
    time: '',
    seats: 1,
    passengerCounts: {
      adults: 1,
      children: 0,
      seniors: 0,
    },
    returnTrip: false
  });
  const navigate = useNavigate();
  const islandSelectRef = useRef<HTMLButtonElement>(null);
  
  // Get today's date for the date picker
  const today = new Date();
  const [departureDate, setDepartureDate] = useState<Date | undefined>(today);
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);

  const availableTimes = booking.island ? 
    (islandTimeRestrictions[booking.island] || allTimes) : 
    allTimes;
  
  const returnAvailableTimes = booking.returnTripDetails?.from ? 
    (islandTimeRestrictions[booking.returnTripDetails.from] || allTimes) : 
    allTimes;
  
  useEffect(() => {
    if (preSelectedIsland) {
      setBooking(prev => ({ ...prev, island: preSelectedIsland }));
    }
  }, [preSelectedIsland]);

  useEffect(() => {
    if (booking.island && booking.time) {
      const availableTimesForIsland = islandTimeRestrictions[booking.island] || allTimes;
      if (!availableTimesForIsland.includes(booking.time as Time)) {
        setBooking(prev => ({ ...prev, time: '' }));
      }
    }
  }, [booking.island]);
  
  useEffect(() => {
    if (booking.returnTrip && booking.island && booking.from) {
      // Initialize return trip details when returnTrip is toggled on
      setBooking(prev => ({
        ...prev,
        returnTripDetails: {
          from: prev.island,
          island: prev.from,
          time: '',
          date: returnDate
        }
      }));
    }
  }, [booking.returnTrip, booking.island, booking.from, returnDate]);

  const handleSelectDestination = (island: Island) => {
    setBooking(prev => ({ ...prev, island }));
    
    // Update return trip details if return trip is enabled
    if (booking.returnTrip) {
      setBooking(prev => ({
        ...prev,
        island,
        returnTripDetails: {
          ...prev.returnTripDetails!,
          island: prev.from,
          from: island
        }
      }));
    }
  };

  const handlePassengerCountChange = (passengerCounts: PassengerCount) => {
    const totalSeats = passengerCounts.adults + passengerCounts.children + passengerCounts.seniors;
    setBooking({ 
      ...booking, 
      seats: totalSeats,
      passengerCounts 
    });
  };
  
  const handleReturnToggle = (isChecked: boolean) => {
    setBooking(prev => ({ 
      ...prev, 
      returnTrip: isChecked,
      returnTripDetails: isChecked ? {
        from: prev.island || '',
        island: prev.from || '',
        time: '',
        date: returnDate
      } : undefined
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!booking.from || !booking.island || !booking.time || booking.seats < 1 || !departureDate) {
      toast({
        title: "Invalid booking",
        description: "Please fill in all the outbound journey fields correctly.",
        variant: "destructive"
      });
      return;
    }
    
    if (booking.returnTrip && (!booking.returnTripDetails?.time || !returnDate)) {
      toast({
        title: "Invalid return booking",
        description: "Please fill in all the return journey fields correctly.",
        variant: "destructive"
      });
      return;
    }
    
    if (booking.seats > MAX_PASSENGERS) {
      toast({
        title: "Too many passengers",
        description: `Maximum ${MAX_PASSENGERS} passengers allowed per booking.`,
        variant: "destructive"
      });
      return;
    }
    
    // Add date to booking information
    const bookingWithDates = {
      ...booking,
      date: departureDate,
      returnTripDetails: booking.returnTripDetails ? {
        ...booking.returnTripDetails,
        date: returnDate
      } : undefined
    };
    
    navigate("/passenger-details", { state: bookingWithDates });
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-md mx-auto booking-card">
        <h2 className="text-2xl font-bold text-ocean-dark mb-6">Book Your Speedboat</h2>
        
        <PopularDestinations onSelectDestination={handleSelectDestination} />
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Return trip toggle */}
          <div className="flex items-center justify-between">
            <Label htmlFor="return-trip" className="text-sm font-medium text-gray-700">
              Return Trip
            </Label>
            <Switch
              id="return-trip"
              checked={booking.returnTrip}
              onCheckedChange={handleReturnToggle}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From
            </label>
            <div className="relative">
              <div className="passenger-picker" onClick={() => document.getElementById('from-select')?.click()}>
                <div className="flex items-center">
                  <Navigation className="h-5 w-5 text-ocean mr-2" />
                  <span className="text-base">{booking.from || 'Select departure island'}</span>
                </div>
                <ChevronDown className="h-5 w-5 text-ocean/70" />
              </div>
              <Select
                value={booking.from}
                onValueChange={(value) => setBooking({ ...booking, from: value as Island })}
              >
                <SelectTrigger id="from-select" className="custom-select-trigger opacity-0 absolute top-0 left-0 w-full h-full" />
                <SelectContent className="select-content">
                  {fromLocations.map((location) => (
                    <SelectItem 
                      key={location} 
                      value={location}
                      className="select-item"
                    >
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Destination Island
            </label>
            <div className="relative">
              <div className="passenger-picker" onClick={() => document.getElementById('island-select')?.click()}>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-ocean mr-2" />
                  <span className="text-base">{booking.island || 'Select an island'}</span>
                </div>
                <ChevronDown className="h-5 w-5 text-ocean/70" />
              </div>
              <Select
                value={booking.island}
                onValueChange={(value) => setBooking({ ...booking, island: value as Island })}
              >
                <SelectTrigger 
                  ref={islandSelectRef}
                  id="island-select" 
                  className="custom-select-trigger opacity-0 absolute top-0 left-0 w-full h-full" 
                />
                <SelectContent className="select-content">
                  {islands.map((island) => (
                    <SelectItem 
                      key={island} 
                      value={island}
                      className="select-item"
                    >
                      {island}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Departure Date */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Departure Date
            </label>
            <div className="relative">
              <Popover>
                <PopoverTrigger asChild>
                  <div className="passenger-picker cursor-pointer">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-ocean mr-2" />
                      <span className="text-base">
                        {departureDate ? format(departureDate, 'PPP') : 'Select date'}
                      </span>
                    </div>
                    <ChevronDown className="h-5 w-5 text-ocean/70" />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={departureDate}
                    onSelect={setDepartureDate}
                    initialFocus
                    disabled={(date) => date < today}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Departure Time
            </label>
            <div className="relative">
              <div className="passenger-picker" onClick={() => document.getElementById('time-select')?.click()}>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-ocean mr-2" />
                  <span className="text-base">{booking.time || 'Select a time'}</span>
                </div>
                <ChevronDown className="h-5 w-5 text-ocean/70" />
              </div>
              <Select
                value={booking.time}
                onValueChange={(value) => setBooking({ ...booking, time: value as Time })}
              >
                <SelectTrigger id="time-select" className="custom-select-trigger opacity-0 absolute top-0 left-0 w-full h-full" />
                <SelectContent className="select-content">
                  {availableTimes.map((time) => (
                    <SelectItem 
                      key={time} 
                      value={time}
                      className="select-item"
                    >
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Return Trip Fields (conditional) */}
          {booking.returnTrip && (
            <>
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h3 className="font-medium text-ocean-dark mb-4">Return Journey</h3>
              </div>
              
              {/* Return Date */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Return Date
                </label>
                <div className="relative">
                  <Popover>
                    <PopoverTrigger asChild>
                      <div className="passenger-picker cursor-pointer">
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-ocean mr-2" />
                          <span className="text-base">
                            {returnDate ? format(returnDate, 'PPP') : 'Select date'}
                          </span>
                        </div>
                        <ChevronDown className="h-5 w-5 text-ocean/70" />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={returnDate}
                        onSelect={setReturnDate}
                        initialFocus
                        disabled={(date) => departureDate ? date < departureDate : date < today}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              {/* Return Time */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Return Time
                </label>
                <div className="relative">
                  <div className="passenger-picker" onClick={() => document.getElementById('return-time-select')?.click()}>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-ocean mr-2" />
                      <span className="text-base">{booking.returnTripDetails?.time || 'Select a time'}</span>
                    </div>
                    <ChevronDown className="h-5 w-5 text-ocean/70" />
                  </div>
                  <Select
                    value={booking.returnTripDetails?.time || ''}
                    onValueChange={(value) => setBooking({ 
                      ...booking, 
                      returnTripDetails: { 
                        ...booking.returnTripDetails!, 
                        time: value as Time 
                      } 
                    })}
                  >
                    <SelectTrigger id="return-time-select" className="custom-select-trigger opacity-0 absolute top-0 left-0 w-full h-full" />
                    <SelectContent className="select-content">
                      {returnAvailableTimes.map((time) => (
                        <SelectItem 
                          key={time} 
                          value={time}
                          className="select-item"
                        >
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Passengers
            </label>
            <SeatPicker 
              onChange={handlePassengerCountChange}
              initialCount={booking.passengerCounts}
            />
            <p className="text-xs text-gray-500 mt-1">Maximum {MAX_PASSENGERS} seats per booking</p>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-ocean hover:bg-ocean-dark text-white h-[60px] text-base font-medium"
          >
            Book Now
          </Button>
        </form>
      </div>
    </div>
  );
};

export default BookingSection;
