
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
const BANK_LOGO = "/lovable-uploads/05a88421-85a4-4019-8124-9aea2cda32b4.png";

const PaymentGateway = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null);
  const [activityBooking, setActivityBooking] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [bookingReference, setBookingReference] = useState("");

  useEffect(() => {
    // Handle regular booking
    if (!location.state?.isActivityBooking) {
      const booking = location.state as BookingInfo | null;
      if (!booking) {
        navigate("/booking");
        return;
      }
      
      setBookingInfo(booking);
    } 
    // Handle activity booking
    else {
      const activityData = location.state;
      if (!activityData) {
        navigate("/activities");
        return;
      }
      
      setActivityBooking(activityData);
    }
    
    // Generate a consistent reference number for this booking session using our standardized function
    setBookingReference(generatePaymentReference());
  }, [location.state, navigate]);

  const handleGoBack = () => {
    if (activityBooking) {
      navigate("/activities");
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
    if (success) {
      if (activityBooking) {
        // For activity bookings
        navigate("/confirmation", { 
          state: {
            ...activityBooking,
            paymentComplete: true,
            paymentReference: bookingReference,
            isActivityBooking: true
          }
        });
      } else if (bookingInfo) {
        // For regular speedboat bookings
        navigate("/confirmation", { 
          state: {
            ...bookingInfo,
            paymentComplete: true,
            paymentReference: bookingReference
          }
        });
      }
    } else {
      setIsRedirecting(false);
      toast.error("Payment failed", {
        description: "Your payment was not processed. Please try again."
      });
    }
  };

  const calculateTotal = () => {
    if (activityBooking) {
      return activityBooking.totalPrice || 0;
    }
    
    if (!bookingInfo?.passengers) return 0;
    
    const totalPassengers = bookingInfo.passengers.length || 0;
    const isReturnTrip = bookingInfo.returnTrip && bookingInfo.returnTripDetails;
    const journeyMultiplier = isReturnTrip ? 2 : 1; // Double the price for return trips
    
    return totalPassengers * PRICE_PER_PERSON * journeyMultiplier;
  };

  if (!bookingInfo && !activityBooking) {
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
          {!activityBooking && (
            <motion.div
              className="max-w-4xl mx-auto mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <StepIndicator />
            </motion.div>
          )}

          <div className="max-w-lg mx-auto">
            <Button 
              variant="outline" 
              onClick={handleGoBack}
              className="mb-6 flex items-center gap-2 text-ocean-dark border-ocean-dark hover:bg-ocean-light/20"
              disabled={isProcessing}
            >
              <ChevronLeft className="h-4 w-4" />
              Back to {activityBooking ? "Activity Details" : "Passenger Details"}
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
