
import React from 'react';

interface PassengerPrice {
  type: string;
  count: number;
  pricePerPerson: number;
  journeyMultiplier: number;
}

interface PriceSummaryProps {
  passengerPrices: PassengerPrice[];
  totalPrice: number;
  pricePerPerson: number;
  isReturnTrip: boolean;
}

const PriceSummary = ({ 
  passengerPrices, 
  totalPrice, 
  pricePerPerson, 
  isReturnTrip 
}: PriceSummaryProps) => {
  return (
    <>
      <div className="space-y-2 mb-6">
        {passengerPrices.map((item, index) => (
          item.count > 0 && (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-700">
                {item.type}: {item.count} {isReturnTrip && '(Round Trip)'}
              </span>
              <span className="font-medium text-ocean-dark">
                ${pricePerPerson * item.count * item.journeyMultiplier}
              </span>
            </div>
          )
        ))}
        
        {isReturnTrip && (
          <p className="text-xs text-gray-500 italic">
            * Return trip prices included
          </p>
        )}
      </div>
      
      <div className="border-t border-ocean-light/20 pt-4">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-700">Total:</span>
          <span className="text-xl font-bold text-ocean-dark">${totalPrice}</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Price per person: ${pricePerPerson} {isReturnTrip && 'each way'}
        </p>
      </div>
    </>
  );
};

export default PriceSummary;
