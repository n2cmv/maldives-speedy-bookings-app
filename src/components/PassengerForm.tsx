
import React, { useEffect, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CountryCodeDropdown } from "./CountryCodeDropdown";
import { BookingInfo } from "@/types/booking";

export interface PassengerFormProps {
  passengers?: any[];
  onFormValidityChange?: (isValid: boolean) => void;
  onSubmit?: (passengerDetails: any[]) => void;
  submitButtonContent?: React.ReactNode;
  bookingInfo?: BookingInfo;
  setPassengers?: React.Dispatch<React.SetStateAction<any[]>>;
}

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

// Define schema once to avoid unnecessary re-renders
const formSchema = z.object({
  passengers: z.array(
    z.object({
      name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
      }),
      email: z.string().email({
        message: "Please enter a valid email address.",
      }),
      phone: z.string().regex(phoneRegex, {
        message: "Please enter a valid phone number.",
      }),
      countryCode: z.string().min(1, {
        message: "Please select a country code.",
      }),
      passport: z.string().min(5, {
        message: "Passport must be at least 5 characters.",
      }),
    })
  ),
});

const PassengerForm = ({ 
  passengers = [],
  onFormValidityChange,
  onSubmit,
  submitButtonContent,
  bookingInfo,
  setPassengers: setPassengersState
}: PassengerFormProps) => {
  // Use memoized defaultValues to prevent unnecessary re-renders
  const defaultValues = useMemo(() => ({
    passengers: passengers.map(() => ({
      name: "",
      email: "",
      phone: "",
      countryCode: "+1",
      passport: "",
    }))
  }), [passengers.length]); // Only depend on the length

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "passengers",
  });

  useEffect(() => {
    const subscription = form.watch(() => {
      // Trigger validation only when needed, not on every change
      if (form.formState.isDirty) {
        form.trigger();
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);

  useEffect(() => {
    // Call onFormValidityChange when form validity changes
    onFormValidityChange?.(form.formState.isValid);
  }, [form.formState.isValid, onFormValidityChange]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    // Combine passenger type data with form values
    const enrichedPassengers = values.passengers.map((passenger, index) => ({
      ...passenger,
      type: passengers[index]?.type || 'adult',
      id: passengers[index]?.id || `passenger-${index + 1}`,
    }));
    
    onSubmit?.(enrichedPassengers);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 md:space-y-8">
        {fields.map((item, index) => (
          <div key={item.id} className="p-4 md:p-6 bg-gray-50 rounded-lg border border-gray-100">
            <h3 className="font-medium text-lg mb-4 text-ocean-dark">
              {index === 0 ? "Primary Passenger" : `Passenger ${index + 1}`}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name={`passengers.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Full Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Full name" 
                        className="h-12" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`passengers.${index}.email`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Email address" 
                        className="h-12" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`passengers.${index}.phone`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Phone Number</FormLabel>
                    <FormControl>
                      <div className="flex space-x-2">
                        <div className="w-1/3 sm:w-1/4">
                          <CountryCodeDropdown
                            value={form.watch(`passengers.${index}.countryCode`)}
                            onChange={(value) => {
                              form.setValue(`passengers.${index}.countryCode`, value);
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <Input
                            placeholder="Phone number"
                            className="h-12"
                            {...field}
                          />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`passengers.${index}.passport`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Passport/ID</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Passport or ID number" 
                        className="h-12" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        ))}
        <Button 
          type="submit" 
          disabled={!form.formState.isValid}
          className="w-full md:w-auto h-12 px-6 text-base font-medium bg-ocean hover:bg-ocean-dark"
        >
          {submitButtonContent || "Submit"}
        </Button>
      </form>
    </Form>
  );
};

export default PassengerForm;
