
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [bookingReference, setBookingReference] = useState("");

  useEffect(() => {
    const booking = location.state as BookingInfo | null;
    if (!booking) {
      navigate("/booking");
      return;
    }
    
    setBookingInfo(booking);
    // Generate a consistent reference number for this booking session
    setBookingReference(`RTM-${Math.floor(Math.random() * 1000000)}`);
  }, [location.state, navigate]);

  const handleGoBack = () => {
    navigate("/passenger-details", { state: bookingInfo });
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
      navigate("/confirmation", { 
        state: {
          ...bookingInfo,
          paymentComplete: true,
          paymentReference: bookingReference
        }
      });
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
    const isReturnTrip = bookingInfo.returnTrip && bookingInfo.returnTripDetails;
    const journeyMultiplier = isReturnTrip ? 2 : 1; // Double the price for return trips
    
    return totalPassengers * PRICE_PER_PERSON * journeyMultiplier;
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
            <StepIndicator />
          </motion.div>

          <div className="max-w-lg mx-auto">
            <Button 
              variant="outline" 
              onClick={handleGoBack}
              className="mb-6 flex items-center gap-2 text-ocean-dark border-ocean-dark hover:bg-ocean-light/20"
              disabled={isProcessing}
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Passenger Details
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
