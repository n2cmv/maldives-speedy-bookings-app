
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Route } from "../RouteForm";
import { RouteData } from "@/types/database";

export const useRouteManager = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    fetchRoutes();

    // Set up real-time subscription for changes made by other users
    const channel = supabase
      .channel('admin-routes-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'routes' },
        (payload) => {
          console.log('Route update detected from another session:', payload);
          // Only refresh if we're not currently saving to avoid flickering
          if (!isSaving) {
            fetchRoutes();
            toast.info('Routes updated by another user', {
              description: 'Route information has been refreshed'
            });
          }
        }
      )
      .subscribe();
    
    // Clean up subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchRoutes = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('routes')
        .select('*')
        .order('display_order', { ascending: true }) as unknown as { data: Route[], error: any };

      if (error) {
        throw error;
      }

      // Ensure timings field exists for all routes
      const routesWithTimings = (data || []).map((route, index) => ({
        ...route,
        timings: route.timings || [],
        display_order: route.display_order || index + 1
      }));
      
      console.log("Fetched routes:", routesWithTimings);
      setRoutes(routesWithTimings);
    } catch (error) {
      console.error("Error fetching routes:", error);
      toast.error("Failed to fetch routes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === index) return;
    
    const newRoutes = [...routes];
    const draggedItem = newRoutes[draggedItemIndex];
    
    // Remove the dragged item
    newRoutes.splice(draggedItemIndex, 1);
    // Insert it at the new position
    newRoutes.splice(index, 0, draggedItem);
    
    // Update the display order for each route
    const reorderedRoutes = newRoutes.map((route, idx) => ({
      ...route,
      display_order: idx + 1
    }));
    
    setRoutes(reorderedRoutes);
    setDraggedItemIndex(index);
  };

  const handleDragEnd = async () => {
    // Save the new order to the database
    if (draggedItemIndex !== null) {
      setIsSaving(true);
      try {
        console.log("Saving route order:", routes.map(r => ({ id: r.id, order: r.display_order })));
        
        // Use Promise.all to update all routes concurrently for better performance
        const updatePromises = routes.map(route => {
          console.log(`Updating route ID ${route.id} with display_order ${route.display_order}`);
          return supabase
            .from('routes')
            .update({ display_order: route.display_order })
            .eq('id', route.id);
        });
        
        const results = await Promise.all(updatePromises);
        
        // Check if any updates failed
        const errors = results.filter(result => result.error).map(result => result.error);
        if (errors.length > 0) {
          console.error("Errors updating route orders:", errors);
          throw new Error(`Failed to update ${errors.length} routes`);
        }
        
        // Verify changes were saved by fetching them again
        const { data, error } = await supabase
          .from('routes')
          .select('id, display_order')
          .order('display_order');
          
        if (error) {
          console.error("Error verifying routes:", error);
        } else {
          console.log("Routes after saving:", data);
        }
        
        toast.success("Route order updated successfully");
      } catch (error) {
        console.error("Error updating route order:", error);
        toast.error("Failed to update route order");
        // Fetch routes again to restore from server state
        fetchRoutes();
      } finally {
        setIsSaving(false);
        setDraggedItemIndex(null);
      }
    }
  };

  const handleDeleteRoute = async (routeId: string) => {
    try {
      const { error } = await supabase
        .from('routes')
        .delete()
        .eq('id', routeId) as any;

      if (error) {
        throw error;
      }

      setRoutes(routes.filter(route => route.id !== routeId));
      toast.success("Route has been deleted");
      return true;
    } catch (error) {
      console.error("Error deleting route:", error);
      toast.error("Failed to delete route");
      return false;
    }
  };

  const handleSaveRoute = async (values: any, currentRoute: Route | null) => {
    try {
      console.log("Saving route with values:", values);
      
      if (currentRoute) {
        // Make sure we have the correct type
        const updatedRoute: RouteData = {
          id: currentRoute.id,
          from_location: values.from_location,
          to_location: values.to_location,
          price: Number(values.price),
          duration: Number(values.duration),
          timings: values.timings || [],
          created_at: currentRoute.created_at,
          updated_at: currentRoute.updated_at,
          display_order: currentRoute.display_order,
          speedboat_name: values.speedboat_name,
          speedboat_image_url: values.speedboat_image_url,
          pickup_location: values.pickup_location,
          pickup_map_url: values.pickup_map_url
        };
        
        console.log("Updating route with data:", updatedRoute);
        
        const { error } = await supabase
          .from('routes')
          .update(updatedRoute)
          .eq('id', currentRoute.id) as any;

        if (error) throw error;

        toast.success("Route updated successfully");
      } else {
        // Get highest display order
        const maxDisplayOrder = Math.max(0, ...routes.map(r => r.display_order || 0));
        
        const newRoute = {
          from_location: values.from_location,
          to_location: values.to_location,
          price: Number(values.price),
          duration: Number(values.duration),
          timings: values.timings || [],
          display_order: maxDisplayOrder + 1,
          speedboat_name: values.speedboat_name,
          speedboat_image_url: values.speedboat_image_url,
          pickup_location: values.pickup_location,
          pickup_map_url: values.pickup_map_url
        };
        
        console.log("Creating new route with data:", newRoute);
        
        const { error } = await supabase
          .from('routes')
          .insert(newRoute) as any;

        if (error) throw error;

        toast.success("New route created successfully");
      }

      await fetchRoutes();
      return true;
    } catch (error: any) {
      console.error("Error saving route:", error);
      toast.error(`Failed to save route: ${error.message || "Unknown error"}`);
      return false;
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return {
    routes,
    isLoading,
    isSaving,
    fetchRoutes,
    handleDragStart,
    handleDragEnter,
    handleDragEnd,
    handleDragOver,
    handleDeleteRoute,
    handleSaveRoute
  };
};
