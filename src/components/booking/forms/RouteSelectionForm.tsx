
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
    }
  };

  // Function to handle the route switch
  const handleSwitchRoutes = () => {
    if (booking.from && booking.island) {
      const newFrom = booking.island;
      const newTo = booking.from;
      
      onBookingChange({
        ...booking,
        from: newFrom,
        island: newTo,
        time: '' // Reset time as available times may change
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
          time: '' // Reset time as available times may change
        });
      }}
      onToChange={handleSelectDestination}
      onSwitchRoutes={handleSwitchRoutes}
    />
  );
};

export default RouteSelectionForm;
