
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
  
  return (
    <>
      <IslandSelector
        label={t("booking.form.from", "From")}
        icon={<Navigation className="h-5 w-5 text-ocean mr-2" />}
        selectedIsland={fromLocation}
        islandNames={fromLocations}
        onIslandChange={onFromChange}
        placeholder={t("booking.form.selectDeparture", "Select departure island")}
        isLoading={isLoading}
        id="from-select"
      />
      
      <IslandSelector
        label={t("booking.form.destinationIsland", "Destination Island")}
        icon={<MapPin className="h-5 w-5 text-ocean mr-2" />}
        selectedIsland={toLocation}
        islandNames={toLocations}
        onIslandChange={onToChange}
        isLoading={isLoading}
        id="island-select"
      />
    </>
  );
};

export default TripLocationSelector;
