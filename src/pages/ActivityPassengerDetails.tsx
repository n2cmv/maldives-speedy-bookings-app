
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import StepIndicator from "@/components/StepIndicator";
import HeaderExtras from "@/components/HeaderExtras";
import TripSummaryCard from "@/components/TripSummaryCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import PassengerForm from "@/components/PassengerForm";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Passenger } from "@/types/booking";

const ActivityPassengerDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [bookingInfo, setBookingInfo] = useState<any>(null);
  const [passengers, setPassengers] = useState<any[]>([]);
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
          isActivityBooking: true
        };
        
        setBookingInfo(updatedBooking);
        
        // Initialize passenger forms based on counts
        const initialPassengers = [];
        for (let i = 0; i < booking.passengerCounts.adults; i++) {
          initialPassengers.push({ type: 'adult', id: `adult-${i+1}` });
        }
        for (let i = 0; i < booking.passengerCounts.children; i++) {
          initialPassengers.push({ type: 'child', id: `child-${i+1}` });
        }
        for (let i = 0; i < booking.passengerCounts.seniors; i++) {
          initialPassengers.push({ type: 'senior', id: `senior-${i+1}` });
        }
        
        setPassengers(initialPassengers);
        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing passenger details:", error);
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
        isActivityBooking: true // Ensure this flag is set for confirmation page
      };
      
      // Store the updated booking info in session storage
      sessionStorage.setItem("currentActivityBooking", JSON.stringify(updatedBookingInfo));
      
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
  
  if (!bookingInfo) {
    return null;
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
