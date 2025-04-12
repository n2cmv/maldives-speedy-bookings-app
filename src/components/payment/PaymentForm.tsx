
import React from "react";
import { Button } from "@/components/ui/button";
import { CreditCard, InfoIcon } from "lucide-react";

interface PaymentFormProps {
  onPayment: () => void;
  isProcessing: boolean;
  bankLogoUrl: string;
  webhookUrl?: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ 
  onPayment, 
  isProcessing,
  bankLogoUrl,
  webhookUrl 
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <p className="text-sm text-blue-800">
          You will be redirected to the Bank of Maldives secure payment gateway to complete your transaction.
        </p>
      </div>
      
      {webhookUrl && (
        <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
          <div className="flex items-start gap-2">
            <InfoIcon className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="text-sm text-amber-800 font-medium">
                Webhook Configuration Required
              </p>
              <p className="text-sm text-amber-700">
                Set up this webhook URL in your BML merchant portal to receive payment notifications:
              </p>
              <div className="bg-white p-2 rounded border border-amber-200 font-mono text-xs break-all">
                {webhookUrl}
              </div>
            </div>
          </div>
        </div>
      )}
      
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
            Proceed to Payment
          </>
        )}
      </Button>
      
      <div className="flex items-center justify-center mt-6">
        <img 
          src={bankLogoUrl} 
          alt="Bank of Maldives Payment Gateway" 
          className="h-8 md:h-10 w-auto"
        />
      </div>
      
      <p className="text-xs text-gray-500 text-center mt-4">
        Your payment information is encrypted and securely processed by Bank of Maldives.
      </p>
    </div>
  );
};

export default PaymentForm;
