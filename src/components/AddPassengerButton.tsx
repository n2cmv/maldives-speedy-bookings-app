
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AddPassengerButtonProps {
  onAddPassenger: () => void;
  passengerCount: number;
  maxPassengers: number;
}

const AddPassengerButton = ({ 
  onAddPassenger, 
  passengerCount, 
  maxPassengers 
}: AddPassengerButtonProps) => {
  return (
    <div className="mb-6">
      <Button 
        type="button" 
        onClick={onAddPassenger}
        variant="outline"
        className="w-full border-dashed border-gray-300 py-3 flex items-center justify-center text-ocean hover:bg-ocean/5"
        disabled={passengerCount >= maxPassengers}
      >
        <Plus className="h-5 w-5 mr-2" />
        Add Another Passenger
      </Button>
      <p className="text-xs text-gray-500 mt-1 text-center">
        Maximum {maxPassengers} passengers per booking ({passengerCount}/{maxPassengers})
      </p>
    </div>
  );
};

export default AddPassengerButton;
