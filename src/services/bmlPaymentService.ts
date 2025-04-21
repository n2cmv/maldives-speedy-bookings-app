
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
        appVersion: "RetourMaldives_1.0",
        // Adding merchant ID directly from your provided details
        merchantId: "8633129903"
      };
      
      console.log("Creating payment with payload:", paymentPayload);
      
      // Call the Supabase edge function to create the payment
      const { data, error } = await supabase.functions.invoke("bml-payment/create", {
        body: paymentPayload
      });
      
      if (error) {
        console.error("Payment creation error:", error);
        throw new Error(`Payment creation failed: ${error.message}`);
      }
      
      // Handle specific error cases
      if (data && data.error) {
        console.error("Payment error response:", data);
        throw new Error(data.error);
      }
      
      if (!data || !data.id) {
        console.error("Invalid payment response:", data);
        throw new Error("Payment creation failed: Invalid response from payment gateway");
      }
      
      console.log("Payment created successfully:", data);
      
      // Handle mock transactions or real QR codes
      let finalRedirectUrl;
      if (data.qrcode?.url) {
        finalRedirectUrl = data.qrcode.url;
      } else if (data.id.startsWith('mock-')) {
        finalRedirectUrl = `${window.location.origin}/payment-confirmation?transaction=${data.id}&mock=true`;
      } else {
        throw new Error("Payment gateway did not provide redirection details");
      }
      
      // Return the redirect URL and transaction ID
      return {
        redirectUrl: finalRedirectUrl,
        transactionId: data.id
      };
    } catch (error) {
      console.error("Payment creation failed:", error);
      
      // Show a clearer error message for specific failure cases
      if (error.message?.includes('payment gateway') || 
          error.message?.includes('configuration')) {
        toast.error("Payment system error", {
          description: "There was an issue with the payment gateway. Please try again or use another payment method.",
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
      
      // Handle mock transactions
      if (transactionId.startsWith('mock-')) {
        console.log("Verifying mock transaction:", transactionId);
        return {
          status: "CONFIRMED",
          success: true,
          bookingReference: `RTM-${Math.floor(Math.random() * 10000)}`
        };
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
      const bookingReference = data?.bookingReference || data?.details?.merchantReference;
      
      return {
        status,
        success: status === "CONFIRMED",
        bookingReference
      };
    } catch (error) {
      console.error("Payment verification failed:", error);
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
