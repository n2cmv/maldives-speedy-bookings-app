
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Time } from "@/types/booking";

export const useRouteTimesMap = () => {
  const { t } = useTranslation();
  const [fromLocations, setFromLocations] = useState<string[]>([]);
  const [toLocations, setToLocations] = useState<string[]>([]);
  const [availableTimesMap, setAvailableTimesMap] = useState<Record<string, Record<string, Time[]>>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchRoutes = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('routes')
        .select('from_location, to_location, display_order, timings');
        
      if (error) {
        console.error('Error fetching routes:', error);
        toast.error(t("booking.form.errorFetchingRoutes", "Failed to fetch available routes"));
        return;
      }
      
      console.log("useRouteTimesMap - Routes data received:", data);
      
      if (data && data.length > 0) {
        const uniqueFromLocations = Array.from(new Set(data.map(route => route.from_location)));
        const uniqueToLocations = Array.from(new Set(data.map(route => route.to_location)));
        
        console.log("useRouteTimesMap - Unique from locations:", uniqueFromLocations);
        console.log("useRouteTimesMap - Unique to locations:", uniqueToLocations);
        
        // Build a map of available times for each route
        const timesMap: Record<string, Record<string, Time[]>> = {};
        
        data.forEach(route => {
          if (!timesMap[route.from_location]) {
            timesMap[route.from_location] = {};
          }
          
          // Convert string[] to Time[] with type checking
          const validTimings: Time[] = (route.timings || []).filter((time): time is Time => {
            // Verify each timing string is a valid Time enum value
            return Object.values<string>(Time).includes(time);
          });
          
          // Enhanced debugging for route timings
          console.log(`useRouteTimesMap - Route timings for ${route.from_location} to ${route.to_location}:`, 
            route.timings, "Valid timings:", validTimings);
          
          timesMap[route.from_location][route.to_location] = validTimings.length > 0 ? validTimings : [];
        });
        
        console.log("useRouteTimesMap - Complete available times map:", timesMap);
        setAvailableTimesMap(timesMap);
        setFromLocations(uniqueFromLocations);
        setToLocations(uniqueToLocations);
      } else {
        console.log("useRouteTimesMap - No routes data received or empty array");
        setFromLocations([]);
        setToLocations([]);
        setAvailableTimesMap({});
      }
    } catch (error) {
      console.error("Exception fetching routes:", error);
      toast.error(t("booking.form.exceptionFetchingRoutes", "An error occurred while fetching routes"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
    
    // Set up real-time subscription to listen for route changes
    const channel = supabase
      .channel('booking-routes-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'routes' },
        (payload) => {
          console.log('Route update detected:', payload);
          // Refresh routes data when changes are detected
          fetchRoutes();
          toast.info(t("booking.routesUpdated", "Routes Updated"), {
            description: t("booking.routesRefreshed", "Available routes have been refreshed")
          });
        }
      )
      .subscribe();
    
    // Clean up subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [t]);

  return {
    fromLocations,
    toLocations,
    availableTimesMap,
    isLoading,
  };
};
