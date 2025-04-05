
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
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
  const { toast } = useToast();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isRouteFormOpen, setIsRouteFormOpen] = useState<boolean>(false);
  const [currentRoute, setCurrentRoute] = useState<Route | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [routeToDelete, setRouteToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('routes')
        .select('*')
        .order('from_location', { ascending: true }) as unknown as { data: Route[], error: any };

      if (error) {
        throw error;
      }

      // Ensure timings field exists for all routes
      const routesWithTimings = (data || []).map(route => ({
        ...route,
        timings: route.timings || []
      }));

      setRoutes(routesWithTimings);
    } catch (error) {
      console.error("Error fetching routes:", error);
      toast({
        title: "Error",
        description: "Failed to fetch routes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
      toast({
        title: "Success",
        description: "Route has been deleted",
      });
    } catch (error) {
      console.error("Error deleting route:", error);
      toast({
        title: "Error",
        description: "Failed to delete route",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setRouteToDelete(null);
    }
  };

  const handleSaveRoute = async (values: RouteFormValues) => {
    try {
      if (currentRoute) {
        const updatedRoute: RouteData = {
          id: currentRoute.id,
          from_location: values.from_location,
          to_location: values.to_location,
          price: Number(values.price),
          duration: Number(values.duration),
          timings: values.timings,
          created_at: currentRoute.created_at,
          updated_at: currentRoute.updated_at
        };
        
        const { error } = await supabase
          .from('routes')
          .update(updatedRoute)
          .eq('id', currentRoute.id) as any;

        if (error) throw error;

        toast({
          title: "Success",
          description: "Route updated successfully",
        });
      } else {
        const newRoute = {
          from_location: values.from_location,
          to_location: values.to_location,
          price: Number(values.price),
          duration: Number(values.duration),
          timings: values.timings
        };
        
        const { error } = await supabase
          .from('routes')
          .insert(newRoute) as any;

        if (error) throw error;

        toast({
          title: "Success",
          description: "New route created successfully",
        });
      }

      setIsRouteFormOpen(false);
      setCurrentRoute(null);
      fetchRoutes();
    } catch (error: any) {
      console.error("Error saving route:", error);
      toast({
        title: "Error",
        description: `Failed to save route: ${error.message || "Unknown error"}`,
        variant: "destructive",
      });
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
        />
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
