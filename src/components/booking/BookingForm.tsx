
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookingInfo, Time, PassengerCount } from "@/types/booking";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { MapPin, Navigation } from "lucide-react";
import { useTranslation } from "react-i18next";
import SeatPicker from "../SeatPicker";
import PopularDestinations from "../PopularDestinations";
import IslandSelector from "./IslandSelector";
import DateSelector from "./DateSelector";
import TimeSelector from "./TimeSelector";
import ReturnTripSwitch from "./ReturnTripSwitch";

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
  isLoading,
  timeRestrictions,
  allTimes
}: BookingFormProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<BookingInfo>({
    from: 'Male\' Airport',
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

      <IslandSelector
        label={t("booking.form.from", "From")}
        icon={<Navigation className="h-5 w-5 text-ocean mr-2" />}
        selectedIsland={booking.from}
        islandNames={islandNames}
        onIslandChange={(value) => setBooking({ ...booking, from: value })}
        placeholder={t("booking.form.selectDeparture", "Select departure island")}
        isLoading={isLoading}
        id="from-select"
      />
      
      <IslandSelector
        label={t("booking.form.destinationIsland", "Destination Island")}
        icon={<MapPin className="h-5 w-5 text-ocean mr-2" />}
        selectedIsland={booking.island}
        islandNames={islandNames}
        onIslandChange={(value) => setBooking({ ...booking, island: value })}
        isLoading={isLoading}
        id="island-select"
      />
      
      <DateSelector
        label={t("booking.form.departureDate", "Departure Date")}
        selectedDate={departureDate}
        onDateSelect={handleDepartureDateSelect}
        minDate={today}
        isOpen={departureDateOpen}
        setIsOpen={setDepartureDateOpen}
      />
      
      <TimeSelector
        label={t("booking.form.departureTime", "Departure Time")}
        selectedTime={booking.time}
        availableTimes={availableTimes}
        onTimeChange={(value) => setBooking({ ...booking, time: value })}
      />
      
      {booking.returnTrip && (
        <>
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h3 className="font-medium text-ocean-dark mb-4">{t("booking.summary.returnJourney", "Return Journey")}</h3>
          </div>
          
          <DateSelector
            label={t("booking.form.returnDate", "Return Date")}
            selectedDate={returnDate}
            onDateSelect={handleReturnDateSelect}
            minDate={departureDate}
            isOpen={returnDateOpen}
            setIsOpen={setReturnDateOpen}
          />
          
          <TimeSelector
            label={t("booking.form.returnTime", "Return Time")}
            selectedTime={booking.returnTripDetails?.time || ''}
            availableTimes={returnAvailableTimes}
            onTimeChange={(value) => setBooking({ 
              ...booking, 
              returnTripDetails: { 
                ...booking.returnTripDetails!, 
                time: value 
              } 
            })}
            id="return-time-select"
          />
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
  );
};

export default BookingForm;
