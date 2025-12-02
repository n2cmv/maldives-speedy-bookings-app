
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { BookingInfo } from '@/types/booking';
import TripSummaryCardHeader from './trip-summary/CardHeader';
import TripSummaryContent from './trip-summary/TripSummaryContent';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TripSummaryCardProps {
  bookingInfo: BookingInfo;
}

const TripSummaryCard = ({ bookingInfo }: TripSummaryCardProps) => {
  const [outboundPrice, setOutboundPrice] = useState<number>(0);
  const [returnPrice, setReturnPrice] = useState<number>(0);
  const [isLoadingPrices, setIsLoadingPrices] = useState<boolean>(true);

  useEffect(() => {
    const fetchRoutePrices = async () => {
      setIsLoadingPrices(true);
      try {
        // Fetch outbound route price
        if (bookingInfo.from && bookingInfo.island) {
          const { data: outboundRoute, error: outboundError } = await supabase
            .from('routes')
            .select('price')
            .eq('from_location', bookingInfo.from)
            .eq('to_location', bookingInfo.island)
            .single();
          
          if (outboundError) {
            console.error("Error fetching outbound route price:", outboundError);
            toast.error("Failed to fetch route pricing");
          } else {
            setOutboundPrice(outboundRoute?.price || 0);
          }
        }
        
        // Fetch return route price if applicable
        if (bookingInfo.returnTrip && bookingInfo.returnTripDetails?.from && bookingInfo.returnTripDetails?.island) {
          const { data: returnRoute, error: returnError } = await supabase
            .from('routes')
            .select('price')
            .eq('from_location', bookingInfo.returnTripDetails.from)
            .eq('to_location', bookingInfo.returnTripDetails.island)
            .single();
          
          if (returnError) {
            console.error("Error fetching return route price:", returnError);
          } else {
            setReturnPrice(returnRoute?.price || 0);
          }
        }
      } catch (error) {
        console.error("Exception fetching route prices:", error);
      } finally {
        setIsLoadingPrices(false);
      }
    };

    fetchRoutePrices();
  }, [bookingInfo.from, bookingInfo.island, bookingInfo.returnTrip, bookingInfo.returnTripDetails]);

  // Calculate total price based on number of passengers and whether it's a return trip
  const totalPassengers = bookingInfo.passengers?.length || 0;
  const isReturnTrip = bookingInfo.returnTrip && bookingInfo.returnTripDetails;
  const outboundTotal = totalPassengers * outboundPrice;
  const returnTotal = isReturnTrip ? totalPassengers * returnPrice : 0;
  const totalPrice = outboundTotal + returnTotal;
  
  // Count by passenger type
  const adultCount = bookingInfo.passengers?.filter(p => p.type === 'adult').length || 0;
  const childCount = bookingInfo.passengers?.filter(p => p.type === 'child').length || 0;
  const seniorCount = bookingInfo.passengers?.filter(p => p.type === 'senior').length || 0;

  return (
    <div className="sticky top-28">
      <Card className="border border-ocean-light/30 rounded-xl overflow-hidden relative shadow-md">
        <TripSummaryCardHeader />
        
        {isLoadingPrices ? (
          <div className="p-6 text-center text-gray-500">Loading prices...</div>
        ) : (
          <TripSummaryContent 
            bookingInfo={bookingInfo}
            totalPrice={totalPrice}
            pricePerPerson={outboundPrice}
            adultCount={adultCount}
            childCount={childCount}
            seniorCount={seniorCount}
          />
        )}
        
        {/* Decorative elements to make it look like a ticket */}
        <div className="absolute -left-2 top-1/3 w-4 h-4 rounded-full bg-white border border-ocean-light/30"></div>
        <div className="absolute -right-2 top-1/3 w-4 h-4 rounded-full bg-white border border-ocean-light/30"></div>
      </Card>
    </div>
  );
};

export default TripSummaryCard;
