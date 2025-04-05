
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
import { MapPin, Clock, Navigation, ChevronDown } from "lucide-react";
import { BookingInfo, Island, Time, PassengerCount } from "@/types/booking";
import PopularDestinations from "./PopularDestinations";
import SeatPicker from "./SeatPicker";

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
const times: Time[] = ['8:00 AM', '10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM', '8:00 PM'];

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
    }
  });
  const navigate = useNavigate();
  // Reference to island select trigger for programmatic clicking
  const islandSelectRef = useRef<HTMLButtonElement>(null);
  
  useEffect(() => {
    if (preSelectedIsland) {
      setBooking(prev => ({ ...prev, island: preSelectedIsland }));
      toast({
        title: "Destination selected",
        description: `You selected ${preSelectedIsland}`,
      });
    }
  }, [preSelectedIsland]);

  const handleSelectDestination = (island: Island) => {
    setBooking(prev => ({ ...prev, island }));
    toast({
      title: "Destination selected",
      description: `You selected ${island}`,
    });
  };

  const handlePassengerCountChange = (passengerCounts: PassengerCount) => {
    const totalSeats = passengerCounts.adults + passengerCounts.children + passengerCounts.seniors;
    setBooking({ 
      ...booking, 
      seats: totalSeats,
      passengerCounts 
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!booking.from || !booking.island || !booking.time || booking.seats < 1) {
      toast({
        title: "Invalid booking",
        description: "Please fill in all the fields correctly.",
        variant: "destructive"
      });
      return;
    }
    
    navigate("/confirmation", { state: booking });
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-md mx-auto booking-card">
        <h2 className="text-2xl font-bold text-ocean-dark mb-6">Book Your Speedboat</h2>
        
        <PopularDestinations onSelectDestination={handleSelectDestination} />
        
        <form onSubmit={handleSubmit} className="space-y-6">
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
                  {times.map((time) => (
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
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Passengers
            </label>
            <SeatPicker 
              onChange={handlePassengerCountChange}
              initialCount={booking.passengerCounts}
            />
            <p className="text-xs text-gray-500 mt-1">Maximum 10 seats per booking</p>
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
