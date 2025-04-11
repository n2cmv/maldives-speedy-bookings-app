
import { useEffect, useState } from "react";
import { BookingInfo, Time, PassengerCount } from "@/types/booking";
import { useBookingForm } from "./hooks/useBookingForm";
import { useRouteTimesMap } from "./hooks/useRouteTimesMap";
import { useAvailableTimes } from "./hooks/useAvailableTimes";
import PassengerSelection from "./PassengerSelection";
import RouteSelectionForm from "./forms/RouteSelectionForm";
import TripDatesForm from "./forms/TripDatesForm";
import BookingFormFooter from "./forms/BookingFormFooter";

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
  // Get route data
  const { 
    fromLocations, 
    toLocations, 
    availableTimesMap, 
    isLoading: routesLoading 
  } = useRouteTimesMap();
  
  // Combined loading state
  const [isLoading, setIsLoading] = useState<boolean>(externalIsLoading || routesLoading);
  
  // Use our custom hook to manage booking form state
  const {
    booking,
    setBooking,
    departureDate,
    setDepartureDate,
    returnDate,
    setReturnDate,
    departureDateOpen,
    setDepartureDateOpen,
    returnDateOpen,
    setReturnDateOpen,
    handlePassengerCountChange,
    handleSubmit,
    today
  } = useBookingForm({
    preSelectedIsland,
    isLoading
  });

  // Get available times based on selected route
  const { availableTimes, returnAvailableTimes } = useAvailableTimes(
    booking,
    availableTimesMap,
    allTimes
  );
  
  // Update loading state when external loading changes
  useEffect(() => {
    setIsLoading(externalIsLoading || routesLoading);
  }, [externalIsLoading, routesLoading]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full isolate">
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
