
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { DialogFooter } from "@/components/ui/dialog";
import RouteTimings from "./RouteTimings";

export interface Route {
  id: string;
  from_location: string;
  to_location: string;
  price: number;
  duration: number;
  timings: string[];
  created_at: string;
  updated_at: string;
  display_order?: number;
  speedboat_name?: string | null;
  speedboat_image_url?: string | null;
  pickup_location?: string | null;
  pickup_map_url?: string | null;
}

const routeSchema = z.object({
  from_location: z.string().min(1, "From location is required"),
  to_location: z.string().min(1, "To location is required"),
  price: z.coerce.number().positive("Price must be positive"),
  duration: z.coerce.number().positive("Duration must be positive"),
  timings: z.array(z.string()).default([]),
  speedboat_name: z.string().nullable().optional(),
  speedboat_image_url: z.string().nullable().optional(),
  pickup_location: z.string().nullable().optional(),
  pickup_map_url: z.string().nullable().optional()
});

export type RouteFormValues = z.infer<typeof routeSchema>;

interface RouteFormProps {
  route: Route | null;
  onSave: (values: RouteFormValues) => Promise<void>;
  onCancel: () => void;
}

const RouteForm = ({ route, onSave, onCancel }: RouteFormProps) => {
  const form = useForm<RouteFormValues>({
    resolver: zodResolver(routeSchema),
    defaultValues: {
      from_location: "",
      to_location: "",
      price: 0,
      duration: 0,
      timings: [],
      speedboat_name: null,
      speedboat_image_url: null,
      pickup_location: null,
      pickup_map_url: null
    },
  });

  useEffect(() => {
    if (route) {
      form.reset({
        from_location: route.from_location,
        to_location: route.to_location,
        price: route.price,
        duration: route.duration,
        timings: route.timings || [],
        speedboat_name: route.speedboat_name || null,
        speedboat_image_url: route.speedboat_image_url || null,
        pickup_location: route.pickup_location || null,
        pickup_map_url: route.pickup_map_url || null
      });
    } else {
      form.reset({
        from_location: "",
        to_location: "",
        price: 0,
        duration: 0,
        timings: [],
        speedboat_name: null,
        speedboat_image_url: null,
        pickup_location: null,
        pickup_map_url: null
      });
    }
  }, [route, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
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
        
        <FormField
          control={form.control}
          name="timings"
          render={({ field }) => (
            <FormItem>
              <RouteTimings 
                timings={field.value} 
                onChange={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Speedboat Information Fields */}
        <div className="border-t pt-4 mt-4">
          <h3 className="font-medium mb-4">Speedboat Information</h3>
          
          <FormField
            control={form.control}
            name="speedboat_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Speedboat Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g., Ocean Explorer" 
                    {...field} 
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value || null)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="speedboat_image_url"
            render={({ field }) => (
              <FormItem className="mt-3">
                <FormLabel>Speedboat Image URL</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="https://example.com/image.jpg" 
                    {...field} 
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value || null)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="pickup_location"
            render={({ field }) => (
              <FormItem className="mt-3">
                <FormLabel>Pickup Location Description</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g., Main Pier, North Dock" 
                    {...field} 
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value || null)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="pickup_map_url"
            render={({ field }) => (
              <FormItem className="mt-3">
                <FormLabel>Pickup Location Map URL</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="https://maps.google.com/..." 
                    {...field} 
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value || null)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default RouteForm;
