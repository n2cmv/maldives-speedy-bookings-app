
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookingInfo } from '@/types/booking';
import { Scissors, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

interface TripSummaryCardProps {
  bookingInfo: BookingInfo;
}

const PRICE_PER_PERSON = 70; // USD per person per way

const TripSummaryCard = ({ bookingInfo }: TripSummaryCardProps) => {
  const isDhigurahDestination = bookingInfo.island === 'A.Dh Dhigurah';
  
  // Calculate total price based on number of passengers and whether it's a return trip
  const totalPassengers = bookingInfo.passengers?.length || 0;
  const isReturnTrip = bookingInfo.returnTrip && bookingInfo.returnTripDetails;
  const journeyMultiplier = isReturnTrip ? 2 : 1; // Double the price for return trips
  const totalPrice = totalPassengers * PRICE_PER_PERSON * journeyMultiplier;
  
  // Count by passenger type
  const adultCount = bookingInfo.passengers?.filter(p => p.type === 'adult').length || 0;
  const childCount = bookingInfo.passengers?.filter(p => p.type === 'child').length || 0;
  const seniorCount = bookingInfo.passengers?.filter(p => p.type === 'senior').length || 0;

  // Format dates if available
  const departureDate = bookingInfo.date ? format(new Date(bookingInfo.date), 'MMM d, yyyy') : '';
  const returnDate = bookingInfo.returnTripDetails?.date 
    ? format(new Date(bookingInfo.returnTripDetails.date), 'MMM d, yyyy') 
    : '';

  return (
    <div className="sticky top-28">
      <Card className="border border-ocean-light/30 rounded-xl overflow-hidden relative shadow-md">
        <CardHeader className="bg-ocean-light/10 border-b border-ocean-light/20">
          <CardTitle className="text-xl font-bold text-ocean-dark">Booking Summary</CardTitle>
          <div className="w-20 h-1 bg-ocean mt-2"></div>
        </CardHeader>
        
        <CardContent className="pt-6 bg-white">
          <div className="relative">
            {/* Outbound Journey */}
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <h3 className="text-lg font-bold text-ocean">
                  {bookingInfo.from || 'Departure'} to {bookingInfo.island}
                </h3>
                {isReturnTrip && (
                  <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    Outbound
                  </span>
                )}
              </div>
              <p className="text-gray-600">By Speedboat</p>
              <div className="text-sm text-gray-500 mt-2 space-y-0.5">
                <p>{bookingInfo.time} {departureDate && `• ${departureDate}`}</p>
                {!isReturnTrip && <p>One Way</p>}
              </div>
            </div>
            
            {/* Return Journey (if applicable) */}
            {isReturnTrip && bookingInfo.returnTripDetails && (
              <>
                <div className="flex items-center justify-center my-3">
                  <div className="w-full border-t border-dashed border-ocean-light/30"></div>
                  <ArrowRight className="mx-2 text-ocean-light" />
                  <div className="w-full border-t border-dashed border-ocean-light/30"></div>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    <h3 className="text-lg font-bold text-ocean">
                      {bookingInfo.returnTripDetails.from} to {bookingInfo.returnTripDetails.island}
                    </h3>
                    <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      Return
                    </span>
                  </div>
                  <p className="text-gray-600">By Speedboat</p>
                  <div className="text-sm text-gray-500 mt-2">
                    <p>{bookingInfo.returnTripDetails.time} {returnDate && `• ${returnDate}`}</p>
                  </div>
                </div>
              </>
            )}
            
            {/* Dashed line decoration */}
            <div className="absolute -right-6 top-1/2 transform -rotate-90 text-ocean-light opacity-30">
              <p className="tracking-[0.5em] text-xs font-light whitespace-nowrap">TEAR HERE</p>
            </div>
            
            <div className="border-t border-dashed border-ocean-light/30 my-4"></div>
            
            <div className="space-y-2 mb-6">
              {adultCount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">
                    Adult: {adultCount} {isReturnTrip && '(Round Trip)'}
                  </span>
                  <span className="font-medium text-ocean-dark">
                    ${PRICE_PER_PERSON * adultCount * journeyMultiplier}
                  </span>
                </div>
              )}
              
              {childCount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">
                    Child: {childCount} {isReturnTrip && '(Round Trip)'}
                  </span>
                  <span className="font-medium text-ocean-dark">
                    ${PRICE_PER_PERSON * childCount * journeyMultiplier}
                  </span>
                </div>
              )}
              
              {seniorCount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">
                    Senior: {seniorCount} {isReturnTrip && '(Round Trip)'}
                  </span>
                  <span className="font-medium text-ocean-dark">
                    ${PRICE_PER_PERSON * seniorCount * journeyMultiplier}
                  </span>
                </div>
              )}
              
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
                Price per person: ${PRICE_PER_PERSON} {isReturnTrip && 'each way'}
              </p>
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
