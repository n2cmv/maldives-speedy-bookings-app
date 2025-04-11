
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { verifyBmlPayment } from "@/services/bmlPaymentService";
import { BookingInfo } from "@/types/booking";

const BmlPaymentHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVerifying, setIsVerifying] = useState(true);
  
  useEffect(() => {
    const handlePaymentVerification = async () => {
      try {
        // Check for pending booking in localStorage
        const pendingBookingJson = localStorage.getItem('pendingBooking');
        const pendingActivityBookingJson = localStorage.getItem('pendingActivityBooking');
        
        if (!pendingBookingJson && !pendingActivityBookingJson) {
          // No pending booking found
          toast.error("No pending booking found");
          navigate("/");
          return;
        }
        
        const isPendingActivity = !!pendingActivityBookingJson;
        const pendingData = isPendingActivity 
          ? JSON.parse(pendingActivityBookingJson!) 
          : JSON.parse(pendingBookingJson!);
        
        // Check if this is a BML payment and has a reference
        if (!pendingData.bmlPayment || !pendingData.paymentReference) {
          toast.error("Invalid payment reference");
          navigate("/");
          return;
        }
        
        // Verify payment with BML
        const verification = await verifyBmlPayment(pendingData.paymentReference);
        
        if (verification.success && verification.verified) {
          // Payment successful
          toast.success("Payment verified successfully");
          
          // Clear pending booking data
          localStorage.removeItem('pendingBooking');
          localStorage.removeItem('pendingActivityBooking');
          
          // Navigate to confirmation page with updated booking data
          if (isPendingActivity) {
            navigate("/confirmation", { 
              state: {
                ...pendingData,
                paymentComplete: true,
                isActivityBooking: true
              }
            });
          } else {
            const bookingInfo = pendingData as BookingInfo;
            navigate("/confirmation", { 
              state: {
                ...bookingInfo,
                paymentComplete: true
              }
            });
          }
        } else {
          // Payment failed or is still pending
          toast.error(
            verification.error || "Payment verification failed", 
            { description: "Please try again or contact customer support" }
          );
          navigate("/");
        }
      } catch (error) {
        console.error("Error handling BML payment verification:", error);
        toast.error("Error processing payment verification");
        navigate("/");
      } finally {
        setIsVerifying(false);
      }
    };
    
    // Check if we're returning from BML payment
    if (location.pathname === "/confirmation" && location.search.includes("status=")) {
      handlePaymentVerification();
    }
  }, [navigate, location]);
  
  if (!isVerifying) return null;
  
  // Only show loading when actively verifying
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-ocean" />
        <h2 className="text-xl font-semibold mb-2">Verifying Payment</h2>
        <p className="text-gray-600">
          Please wait while we verify your payment with Bank of Maldives...
        </p>
      </div>
    </div>
  );
};

export default BmlPaymentHandler;
