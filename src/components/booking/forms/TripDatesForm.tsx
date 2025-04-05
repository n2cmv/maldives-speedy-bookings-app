
import { useState, useEffect } from "react";
import { Time, BookingInfo } from "@/types/booking";
import TripDateTimeSelector from "../TripDateTimeSelector";
import ReturnTripSection from "../ReturnTripSection";

interface TripDatesFormProps {
  booking: BookingInfo;
  onBookingChange: (booking: BookingInfo) => void;
  departureDate: Date | undefined;
  setDepartureDate: (date: Date | undefined) => void; 
  departureDateOpen: boolean;
  setDepartureDateOpen: (open: boolean) => void;
  returnDate: Date | undefined;
  setReturnDate: (date: Date | undefined) => void;
  returnDateOpen: boolean;
  setReturnDateOpen: (open: boolean) => void;
  availableTimes: Time[];
  returnAvailableTimes: Time[];
  today: Date;
}

const TripDatesForm = ({
  booking,
  onBookingChange,
  departureDate,
  setDepartureDate,
  departureDateOpen,
  setDepartureDateOpen,
  returnDate,
  setReturnDate,
  returnDateOpen,
  setReturnDateOpen,
  availableTimes,
  returnAvailableTimes,
  today
}: TripDatesFormProps) => {
  const handleDepartureDateSelect = (date: Date | undefined) => {
    setDepartureDate(date);
    setDepartureDateOpen(false);
  };

  const handleReturnDateSelect = (date: Date | undefined) => {
    setReturnDate(date);
    setReturnDateOpen(false);
  };

  return (
    <>
      <TripDateTimeSelector
        date={departureDate}
        time={booking.time}
        availableTimes={availableTimes}
        minDate={today}
        isDateOpen={departureDateOpen}
        setIsDateOpen={setDepartureDateOpen}
        onDateSelect={handleDepartureDateSelect}
        onTimeChange={(value) => onBookingChange({ ...booking, time: value })}
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
          onReturnTimeChange={(value) => onBookingChange({ 
            ...booking, 
            returnTripDetails: { 
              ...booking.returnTripDetails!, 
              time: value 
            } 
          })}
        />
      )}
    </>
  );
};

export default TripDatesForm;
