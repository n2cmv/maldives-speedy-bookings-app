
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookingInfo, Time, PassengerCount } from "@/types/booking";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";
import ReturnTripSwitch from "./ReturnTripSwitch";
import TripLocationSelector from "./TripLocationSelector";
import TripDateTimeSelector from "./TripDateTimeSelector";
import ReturnTripSection from "./ReturnTripSection";
import PassengerSelection from "./PassengerSelection";
import { getAllRoutes } from "@/services/bookingService";
import { supabase } from "@/integrations/supabase/client";

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
  const [availableTimesMap, setAvailableTimesMap] = useState<Record<string, Record<string, Time[]>>>({});
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
          toast({
            title: t("booking.error", "Error"),
            description: t("booking.form.errorFetchingRoutes", "Failed to fetch available routes"),
            variant: "destructive"
          });
          return;
        }

        if (data) {
          console.log("Routes data received:", data);
          
          const uniqueFromLocations = Array.from(new Set(data.map(route => route.from_location)));
          const uniqueToLocations = Array.from(new Set(data.map(route => route.to_location)));
          
          // Build a map of available times for each route
          const timesMap: Record<string, Record<string, Time[]>> = {};
          
          data.forEach(route => {
            if (!timesMap[route.from_location]) {
              timesMap[route.from_location] = {};
            }
            
            // Convert string[] to Time[] with type checking
            const validTimings: Time[] = (route.timings || []).filter((time): time is Time => {
              // Verify each timing string is a valid Time enum value
              return Object.values<string>(Time).includes(time);
            });
            
            // Log route timings for debugging
            console.log(`Route timings for ${route.from_location} to ${route.to_location}:`, 
              route.timings, "Valid timings:", validTimings);
            
            timesMap[route.from_location][route.to_location] = validTimings.length > 0 ? validTimings : allTimes;
          });
          
          console.log("Available times map:", timesMap);
          setAvailableTimesMap(timesMap);
          setFromLocations(uniqueFromLocations);
          setToLocations(uniqueToLocations);
        }
      } catch (error) {
        console.error("Exception fetching routes:", error);
        toast({
          title: t("booking.error", "Error"),
          description: t("booking.form.exceptionFetchingRoutes", "An error occurred while fetching routes"),
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoutes();
    
    // Set up real-time subscription to listen for route changes
    const channel = supabase
      .channel('booking-routes-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'routes' },
        (payload) => {
          console.log('Route update detected in booking form:', payload);
          // Refresh routes data when changes are detected
          fetchRoutes();
          toast({
            title: t("booking.routesUpdated", "Routes Updated"),
            description: t("booking.routesRefreshed", "Available routes have been refreshed")
          });
        }
      )
      .subscribe();
    
    // Clean up subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [allTimes, t]);

  const getRouteTimings = (from: string, to: string): Time[] => {
    // Check both directional routes if data exists (in case route is defined in reverse)
    if (availableTimesMap[from] && availableTimesMap[from][to] && availableTimesMap[from][to].length > 0) {
      console.log(`Found timings for ${from} to ${to}:`, availableTimesMap[from][to]);
      return availableTimesMap[from][to];
    }
    
    // Log that we're falling back to default times
    console.log(`No specific timings found for ${from} to ${to}, using default times`);
    return allTimes;
  };
  
  const availableTimes = booking.from && booking.island 
    ? getRouteTimings(booking.from, booking.island)
    : allTimes;
  
  const returnAvailableTimes = booking.returnTrip && booking.returnTripDetails?.from && booking.returnTripDetails?.island
    ? getRouteTimings(booking.returnTripDetails.from, booking.returnTripDetails.island)
    : allTimes;

  useEffect(() => {
    if (booking.from && booking.island && booking.time) {
      const routeTimings = getRouteTimings(booking.from, booking.island);
      if (!routeTimings.includes(booking.time as Time)) {
        setBooking(prev => ({ ...prev, time: '' }));
      }
    }
  }, [booking.from, booking.island, booking.time]);
  
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
    if (island !== booking.from) {
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
