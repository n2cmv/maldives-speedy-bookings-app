
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Search, Edit, Trash2, Plus } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface Route {
  id: string;
  from_location: string;
  to_location: string;
  price: number;
  duration: number; // in minutes
  created_at: string;
  updated_at: string;
}

const routeSchema = z.object({
  from_location: z.string().min(1, "From location is required"),
  to_location: z.string().min(1, "To location is required"),
  price: z.coerce.number().positive("Price must be positive"),
  duration: z.coerce.number().positive("Duration must be positive"),
});

const RoutesManager = () => {
  const { toast } = useToast();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isRouteFormOpen, setIsRouteFormOpen] = useState<boolean>(false);
  const [currentRoute, setCurrentRoute] = useState<Route | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [routeToDelete, setRouteToDelete] = useState<string | null>(null);

  const form = useForm<z.infer<typeof routeSchema>>({
    resolver: zodResolver(routeSchema),
    defaultValues: {
      from_location: "",
      to_location: "",
      price: 0,
      duration: 0,
    },
  });

  useEffect(() => {
    fetchRoutes();
  }, []);

  useEffect(() => {
    if (currentRoute) {
      form.reset({
        from_location: currentRoute.from_location,
        to_location: currentRoute.to_location,
        price: currentRoute.price,
        duration: currentRoute.duration,
      });
    } else {
      form.reset({
        from_location: "",
        to_location: "",
        price: 0,
        duration: 0,
      });
    }
  }, [currentRoute, form]);

  const fetchRoutes = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('routes')
        .select('*')
        .order('from_location', { ascending: true });

      if (error) {
        throw error;
      }

      setRoutes(data || []);
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
        .eq('id', routeToDelete);

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

  const onSubmit = async (values: z.infer<typeof routeSchema>) => {
    try {
      if (currentRoute) {
        // Update existing route
        const { error } = await supabase
          .from('routes')
          .update(values)
          .eq('id', currentRoute.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Route updated successfully",
        });
      } else {
        // Create new route
        const { error } = await supabase
          .from('routes')
          .insert(values);

        if (error) throw error;

        toast({
          title: "Success",
          description: "New route created successfully",
        });
      }

      // Close form and refresh routes
      setIsRouteFormOpen(false);
      setCurrentRoute(null);
      fetchRoutes();
    } catch (error) {
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
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search routes..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
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
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoutes.length > 0 ? (
                filteredRoutes.map((route) => (
                  <TableRow key={route.id}>
                    <TableCell>{route.from_location}</TableCell>
                    <TableCell>{route.to_location}</TableCell>
                    <TableCell>${route.price.toFixed(2)}</TableCell>
                    <TableCell>{route.duration} minutes</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(route)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setRouteToDelete(route.id);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No routes found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
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
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="from_location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From Location</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="to_location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To Location</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        min="0"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsRouteFormOpen(false);
                    setCurrentRoute(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </Form>
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
