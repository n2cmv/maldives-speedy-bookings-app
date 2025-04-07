
import React from "react";

interface PaymentSummaryProps {
  bookingReference: string;
  totalAmount: number;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({ bookingReference, totalAmount }) => {
  return (
    <div className="border-b border-gray-200 pb-4">
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-700">Booking Reference:</span>
        <span className="font-medium">{bookingReference}</span>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-gray-700">Total Amount:</span>
        <span className="text-lg font-bold text-ocean-dark">${totalAmount.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default PaymentSummary;
