
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface CountryCodeDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

const COMMON_COUNTRY_CODES = [
  { code: "+1", country: "US/CA" },
  { code: "+44", country: "UK" },
  { code: "+91", country: "IN" },
  { code: "+61", country: "AU" },
  { code: "+960", country: "MV" },
];

export const CountryCodeDropdown: React.FC<CountryCodeDropdownProps> = ({
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (code: string) => {
    onChange(code);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          aria-label="Select country code"
          className="w-full h-12 px-2 flex justify-between items-center bg-white border border-gray-200"
          onClick={(e) => {
            e.preventDefault(); // Prevent form submission
            e.stopPropagation(); // Stop event propagation
          }}
        >
          <span className="text-base">{value || "+1"}</span>
          <ChevronDown className="h-4 w-4 ml-1 flex-shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-[120px] bg-white border border-gray-200 shadow-md z-50 max-h-64 overflow-y-auto"
      >
        {COMMON_COUNTRY_CODES.map((item) => (
          <DropdownMenuItem
            key={item.code}
            onClick={() => handleSelect(item.code)}
            className="cursor-pointer py-2.5 hover:bg-gray-50"
          >
            <span className="text-sm">
              {item.code} ({item.country})
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CountryCodeDropdown;
