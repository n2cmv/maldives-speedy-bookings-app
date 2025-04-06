
import { useTranslation } from "react-i18next";
import { MapPin, Navigation, ArrowLeftRight } from "lucide-react";
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
    <div className="relative">
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
        <div className="flex justify-center my-2 relative z-10">
          <Button 
            type="button"
            variant="outline"
            size="icon"
            onClick={(e) => {
              e.preventDefault(); // Prevent form submission
              onSwitchRoutes();
            }}
            className="rounded-full border-ocean text-ocean hover:bg-ocean-light/10 hover:text-ocean-dark transition-all duration-300"
            title={t("booking.form.switchRoutes", "Switch routes")}
          >
            <ArrowLeftRight className="h-4 w-4" />
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
