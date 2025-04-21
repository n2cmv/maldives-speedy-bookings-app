
import React from "react";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";

interface PaymentFormProps {
  onPayment: () => void;
  isProcessing: boolean;
  bankLogoUrl: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ 
  onPayment, 
  isProcessing,
  bankLogoUrl 
}) => {
  return (
    <div className="space-y-6">      
      <Button
        onClick={onPayment}
        disabled={isProcessing}
        className="w-full bg-ocean hover:bg-ocean-dark text-white h-[60px] text-base font-medium"
      >
        {isProcessing ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-5 w-5" />
            Pay Now
          </>
        )}
      </Button>
      
      <div className="flex items-center justify-center mt-6">
        <img 
          src={bankLogoUrl} 
          alt="Bank of Maldives" 
          className="h-8 md:h-10 w-auto"
        />
      </div>
    </div>
  );
};

export default PaymentForm;
