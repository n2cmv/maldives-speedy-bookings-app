import { useState, useRef, useEffect } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CountryCode {
  code: string;
  name: string;
  dial_code: string;
  flag: string;
}

interface CountryCodeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

// List of country codes
const countryCodes: CountryCode[] = [
  { code: "US", name: "United States", dial_code: "+1", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", dial_code: "+44", flag: "🇬🇧" },
  { code: "MV", name: "Maldives", dial_code: "+960", flag: "🇲🇻" },
  { code: "IN", name: "India", dial_code: "+91", flag: "🇮🇳" },
  { code: "AU", name: "Australia", dial_code: "+61", flag: "🇦🇺" },
  { code: "CA", name: "Canada", dial_code: "+1", flag: "🇨🇦" },
  { code: "DE", name: "Germany", dial_code: "+49", flag: "🇩🇪" },
  { code: "FR", name: "France", dial_code: "+33", flag: "🇫🇷" },
  { code: "IT", name: "Italy", dial_code: "+39", flag: "🇮🇹" },
  { code: "JP", name: "Japan", dial_code: "+81", flag: "🇯🇵" },
  { code: "CN", name: "China", dial_code: "+86", flag: "🇨🇳" },
  { code: "RU", name: "Russia", dial_code: "+7", flag: "🇷🇺" },
  { code: "BR", name: "Brazil", dial_code: "+55", flag: "🇧🇷" },
  { code: "AE", name: "United Arab Emirates", dial_code: "+971", flag: "🇦🇪" },
  { code: "SG", name: "Singapore", dial_code: "+65", flag: "🇸🇬" },
  { code: "MY", name: "Malaysia", dial_code: "+60", flag: "🇲🇾" },
  { code: "TH", name: "Thailand", dial_code: "+66", flag: "🇹🇭" },
  { code: "ID", name: "Indonesia", dial_code: "+62", flag: "🇮🇩" },
  { code: "PH", name: "Philippines", dial_code: "+63", flag: "🇵🇭" },
  { code: "VN", name: "Vietnam", dial_code: "+84", flag: "🇻🇳" },
  { code: "SA", name: "Saudi Arabia", dial_code: "+966", flag: "🇸🇦" },
  { code: "QA", name: "Qatar", dial_code: "+974", flag: "🇶🇦" },
  { code: "KW", name: "Kuwait", dial_code: "+965", flag: "🇰🇼" },
  { code: "BH", name: "Bahrain", dial_code: "+973", flag: "🇧🇭" },
  { code: "OM", name: "Oman", dial_code: "+968", flag: "🇴🇲" },
  { code: "EG", name: "Egypt", dial_code: "+20", flag: "🇪🇬" },
  { code: "ZA", name: "South Africa", dial_code: "+27", flag: "🇿🇦" },
  { code: "NG", name: "Nigeria", dial_code: "+234", flag: "🇳🇬" },
  { code: "KE", name: "Kenya", dial_code: "+254", flag: "🇰🇪" },
  { code: "GH", name: "Ghana", dial_code: "+233", flag: "🇬🇭" },
  { code: "TZ", name: "Tanzania", dial_code: "+255", flag: "🇹🇿" },
  { code: "LK", name: "Sri Lanka", dial_code: "+94", flag: "🇱🇰" },
  { code: "NP", name: "Nepal", dial_code: "+977", flag: "🇳🇵" },
  { code: "BD", name: "Bangladesh", dial_code: "+880", flag: "🇧🇩" },
  { code: "PK", name: "Pakistan", dial_code: "+92", flag: "🇵🇰" },
  { code: "AF", name: "Afghanistan", dial_code: "+93", flag: "🇦🇫" },
  { code: "IR", name: "Iran", dial_code: "+98", flag: "🇮🇷" },
  { code: "IQ", name: "Iraq", dial_code: "+964", flag: "🇮🇶" },
  { code: "TR", name: "Turkey", dial_code: "+90", flag: "🇹🇷" },
  { code: "IL", name: "Israel", dial_code: "+972", flag: "🇮🇱" },
  { code: "JO", name: "Jordan", dial_code: "+962", flag: "🇯🇴" },
  { code: "LB", name: "Lebanon", dial_code: "+961", flag: "🇱🇧" },
  { code: "SY", name: "Syria", dial_code: "+963", flag: "🇸🇾" },
  { code: "FI", name: "Finland", dial_code: "+358", flag: "🇫🇮" },
  { code: "SE", name: "Sweden", dial_code: "+46", flag: "🇸🇪" },
  { code: "NO", name: "Norway", dial_code: "+47", flag: "🇳🇴" },
  { code: "DK", name: "Denmark", dial_code: "+45", flag: "🇩🇰" },
  { code: "NL", name: "Netherlands", dial_code: "+31", flag: "🇳🇱" },
  { code: "BE", name: "Belgium", dial_code: "+32", flag: "🇧🇪" },
  { code: "CH", name: "Switzerland", dial_code: "+41", flag: "🇨🇭" },
  { code: "AT", name: "Austria", dial_code: "+43", flag: "🇦🇹" },
  { code: "ES", name: "Spain", dial_code: "+34", flag: "🇪🇸" },
  { code: "PT", name: "Portugal", dial_code: "+351", flag: "🇵🇹" },
  { code: "GR", name: "Greece", dial_code: "+30", flag: "🇬🇷" },
  { code: "IE", name: "Ireland", dial_code: "+353", flag: "🇮🇪" },
  { code: "IS", name: "Iceland", dial_code: "+354", flag: "🇮🇸" }
];

const CountryCodeSelector = ({ value, onChange }: CountryCodeSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  
  // Find the selected country by dial code
  const selectedCountry = countryCodes.find(country => country.dial_code === value);
  
  // Handle clicks outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  // Set mounted state after component mount to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[110px] justify-between"
        >
          {selectedCountry ? (
            <span>
              {selectedCountry.flag} {selectedCountry.dial_code}
            </span>
          ) : (
            <span>
              🏳️ Select
            </span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0" ref={popoverRef}>
        {mounted && open ? (
          <div className="relative">
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <input
                className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Search country..."
              />
            </div>
            <ScrollArea className="h-[300px]">
              <div className="p-1">
                {countryCodes.map((country) => (
                  <div
                    key={country.code}
                    className={cn(
                      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected='true']:bg-accent data-[selected='true']:text-accent-foreground data-[disabled=true]:opacity-50",
                      value === country.dial_code ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"
                    )}
                    onClick={() => {
                      onChange(country.dial_code);
                      setOpen(false);
                    }}
                  >
                    <span className="mr-2">{country.flag}</span>
                    <span>{country.name}</span>
                    <span className="ml-2 text-gray-500">{country.dial_code}</span>
                    {value === country.dial_code && (
                      <Check className="ml-auto h-4 w-4 opacity-100" />
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  );
};

export default CountryCodeSelector;
