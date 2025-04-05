
import { useState, useEffect } from "react";
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
import { MapPin, Clock, Navigation } from "lucide-react";
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
  'Male\' Airport'
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
    setBooking({ ...booking, island });
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
              <Navigation className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <div className="w-full">
                <Select
                  value={booking.from}
                  onValueChange={(value) => setBooking({ ...booking, from: value as Island })}
                >
                  <SelectTrigger 
                    className="pl-10 h-12 w-full border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                  >
                    <SelectValue placeholder="Select departure island" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-md p-1 z-50">
                    {fromLocations.map((location) => (
                      <SelectItem 
                        key={location} 
                        value={location}
                        className="py-2.5 px-3 rounded-md cursor-pointer hover:bg-primary/10 hover:text-primary text-sm"
                      >
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Destination Island
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <div className="w-full">
                <Select
                  value={booking.island}
                  onValueChange={(value) => setBooking({ ...booking, island: value as Island })}
                >
                  <SelectTrigger 
                    className="pl-10 h-12 w-full border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                  >
                    <SelectValue placeholder="Select an island" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-md p-1 z-50">
                    {islands.map((island) => (
                      <SelectItem 
                        key={island} 
                        value={island}
                        className="py-2.5 px-3 rounded-md cursor-pointer hover:bg-primary/10 hover:text-primary text-sm"
                      >
                        {island}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Departure Time
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <div className="w-full">
                <Select
                  value={booking.time}
                  onValueChange={(value) => setBooking({ ...booking, time: value as Time })}
                >
                  <SelectTrigger 
                    className="pl-10 h-12 w-full border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                  >
                    <SelectValue placeholder="Select a time" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-md p-1 z-50">
                    {times.map((time) => (
                      <SelectItem 
                        key={time} 
                        value={time}
                        className="py-2.5 px-3 rounded-md cursor-pointer hover:bg-primary/10 hover:text-primary text-sm"
                      >
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
            className="w-full bg-ocean hover:bg-ocean-dark text-white"
          >
            Book Now
          </Button>
        </form>
      </div>
    </div>
  );
};

export default BookingSection;
