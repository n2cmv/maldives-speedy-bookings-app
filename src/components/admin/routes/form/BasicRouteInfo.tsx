
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

interface BasicRouteInfoProps {
  form: UseFormReturn<RouteFormValues>;
}

const BasicRouteInfo = ({ form }: BasicRouteInfoProps) => {
  return (
    <>
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
    </>
  );
};

export default BasicRouteInfo;
