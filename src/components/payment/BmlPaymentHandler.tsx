
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { bmlPaymentService } from "@/services/bmlPaymentService";
import { toast } from "sonner";
import PaymentProcessingScreen from "./PaymentProcessingScreen";

/**
 * Component to handle BML payment returns and verify the transaction status
 */
const BmlPaymentHandler = () => {
  const [isVerifying, setIsVerifying] = useState(true);
  const [verifyAttempts, setVerifyAttempts] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Extract transaction ID from URL parameters
        const searchParams = new URLSearchParams(location.search);
        const transactionId = searchParams.get('transaction');
        const isMockPayment = searchParams.get('mock') === 'true';
        
        if (!transactionId) {
          setIsVerifying(false);
          toast.error("Invalid payment return URL");
          navigate("/payment");
          return;
        }
        
        console.log("Verifying payment transaction:", transactionId, isMockPayment ? "(mock)" : "");
        
        // Verify the payment status
        const result = await bmlPaymentService.verifyPayment(transactionId);
        
        if (result.success) {
          toast.success("Payment successful!");
          // Navigate to confirmation page with booking reference
          if (result.bookingReference) {
            // Need to fetch the complete booking before redirecting
            navigate(`/confirmation/${result.bookingReference}`);
          } else {
            navigate("/confirmation");
          }
        } else {
          console.log("Payment failed with status:", result.status);
          
          // If this is a mock payment and status isn't confirming, we'll force it to confirm
          // This is just for development purposes
          if (isMockPayment && verifyAttempts < 3) {
            console.log("Mock payment - retry attempt:", verifyAttempts + 1);
            setVerifyAttempts(prev => prev + 1);
            setTimeout(() => verifyPayment(), 1500);
            return;
          }
          
          toast.error(`Payment ${result.status.toLowerCase()}`);
          navigate("/payment", { 
            state: { 
              failed: true, 
              reason: result.status,
              transactionId
            } 
          });
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        
        // If we've tried less than 3 times, try again
        if (verifyAttempts < 2) {
          setVerifyAttempts(prev => prev + 1);
          toast.warning("Verification attempt failed, retrying...");
          // Try again after a delay
          setTimeout(() => verifyPayment(), 2000);
          return;
        }
        
        toast.error("Failed to verify payment");
        navigate("/payment", { 
          state: { 
            failed: true, 
            reason: "VERIFICATION_ERROR"
          } 
        });
      } finally {
        setIsVerifying(false);
      }
    };
    
    if (location.search.includes('transaction=') && isVerifying) {
      verifyPayment();
    }
  }, [location.search, navigate, verifyAttempts, isVerifying]);
  
  // Show processing screen while verifying payment
  if (isVerifying) {
    return <PaymentProcessingScreen bankLogo="/lovable-uploads/05a88421-85a4-4019-8124-9aea2cda32b4.png" />;
  }
  
  // Don't render anything visible once verification is complete (we'll navigate away)
  return null;
};

export default BmlPaymentHandler;
