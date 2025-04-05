
import React from 'react';
import { Card } from '@/components/ui/card';
import { BookingInfo } from '@/types/booking';
import TripSummaryCardHeader from './trip-summary/CardHeader';
import TripSummaryContent from './trip-summary/TripSummaryContent';

interface TripSummaryCardProps {
  bookingInfo: BookingInfo;
}

const PRICE_PER_PERSON = 70; // USD per person per way

const TripSummaryCard = ({ bookingInfo }: TripSummaryCardProps) => {
  // Calculate total price based on number of passengers and whether it's a return trip
  const totalPassengers = bookingInfo.passengers?.length || 0;
  const isReturnTrip = bookingInfo.returnTrip && bookingInfo.returnTripDetails;
  const journeyMultiplier = isReturnTrip ? 2 : 1; // Double the price for return trips
  const totalPrice = totalPassengers * PRICE_PER_PERSON * journeyMultiplier;
  
  // Count by passenger type
  const adultCount = bookingInfo.passengers?.filter(p => p.type === 'adult').length || 0;
  const childCount = bookingInfo.passengers?.filter(p => p.type === 'child').length || 0;
  const seniorCount = bookingInfo.passengers?.filter(p => p.type === 'senior').length || 0;

  return (
    <div className="sticky top-28">
      <Card className="border border-ocean-light/30 rounded-xl overflow-hidden relative shadow-md">
        <TripSummaryCardHeader />
        
        <TripSummaryContent 
          bookingInfo={bookingInfo}
          totalPrice={totalPrice}
          pricePerPerson={PRICE_PER_PERSON}
          adultCount={adultCount}
          childCount={childCount}
          seniorCount={seniorCount}
        />
        
        {/* Decorative elements to make it look like a ticket */}
        <div className="absolute -left-2 top-1/3 w-4 h-4 rounded-full bg-white border border-ocean-light/30"></div>
        <div className="absolute -right-2 top-1/3 w-4 h-4 rounded-full bg-white border border-ocean-light/30"></div>
      </Card>
    </div>
  );
};

export default TripSummaryCard;
