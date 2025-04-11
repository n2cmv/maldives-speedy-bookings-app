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
    // Wrap in setTimeout to prevent blocking the main thread
    const timer = setTimeout(() => {
      try {
        const booking = location.state;
        if (!booking) {
          navigate("/activity-booking");
          return;
        }
        
        // Ensure we mark this as an activity booking
        const updatedBooking = {
          ...booking,
          isActivityBooking: true,
          // Explicitly set these fields to ensure proper storage in Supabase
          activity: booking.activity || "Unknown Activity",
          is_activity_booking: true // Add snake_case version for direct database mapping
        };
        
        console.log("Activity booking prepared:", updatedBooking);
        setBookingInfo(updatedBooking);
        
        // Initialize passenger forms based on counts
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
          // Fallback if no passenger counts are provided
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

  const handleSubmit = (passengerDetails: Passenger[]) => {
    if (!bookingInfo) return;
    
    try {
      const updatedBookingInfo = {
        ...bookingInfo,
        passengers: passengerDetails,
        isActivityBooking: true, // Ensure camelCase flag is set for UI
        is_activity_booking: true, // Ensure snake_case flag is set for database
        activity: bookingInfo.activity || "Unknown Activity" // Ensure activity is set
      };
      
      console.log("Submitting activity booking:", updatedBookingInfo);
      
      // Store the updated booking info in session storage
      sessionStorage.setItem("currentActivityBooking", JSON.stringify(updatedBookingInfo));
      
      // Also store in localStorage for "My Bookings" feature
      const storedBookings = localStorage.getItem("savedBookings");
      const bookingsArray = storedBookings ? JSON.parse(storedBookings) : [];
      
      // Add this booking with a unique ID
      const bookingWithId = {
        ...updatedBookingInfo,
        id: `activity-${Date.now()}`,
        paymentComplete: false // Will be set to true after payment
      };
      
      bookingsArray.push(bookingWithId);
      localStorage.setItem("savedBookings", JSON.stringify(bookingsArray));
      
      // Navigate to payment page with updated booking info
      navigate("/payment", { state: updatedBookingInfo });
      
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
          {/* On mobile, show the summary card first */}
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
          
          {/* On desktop, show the summary card on the right */}
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
