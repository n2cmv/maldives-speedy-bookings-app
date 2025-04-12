
import React from "react";

interface PaymentProcessingScreenProps {
  bankLogo: string;
}

const PaymentProcessingScreen: React.FC<PaymentProcessingScreenProps> = ({ bankLogo }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <img 
            src={bankLogo} 
            alt="Bank of Maldives Payment Gateway" 
            className="h-16 mb-4"
          />
          <div className="w-16 h-16 border-4 border-ocean border-t-transparent rounded-full animate-spin"></div>
          <h2 className="text-2xl font-bold text-gray-800">Processing Payment</h2>
          <p className="text-gray-600">
            Please wait while your payment is being processed at Bank of Maldives...
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentProcessingScreen;
