
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

  useEffect(() => {
    const booking = location.state;
    if (!booking) {
      navigate("/activity-booking");
      return;
    }
    
    setBookingInfo(booking);
    
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
  }, [location.state, navigate]);

  const handleGoBack = () => {
    navigate("/activity-booking", { state: { activity: bookingInfo?.activity } });
  };

  const handleSubmit = (passengerDetails: any[]) => {
    if (!bookingInfo) return;
    
    const updatedBookingInfo = {
      ...bookingInfo,
      passengers: passengerDetails
    };
    
    // Store the updated booking info in session storage
    sessionStorage.setItem("currentActivityBooking", JSON.stringify(updatedBookingInfo));
    
    // Navigate to payment page with updated booking info
    navigate("/payment", { state: updatedBookingInfo });
    
    toast({
      title: "Passenger details saved!",
      description: "You're being redirected to payment."
    });
  };
  
  if (!bookingInfo) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      <div className="absolute top-4 right-4 z-20">
        <HeaderExtras />
      </div>
      
      <Header />
      
      <motion.div
        className="max-w-4xl mx-auto pt-20 sm:pt-28 px-4 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <StepIndicator currentStep={1} />
      </motion.div>
      
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
