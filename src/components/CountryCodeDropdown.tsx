
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

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full h-12 px-2 flex justify-between items-center bg-white"
        >
          <span className="text-base">{value || "+1"}</span>
          <ChevronDown className="h-4 w-4 ml-1 flex-shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-full bg-white border border-gray-200 shadow-md z-50"
      >
        {COMMON_COUNTRY_CODES.map((item) => (
          <DropdownMenuItem
            key={item.code}
            onClick={() => {
              onChange(item.code);
              setIsOpen(false);
            }}
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
