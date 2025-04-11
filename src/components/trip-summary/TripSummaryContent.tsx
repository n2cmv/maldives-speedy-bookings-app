
import React from 'react';
import { BookingInfo } from '@/types/booking';
import JourneyInfo from './JourneyInfo';
import JourneySeparator from './JourneySeparator';
import PriceSummary from './PriceSummary';
import { format } from 'date-fns';
import { CardContent } from '../ui/card';

interface TripSummaryContentProps {
  bookingInfo: BookingInfo;
  totalPrice: number;
  pricePerPerson: number;
  adultCount: number;
  childCount: number;
  seniorCount: number;
  isActivityBooking?: boolean;
}

const TripSummaryContent = ({
  bookingInfo,
  totalPrice,
  pricePerPerson,
  adultCount,
  childCount,
  seniorCount,
  isActivityBooking = false
}: TripSummaryContentProps) => {
  const isReturnTrip = bookingInfo.returnTrip && bookingInfo.returnTripDetails;
  
  // Format date for display if it exists
  const formatDate = (date?: Date | string) => {
    if (!date) return '';
    return typeof date === 'string' ? date : format(new Date(date), 'MMM d, yyyy');
  };
  
  const passengerPrices = [
    { type: 'Adults', count: adultCount, pricePerPerson, journeyMultiplier: isReturnTrip ? 2 : 1 },
    { type: 'Children', count: childCount, pricePerPerson, journeyMultiplier: isReturnTrip ? 2 : 1 },
    { type: 'Seniors', count: seniorCount, pricePerPerson, journeyMultiplier: isReturnTrip ? 2 : 1 }
  ];

  return (
    <CardContent className="p-6">
      {isActivityBooking ? (
        // Activity Booking Summary
        <>
          <div className="mb-6">
            <h3 className="text-lg font-bold text-ocean mb-2">{bookingInfo.activity}</h3>
            <p className="text-sm text-gray-500">
              {bookingInfo.date && formatDate(bookingInfo.date)} • {bookingInfo.time}
            </p>
          </div>
        </>
      ) : (
        // Regular Trip Summary (Speedboat)
        <>
          <JourneyInfo
            from={bookingInfo.from}
            to={bookingInfo.island}
            time={bookingInfo.time}
            date={bookingInfo.date ? formatDate(bookingInfo.date) : ''}
            isReturnTrip={isReturnTrip}
          />
          
          {isReturnTrip && bookingInfo.returnTripDetails && (
            <>
              <JourneySeparator />
              <JourneyInfo
                from={bookingInfo.returnTripDetails.from || bookingInfo.island}
                to={bookingInfo.returnTripDetails.island || bookingInfo.from}
                time={bookingInfo.returnTripDetails.time}
                date={bookingInfo.returnTripDetails.date ? formatDate(bookingInfo.returnTripDetails.date) : ''}
                isReturn={true}
                isReturnTrip={true}
              />
            </>
          )}
        </>
      )}
      
      <div className="border-t border-dashed border-ocean-light/20 my-4 pt-4">
        <PriceSummary
          passengerPrices={passengerPrices}
          totalPrice={totalPrice}
          pricePerPerson={pricePerPerson}
          isReturnTrip={!isActivityBooking && isReturnTrip}
        />
      </div>
    </CardContent>
  );
};

export default TripSummaryContent;
