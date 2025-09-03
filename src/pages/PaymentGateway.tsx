
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BookingInfo } from "@/types/booking";
import Header from "@/components/Header";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ChevronLeft, InfoIcon } from "lucide-react";
import StepIndicator from "@/components/StepIndicator";
import HeaderExtras from "@/components/HeaderExtras";
import { motion } from "framer-motion";
import PaymentProcessingScreen from "@/components/payment/PaymentProcessingScreen";
import PaymentSummary from "@/components/payment/PaymentSummary";
import PaymentForm from "@/components/payment/PaymentForm";
import PaymentMethodSelector from "@/components/payment/PaymentMethodSelector";
import { generatePaymentReference } from "@/services/bookingService";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { bmlPaymentService } from "@/services/bmlPaymentService";
import { useScrollToTop } from "@/hooks/use-scroll-top";

const BANK_LOGO = "/lovable-uploads/05a88421-85a4-4019-8124-9aea2cda32b4.png";
const PRICE_PER_PERSON = 35;

const PaymentGateway = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null);
  const [activityBooking, setActivityBooking] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [bookingReference, setBookingReference] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bml_connect");
  const [paymentError, setPaymentError] = useState<string | null>(null);
  
  useScrollToTop();

  useEffect(() => {
    if (!location.state?.isActivityBooking) {
      const booking = location.state as BookingInfo | null;
      if (!booking) {
        navigate("/booking");
        return;
      }
      
      setBookingInfo(booking);
    } else {
      const activityData = location.state;
      if (!activityData) {
        navigate("/activities");
        return;
      }
      
      setActivityBooking(activityData);
    }
    
    setBookingReference(generatePaymentReference());
    
    const searchParams = new URLSearchParams(location.search);
    const canceled = searchParams.get('canceled') === 'true';
    
    if (canceled) {
      toast.error("Payment canceled", {
        description: "You canceled the payment process."
      });
      
      localStorage.removeItem('pendingBooking');
      localStorage.removeItem('pendingActivityBooking');
    }
  }, [location.state, location.search, navigate]);

  const handleGoBack = () => {
    if (activityBooking) {
      navigate("/activities");
    } else {
      navigate("/passenger-details", { state: bookingInfo });
    }
  };

  const handlePayment = async () => {
    setPaymentError(null);
    setIsProcessing(true);
    
    const totalAmount = calculateTotal();
    
    try {
      const paymentReference = bookingReference;
      
      let paymentData;
      
      if (activityBooking) {
        paymentData = {
          ...activityBooking,
          paymentReference,
          paymentMethod,
          from: "Male",
          to: activityBooking.activityName || "Activity",
          island: activityBooking.location || "Maldives",
          seats: activityBooking.adultCount + (activityBooking.childCount || 0)
        };
      } else if (bookingInfo) {
        paymentData = {
          ...bookingInfo,
          paymentReference,
          paymentMethod
        };
      }
      
      if (paymentData) {
        toast.info("Redirecting to payment...");
        setIsRedirecting(true);
        
        const result = await bmlPaymentService.createPayment(paymentData);
        
        // Save transaction ID to localStorage
        localStorage.setItem('lastTransactionId', result.transactionId);
        
        // Save pending booking data
        if (activityBooking) {
          localStorage.setItem("pendingActivityBooking", JSON.stringify(paymentData));
        } else {
          localStorage.setItem("pendingBooking", JSON.stringify(paymentData));
        }
        
        // Redirect to payment gateway
        //window.location.href = result.url;
      }
    } catch (error) {
      console.error("Payment error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to process payment";
      
      setPaymentError(errorMessage);
      toast.error("Payment error", {
        description: errorMessage
      });
      setIsProcessing(false);
      setIsRedirecting(false);
    }
  };

  const calculateTotal = () => {
    if (activityBooking) {
      return activityBooking.totalPrice || 0;
    }
    
    if (!bookingInfo?.passengers) return 0;
    
    const totalPassengers = bookingInfo.passengers.length || 0;
    const isReturnTrip = bookingInfo.returnTrip && bookingInfo.returnTripDetails;
    const journeyMultiplier = isReturnTrip ? 2 : 1;
    
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
                  Complete your booking securely
                </p>
              </div>
              
              <div className="p-6 space-y-6">
                {paymentError && (
                  <Alert variant="destructive" className="bg-red-50 border-red-200">
                    <AlertDescription className="ml-2">
                      <div className="font-medium">Payment Error</div>
                      <div className="text-sm">{paymentError}</div>
                    </AlertDescription>
                  </Alert>
                )}
                
                <PaymentSummary 
                  bookingReference={bookingReference}
                  totalAmount={calculateTotal()}
                />
                
                <PaymentMethodSelector
                  selectedMethod={paymentMethod}
                  onMethodChange={setPaymentMethod}
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
