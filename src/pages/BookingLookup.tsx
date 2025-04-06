
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, Loader2, Shield, Eye } from "lucide-react";
import Header from "@/components/Header";
import { useTranslation } from "react-i18next";
import { getBookingByReference } from "@/services/bookingService";
import { BookingInfo } from "@/types/booking";
import TripSummaryCard from "@/components/TripSummaryCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Form validation schema
const formSchema = z.object({
  reference: z.string().min(1, "Reference number is required")
});

type FormValues = z.infer<typeof formSchema>;

const BookingLookup = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [booking, setBooking] = useState<BookingInfo | null>(null);
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reference: ""
    }
  });
  
  // Function to fetch booking by reference
  const fetchBookingByReference = async (reference: string) => {
    if (!reference) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await getBookingByReference(reference);
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
        // Reset sensitive data visibility on each new booking lookup
        setShowSensitiveData(false);
        toast.success(t("lookup.success", "Booking found!"));
      }
    } catch (error) {
      console.error("Error looking up booking:", error);
      toast.error(t("lookup.error", "Error looking up booking"));
    } finally {
      setIsLoading(false);
    }
  };
  
  // Check for reference in URL on component mount
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const reference = queryParams.get('ref');
    
    if (reference) {
      // Update the form value to match the reference
      form.setValue('reference', reference);
      
      // Fetch booking information automatically
      fetchBookingByReference(reference);
    }
  }, [location.search]);
  
  const onSubmit = async (values: FormValues) => {
    await fetchBookingByReference(values.reference);
  };

  // Function to render masked passenger data (only first name and last initial)
  const renderMaskedPassengers = () => {
    if (!booking?.passengers?.length) return null;
    
    return (
      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-gray-800">Passenger Information</h3>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => setShowSensitiveData(!showSensitiveData)}
          >
            <Eye className="w-4 h-4" />
            {showSensitiveData ? "Hide Details" : "Show Details"}
          </Button>
        </div>
        
        {booking.passengers.map((passenger, index) => {
          // Get first name and last initial for masked display
          const nameParts = passenger.name.split(' ');
          const firstName = nameParts[0];
          const lastInitial = nameParts.length > 1 ? nameParts[nameParts.length - 1][0] + '.' : '';
          const maskedName = `${firstName} ${lastInitial}`;
          
          // Mask email and phone
          const emailParts = passenger.email.split('@');
          const maskedEmail = emailParts[0].substring(0, 2) + '***@' + emailParts[1];
          const maskedPhone = passenger.phone ? passenger.phone.substring(0, 3) + '•••••' + passenger.phone.substring(passenger.phone.length - 3) : '';
          
          return (
            <div key={index} className="bg-white p-3 rounded-md border border-gray-200">
              <p className="font-medium">
                {showSensitiveData ? passenger.name : maskedName}
                {index === 0 && <span className="ml-2 text-xs bg-ocean-light/30 text-ocean-dark px-2 py-0.5 rounded-full">Lead Passenger</span>}
              </p>
              {showSensitiveData ? (
                <>
                  {passenger.email && <p className="text-sm text-gray-600">{passenger.email}</p>}
                  {passenger.phone && <p className="text-sm text-gray-600">{passenger.phone}</p>}
                </>
              ) : (
                <>
                  {passenger.email && <p className="text-sm text-gray-600">{maskedEmail}</p>}
                  {passenger.phone && <p className="text-sm text-gray-600">{maskedPhone}</p>}
                </>
              )}
            </div>
          );
        })}
        
        {!showSensitiveData && (
          <Alert className="mt-2 bg-blue-50 border-blue-200">
            <Shield className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">Privacy Protection</AlertTitle>
            <AlertDescription className="text-blue-700 text-sm">
              For security reasons, passenger details are masked. Click "Show Details" to view full information.
            </AlertDescription>
          </Alert>
        )}
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
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
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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
              
              {renderMaskedPassengers()}
              
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
