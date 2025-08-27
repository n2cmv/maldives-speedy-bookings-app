
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
        // Extract transaction ID from URL parameters or localStorage
        const searchParams = new URLSearchParams(location.search);
        let transactionId = searchParams.get('transaction');
        
        // Fallback to localStorage if no transaction in URL
        if (!transactionId) {
          transactionId = localStorage.getItem('lastTransactionId');
        }
        
        if (!transactionId) {
          setIsVerifying(false);
          toast.error("No transaction found");
          navigate("/payment");
          return;
        }
        
        console.log("Polling payment verification for:", transactionId);
        
        // Poll for payment confirmation
        const pollPayment = async (): Promise<boolean> => {
          try {
            const result = await bmlPaymentService.verifyPayment(transactionId);
            console.log("Payment status:", result.status);
            
            if (result.status === 'CONFIRMED') {
              toast.success("Payment confirmed!");
              
              // Retrieve pending booking from local storage
              const pendingBooking = localStorage.getItem('pendingBooking');
              const pendingActivityBooking = localStorage.getItem('pendingActivityBooking');
              
              let bookingData = null;
              if (pendingBooking) {
                bookingData = JSON.parse(pendingBooking);
                localStorage.removeItem('pendingBooking');
              } else if (pendingActivityBooking) {
                bookingData = JSON.parse(pendingActivityBooking);
                localStorage.removeItem('pendingActivityBooking');
              }
              
              // Clean up transaction ID
              localStorage.removeItem('lastTransactionId');
              
              // Navigate to confirmation page with booking data
              if (bookingData) {
                const completedBooking = {
                  ...bookingData,
                  paymentComplete: true,
                  paymentReference: bookingData.paymentReference || result.bookingReference || transactionId
                };
                
                navigate("/confirmation", { state: completedBooking });
              } else {
                navigate("/confirmation");
              }
              return true;
            } else if (result.status === 'FAILED' || result.status === 'CANCELLED') {
              toast.error(`Payment ${result.status.toLowerCase()}`);
              localStorage.removeItem('lastTransactionId');
              navigate("/payment", { 
                state: { 
                  failed: true, 
                  reason: result.status,
                  transactionId
                } 
              });
              return true;
            }
            
            return false; // Continue polling
          } catch (error) {
            console.error("Payment verification error:", error);
            return false;
          }
        };
        
        // Start polling
        const pollInterval = setInterval(async () => {
          const completed = await pollPayment();
          if (completed) {
            clearInterval(pollInterval);
            setIsVerifying(false);
          }
        }, 3000); // Poll every 3 seconds
        
        // Initial check
        const initialResult = await pollPayment();
        if (initialResult) {
          clearInterval(pollInterval);
          setIsVerifying(false);
        }
        
        // Cleanup on unmount or timeout
        setTimeout(() => {
          clearInterval(pollInterval);
          if (isVerifying) {
            toast.error("Payment verification timeout");
            navigate("/payment", { 
              state: { 
                failed: true, 
                reason: "TIMEOUT"
              } 
            });
            setIsVerifying(false);
          }
        }, 300000); // 5 minute timeout
        
      } catch (error) {
        console.error("Payment verification setup error:", error);
        toast.error("Failed to verify payment");
        navigate("/payment", { 
          state: { 
            failed: true, 
            reason: "VERIFICATION_ERROR"
          } 
        });
        setIsVerifying(false);
      }
    };
    
    verifyPayment();
  }, [location.search, location.pathname, navigate, isVerifying]);
  
  // Show processing screen while verifying payment
  if (isVerifying) {
    return <PaymentProcessingScreen bankLogo="/lovable-uploads/05a88421-85a4-4019-8124-9aea2cda32b4.png" />;
  }
  
  // Don't render anything visible once verification is complete (we'll navigate away)
  return null;
};

export default BmlPaymentHandler;
