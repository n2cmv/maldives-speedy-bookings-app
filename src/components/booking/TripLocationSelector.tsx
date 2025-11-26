
import { useTranslation } from "react-i18next";
import { MapPin, Navigation } from "lucide-react";
import IslandSelector from "./IslandSelector";

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
  // Also filter Male' Airport if from is Male' City, and vice versa
  const filteredToLocations = toLocations.filter(island => {
    if (island === fromLocation) return false;
    if (fromLocation === "Male' City" && island === "Male' Airport") return false;
    if (fromLocation === "Male' Airport" && island === "Male' City") return false;
    return true;
  });
  
  return (
    <div className="route-selectors-container relative space-y-6">
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
