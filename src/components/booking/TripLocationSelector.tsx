
import { useTranslation } from "react-i18next";
import { MapPin, Navigation, RotateCw } from "lucide-react";
import IslandSelector from "./IslandSelector";
import { Button } from "@/components/ui/button";

interface TripLocationSelectorProps {
  fromLocation: string;
  toLocation: string;
  fromLocations: string[];
  toLocations: string[];
  isLoading: boolean;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onSwitchRoutes: () => void;
}

const TripLocationSelector = ({
  fromLocation,
  toLocation,
  fromLocations,
  toLocations,
  isLoading,
  onFromChange,
  onToChange,
  onSwitchRoutes
}: TripLocationSelectorProps) => {
  const { t } = useTranslation();
  
  // Filter out the currently selected fromLocation from toLocations
  const filteredToLocations = toLocations.filter(island => island !== fromLocation);
  
  return (
    <div className="relative space-y-3">
      <IslandSelector
        label={t("booking.form.from", "From")}
        icon={<Navigation className="h-5 w-5 text-ocean mr-2" />}
        selectedIsland={fromLocation}
        islandNames={fromLocations}
        onIslandChange={(value) => {
          onFromChange(value);
          // If the newly selected 'from' location is the same as the current 'to' location,
          // clear the 'to' location to avoid having the same island as both departure and destination
          if (value === toLocation) {
            onToChange('');
          }
        }}
        placeholder={t("booking.form.selectDeparture", "Select departure island")}
        isLoading={isLoading}
        id="from-select"
      />
      
      {/* Switch Routes Button - Only show when both selections are made */}
      {fromLocation && toLocation && (
        <div className="flex justify-center my-0">
          <Button 
            type="button"
            variant="outline"
            size="icon"
            onClick={onSwitchRoutes}
            className="rounded-full border-ocean text-ocean hover:bg-ocean-light/10 hover:text-ocean-dark h-6 w-6 absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
            title={t("booking.form.switchRoutes", "Switch routes")}
          >
            <RotateCw className="h-3 w-3" />
          </Button>
        </div>
      )}
      
      <IslandSelector
        label={t("booking.form.destinationIsland", "Destination Island")}
        icon={<MapPin className="h-5 w-5 text-ocean mr-2" />}
        selectedIsland={toLocation}
        islandNames={filteredToLocations}
        onIslandChange={onToChange}
        isLoading={isLoading}
        id="island-select"
      />
    </div>
  );
};

export default TripLocationSelector;
