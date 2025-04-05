
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
      <Card className="border border-ocean-light/30 rounded-xl overflow-hidden relative shadow-md">
        <CardHeader className="bg-ocean-light/10 border-b border-ocean-light/20">
          <CardTitle className="text-xl font-bold text-ocean-dark">Booking Summary</CardTitle>
          <div className="w-20 h-1 bg-ocean mt-2"></div>
        </CardHeader>
        
        <CardContent className="pt-6 bg-white">
          <div className="relative">
            <div className="mb-8">
              <h3 className="text-lg font-bold text-ocean">
                {bookingInfo.from || 'Departure'} to {bookingInfo.island}
              </h3>
              <p className="text-gray-600">By Speedboat</p>
              <p className="text-sm text-gray-500 mt-2">{bookingInfo.time} • One Way</p>
            </div>
            
            {/* Dashed line decoration */}
            <div className="absolute -right-6 top-1/2 transform -rotate-90 text-ocean-light opacity-30">
              <p className="tracking-[0.5em] text-xs font-light whitespace-nowrap">TEAR HERE</p>
            </div>
            
            <div className="border-t border-dashed border-ocean-light/30 my-4"></div>
            
            <div className="space-y-2 mb-6">
              {adultCount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Adult: {adultCount}</span>
                  <span className="font-medium text-ocean-dark">${PRICE_PER_PERSON * adultCount}</span>
                </div>
              )}
              
              {childCount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Child: {childCount}</span>
                  <span className="font-medium text-ocean-dark">${PRICE_PER_PERSON * childCount}</span>
                </div>
              )}
              
              {seniorCount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Senior: {seniorCount}</span>
                  <span className="font-medium text-ocean-dark">${PRICE_PER_PERSON * seniorCount}</span>
                </div>
              )}
            </div>
            
            <div className="border-t border-ocean-light/20 pt-4">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Total:</span>
                <span className="text-xl font-bold text-ocean-dark">${totalPrice}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Price per person: ${PRICE_PER_PERSON}</p>
            </div>
          </div>
        </CardContent>
        
        {/* Decorative elements to make it look like a ticket */}
        <div className="absolute -left-2 top-1/3 w-4 h-4 rounded-full bg-white border border-ocean-light/30"></div>
        <div className="absolute -right-2 top-1/3 w-4 h-4 rounded-full bg-white border border-ocean-light/30"></div>
      </Card>
    </div>
  );
};

export default TripSummaryCard;
