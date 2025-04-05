
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BookingInfo } from "@/types/booking";
import Header from "@/components/Header";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ChevronLeft, CreditCard } from "lucide-react";
import StepIndicator from "@/components/StepIndicator";
import HeaderExtras from "@/components/HeaderExtras";
import { motion } from "framer-motion";

const PaymentGateway = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const booking = location.state as BookingInfo | null;
    if (!booking) {
      navigate("/booking");
      return;
    }
    
    setBookingInfo(booking);
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
      // Create a unique payment reference
      const paymentRef = `BML-${Math.floor(Math.random() * 1000000)}`;
      
      navigate("/confirmation", { 
        state: {
          ...bookingInfo,
          paymentComplete: true,
          paymentReference: paymentRef
        }
      });
    } else {
      setIsRedirecting(false);
      toast.error("Payment failed", {
        description: "Your payment was not processed. Please try again."
      });
    }
  };

  if (!bookingInfo) {
    return null;
  }

  if (isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <img 
              src="/lovable-uploads/05a88421-85a4-4019-8124-9aea2cda32b4.png" 
              alt="Bank of Maldives Payment Gateway" 
              className="h-16 mb-4"
            />
            <div className="w-16 h-16 border-4 border-ocean border-t-transparent rounded-full animate-spin"></div>
            <h2 className="text-2xl font-bold text-gray-800">Processing Payment</h2>
            <p className="text-gray-600">
              Please wait while your payment is being processed at Bank of Maldives...
            </p>
            <p className="text-sm text-gray-500 mt-8">
              (This is a simulation. In a real implementation, you would be on the bank's website)
            </p>
          </div>
        </div>
      </div>
    );
  }

  const calculateTotal = () => {
    if (!bookingInfo.passengerCounts) return 0;
    
    const basePrice = 149;
    const adultTotal = bookingInfo.passengerCounts.adults * basePrice;
    const childTotal = bookingInfo.passengerCounts.children * (basePrice * 0.7); // 30% discount
    const seniorTotal = bookingInfo.passengerCounts.seniors * (basePrice * 0.8); // 20% discount
    
    let total = adultTotal + childTotal + seniorTotal;
    if (bookingInfo.returnTrip) {
      total = total * 2;
    }
    
    return Math.round(total);
  };

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
                <div className="border-b border-gray-200 pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-700">Booking Reference:</span>
                    <span className="font-medium">{`MV-${Date.now().toString().slice(-6)}`}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Total Amount:</span>
                    <span className="text-lg font-bold text-ocean-dark">${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <p className="text-sm text-blue-800">
                    You will be redirected to the Bank of Maldives secure payment gateway to complete your transaction.
                  </p>
                </div>
                
                <Button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full bg-ocean hover:bg-ocean-dark text-white h-[60px] text-base font-medium"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-5 w-5" />
                      Proceed to Payment
                    </>
                  )}
                </Button>
                
                <div className="flex items-center justify-center mt-6">
                  <img 
                    src="/lovable-uploads/05a88421-85a4-4019-8124-9aea2cda32b4.png" 
                    alt="Payment Methods" 
                    className="h-8 md:h-10 w-auto"
                  />
                </div>
                
                <p className="text-xs text-gray-500 text-center mt-4">
                  Your payment information is encrypted and securely processed by Bank of Maldives.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;
