
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";
import { verifyBmlPayment, BMLSettings } from "@/services/bmlPaymentService";
import { BookingInfo } from "@/types/booking";

const BmlPaymentHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVerifying, setIsVerifying] = useState(false);
  const [hasAttemptedVerification, setHasAttemptedVerification] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [isSimulationMode, setIsSimulationMode] = useState(false);
  
  useEffect(() => {
    const handlePaymentVerification = async () => {
      // Skip verification if we've already attempted it once
      if (hasAttemptedVerification) {
        console.log("BML Handler: Already attempted verification, skipping");
        return;
      }
      
      // Only verify if we have search params in the URL
      const searchParams = new URLSearchParams(location.search);
      console.log("BML Handler: URL search params:", Object.fromEntries(searchParams));
      
      if (!searchParams.has('status')) {
        console.log("BML Handler: No status parameter found in URL, skipping verification");
        return;
      }
      
      console.log(`BML Handler: Payment verification started. Status: ${searchParams.get('status')}`);
      
      setIsVerifying(true);
      setHasAttemptedVerification(true);
      
      try {
        // Check for pending booking in localStorage
        const pendingBookingJson = localStorage.getItem('pendingBooking');
        const pendingActivityBookingJson = localStorage.getItem('pendingActivityBooking');
        
        console.log("BML Handler: Found pendingBooking:", !!pendingBookingJson);
        console.log("BML Handler: Found pendingActivityBooking:", !!pendingActivityBookingJson);
        
        if (!pendingBookingJson && !pendingActivityBookingJson) {
          // No pending booking found
          const errorMsg = "No pending booking found";
          console.error("BML Handler Error:", errorMsg);
          setVerificationError(errorMsg);
          toast.error(errorMsg);
          setTimeout(() => navigate("/"), 3000);
          return;
        }
        
        const isPendingActivity = !!pendingActivityBookingJson;
        const pendingData = isPendingActivity 
          ? JSON.parse(pendingActivityBookingJson!) 
          : JSON.parse(pendingBookingJson!);
        
        console.log("BML Handler: Pending data retrieved:", {
          isPendingActivity,
          hasBmlPayment: !!pendingData.bmlPayment,
          hasReference: !!pendingData.paymentReference,
          reference: pendingData.paymentReference,
          isSimulation: !!pendingData.isSimulationMode,
          bmlSettings: pendingData.bmlSettings
        });
        
        // Get any stored BML settings or use defaults
        const bmlSettings: BMLSettings = pendingData.bmlSettings || {
          forceRealMode: false,
          disableSimulation: false,
          apiBaseUrl: "https://api.merchants.bankofmaldives.com.mv"
        };
        
        // Check if this is using simulation mode
        if (pendingData.isSimulationMode) {
          console.log("BML Handler: Using simulation mode");
          setIsSimulationMode(true);
          // In simulation mode, we consider the payment successful
          setVerificationSuccess(true);
          toast.success("Payment verification completed", {
            description: "Payment simulation completed successfully"
          });
          
          // Clear pending booking data
          localStorage.removeItem('pendingBooking');
          localStorage.removeItem('pendingActivityBooking');
          
          // Navigate to confirmation page with updated booking data
          setTimeout(() => {
            if (isPendingActivity) {
              console.log("BML Handler: Navigating to confirmation page for activity booking (simulation)");
              navigate("/confirmation", { 
                state: {
                  ...pendingData,
                  paymentComplete: true,
                  isActivityBooking: true,
                  isSimulationMode: true
                }
              });
            } else {
              console.log("BML Handler: Navigating to confirmation page for regular booking (simulation)");
              const bookingInfo = pendingData as BookingInfo;
              navigate("/confirmation", { 
                state: {
                  ...bookingInfo,
                  paymentComplete: true,
                  isSimulationMode: true
                }
              });
            }
          }, 1500);
          return;
        }
        
        // Check if this is a BML payment and has a reference
        if (!pendingData.bmlPayment || !pendingData.paymentReference) {
          const errorMsg = "Invalid payment reference";
          console.error("BML Handler Error:", errorMsg);
          setVerificationError(errorMsg);
          toast.error(errorMsg);
          setTimeout(() => navigate("/"), 3000);
          return;
        }
        
        // Verify payment with BML using any stored settings
        console.log("BML Handler: Verifying payment with reference:", pendingData.paymentReference);
        const verification = await verifyBmlPayment(pendingData.paymentReference, bmlSettings);
        console.log("BML Handler: Verification result:", verification);
        
        if (verification.success && verification.verified) {
          // Payment successful
          console.log("BML Handler: Payment verified successfully");
          setVerificationSuccess(true);
          toast.success("Payment verified successfully");
          
          // Clear pending booking data
          localStorage.removeItem('pendingBooking');
          localStorage.removeItem('pendingActivityBooking');
          
          // Navigate to confirmation page with updated booking data
          setTimeout(() => {
            if (isPendingActivity) {
              console.log("BML Handler: Navigating to confirmation page for activity booking");
              navigate("/confirmation", { 
                state: {
                  ...pendingData,
                  paymentComplete: true,
                  isActivityBooking: true
                }
              });
            } else {
              console.log("BML Handler: Navigating to confirmation page for regular booking");
              const bookingInfo = pendingData as BookingInfo;
              navigate("/confirmation", { 
                state: {
                  ...bookingInfo,
                  paymentComplete: true
                }
              });
            }
          }, 1500);
        } else {
          // Payment failed or is still pending
          const errorMsg = verification.error || "Payment verification failed";
          console.error("BML Handler Error:", errorMsg, verification);
          setVerificationError(errorMsg);
          toast.error(
            errorMsg, 
            { description: "Please try again or contact customer support" }
          );
          setTimeout(() => navigate("/"), 3000);
        }
      } catch (error) {
        console.error("BML Handler: Error handling BML payment verification:", error);
        setVerificationError(error instanceof Error ? error.message : "Unknown error");
        toast.error("Error processing payment verification");
        setTimeout(() => navigate("/"), 3000);
      } finally {
        setIsVerifying(false);
      }
    };
    
    // Check if we're returning from BML payment - only on the index page
    if (location.pathname === "/" && location.search.includes("status=")) {
      console.log("BML Handler: Detected payment return on index page");
      handlePaymentVerification();
    } else {
      console.log("BML Handler: Not verifying payment. Path:", location.pathname, "Search:", location.search);
    }
  }, [navigate, location, hasAttemptedVerification]);
  
  if (!isVerifying) return null;
  
  // Show loading or success UI when verifying
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg text-center max-w-md">
        {verificationSuccess ? (
          <>
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Payment Successful</h2>
            <p className="text-gray-600 mb-4">
              Your payment has been verified. Redirecting to your booking confirmation...
            </p>
            {isSimulationMode && (
              <div className="bg-yellow-50 p-3 rounded-lg mt-4 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0" />
                <p className="text-sm text-yellow-800">Simulation mode active</p>
              </div>
            )}
          </>
        ) : (
          <>
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-ocean" />
            <h2 className="text-xl font-semibold mb-2">Verifying Payment</h2>
            <p className="text-gray-600 mb-4">
              Please wait while we verify your payment with Bank of Maldives...
            </p>
          </>
        )}
        
        {verificationError && (
          <div className="bg-red-50 text-red-800 p-3 rounded-lg mt-4 flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
            <div className="text-left">
              <p className="font-medium">Verification Error</p>
              <p className="text-sm">{verificationError}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BmlPaymentHandler;
