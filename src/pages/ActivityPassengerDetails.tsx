
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import StepIndicator from "@/components/StepIndicator";
import HeaderExtras from "@/components/HeaderExtras";
import TripSummaryCard from "@/components/TripSummaryCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ArrowRight } from "lucide-react";
import PassengerForm from "@/components/PassengerForm";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Passenger, BookingInfo } from "@/types/booking";
import { saveBookingToDatabase, generatePaymentReference } from "@/services/bookingService";

const ActivityPassengerDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null);
  const [passengers, setPassengers] = useState<any[]>([]);
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const booking = location.state;
        if (!booking) {
          navigate("/activity-booking");
          return;
        }
        
        // Always generate or use an existing payment reference
        const paymentRef = booking.paymentReference || generatePaymentReference();
        console.log("Setting up activity booking with reference:", paymentRef);
        
        const updatedBooking = {
          ...booking,
          isActivityBooking: true,
          activity: booking.activity || "Unknown Activity",
          is_activity_booking: true,
          paymentReference: paymentRef
        };
        
        console.log("Activity booking prepared:", updatedBooking);
        setBookingInfo(updatedBooking);
        
        const initialPassengers = [];
        if (booking.passengerCounts) {
          for (let i = 0; i < (booking.passengerCounts.adults || 0); i++) {
            initialPassengers.push({ type: 'adult', id: `adult-${i+1}` });
          }
          for (let i = 0; i < (booking.passengerCounts.children || 0); i++) {
            initialPassengers.push({ type: 'child', id: `child-${i+1}` });
          }
          for (let i = 0; i < (booking.passengerCounts.seniors || 0); i++) {
            initialPassengers.push({ type: 'senior', id: `senior-${i+1}` });
          }
        } else {
          initialPassengers.push({ type: 'adult', id: 'adult-1' });
        }
        
        setPassengers(initialPassengers);
        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing passenger details:", error);
        setError("An error occurred while loading your booking. Please try again.");
        setIsLoading(false);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [location.state, navigate]);

  const handleGoBack = () => {
    navigate("/activity-booking", { state: { activity: bookingInfo?.activity } });
  };

  const handleSubmit = async (passengerDetails: Passenger[]) => {
    if (!bookingInfo) return;
    
    try {
      if (!bookingInfo.activity) {
        console.error("Missing activity name");
        toast({
          title: "Missing activity information",
          description: "Please go back and select an activity",
          variant: "destructive"
        });
        return;
      }

      // Ensure we use the existing payment reference if available
      const paymentReference = bookingInfo.paymentReference;
      
      if (!paymentReference) {
        console.error("Payment reference is missing");
        toast({
          title: "Error with booking reference",
          description: "Could not generate a booking reference. Please try again.",
          variant: "destructive"
        });
        return;
      }

      const updatedBookingInfo = {
        ...bookingInfo,
        passengers: passengerDetails,
        isActivityBooking: true,
        is_activity_booking: true,
        activity: bookingInfo.activity || "Unknown Activity",
        paymentReference: paymentReference,
        paymentComplete: false
      };
      
      console.log("Submitting activity booking with explicit reference:", updatedBookingInfo);
      
      const { data, error } = await saveBookingToDatabase(updatedBookingInfo);
      
      if (error) {
        throw error;
      }
      
      console.log("Activity booking saved to database:", data);
      
      // Make sure we have the payment reference from the database
      const savedBooking = {
        ...updatedBookingInfo,
        id: data?.id || undefined,
        paymentReference: data?.payment_reference || paymentReference
      };
      
      sessionStorage.setItem("currentActivityBooking", JSON.stringify(savedBooking));
      
      const storedBookings = localStorage.getItem("savedBookings");
      const bookingsArray = storedBookings ? JSON.parse(storedBookings) : [];
      
      const bookingWithId = {
        ...savedBooking,
        id: data?.id || `activity-${Date.now()}`,
        paymentComplete: false
      };
      
      bookingsArray.push(bookingWithId);
      localStorage.setItem("savedBookings", JSON.stringify(bookingsArray));
      
      navigate("/payment", { state: savedBooking });
      
      toast({
        title: "Participant details saved!",
        description: "You're being redirected to payment."
      });
    } catch (error) {
      console.error("Error submitting passenger details:", error);
      toast({
        title: "Error saving participant details",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50">
        <div className="animate-pulse text-ocean-dark">Loading...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50 p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-red-800">
          {error}
        </div>
        <Button onClick={() => navigate("/activity-booking")}>
          Return to Activity Booking
        </Button>
      </div>
    );
  }
  
  if (!bookingInfo) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50">
        <Button onClick={() => navigate("/activity-booking")}>
          Start a New Activity Booking
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      <div className="absolute top-4 right-4 z-20">
        <HeaderExtras />
      </div>
      
      <Header />
      
      <div className="max-w-4xl mx-auto pt-20 sm:pt-28 px-4 mb-6">
        <StepIndicator currentStep={1} />
      </div>
      
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <Button 
          variant="outline" 
          onClick={handleGoBack}
          className="mb-6 flex items-center gap-2 text-ocean-dark border-ocean-dark hover:bg-ocean-light/20"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Activity Selection
        </Button>
        
        <h1 className="text-2xl md:text-3xl font-bold text-ocean-dark mb-6 md:mb-8">
          Participant Details
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {isMobile && (
            <div className="lg:col-span-1 mb-4">
              <TripSummaryCard 
                isActivityBooking={true}
                heading="Activity Summary"
                booking={bookingInfo}
              />
            </div>
          )}
          
          <div className="lg:col-span-2">
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
              {passengers.length > 0 ? (
                <PassengerForm
                  passengers={passengers}
                  onFormValidityChange={setIsValid}
                  onSubmit={handleSubmit}
                  submitButtonContent={
                    <>
                      Continue to Payment
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  }
                />
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No passengers selected. Please go back and select passengers.
                </div>
              )}
            </div>
          </div>
          
          {!isMobile && (
            <div className="lg:col-span-1">
              <TripSummaryCard 
                isActivityBooking={true}
                heading="Activity Summary"
                booking={bookingInfo}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityPassengerDetails;
