
import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { RouteFormValues } from "../RouteForm";

interface SpeedboatInfoProps {
  form: UseFormReturn<RouteFormValues>;
}

const SpeedboatInfo = ({ form }: SpeedboatInfoProps) => {
  return (
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
            </Control>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default SpeedboatInfo;
