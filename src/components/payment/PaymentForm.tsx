
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
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <p className="text-sm text-blue-800">
          This is a simulated payment system. In a real application, you would be redirected to a secure payment gateway.
        </p>
      </div>
      
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
            Complete Payment
          </>
        )}
      </Button>
      
      <div className="flex items-center justify-center mt-6">
        <img 
          src={bankLogoUrl} 
          alt="Payment Provider" 
          className="h-8 md:h-10 w-auto"
        />
      </div>
      
      <p className="text-xs text-gray-500 text-center mt-4">
        This is a demo payment system. No actual payments will be processed.
      </p>
    </div>
  );
};

export default PaymentForm;
