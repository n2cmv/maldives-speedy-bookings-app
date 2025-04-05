
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus } from "lucide-react";
import SearchBar from "@/components/admin/common/SearchBar";
import RouteTable from "@/components/admin/routes/RouteTable";
import RouteForm, { Route, RouteFormValues } from "@/components/admin/routes/RouteForm";
import { RouteData } from "@/types/database";

const RoutesManager = () => {
  const { toast: legacyToast } = useToast();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isRouteFormOpen, setIsRouteFormOpen] = useState<boolean>(false);
  const [currentRoute, setCurrentRoute] = useState<Route | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [routeToDelete, setRouteToDelete] = useState<string | null>(null);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    fetchRoutes();
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
        
        // Update each route one by one to ensure order is saved correctly
        for (const route of routes) {
          console.log(`Updating route ID ${route.id} with display_order ${route.display_order}`);
          const { error } = await supabase
            .from('routes')
            .update({ display_order: route.display_order })
            .eq('id', route.id);
            
          if (error) {
            console.error(`Error updating route ${route.id}:`, error);
            throw error;
          }
        }
        
        // Double-check that the routes were actually saved by fetching them again
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleEdit = (route: Route) => {
    setCurrentRoute(route);
    setIsRouteFormOpen(true);
  };

  const handleDelete = async () => {
    if (!routeToDelete) return;

    try {
      const { error } = await supabase
        .from('routes')
        .delete()
        .eq('id', routeToDelete) as any;

      if (error) {
        throw error;
      }

      setRoutes(routes.filter(route => route.id !== routeToDelete));
      toast.success("Route has been deleted");
    } catch (error) {
      console.error("Error deleting route:", error);
      toast.error("Failed to delete route");
    } finally {
      setIsDeleteDialogOpen(false);
      setRouteToDelete(null);
    }
  };

  const handleSaveRoute = async (values: RouteFormValues) => {
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
          display_order: currentRoute.display_order
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
          display_order: maxDisplayOrder + 1
        };
        
        console.log("Creating new route with data:", newRoute);
        
        const { error } = await supabase
          .from('routes')
          .insert(newRoute) as any;

        if (error) throw error;

        toast.success("New route created successfully");
      }

      setIsRouteFormOpen(false);
      setCurrentRoute(null);
      fetchRoutes();
    } catch (error: any) {
      console.error("Error saving route:", error);
      toast.error(`Failed to save route: ${error.message || "Unknown error"}`);
    }
  };

  const filteredRoutes = routes.filter(route => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      route.from_location.toLowerCase().includes(query) ||
      route.to_location.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <SearchBar 
          placeholder="Search routes..."
          value={searchQuery}
          onChange={setSearchQuery}
        />
        <Button onClick={() => {
          setCurrentRoute(null);
          setIsRouteFormOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" /> Add Route
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <RouteTable 
          routes={filteredRoutes} 
          onEdit={handleEdit} 
          onDelete={(routeId) => {
            setRouteToDelete(routeId);
            setIsDeleteDialogOpen(true);
          }}
          onDragStart={handleDragStart}
          onDragEnter={handleDragEnter}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
        />
      )}

      {isSaving && (
        <div className="fixed inset-0 z-50 bg-black/20 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            <p>Saving route order...</p>
          </div>
        </div>
      )}

      <Dialog open={isRouteFormOpen} onOpenChange={setIsRouteFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentRoute ? "Edit Route" : "Add New Route"}
            </DialogTitle>
            <DialogDescription>
              {currentRoute
                ? "Update route details"
                : "Enter new route information"}
            </DialogDescription>
          </DialogHeader>
          
          <RouteForm 
            route={currentRoute} 
            onSave={handleSaveRoute}
            onCancel={() => {
              setIsRouteFormOpen(false);
              setCurrentRoute(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Route</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this route? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RoutesManager;
