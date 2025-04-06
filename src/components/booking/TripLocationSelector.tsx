
import { useTranslation } from "react-i18next";
import { MapPin, Navigation } from "lucide-react";
import IslandSelector from "./IslandSelector";
import { useEffect, useState } from "react";

interface TripLocationSelectorProps {
  fromLocation: string;
  toLocation: string;
  fromLocations: string[];
  toLocations: string[];
  isLoading: boolean;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
}

const TripLocationSelector = ({
  fromLocation,
  toLocation,
  fromLocations,
  toLocations,
  isLoading,
  onFromChange,
  onToChange
}: TripLocationSelectorProps) => {
  const { t } = useTranslation();
  const [filteredToLocations, setFilteredToLocations] = useState<string[]>([]);
  
  // Filter out the currently selected fromLocation from toLocations whenever changes occur
  useEffect(() => {
    const filtered = toLocations.filter(island => island !== fromLocation);
    console.log("Filtered destination islands:", filtered);
    setFilteredToLocations(filtered);
  }, [fromLocation, toLocations]);
  
  return (
    <>
      <IslandSelector
        label={t("booking.form.from", "From")}
        icon={<Navigation className="h-5 w-5 text-ocean mr-2" />}
        selectedIsland={fromLocation}
        islandNames={fromLocations}
        onIslandChange={(value) => {
          console.log("From location changed to:", value);
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
        onIslandChange={(value) => {
          console.log("Destination changed to:", value);
          onToChange(value);
        }}
        isLoading={isLoading}
        id="island-select"
      />
    </>
  );
};

export default TripLocationSelector;
