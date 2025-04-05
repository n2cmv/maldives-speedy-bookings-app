
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookingInfo } from '@/types/booking';
import { Scissors } from 'lucide-react';

interface TripSummaryCardProps {
  bookingInfo: BookingInfo;
}

const PRICE_PER_PERSON = 70; // USD per person per way

const TripSummaryCard = ({ bookingInfo }: TripSummaryCardProps) => {
  const isDhigurahDestination = bookingInfo.island === 'A.Dh Dhigurah';
  
  // Calculate total price based on number of passengers
  const totalPassengers = bookingInfo.passengers?.length || 0;
  const totalPrice = totalPassengers * PRICE_PER_PERSON;
  
  // Count by passenger type
  const adultCount = bookingInfo.passengers?.filter(p => p.type === 'adult').length || 0;
  const childCount = bookingInfo.passengers?.filter(p => p.type === 'child').length || 0;
  const seniorCount = bookingInfo.passengers?.filter(p => p.type === 'senior').length || 0;

  return (
    <div className="sticky top-28">
      <Card className="border border-gray-200 rounded-xl overflow-hidden relative">
        <CardHeader className="bg-white border-b border-gray-100">
          <CardTitle className="text-xl font-bold text-gray-800">Booking Summary</CardTitle>
          <div className="w-20 h-1 bg-blue-500 mt-2"></div>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="relative">
            <div className="mb-8">
              <h3 className="text-lg font-bold text-blue-600">
                {bookingInfo.from || 'Departure'} to {bookingInfo.island}
              </h3>
              <p className="text-gray-600">By Speedboat</p>
              <p className="text-sm text-gray-500 mt-2">{bookingInfo.time} • One Way</p>
            </div>
            
            {/* Dashed line decoration */}
            <div className="absolute -right-6 top-1/2 transform -rotate-90 text-gray-200 opacity-30">
              <p className="tracking-[0.5em] text-xs font-light whitespace-nowrap">TEAR HERE</p>
            </div>
            
            <div className="border-t border-dashed border-gray-200 my-4"></div>
            
            <div className="space-y-2 mb-6">
              {adultCount > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Adult: {adultCount}</span>
                  <span className="font-medium">${PRICE_PER_PERSON * adultCount}</span>
                </div>
              )}
              
              {childCount > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Child: {childCount}</span>
                  <span className="font-medium">${PRICE_PER_PERSON * childCount}</span>
                </div>
              )}
              
              {seniorCount > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Senior: {seniorCount}</span>
                  <span className="font-medium">${PRICE_PER_PERSON * seniorCount}</span>
                </div>
              )}
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Total:</span>
                <span className="text-xl font-bold">${totalPrice}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Price per person: ${PRICE_PER_PERSON}</p>
            </div>
          </div>
        </CardContent>
        
        {/* Decorative elements to make it look like a ticket */}
        <div className="absolute -left-2 top-1/3 w-4 h-4 rounded-full bg-gray-100 border border-gray-200"></div>
        <div className="absolute -right-2 top-1/3 w-4 h-4 rounded-full bg-gray-100 border border-gray-200"></div>
      </Card>
    </div>
  );
};

export default TripSummaryCard;
