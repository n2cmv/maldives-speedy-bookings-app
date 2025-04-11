
import React, { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      passengers: passengers.map(() => ({
        name: "",
        email: "",
        phone: "",
        countryCode: "+1",
        passport: "",
      })),
    },
    mode: "onChange",
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "passengers",
  });

  useEffect(() => {
    // Trigger validation on form values change
    form.trigger();
  }, [form.watch(), form.trigger]);

  useEffect(() => {
    // Call onFormValidityChange when form validity changes
    onFormValidityChange?.(form.formState.isValid);
  }, [form.formState.isValid, onFormValidityChange]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit?.(values.passengers);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {fields.map((item, index) => (
          <div key={item.id} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name={`passengers.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Full name" {...field} />
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email address" {...field} />
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
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <div className="flex">
                      <CountryCodeDropdown
                        value={form.watch(`passengers.${index}.countryCode`)}
                        onChange={(value) => {
                          form.setValue(`passengers.${index}.countryCode`, value);
                        }}
                      />
                      <Input
                        placeholder="Phone number"
                        className="ml-2"
                        {...field}
                      />
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
                  <FormLabel>Passport</FormLabel>
                  <FormControl>
                    <Input placeholder="Passport number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}
        <Button type="submit" disabled={!form.formState.isValid}>
          {submitButtonContent || "Submit"}
        </Button>
      </form>
    </Form>
  );
};

export default PassengerForm;
