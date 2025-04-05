
import { Passenger } from "@/types/booking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, User } from "lucide-react";
import CountryCodeSelector from "@/components/CountryCodeSelector";

interface PassengerFormItemProps {
  passenger: Passenger;
  index: number;
  isRemovable: boolean;
  onRemove: (id: number) => void;
  onChange: (id: number, field: keyof Passenger, value: string) => void;
}

const PassengerFormItem = ({
  passenger,
  index,
  isRemovable,
  onRemove,
  onChange
}: PassengerFormItemProps) => {
  const isPrimaryPassenger = index === 0;

  return (
    <div className="mb-8 border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <User className="h-5 w-5 text-ocean mr-2" />
          <h3 className="font-medium">
            {isPrimaryPassenger ? "Primary Passenger" : `Passenger ${index + 1}`} ({passenger.type})
          </h3>
        </div>
        {isRemovable && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onRemove(passenger.id)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Remove
          </Button>
        )}
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            value={passenger.name}
            onChange={(e) => onChange(passenger.id, "name", e.target.value)}
            placeholder="Enter full name"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address {isPrimaryPassenger && <span className="text-red-500">*</span>}
          </label>
          <Input
            type="email"
            value={passenger.email}
            onChange={(e) => onChange(passenger.id, "email", e.target.value)}
            placeholder="Enter email address"
            required={isPrimaryPassenger}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number {isPrimaryPassenger && <span className="text-red-500">*</span>}
          </label>
          <div className="flex items-center gap-2">
            <CountryCodeSelector 
              value={passenger.countryCode}
              onChange={(value) => onChange(passenger.id, "countryCode", value)}
            />
            <Input
              type="tel"
              value={passenger.phone}
              onChange={(e) => onChange(passenger.id, "phone", e.target.value)}
              placeholder="Enter phone number"
              required={isPrimaryPassenger}
              className="flex-1"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Passport Number <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            value={passenger.passport}
            onChange={(e) => onChange(passenger.id, "passport", e.target.value)}
            placeholder="Enter passport number"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default PassengerFormItem;
