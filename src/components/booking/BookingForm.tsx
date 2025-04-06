
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BookingInfo, Time, PassengerCount } from "@/types/booking";
import { toast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";
import ReturnTripSwitch from "./ReturnTripSwitch";
import PassengerSelection from "./PassengerSelection";
import { useRouteTimesMap } from "./hooks/useRouteTimesMap";
import { useAvailableTimes } from "./hooks/useAvailableTimes";
import RouteSelectionForm from "./forms/RouteSelectionForm";
import TripDatesForm from "./forms/TripDatesForm";
import BookingFormFooter from "./forms/BookingFormFooter";

interface BookingFormProps {
  preSelectedIsland?: string;
  preSelectedFrom?: string;
  islandNames: string[];
  isLoading: boolean;
  timeRestrictions: Record<string, Time[]>;
  allTimes: Time[];
}

const MAX_PASSENGERS = 15;

const BookingForm = ({
  preSelectedIsland,
  preSelectedFrom,
  islandNames,
  isLoading: externalIsLoading,
  timeRestrictions,
  allTimes
}: BookingFormProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Route data state
  const { 
    fromLocations, 
    toLocations, 
    availableTimesMap, 
    isLoading: routesLoading 
  } = useRouteTimesMap();
  
  const [isLoading, setIsLoading] = useState<boolean>(externalIsLoading || routesLoading);
  const [booking, setBooking] = useState<BookingInfo>({
    from: preSelectedFrom || '',
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
  
  // Using useRef for tracking previous props
  const prevPreSelectedFrom = useRef<string | undefined>(preSelectedFrom);

  // Update booking when preSelectedFrom changes
  useEffect(() => {
    if (preSelectedFrom && preSelectedFrom !== prevPreSelectedFrom.current) {
      console.log("BookingForm - Updating 'from' due to prop change:", preSelectedFrom);
      setBooking(prev => ({
        ...prev,
        from: preSelectedFrom
      }));
      prevPreSelectedFrom.current = preSelectedFrom;
    }
  }, [preSelectedFrom]);
  
  // Date state
  const today = new Date();
  const [departureDate, setDepartureDate] = useState<Date | undefined>(today);
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);
  const [departureDateOpen, setDepartureDateOpen] = useState(false);
  const [returnDateOpen, setReturnDateOpen] = useState(false);

  // Get available times based on selected route
  const { availableTimes, returnAvailableTimes } = useAvailableTimes(
    booking,
    availableTimesMap,
    allTimes
  );

  // Update return trip details when route changes
  useEffect(() => {
    if (booking.returnTrip && booking.island && booking.from) {
      setBooking(prev => ({
        ...prev,
        returnTripDetails: {
          ...prev.returnTripDetails,
          from: prev.island,
          island: prev.from,
          date: returnDate
        }
      }));
    }
  }, [booking.returnTrip, booking.island, booking.from, returnDate]);

  // Passengers handling
  const handlePassengerCountChange = (passengerCounts: PassengerCount) => {
    const totalSeats = passengerCounts.adults + passengerCounts.children + passengerCounts.seniors;
    setBooking({ 
      ...booking, 
      seats: totalSeats,
      passengerCounts 
    });
  };
  
  // Return trip toggle
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

  // Form validation and submission
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

  // Update loading state when external loading changes
  useEffect(() => {
    setIsLoading(externalIsLoading || routesLoading);
  }, [externalIsLoading, routesLoading]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ReturnTripSwitch
        isReturnTrip={booking.returnTrip}
        onReturnTripChange={handleReturnToggle}
      />

      <RouteSelectionForm
        fromLocations={fromLocations}
        toLocations={toLocations}
        isLoading={isLoading}
        booking={booking}
        onBookingChange={setBooking}
        availableTimesMap={availableTimesMap}
      />
      
      <TripDatesForm
        booking={booking}
        onBookingChange={setBooking}
        departureDate={departureDate}
        setDepartureDate={setDepartureDate}
        departureDateOpen={departureDateOpen}
        setDepartureDateOpen={setDepartureDateOpen}
        returnDate={returnDate}
        setReturnDate={setReturnDate}
        returnDateOpen={returnDateOpen}
        setReturnDateOpen={setReturnDateOpen}
        availableTimes={availableTimes}
        returnAvailableTimes={returnAvailableTimes}
        today={today}
      />
      
      <PassengerSelection 
        onChange={handlePassengerCountChange}
        initialCount={booking.passengerCounts || {adults: 1, children: 0, seniors: 0}}
        maxPassengers={MAX_PASSENGERS}
      />
      
      <BookingFormFooter onSubmit={handleSubmit} />
    </form>
  );
};

export default BookingForm;
