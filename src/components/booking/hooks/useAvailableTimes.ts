
import { useState, useEffect } from "react";
import { Time, BookingInfo } from "@/types/booking";

export const useAvailableTimes = (
  booking: BookingInfo,
  availableTimesMap: Record<string, Record<string, Time[]>>,
  allTimes: Time[]
) => {
  // Get timings for selected route
  const getRouteTimings = (from: string, to: string): Time[] => {
    // Check if there are specific timings for this route
    if (availableTimesMap[from] && availableTimesMap[from][to]) {
      const timings = availableTimesMap[from][to];
      console.log(`useAvailableTimes - Found timings for ${from} to ${to}:`, timings);
      
      if (timings && timings.length > 0) {
        return timings;
      }
    }
    
    // Log that we're falling back to default times
    console.log(`useAvailableTimes - No specific timings found for ${from} to ${to}, using default times`);
    return allTimes;
  };

  // Get available times for outbound journey
  const availableTimes = booking.from && booking.island 
    ? getRouteTimings(booking.from, booking.island)
    : allTimes;
  
  // Get available times for return journey if applicable
  const returnAvailableTimes = booking.returnTrip && booking.returnTripDetails?.from && booking.returnTripDetails?.island
    ? getRouteTimings(booking.returnTripDetails.from, booking.returnTripDetails.island)
    : allTimes;

  // Effect to validate that selected time is available in current route
  useEffect(() => {
    if (booking.from && booking.island && booking.time) {
      const routeTimings = getRouteTimings(booking.from, booking.island);
      if (!routeTimings.includes(booking.time as Time)) {
        // Time is no longer available, should be handled by parent
        console.log("Selected time is not available for this route, reset needed");
      }
    }
  }, [booking.from, booking.island, booking.time]);

  return {
    availableTimes,
    returnAvailableTimes
  };
};
