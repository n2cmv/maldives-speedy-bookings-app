
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
}

const routeSchema = z.object({
  from_location: z.string().min(1, "From location is required"),
  to_location: z.string().min(1, "To location is required"),
  price: z.coerce.number().positive("Price must be positive"),
  duration: z.coerce.number().positive("Duration must be positive"),
  timings: z.array(z.string()).default([]),
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
      });
    } else {
      form.reset({
        from_location: "",
        to_location: "",
        price: 0,
        duration: 0,
        timings: [],
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
