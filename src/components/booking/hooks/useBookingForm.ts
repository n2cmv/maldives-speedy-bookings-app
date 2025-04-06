
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BookingInfo, Time, PassengerCount } from "@/types/booking";
import { toast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";

interface UseBookingFormProps {
  preSelectedIsland?: string;
  preSelectedFrom?: string;
  isLoading: boolean;
}

export const useBookingForm = ({
  preSelectedIsland,
  preSelectedFrom,
  isLoading: externalIsLoading
}: UseBookingFormProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Booking state
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
      
      // Only update the from location if it's different to avoid loops
      if (booking.from !== preSelectedFrom) {
        setBooking(prev => ({
          ...prev,
          from: preSelectedFrom,
          // Reset the island selection if needed
          island: preSelectedFrom === prev.island ? '' : prev.island
        }));
      }
      
      prevPreSelectedFrom.current = preSelectedFrom;
    }
  }, [preSelectedFrom, booking.from]);
  
  // Date state
  const today = new Date();
  const [departureDate, setDepartureDate] = useState<Date | undefined>(today);
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);
  const [departureDateOpen, setDepartureDateOpen] = useState(false);
  const [returnDateOpen, setReturnDateOpen] = useState(false);
  
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
  
  // Booking form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const MAX_PASSENGERS = 15;
    
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

  return {
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
    handleReturnToggle,
    handleSubmit,
    today
  };
};
