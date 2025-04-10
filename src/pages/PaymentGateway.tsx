
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BookingInfo } from "@/types/booking";
import Header from "@/components/Header";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ChevronLeft, AlertCircle, InfoIcon } from "lucide-react";
import StepIndicator from "@/components/StepIndicator";
import HeaderExtras from "@/components/HeaderExtras";
import { motion } from "framer-motion";
import PaymentProcessingScreen from "@/components/payment/PaymentProcessingScreen";
import PaymentSummary from "@/components/payment/PaymentSummary";
import PaymentForm from "@/components/payment/PaymentForm";
import PaymentMethodSelector from "@/components/payment/PaymentMethodSelector";
import { generatePaymentReference } from "@/services/bookingService";
import { createBmlPaymentSession, BMLSettings, testBmlApiConnection } from "@/services/bmlPaymentService";
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
  const [apiStatus, setApiStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [isTestingApi, setIsTestingApi] = useState(false);

  useEffect(() => {
    if (!location.state?.isActivityBooking) {
      const booking = location.state as BookingInfo | null;
      if (!booking) {
        navigate("/booking");
        return;
      }
      
      setBookingInfo(booking);
    } 
    else {
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
  
  // Test API connection on load or when force real mode changes
  useEffect(() => {
    const checkApiConnection = async () => {
      if (forceRealMode) {
        setIsTestingApi(true);
        try {
          const settings: BMLSettings = {
            forceRealMode: true,
            disableSimulation: true,
            apiBaseUrl: "https://api.merchants.bankofmaldives.com.mv"
          };
          
          const result = await testBmlApiConnection(settings);
          setApiStatus(result);
        } catch (error) {
          setApiStatus({ 
            success: false, 
            message: error instanceof Error ? error.message : "Failed to test API connection" 
          });
        } finally {
          setIsTestingApi(false);
        }
      } else {
        setApiStatus(null);
      }
    };
    
    checkApiConnection();
  }, [forceRealMode]);

  const handleGoBack = () => {
    if (activityBooking) {
      navigate("/activities");
    } else {
      navigate("/passenger-details", { state: bookingInfo });
    }
  };

  const handlePayment = async () => {
    setPaymentError(null);
    setIsSimulationMode(false);
    setIsProcessing(true);
    
    const totalAmount = calculateTotal();
    
    if (paymentMethod === "bml") {
      try {
        toast.info("Connecting to Bank of Maldives payment gateway", {
          description: "You will be redirected to the secure BML payment page"
        });
        
        const origin = window.location.origin;
        const returnUrl = `${origin}/`;
        const cancelUrl = `${origin}/payment?canceled=true`;
        
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
        
        const bmlSettings: BMLSettings = {
          forceRealMode: forceRealMode,
          disableSimulation: false,
          apiBaseUrl: forceRealMode ? 
            "https://api.merchants.bankofmaldives.com.mv" : 
            "https://api.uat.merchants.bankofmaldives.com.mv"
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
          if (forceRealMode && bmlPayment.error?.includes("Failed to fetch")) {
            throw new Error("Cannot connect to BML payment gateway. Turn off 'Force real mode' to use simulation instead.");
          }
          throw new Error(bmlPayment.error || "Failed to initialize payment with Bank of Maldives");
        }
        
        if (bmlPayment.error && bmlPayment.error.includes("simulation")) {
          setIsSimulationMode(true);
          toast.warning("Using simulation mode", {
            description: "The BML API is currently unavailable. Using simulation mode instead."
          });
        }
        
        const paymentReference = bmlPayment.reference || bookingReference;
        
        if (activityBooking) {
          localStorage.setItem('pendingActivityBooking', JSON.stringify({
            ...activityBooking,
            paymentReference,
            paymentPending: true,
            bmlPayment: true,
            isSimulationMode: bmlPayment.error?.includes("simulation") || false,
            bmlSettings
          }));
        } else if (bookingInfo) {
          localStorage.setItem('pendingBooking', JSON.stringify({
            ...bookingInfo,
            paymentReference,
            paymentPending: true,
            bmlPayment: true,
            isSimulationMode: bmlPayment.error?.includes("simulation") || false,
            bmlSettings
          }));
        }
        
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
        navigate("/confirmation", { 
          state: {
            ...activityBooking,
            paymentComplete: true,
            paymentReference: bookingReference,
            isActivityBooking: true
          }
        });
      } else if (bookingInfo) {
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
                    <AlertCircle className="h-5 w-5" />
                    <AlertDescription className="ml-2">
                      <div className="font-medium">Payment Error</div>
                      <div className="text-sm">{paymentError}</div>
                      {forceRealMode && paymentError.includes("Failed to fetch") && (
                        <div className="mt-2 text-sm">
                          <p className="font-medium">
                            You have "Force real payment mode" enabled which is preventing simulation mode.
                          </p>
                          <p className="mt-1">
                            To proceed with testing, either:
                          </p>
                          <ul className="list-disc ml-5 mt-1 space-y-1">
                            <li>Turn off "Force real mode" below to use simulation mode</li>
                            <li>Check your network connection to the BML payment gateway</li>
                            <li>Verify that your API credentials are correct</li>
                          </ul>
                        </div>
                      )}
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
                    <Label htmlFor="force-real-mode" className={`text-sm ${forceRealMode && paymentError ? 'text-red-600 font-medium' : ''}`}>
                      Force real payment mode (use BML production API)
                    </Label>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    When enabled, the system will attempt to use the real BML payment gateway.
                    {forceRealMode ? (
                      <span className="block mt-1 font-medium text-amber-700">
                        This might result in errors if the gateway is not reachable or your API key is not valid for production.
                      </span>
                    ) : (
                      <span className="block mt-1">
                        When disabled, the system will use the UAT (testing) endpoint, or fall back to simulation if unavailable.
                      </span>
                    )}
                  </p>
                  
                  {isTestingApi && (
                    <div className="mt-3 flex items-center text-slate-600">
                      <div className="w-4 h-4 border-2 border-ocean border-t-transparent rounded-full animate-spin mr-2"></div>
                      <span className="text-xs">Testing API connection...</span>
                    </div>
                  )}
                  
                  {apiStatus && !isTestingApi && (
                    <div className={`mt-3 text-xs rounded-md p-2 ${apiStatus.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                      <div className="flex items-center">
                        <InfoIcon className="h-3 w-3 mr-1" />
                        <span className="font-medium">API Status:</span>
                      </div>
                      <p className="mt-1">{apiStatus.message}</p>
                    </div>
                  )}
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
