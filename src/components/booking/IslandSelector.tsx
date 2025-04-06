
import { SelectContent, SelectItem, SelectTrigger, Select } from "@/components/ui/select";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ForwardedRef, forwardRef, useEffect, useState } from "react";

interface IslandSelectorProps {
  label: string;
  icon: React.ReactNode;
  selectedIsland: string;
  islandNames: string[];
  onIslandChange: (island: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  id?: string;
  ref?: ForwardedRef<HTMLButtonElement>;
}

const IslandSelector = forwardRef<HTMLButtonElement, IslandSelectorProps>(({
  label,
  icon,
  selectedIsland,
  islandNames,
  onIslandChange,
  placeholder,
  isLoading = false,
  id = "island-select"
}, ref) => {
  const { t } = useTranslation();
  const [options, setOptions] = useState<string[]>([]);
  
  // Update options when islandNames changes
  useEffect(() => {
    if (islandNames && islandNames.length > 0) {
      setOptions(islandNames);
    }
  }, [islandNames]);
  
  return (
    <div className="space-y-2 relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <div className="passenger-picker" onClick={() => document.getElementById(id)?.click()}>
          <div className="flex items-center">
            {icon}
            <span className="text-base">{selectedIsland || placeholder || t("booking.form.selectIsland", "Select an island")}</span>
          </div>
          <ChevronDown className="h-5 w-5 text-ocean/70" />
        </div>
        <Select
          value={selectedIsland}
          onValueChange={onIslandChange}
          disabled={isLoading || options.length === 0}
        >
          <SelectTrigger 
            ref={ref}
            id={id} 
            className="custom-select-trigger opacity-0 absolute top-0 left-0 w-full h-full" 
          />
          <SelectContent 
            className="select-content z-50 bg-white shadow-lg"
            position="popper"
            sideOffset={5}
          >
            {isLoading ? (
              <SelectItem value="loading">Loading...</SelectItem>
            ) : options.length > 0 ? (
              options.map((islandName) => (
                <SelectItem 
                  key={islandName} 
                  value={islandName}
                  className="select-item"
                >
                  {islandName}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-options">No islands available</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
});

IslandSelector.displayName = "IslandSelector";

export default IslandSelector;
