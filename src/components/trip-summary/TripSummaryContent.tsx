
import React from 'react';
import { CardContent } from '@/components/ui/card';
import JourneyInfo from './JourneyInfo';
import JourneySeparator from './JourneySeparator';
import PriceSummary from './PriceSummary';
import { BookingInfo } from '@/types/booking';
import { format } from 'date-fns';

interface TripSummaryContentProps {
  bookingInfo: BookingInfo;
  totalPrice: number;
  pricePerPerson: number;
  adultCount: number;
  childCount: number;
  seniorCount: number;
}

const TripSummaryContent = ({ 
  bookingInfo, 
  totalPrice, 
  pricePerPerson, 
  adultCount, 
  childCount, 
  seniorCount 
}: TripSummaryContentProps) => {
  const isReturnTrip = bookingInfo.returnTrip && bookingInfo.returnTripDetails;
  const journeyMultiplier = isReturnTrip ? 2 : 1;
  
  // Format dates if available
  const departureDate = bookingInfo.date ? format(new Date(bookingInfo.date), 'MMM d, yyyy') : '';
  const returnDate = bookingInfo.returnTripDetails?.date 
    ? format(new Date(bookingInfo.returnTripDetails.date), 'MMM d, yyyy') 
    : '';
    
  const passengerPrices = [
    { type: 'Adult', count: adultCount, pricePerPerson, journeyMultiplier },
    { type: 'Child', count: childCount, pricePerPerson, journeyMultiplier },
    { type: 'Senior', count: seniorCount, pricePerPerson, journeyMultiplier }
  ];

  return (
    <CardContent className="pt-6 bg-white">
      <div className="relative">
        {/* Outbound Journey */}
        <JourneyInfo 
          from={bookingInfo.from || 'Departure'} 
          to={bookingInfo.island} 
          time={bookingInfo.time} 
          date={departureDate}
          isReturnTrip={!!isReturnTrip}
        />
        
        {/* Return Journey (if applicable) */}
        {isReturnTrip && bookingInfo.returnTripDetails && (
          <>
            <JourneySeparator />
            
            <JourneyInfo 
              from={bookingInfo.returnTripDetails.from} 
              to={bookingInfo.returnTripDetails.island} 
              time={bookingInfo.returnTripDetails.time} 
              date={returnDate}
              isReturn
              isReturnTrip={true}
            />
          </>
        )}
        
        <div className="border-t border-dashed border-ocean-light/30 my-4"></div>
        
        <PriceSummary 
          passengerPrices={passengerPrices} 
          totalPrice={totalPrice}
          pricePerPerson={pricePerPerson}
          isReturnTrip={!!isReturnTrip}
        />
      </div>
    </CardContent>
  );
};

export default TripSummaryContent;
