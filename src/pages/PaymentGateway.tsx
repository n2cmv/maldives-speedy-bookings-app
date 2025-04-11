
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BookingInfo } from "@/types/booking";
import Header from "@/components/Header";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import StepIndicator from "@/components/StepIndicator";
import HeaderExtras from "@/components/HeaderExtras";
import { motion } from "framer-motion";
import PaymentProcessingScreen from "@/components/payment/PaymentProcessingScreen";
import PaymentSummary from "@/components/payment/PaymentSummary";
import PaymentForm from "@/components/payment/PaymentForm";
import { generatePaymentReference } from "@/services/bookingService";

const PRICE_PER_PERSON = 70; // USD per person per way - matching TripSummaryCard
const ACTIVITY_PRICE_PER_PERSON = 90; // USD per person for activities
const BANK_LOGO = "/lovable-uploads/05a88421-85a4-4019-8124-9aea2cda32b4.png";

const PaymentGateway = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingInfo, setBookingInfo] = useState<BookingInfo | any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [bookingReference, setBookingReference] = useState("");
  const [isActivityBooking, setIsActivityBooking] = useState(false);

  useEffect(() => {
    const booking = location.state as BookingInfo | any;
    if (!booking) {
      navigate("/booking");
      return;
    }
    
    // Enhanced activity booking detection
    const hasActivity = booking.activity !== undefined && booking.activity !== null && booking.activity !== "";
    setIsActivityBooking(booking.isActivityBooking === true || hasActivity);
    
    console.log("Payment Gateway - Booking info:", {
      hasActivity,
      activity: booking.activity,
      isActivityBookingFlag: booking.isActivityBooking,
      detectedAsActivity: booking.isActivityBooking === true || hasActivity
    });
    
    setBookingInfo(booking);
    
    // Generate a consistent reference number for this booking session
    setBookingReference(generatePaymentReference());
  }, [location.state, navigate]);

  const handleGoBack = () => {
    if (isActivityBooking) {
      navigate("/activity-passenger-details", { state: bookingInfo });
    } else {
      navigate("/passenger-details", { state: bookingInfo });
    }
  };

  const handlePayment = () => {
    setIsProcessing(true);
    
    toast.info("Redirecting to payment gateway", {
      description: "You will be redirected to the Bank of Maldives payment page"
    });
    
    setTimeout(() => {
      setIsProcessing(false);
      setIsRedirecting(true);
      
      simulatePaymentGateway();
    }, 2000);
  };

  const simulatePaymentGateway = () => {
    setTimeout(() => {
      handlePaymentCompletion(true);
    }, 3000);
  };

  const handlePaymentCompletion = (success: boolean) => {
    if (success && bookingInfo) {
      // Ensure activity booking flag is properly set before confirmation
      const finalBookingInfo = {
        ...bookingInfo,
        paymentComplete: true,
        paymentReference: bookingReference,
        isActivityBooking: isActivityBooking
      };
      
      // Double check if we have an activity but the flag wasn't set
      if (bookingInfo.activity && !finalBookingInfo.isActivityBooking) {
        finalBookingInfo.isActivityBooking = true;
      }
      
      console.log("Completing payment with booking info:", {
        isActivityBooking: finalBookingInfo.isActivityBooking,
        activity: finalBookingInfo.activity
      });
      
      navigate("/confirmation", { state: finalBookingInfo });
    } else {
      setIsRedirecting(false);
      toast.error("Payment failed", {
        description: "Your payment was not processed. Please try again."
      });
    }
  };

  const calculateTotal = () => {
    if (!bookingInfo?.passengers) return 0;
    
    const totalPassengers = bookingInfo.passengers.length || 0;
    
    if (isActivityBooking) {
      // Activity pricing
      return totalPassengers * ACTIVITY_PRICE_PER_PERSON;
    } else {
      // Regular booking pricing
      const isReturnTrip = bookingInfo.returnTrip && bookingInfo.returnTripDetails;
      const journeyMultiplier = isReturnTrip ? 2 : 1;
      return totalPassengers * PRICE_PER_PERSON * journeyMultiplier;
    }
  };

  if (!bookingInfo) {
    return null;
  }

  if (isRedirecting) {
    return <PaymentProcessingScreen bankLogo={BANK_LOGO} />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="absolute top-4 right-4 z-20">
        <HeaderExtras />
      </div>
      
      <Header />
      
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="max-w-4xl mx-auto mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <StepIndicator currentStep={2} />
          </motion.div>

          <div className="max-w-lg mx-auto">
            <Button 
              variant="outline" 
              onClick={handleGoBack}
              className="mb-6 flex items-center gap-2 text-ocean-dark border-ocean-dark hover:bg-ocean-light/20"
              disabled={isProcessing}
            >
              <ChevronLeft className="h-4 w-4" />
              Back to {isActivityBooking ? 'Participant' : 'Passenger'} Details
            </Button>
            
            <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-100">
              <div className="bg-ocean-light/10 py-4 px-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-ocean-dark">Payment</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Bank of Maldives Payment Gateway
                </p>
              </div>
              
              <div className="p-6 space-y-6">
                <PaymentSummary 
                  bookingReference={bookingReference}
                  totalAmount={calculateTotal()}
                  isActivityBooking={isActivityBooking}
                  activity={isActivityBooking ? bookingInfo.activity : undefined}
                />
                
                <PaymentForm 
                  onPayment={handlePayment}
                  isProcessing={isProcessing}
                  bankLogoUrl={BANK_LOGO}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;
