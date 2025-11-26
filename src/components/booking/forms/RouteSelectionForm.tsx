
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

  // This function is kept for interface compatibility but isn't used anymore
  const handleSwitchRoutes = () => {
    // No longer implemented
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
        // or if it creates a Male' City/Airport conflict
        let newIsland = booking.island;
        if (value === booking.island) {
          newIsland = '';
        } else if (value === "Male' City" && booking.island === "Male' Airport") {
          newIsland = '';
        } else if (value === "Male' Airport" && booking.island === "Male' City") {
          newIsland = '';
        }
        
        onBookingChange({ 
          ...booking, 
          from: value,
          island: newIsland,
          time: '' // Reset time as available times may change
        });
      }}
      onToChange={handleSelectDestination}
      onSwitchRoutes={handleSwitchRoutes}
    />
  );
};

export default RouteSelectionForm;
