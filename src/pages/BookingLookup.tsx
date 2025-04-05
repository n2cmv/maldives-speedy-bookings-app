
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import Header from "@/components/Header";
import HeaderExtras from "@/components/HeaderExtras";
import { useTranslation } from "react-i18next";
import { getBookingByReference } from "@/services/bookingService";
import { BookingInfo } from "@/types/booking";
import TripSummaryCard from "@/components/TripSummaryCard";

// Form validation schema
const formSchema = z.object({
  reference: z.string().min(1, "Reference number is required")
});

type FormValues = z.infer<typeof formSchema>;

const BookingLookup = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [booking, setBooking] = useState<BookingInfo | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reference: ""
    }
  });
  
  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const { data, error } = await getBookingByReference(values.reference);
      if (error || !data) {
        toast.error(t("lookup.error", "Error finding booking"), {
          description: t("lookup.notFound", "No booking found with that reference")
        });
        setBooking(null);
      } else {
        // Format the data to match BookingInfo structure
        const bookingData: BookingInfo = {
          from: data.from_location as any,
          island: data.to_location as any,
          time: data.departure_time as any,
          date: data.departure_date ? new Date(data.departure_date) : undefined,
          seats: data.passenger_count,
          passengers: data.passenger_info as any,
          returnTrip: data.return_trip,
          paymentComplete: data.payment_complete,
          paymentReference: data.payment_reference,
          id: data.id,
        };
        
        if (data.return_trip) {
          bookingData.returnTripDetails = {
            from: data.return_from_location as any,
            island: data.return_to_location as any,
            time: data.return_time as any,
            date: data.return_date ? new Date(data.return_date) : undefined,
          };
        }
        
        setBooking(bookingData);
        toast.success(t("lookup.success", "Booking found!"));
      }
    } catch (error) {
      console.error("Error looking up booking:", error);
      toast.error(t("lookup.error", "Error looking up booking"));
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      <div className="absolute top-4 right-4 z-20">
        <HeaderExtras />
      </div>
      
      <Header />
      
      <main className="container mx-auto pt-28 pb-12 px-4">
        <div className="max-w-lg mx-auto">
          <Card className="shadow-md border-ocean-light/30">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-ocean-dark">
                {t("lookup.title", "Find Your Booking")}
              </CardTitle>
              <CardDescription>
                {t("lookup.description", "Enter your booking reference number to view your trip details")}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="reference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("lookup.referenceNumber", "Reference Number")}</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. ABC123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        {t("common.searching", "Searching...")}
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Search className="w-4 h-4 mr-2" />
                        {t("common.search", "Search")}
                      </div>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          {booking && (
            <div className="mt-8 animate-fadeIn">
              <h2 className="text-xl font-semibold mb-4 text-ocean-dark">
                {t("lookup.bookingDetails", "Booking Details")}
              </h2>
              <TripSummaryCard bookingInfo={booking} />
              
              <div className="mt-6 flex justify-center">
                <Button onClick={() => navigate("/booking")} variant="outline">
                  {t("common.bookNewTrip", "Book a New Trip")}
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BookingLookup;
