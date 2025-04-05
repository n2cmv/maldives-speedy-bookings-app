
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ConfirmationFooterProps {
  island: string;
  isReturnTrip: boolean;
}

const ConfirmationFooter = ({ island, isReturnTrip }: ConfirmationFooterProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="border-t border-gray-200 pt-6">
      <p className="text-center text-gray-700 mb-6">
        Thank you for booking with us. Your journey{isReturnTrip ? 's' : ''} to {island}{isReturnTrip ? ' and back' : ''} await{isReturnTrip ? '' : 's'}!
      </p>
      
      <div className="flex justify-center">
        <Button
          onClick={() => navigate("/booking")}
          className="bg-ocean hover:bg-ocean-dark text-white"
        >
          Book Another Trip
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationFooter;
