
import React from 'react';
import { CardContent } from '@/components/ui/card';
import JourneyInfo from './JourneyInfo';
import JourneySeparator from './JourneySeparator';
import PriceSummary from './PriceSummary';
import { BookingInfo } from '@/types/booking';
import { format } from 'date-fns';
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from 'react';

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
  const [routePrice, setRoutePrice] = useState<number | null>(null);
  
  // Format dates if available
  const departureDate = bookingInfo.date ? format(new Date(bookingInfo.date), 'MMM d, yyyy') : '';
  const returnDate = bookingInfo.returnTripDetails?.date 
    ? format(new Date(bookingInfo.returnTripDetails.date), 'MMM d, yyyy') 
    : '';
  
  // Fetch actual route price from database
  useEffect(() => {
    const fetchRoutePrice = async () => {
      if (bookingInfo.from && bookingInfo.island) {
        try {
          const { data, error } = await supabase
            .from('routes')
            .select('price')
            .eq('from_location', bookingInfo.from)
            .eq('to_location', bookingInfo.island)
            .maybeSingle();
            
          if (data && data.price) {
            console.log(`Fetched route price for ${bookingInfo.from} to ${bookingInfo.island}: $${data.price}`);
            setRoutePrice(data.price);
          }
        } catch (error) {
          console.error('Error fetching route price:', error);
        }
      }
    };
    
    fetchRoutePrice();
  }, [bookingInfo.from, bookingInfo.island]);
    
  const actualPricePerPerson = routePrice || pricePerPerson;
  const actualTotalPrice = routePrice ? routePrice * bookingInfo.seats * journeyMultiplier : totalPrice;
  
  const passengerPrices = [
    { type: 'Adult', count: adultCount, pricePerPerson: actualPricePerPerson, journeyMultiplier },
    { type: 'Child', count: childCount, pricePerPerson: actualPricePerPerson, journeyMultiplier },
    { type: 'Senior', count: seniorCount, pricePerPerson: actualPricePerPerson, journeyMultiplier }
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
          totalPrice={actualTotalPrice}
          pricePerPerson={actualPricePerPerson}
          isReturnTrip={!!isReturnTrip}
        />
      </div>
    </CardContent>
  );
};

export default TripSummaryContent;
