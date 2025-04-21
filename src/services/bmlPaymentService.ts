
import { BookingInfo } from "@/types/booking";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// BML Connect integration service with updated configuration
export const bmlPaymentService = {
  // Create a new payment transaction
  async createPayment(booking: BookingInfo): Promise<{ redirectUrl: string, transactionId: string }> {
    try {
      if (!booking) {
        throw new Error("Invalid booking data");
      }
      
      // Calculate total amount (in USD, as configured in BML Connect dashboard)
      const totalAmount = calculateTotalAmount(booking);
      
      if (totalAmount <= 0) {
        throw new Error("Invalid payment amount");
      }

      // Prepare customer reference with fallback values
      const fromLocation = booking.from || 'Male';
      const toLocation = booking.island || 'Resort Island';
      const customerReference = `Booking for ${fromLocation} to ${toLocation}`;

      // Redirect to the dedicated payment confirmation route
      const confirmationBaseUrl = `${window.location.origin}/payment-confirmation?transaction=`;

      // Include merchant ID in the payment payload
      const paymentPayload = {
        amount: totalAmount * 100, // Convert to cents (API requires amount in smallest currency unit)
        currency: "USD", // Using USD as shown in the BML dashboard
        provider: "bml_epos", // BML payment method
        signMethod: "sha1",
        paymentReference: booking.paymentReference || `RTM-${Math.floor(Math.random() * 10000)}`,
        customerReference,
        redirectUrl: confirmationBaseUrl,
        appVersion: "RetourMaldives_1.0"
      };
      
      console.log("Creating BML payment with payload:", paymentPayload);
      
      // Call the Supabase edge function to create the payment
      const { data, error } = await supabase.functions.invoke("bml-payment/create", {
        body: paymentPayload
      });
      
      if (error) {
        console.error("Error creating BML payment:", error);
        throw new Error(`Payment creation failed: ${error.message}`);
      }
      
      // Handle case where configuration is missing
      if (data && data.error && data.error.includes('Payment gateway configuration')) {
        throw new Error("Payment gateway not configured");
      }
      
      if (data && data.missingVars && data.missingVars.length > 0) {
        throw new Error("Payment gateway configuration missing");
      }
      
      if (!data || !data.id) {
        console.error("Invalid payment response:", data);
        
        // Show more specific error message from the response if available
        if (data && data.error) {
          throw new Error(data.error);
        }
        
        if (data && data.details) {
          const details = typeof data.details === 'string' ? data.details : JSON.stringify(data.details);
          throw new Error(`Payment failed: ${details}`);
        }
        
        throw new Error("Invalid payment response received");
      }
      
      // For QR code, handle case where it might not be returned
      const finalRedirectUrl = data.qrcode?.url || `${window.location.origin}/payment?error=qr_missing`;
      
      // Return the QR code URL and transaction ID
      return {
        redirectUrl: finalRedirectUrl,
        transactionId: data.id
      };
    } catch (error) {
      console.error("BML payment creation failed:", error);
      
      // Handle specific configuration errors with clearer messages
      if (error.message?.includes('gateway configuration missing') || 
          error.message?.includes('gateway not configured')) {
        toast.error("Payment gateway not configured", {
          description: "The payment system is currently unavailable. Please try another payment method or contact support.",
          duration: 8000
        });
        
        throw new Error("Payment gateway not configured: BML Connect environment variables are missing");
      }
      
      // Check for other missing environment variables error
      if (error.message?.includes('Missing required environment')) {
        toast.error("Payment system configuration error", {
          description: "The payment gateway is not properly configured. Please try another payment method or contact support.",
          duration: 8000
        });
      }
      
      throw error;
    }
  },
  
  // Verify payment status
  async verifyPayment(transactionId: string): Promise<{ 
    status: string;
    success: boolean;
    bookingReference?: string;
  }> {
    try {
      if (!transactionId) {
        throw new Error("Transaction ID is required");
      }
      
      const { data, error } = await supabase.functions.invoke("bml-payment/verify", {
        body: { transactionId }
      });
      
      if (error) {
        console.error("Error verifying payment:", error);
        throw new Error(`Payment verification failed: ${error.message}`);
      }
      
      // Handle case where data might not be complete
      const status = data?.status || data?.state || "FAILED";
      const bookingReference = data?.bookingReference;
      
      return {
        status,
        success: status === "CONFIRMED",
        bookingReference
      };
    } catch (error) {
      console.error("BML payment verification failed:", error);
      throw error;
    }
  }
};

// Helper function to calculate total amount
function calculateTotalAmount(booking: BookingInfo): number {
  const PRICE_PER_PERSON = 70; // USD per person per way
  
  // Handle cases where booking information might be incomplete
  const totalPassengers = booking.passengers?.length || booking.seats || 1;
  const isReturnTrip = booking.returnTrip && booking.returnTripDetails;
  const journeyMultiplier = isReturnTrip ? 2 : 1;
  
  return totalPassengers * PRICE_PER_PERSON * journeyMultiplier;
}
