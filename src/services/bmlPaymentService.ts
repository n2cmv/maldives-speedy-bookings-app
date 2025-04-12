
import { BookingInfo } from "@/types/booking";
import { supabase } from "@/integrations/supabase/client";

// BML Connect integration service
export const bmlPaymentService = {
  // Create a new payment transaction
  async createPayment(booking: BookingInfo): Promise<{ redirectUrl: string, transactionId: string }> {
    try {
      if (!booking) {
        throw new Error("Invalid booking data");
      }
      
      // Calculate total amount (in MVR, as required by BML API)
      const totalAmount = calculateTotalAmount(booking);
      
      if (totalAmount <= 0) {
        throw new Error("Invalid payment amount");
      }

      const paymentPayload = {
        amount: totalAmount * 100, // Convert to cents (API requires amount in smallest currency unit)
        currency: "MVR", // Maldivian rufiyaa
        provider: "bml_epos", // BML payment method
        signMethod: "sha1",
        paymentReference: booking.paymentReference || `RTM-${Math.floor(Math.random() * 10000)}`,
        customerReference: `Booking for ${booking.from || 'Male'} to ${booking.island || 'Resort Island'}`,
        redirectUrl: `${window.location.origin}/confirmation?transaction=`,
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
      
      if (!data || !data.id) {
        console.error("Invalid payment response:", data);
        throw new Error("Invalid payment response received");
      }
      
      // For QR code, handle case where it might not be returned
      const redirectUrl = data.qrcode?.url || `${window.location.origin}/payment?error=qr_missing`;
      
      // Return the QR code URL and transaction ID
      return {
        redirectUrl,
        transactionId: data.id
      };
    } catch (error) {
      console.error("BML payment creation failed:", error);
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
      const status = data?.state || "FAILED";
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
