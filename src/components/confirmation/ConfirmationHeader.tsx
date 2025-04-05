
import { Check } from "lucide-react";

const ConfirmationHeader = () => {
  return (
    <>
      <div className="flex items-center justify-center mb-6">
        <div className="bg-green-100 rounded-full p-3">
          <Check className="h-8 w-8 text-green-600" />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-ocean-dark text-center mb-6">
        Booking Confirmed!
      </h2>
    </>
  );
};

export default ConfirmationHeader;
