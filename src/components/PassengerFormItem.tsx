
import { Passenger } from "@/types/booking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, User, Mail, Phone, FileText } from "lucide-react";
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
    <div className="mb-8 border border-ocean/20 rounded-lg p-6 bg-white shadow-sm relative">
      {/* Removing the blue line that was here */}
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="bg-ocean/10 p-2 rounded-full mr-3">
            <User className="h-5 w-5 text-ocean" />
          </div>
          <h3 className="font-medium text-lg text-ocean-dark">
            {isPrimaryPassenger ? "Primary Passenger" : `Passenger ${index + 1}`} 
            <span className="ml-2 text-sm font-normal text-gray-500">({passenger.type})</span>
          </h3>
        </div>
        {isRemovable && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onRemove(passenger.id)}
            className="text-red-500 border-red-200 hover:text-red-700 hover:bg-red-50 hover:border-red-300"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Remove
          </Button>
        )}
      </div>
      
      <div className="space-y-5">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              <User className="h-5 w-5" />
            </div>
            <Input
              type="text"
              value={passenger.name}
              onChange={(e) => onChange(passenger.id, "name", e.target.value)}
              placeholder="Enter full name"
              className="h-[60px] pl-10 border-gray-300 hover:border-ocean focus:border-ocean focus:ring-ocean bg-white text-base"
              required
            />
          </div>
        </div>
        
        {/* Only show email field for primary passenger */}
        {isPrimaryPassenger && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <Mail className="h-5 w-5" />
              </div>
              <Input
                type="email"
                value={passenger.email}
                onChange={(e) => onChange(passenger.id, "email", e.target.value)}
                placeholder="Enter email address"
                className="h-[60px] pl-10 border-gray-300 hover:border-ocean focus:border-ocean focus:ring-ocean bg-white text-base"
                required
              />
            </div>
          </div>
        )}
        
        {/* Only show phone field for primary passenger */}
        {isPrimaryPassenger && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <CountryCodeSelector 
                value={passenger.countryCode}
                onChange={(value) => onChange(passenger.id, "countryCode", value)}
              />
              <div className="relative flex-1">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <Phone className="h-5 w-5" />
                </div>
                <Input
                  type="tel"
                  value={passenger.phone}
                  onChange={(e) => onChange(passenger.id, "phone", e.target.value)}
                  placeholder="Enter phone number"
                  className="h-[60px] pl-10 border-gray-300 hover:border-ocean focus:border-ocean focus:ring-ocean bg-white text-base"
                  required
                />
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Passport Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              <FileText className="h-5 w-5" />
            </div>
            <Input
              type="text"
              value={passenger.passport}
              onChange={(e) => onChange(passenger.id, "passport", e.target.value)}
              placeholder="Enter passport number"
              className="h-[60px] pl-10 border-gray-300 hover:border-ocean focus:border-ocean focus:ring-ocean bg-white text-base"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassengerFormItem;
