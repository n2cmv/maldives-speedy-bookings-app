
import React from 'react';
import { Card } from '@/components/ui/card';
import { BookingInfo } from '@/types/booking';
import TripSummaryCardHeader from './trip-summary/CardHeader';
import TripSummaryContent from './trip-summary/TripSummaryContent';

interface TripSummaryCardProps {
  bookingInfo?: BookingInfo;
  isActivityBooking?: boolean;
  heading?: string;
  booking?: any;
}

const PRICE_PER_PERSON = 70; // USD per person per way
const ACTIVITY_PRICE_PER_PERSON = 90; // USD per person for activities

const TripSummaryCard = ({ bookingInfo, isActivityBooking, heading, booking }: TripSummaryCardProps) => {
  const activeBudBooking = booking || bookingInfo;
  
  if (!activeBudBooking) {
    // Show a placeholder card when no booking info is available
    return (
      <div className="sticky top-28">
        <Card className="border border-ocean-light/30 rounded-xl overflow-hidden relative shadow-md">
          <TripSummaryCardHeader title={heading || (isActivityBooking ? "Activity Summary" : "Trip Summary")} />
          <div className="p-6">
            <p className="text-gray-500 text-sm">Please complete your booking details to see the summary.</p>
          </div>
        </Card>
      </div>
    );
  }
  
  // Calculate total price based on number of passengers and whether it's a return trip
  const totalPassengers = activeBudBooking.passengers?.length || 
    (activeBudBooking.passengerCounts ? 
      (activeBudBooking.passengerCounts.adults || 0) + 
      (activeBudBooking.passengerCounts.children || 0) + 
      (activeBudBooking.passengerCounts.seniors || 0) : 0);
  
  const isReturnTrip = activeBudBooking.returnTrip && activeBudBooking.returnTripDetails;
  const journeyMultiplier = isReturnTrip ? 2 : 1; // Double the price for return trips
  const pricePerPerson = isActivityBooking ? ACTIVITY_PRICE_PER_PERSON : PRICE_PER_PERSON;
  const totalPrice = totalPassengers * pricePerPerson * (isActivityBooking ? 1 : journeyMultiplier);
  
  // Count by passenger type
  const adultCount = activeBudBooking.passengers?.filter((p: any) => p.type === 'adult').length || 
    (activeBudBooking.passengerCounts?.adults || 0);
  const childCount = activeBudBooking.passengers?.filter((p: any) => p.type === 'child').length || 
    (activeBudBooking.passengerCounts?.children || 0);
  const seniorCount = activeBudBooking.passengers?.filter((p: any) => p.type === 'senior').length || 
    (activeBudBooking.passengerCounts?.seniors || 0);

  return (
    <div className="sticky top-28">
      <Card className="border border-ocean-light/30 rounded-xl overflow-hidden relative shadow-md">
        <TripSummaryCardHeader title={heading || (isActivityBooking ? "Activity Summary" : "Trip Summary")} />
        
        <TripSummaryContent 
          bookingInfo={activeBudBooking}
          totalPrice={totalPrice}
          pricePerPerson={pricePerPerson}
          adultCount={adultCount}
          childCount={childCount}
          seniorCount={seniorCount}
          isActivityBooking={isActivityBooking}
        />
        
        {/* Decorative elements to make it look like a ticket */}
        <div className="absolute -left-2 top-1/3 w-4 h-4 rounded-full bg-white border border-ocean-light/30"></div>
        <div className="absolute -right-2 top-1/3 w-4 h-4 rounded-full bg-white border border-ocean-light/30"></div>
      </Card>
    </div>
  );
};

export default TripSummaryCard;
