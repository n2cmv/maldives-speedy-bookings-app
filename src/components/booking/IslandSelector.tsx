
import { SelectContent, SelectItem, SelectTrigger, Select } from "@/components/ui/select";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ForwardedRef, forwardRef } from "react";

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
        >
          <SelectTrigger 
            ref={ref}
            id={id} 
            className="custom-select-trigger opacity-0 absolute top-0 left-0 w-full h-full" 
          />
          <SelectContent 
            className="select-content z-[100] bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700"
            position="popper"
            sideOffset={5}
          >
            {isLoading ? (
              <SelectItem value="loading">Loading...</SelectItem>
            ) : (
              islandNames.map((islandName) => (
                <SelectItem 
                  key={islandName} 
                  value={islandName}
                  className="select-item cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 bg-white dark:bg-gray-800"
                >
                  {islandName}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
});

IslandSelector.displayName = "IslandSelector";

export default IslandSelector;
