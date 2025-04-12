
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { bmlPaymentService } from "@/services/bmlPaymentService";
import { toast } from "sonner";

/**
 * Component to handle BML payment returns and verify the transaction status
 */
const BmlPaymentHandler = () => {
  const [isVerifying, setIsVerifying] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Extract transaction ID from URL parameters
        const searchParams = new URLSearchParams(location.search);
        const transactionId = searchParams.get('transaction');
        
        if (!transactionId) {
          setIsVerifying(false);
          toast.error("Invalid payment return URL");
          navigate("/");
          return;
        }
        
        // Verify the payment status
        const result = await bmlPaymentService.verifyPayment(transactionId);
        
        if (result.success) {
          toast.success("Payment successful!");
          // Navigate to confirmation page with booking reference
          if (result.bookingReference) {
            // Need to fetch the complete booking before redirecting
            navigate(`/confirmation/${result.bookingReference}`);
          } else {
            navigate("/");
          }
        } else {
          toast.error(`Payment ${result.status.toLowerCase()}`);
          navigate("/payment", { 
            state: { 
              failed: true, 
              reason: result.status 
            } 
          });
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        toast.error("Failed to verify payment");
        navigate("/");
      } finally {
        setIsVerifying(false);
      }
    };
    
    if (location.search.includes('transaction=')) {
      verifyPayment();
    }
  }, [location.search, navigate]);
  
  // Don't render anything visible, this is just a handler
  return null;
};

export default BmlPaymentHandler;
