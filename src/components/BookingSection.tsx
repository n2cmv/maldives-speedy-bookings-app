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
import { BookingInfo, Time, PassengerCount } from "@/types/booking";
import { Island } from "@/types/island";
import { supabase } from "@/integrations/supabase/client";
import PopularDestinations from "./PopularDestinations";
import SeatPicker from "./SeatPicker";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

const fallbackIslands = [
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

const fromLocations: string[] = [
  'Male\' City',
  'Male\' Airport'
];

const allTimes: Time[] = ['8:00 AM', '10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM', '8:00 PM'];

const islandTimeRestrictions: Record<string, Time[]> = {
  'A.Dh Dhigurah': ['6:30 AM', '1:10 PM'],
  'A.Dh Dhangethi': ['7:00 AM', '1:30 PM'],
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
  preSelectedIsland?: string;
}

const BookingSection = ({ preSelectedIsland }: BookingSectionProps = {}) => {
  const { t } = useTranslation();
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
  
  const [islandsData, setIslandsData] = useState<Island[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const today = new Date();
  const [departureDate, setDepartureDate] = useState<Date | undefined>(today);
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);
  const [departureDateOpen, setDepartureDateOpen] = useState(false);
  const [returnDateOpen, setReturnDateOpen] = useState(false);

  const availableTimes = booking.island ? 
    (islandTimeRestrictions[booking.island] || allTimes) : 
    allTimes;
  
  const returnAvailableTimes = booking.returnTripDetails?.from ? 
    (islandTimeRestrictions[booking.returnTripDetails.from] || allTimes) : 
    allTimes;
  
  useEffect(() => {
    const fetchIslands = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('islands')
          .select('*')
          .order('name');
        
        if (error) {
          console.error('Error fetching islands:', error);
          return;
        }
        
        if (data && data.length > 0) {
          setIslandsData(data);
        }
      } catch (error) {
        console.error('Error fetching islands:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchIslands();
  }, []);
  
  const islandNames = islandsData.length > 0 
    ? islandsData.map(island => island.name) 
    : fallbackIslands;

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

  const handleSelectDestination = (island: string) => {
    setBooking(prev => ({ ...prev, island }));
    
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
        title: t("booking.form.invalidBooking", "Invalid booking"),
        description: t("booking.form.fillOutboundFields", "Please fill in all the outbound journey fields correctly."),
        variant: "destructive"
      });
      return;
    }
    
    if (booking.returnTrip && (!booking.returnTripDetails?.time || !returnDate)) {
      toast({
        title: t("booking.form.invalidReturn", "Invalid return booking"),
        description: t("booking.form.fillReturnFields", "Please fill in all the return journey fields correctly."),
        variant: "destructive"
      });
      return;
    }
    
    if (booking.seats > MAX_PASSENGERS) {
      toast({
        title: t("booking.form.tooManyPassengers", "Too many passengers"),
        description: t("booking.form.maxPassengers", `Maximum ${MAX_PASSENGERS} passengers allowed per booking.`),
        variant: "destructive"
      });
      return;
    }
    
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

  const handleDepartureDateSelect = (date: Date | undefined) => {
    setDepartureDate(date);
    setDepartureDateOpen(false);
  };

  const handleReturnDateSelect = (date: Date | undefined) => {
    setReturnDate(date);
    setReturnDateOpen(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-md mx-auto booking-card">
        <h2 className="text-2xl font-bold text-ocean-dark mb-6">{t("booking.form.bookSpeedboat", "Book Your Speedboat")}</h2>
        
        <PopularDestinations onSelectDestination={handleSelectDestination} />
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="return-trip" className="text-sm font-medium text-gray-700">
              {t("booking.form.returnTrip", "Return Trip")}
            </Label>
            <Switch
              id="return-trip"
              checked={booking.returnTrip}
              onCheckedChange={handleReturnToggle}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("booking.form.from", "From")}
            </label>
            <div className="relative">
              <div className="passenger-picker" onClick={() => document.getElementById('from-select')?.click()}>
                <div className="flex items-center">
                  <Navigation className="h-5 w-5 text-ocean mr-2" />
                  <span className="text-base">{booking.from || t("booking.form.selectDeparture", "Select departure island")}</span>
                </div>
                <ChevronDown className="h-5 w-5 text-ocean/70" />
              </div>
              <Select
                value={booking.from}
                onValueChange={(value) => setBooking({ ...booking, from: value })}
              >
                <SelectTrigger id="from-select" className="custom-select-trigger opacity-0 absolute top-0 left-0 w-full h-full" />
                <SelectContent className="select-content">
                  {isLoading ? (
                    <SelectItem value="loading">Loading...</SelectItem>
                  ) : (
                    islandNames.map((islandName) => (
                      <SelectItem 
                        key={islandName} 
                        value={islandName}
                        className="select-item"
                      >
                        {islandName}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("booking.form.destinationIsland", "Destination Island")}
            </label>
            <div className="relative">
              <div className="passenger-picker" onClick={() => document.getElementById('island-select')?.click()}>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-ocean mr-2" />
                  <span className="text-base">{booking.island || t("booking.form.selectIsland", "Select an island")}</span>
                </div>
                <ChevronDown className="h-5 w-5 text-ocean/70" />
              </div>
              <Select
                value={booking.island}
                onValueChange={(value) => setBooking({ ...booking, island: value })}
              >
                <SelectTrigger 
                  ref={islandSelectRef}
                  id="island-select" 
                  className="custom-select-trigger opacity-0 absolute top-0 left-0 w-full h-full" 
                />
                <SelectContent className="select-content">
                  {isLoading ? (
                    <SelectItem value="loading">Loading...</SelectItem>
                  ) : (
                    islandNames.map((islandName) => (
                      <SelectItem 
                        key={islandName} 
                        value={islandName}
                        className="select-item"
                      >
                        {islandName}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("booking.form.departureDate", "Departure Date")}
            </label>
            <div className="relative">
              <Popover open={departureDateOpen} onOpenChange={setDepartureDateOpen}>
                <PopoverTrigger asChild>
                  <div className="passenger-picker cursor-pointer">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-ocean mr-2" />
                      <span className="text-base">
                        {departureDate ? format(departureDate, 'PPP') : t("booking.form.selectDate", "Select date")}
                      </span>
                    </div>
                    <ChevronDown className="h-5 w-5 text-ocean/70" />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={departureDate}
                    onSelect={handleDepartureDateSelect}
                    initialFocus
                    disabled={(date) => date < today}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("booking.form.departureTime", "Departure Time")}
            </label>
            <div className="relative">
              <div className="passenger-picker" onClick={() => document.getElementById('time-select')?.click()}>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-ocean mr-2" />
                  <span className="text-base">{booking.time || t("booking.form.selectTime", "Select a time")}</span>
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
          
          {booking.returnTrip && (
            <>
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h3 className="font-medium text-ocean-dark mb-4">{t("booking.summary.returnJourney", "Return Journey")}</h3>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("booking.form.returnDate", "Return Date")}
                </label>
                <div className="relative">
                  <Popover open={returnDateOpen} onOpenChange={setReturnDateOpen}>
                    <PopoverTrigger asChild>
                      <div className="passenger-picker cursor-pointer">
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-ocean mr-2" />
                          <span className="text-base">
                            {returnDate ? format(returnDate, 'PPP') : t("booking.form.selectDate", "Select date")}
                          </span>
                        </div>
                        <ChevronDown className="h-5 w-5 text-ocean/70" />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={returnDate}
                        onSelect={handleReturnDateSelect}
                        initialFocus
                        disabled={(date) => departureDate ? date < departureDate : date < today}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("booking.form.returnTime", "Return Time")}
                </label>
                <div className="relative">
                  <div className="passenger-picker" onClick={() => document.getElementById('return-time-select')?.click()}>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-ocean mr-2" />
                      <span className="text-base">{booking.returnTripDetails?.time || t("booking.form.selectTime", "Select a time")}</span>
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
              {t("booking.form.passengers", "Number of Passengers")}
            </label>
            <SeatPicker 
              onChange={handlePassengerCountChange}
              initialCount={booking.passengerCounts}
            />
            <p className="text-xs text-gray-500 mt-1">{t("booking.form.maxPassengersInfo", "Maximum {{max}} seats per booking", {max: MAX_PASSENGERS})}</p>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-ocean hover:bg-ocean-dark text-white h-[60px] text-base font-medium"
          >
            {t("common.bookNow", "Book Now")}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default BookingSection;
