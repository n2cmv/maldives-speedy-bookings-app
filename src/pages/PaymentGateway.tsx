
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BookingInfo } from "@/types/booking";
import Header from "@/components/Header";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ChevronLeft, AlertCircle } from "lucide-react";
import StepIndicator from "@/components/StepIndicator";
import HeaderExtras from "@/components/HeaderExtras";
import { motion } from "framer-motion";
import PaymentProcessingScreen from "@/components/payment/PaymentProcessingScreen";
import PaymentSummary from "@/components/payment/PaymentSummary";
import PaymentForm from "@/components/payment/PaymentForm";
import PaymentMethodSelector from "@/components/payment/PaymentMethodSelector";
import { generatePaymentReference } from "@/services/bookingService";
import { createBmlPaymentSession, BMLSettings } from "@/services/bmlPaymentService";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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
  const [paymentMethod, setPaymentMethod] = useState("bml"); // Default to BML payment gateway
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isSimulationMode, setIsSimulationMode] = useState(false);
  const [forceRealMode, setForceRealMode] = useState(false);

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
    
    // Check if we're returning from a cancelled payment
    const searchParams = new URLSearchParams(location.search);
    const canceled = searchParams.get('canceled') === 'true';
    
    if (canceled) {
      toast.error("Payment canceled", {
        description: "You canceled the payment process."
      });
      
      // Clear any pending booking data
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
    // Reset any previous errors
    setPaymentError(null);
    setIsSimulationMode(false);
    setIsProcessing(true);
    
    const totalAmount = calculateTotal();
    
    // If using BML payment gateway
    if (paymentMethod === "bml") {
      try {
        toast.info("Connecting to Bank of Maldives payment gateway", {
          description: "You will be redirected to the secure BML payment page"
        });
        
        const origin = window.location.origin;
        const returnUrl = `${origin}/`;
        const cancelUrl = `${origin}/payment?canceled=true`;
        
        // For activity booking, use a placeholder booking object for BML API
        const bookingForBml = activityBooking ? {
          from: "Activity Booking",
          island: activityBooking.activity?.name || "Activity",
          date: activityBooking.date,
          passengers: [{ 
            name: activityBooking.fullName,
            email: activityBooking.email,
            phone: activityBooking.phone,
            countryCode: activityBooking.countryCode
          }]
        } as BookingInfo : bookingInfo;
        
        if (!bookingForBml) {
          throw new Error("Missing booking information");
        }
        
        // Set up BML settings based on the user's preference
        const bmlSettings: BMLSettings = {
          forceRealMode: forceRealMode,
          disableSimulation: false,
          apiBaseUrl: "https://api.merchants.bankofmaldives.com.mv"
        };

        console.log("Using BML settings:", bmlSettings);
        
        const bmlPayment = await createBmlPaymentSession(
          bookingForBml,
          totalAmount,
          returnUrl,
          cancelUrl,
          bmlSettings
        );
        
        if (!bmlPayment.success) {
          throw new Error(bmlPayment.error || "Failed to initialize payment with Bank of Maldives");
        }
        
        // Check if we're in simulation mode (if the error message mentions simulation)
        if (bmlPayment.error && bmlPayment.error.includes("simulation")) {
          setIsSimulationMode(true);
          toast.warning("Using simulation mode", {
            description: "The BML API is currently unavailable. Using simulation mode instead."
          });
        }
        
        // Store payment reference
        const paymentReference = bmlPayment.reference || bookingReference;
        
        // Store booking with payment reference before redirecting
        if (activityBooking) {
          // For activity bookings
          localStorage.setItem('pendingActivityBooking', JSON.stringify({
            ...activityBooking,
            paymentReference,
            paymentPending: true,
            bmlPayment: true,
            isSimulationMode: bmlPayment.error?.includes("simulation") || false,
            bmlSettings
          }));
        } else if (bookingInfo) {
          // For regular speedboat bookings
          localStorage.setItem('pendingBooking', JSON.stringify({
            ...bookingInfo,
            paymentReference,
            paymentPending: true,
            bmlPayment: true,
            isSimulationMode: bmlPayment.error?.includes("simulation") || false,
            bmlSettings
          }));
        }
        
        // Redirect to BML payment page
        if (bmlPayment.paymentUrl) {
          window.location.href = bmlPayment.paymentUrl;
          return;
        } else {
          throw new Error("No payment URL provided by payment gateway");
        }
      } catch (error) {
        console.error("Error with BML payment:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to connect to payment gateway";
        
        setPaymentError(errorMessage);
        toast.error("Payment gateway error", {
          description: errorMessage
        });
        setIsProcessing(false);
        return;
      }
    }
    
    // Fallback to simulation flow
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
                  Complete your booking securely
                </p>
              </div>
              
              <div className="p-6 space-y-6">
                {paymentError && (
                  <Alert variant="destructive" className="bg-red-50 border-red-200">
                    <AlertCircle className="h-5 w-5" />
                    <AlertDescription className="ml-2">
                      <div className="font-medium">Payment Error</div>
                      <div className="text-sm">{paymentError}</div>
                      <p className="text-sm mt-2">
                        The payment gateway might be temporarily unavailable. Please try again or use simulation mode.
                      </p>
                    </AlertDescription>
                  </Alert>
                )}
                
                {isSimulationMode && (
                  <Alert className="bg-yellow-50 border-yellow-200">
                    <AlertDescription>
                      <div className="font-medium text-amber-800">Payment Simulation Mode</div>
                      <p className="text-sm text-amber-700">
                        You are using simulation mode because the Bank of Maldives payment gateway is temporarily unavailable.
                        Your transaction will be simulated for testing purposes.
                      </p>
                    </AlertDescription>
                  </Alert>
                )}
                
                <PaymentSummary 
                  bookingReference={bookingReference}
                  totalAmount={calculateTotal()}
                />
                
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <h3 className="text-sm font-medium mb-3">Developer Options</h3>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="force-real-mode" 
                      checked={forceRealMode} 
                      onCheckedChange={setForceRealMode} 
                    />
                    <Label htmlFor="force-real-mode" className="text-sm">
                      Force real payment mode (disable simulation fallback)
                    </Label>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    When enabled, the system will attempt to use the real BML payment gateway without falling back to simulation mode.
                    This might result in errors if the gateway is not reachable.
                  </p>
                </div>
                
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
