import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookingInfo, Time, PassengerCount } from "@/types/booking";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";
import PopularDestinations from "../PopularDestinations";
import ReturnTripSwitch from "./ReturnTripSwitch";
import TripLocationSelector from "./TripLocationSelector";
import TripDateTimeSelector from "./TripDateTimeSelector";
import ReturnTripSection from "./ReturnTripSection";
import PassengerSelection from "./PassengerSelection";
import { getAllRoutes } from "@/services/bookingService";

interface BookingFormProps {
  preSelectedIsland?: string;
  islandNames: string[];
  isLoading: boolean;
  timeRestrictions: Record<string, Time[]>;
  allTimes: Time[];
}

const MAX_PASSENGERS = 15;

const BookingForm = ({
  preSelectedIsland,
  islandNames,
  isLoading: externalIsLoading,
  timeRestrictions,
  allTimes
}: BookingFormProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(externalIsLoading || true);
  const [fromLocations, setFromLocations] = useState<string[]>([]);
  const [toLocations, setToLocations] = useState<string[]>([]);
  const [booking, setBooking] = useState<BookingInfo>({
    from: '',
    island: preSelectedIsland || '',
    time: '',
    seats: 1,
    passengerCounts: {
      adults: 1,
      children: 0,
      seniors: 0,
    },
    returnTrip: false
  });
  
  const today = new Date();
  const [departureDate, setDepartureDate] = useState<Date | undefined>(today);
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);
  const [departureDateOpen, setDepartureDateOpen] = useState(false);
  const [returnDateOpen, setReturnDateOpen] = useState(false);

  useEffect(() => {
    const fetchRoutes = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await getAllRoutes();
        
        if (error) {
          console.error("Error fetching routes:", error);
          return;
        }

        if (data) {
          const uniqueFromLocations = Array.from(new Set(data.map(route => route.from_location)));
          const uniqueToLocations = Array.from(new Set(data.map(route => route.to_location)));
          
          setFromLocations(uniqueFromLocations);
          setToLocations(uniqueToLocations);
        }
      } catch (error) {
        console.error("Exception fetching routes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  const availableTimes = booking.island ? 
    (timeRestrictions[booking.island] || allTimes) : 
    allTimes;
  
  const returnAvailableTimes = booking.returnTripDetails?.from ? 
    (timeRestrictions[booking.returnTripDetails.from] || allTimes) : 
    allTimes;

  useEffect(() => {
    if (booking.island && booking.time) {
      const availableTimesForIsland = timeRestrictions[booking.island] || allTimes;
      if (!availableTimesForIsland.includes(booking.time as Time)) {
        setBooking(prev => ({ ...prev, time: '' }));
      }
    }
  }, [booking.island, booking.time, timeRestrictions, allTimes]);
  
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

  const handleDepartureDateSelect = (date: Date | undefined) => {
    setDepartureDate(date);
    setDepartureDateOpen(false);
  };

  const handleReturnDateSelect = (date: Date | undefined) => {
    setReturnDate(date);
    setReturnDateOpen(false);
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ReturnTripSwitch
        isReturnTrip={booking.returnTrip}
        onReturnTripChange={handleReturnToggle}
      />

      <TripLocationSelector
        fromLocation={booking.from}
        toLocation={booking.island}
        fromLocations={fromLocations}
        toLocations={toLocations}
        isLoading={isLoading}
        onFromChange={(value) => setBooking({ ...booking, from: value })}
        onToChange={handleSelectDestination}
      />
      
      <TripDateTimeSelector
        date={departureDate}
        time={booking.time}
        availableTimes={availableTimes}
        minDate={today}
        isDateOpen={departureDateOpen}
        setIsDateOpen={setDepartureDateOpen}
        onDateSelect={handleDepartureDateSelect}
        onTimeChange={(value) => setBooking({ ...booking, time: value })}
      />
      
      {booking.returnTrip && (
        <ReturnTripSection
          returnTime={booking.returnTripDetails?.time || ''}
          availableTimes={returnAvailableTimes}
          returnDate={returnDate}
          minDate={departureDate}
          returnDateOpen={returnDateOpen}
          setReturnDateOpen={setReturnDateOpen}
          onReturnDateSelect={handleReturnDateSelect}
          onReturnTimeChange={(value) => setBooking({ 
            ...booking, 
            returnTripDetails: { 
              ...booking.returnTripDetails!, 
              time: value 
            } 
          })}
        />
      )}
      
      <PassengerSelection 
        onChange={handlePassengerCountChange}
        initialCount={booking.passengerCounts || {adults: 1, children: 0, seniors: 0}}
        maxPassengers={MAX_PASSENGERS}
      />
      
      <Button 
        type="submit" 
        className="w-full bg-ocean hover:bg-ocean-dark text-white h-[60px] text-base font-medium"
      >
        {t("common.bookNow", "Book Now")}
      </Button>
    </form>
  );
};

export default BookingForm;
