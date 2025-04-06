
import { useState, useEffect } from "react";
import { Island, Time, BookingInfo } from "@/types/booking";
import TripLocationSelector from "../TripLocationSelector";
import { toast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";

interface RouteSelectionFormProps {
  fromLocations: string[];
  toLocations: string[];
  isLoading: boolean;
  booking: BookingInfo;
  onBookingChange: (booking: BookingInfo) => void;
  availableTimesMap: Record<string, Record<string, Time[]>>;
}

const RouteSelectionForm = ({
  fromLocations,
  toLocations,
  isLoading,
  booking,
  onBookingChange,
  availableTimesMap
}: RouteSelectionFormProps) => {
  const { t } = useTranslation();

  const handleSelectDestination = (island: string) => {
    if (island !== booking.from) {
      onBookingChange({ ...booking, island });
      
      if (booking.returnTrip) {
        onBookingChange({
          ...booking,
          island,
          returnTripDetails: {
            ...booking.returnTripDetails!,
            island: booking.from,
            from: island
          }
        });
      }
    }
  };

  // Fixed function to properly handle the route switch
  const handleSwitchRoutes = () => {
    // Store current values - make sure we're using the actual values, not empty strings
    const fromLocation = booking.from;
    const toLocation = booking.island;
    
    // Only proceed if at least one field has a value
    if (fromLocation || toLocation) {
      // Create new booking object with swapped routes and reset time selection
      const updatedBooking: BookingInfo = {
        ...booking,
        from: toLocation || '', // Use empty string if toLocation is empty
        island: fromLocation || '', // Use empty string if fromLocation is empty
        time: '' as '', // Reset time selection
      };
      
      // If there's a return trip, swap those routes too
      if (booking.returnTrip && booking.returnTripDetails) {
        updatedBooking.returnTripDetails = {
          ...booking.returnTripDetails,
          from: fromLocation || '',
          island: toLocation || '',
          time: '' as '',
        };
      }
      
      // Apply the changes
      onBookingChange(updatedBooking);
      
      // Show a toast notification to confirm the switch
      toast({
        title: t("booking.form.routesSwitched", "Routes Switched"),
        description: t("booking.form.routesSwitchedDescription", "Departure and destination have been switched."),
      });
    }
  };

  return (
    <TripLocationSelector
      fromLocation={booking.from}
      toLocation={booking.island}
      fromLocations={fromLocations}
      toLocations={toLocations}
      isLoading={isLoading}
      onFromChange={(value) => {
        // Clear destination if it's the same as the selected origin
        onBookingChange({ 
          ...booking, 
          from: value,
          island: value === booking.island ? '' : booking.island,
          time: '' as '' // Explicitly type as empty string
        });
      }}
      onToChange={handleSelectDestination}
      onSwitchRoutes={handleSwitchRoutes}
    />
  );
};

export default RouteSelectionForm;
