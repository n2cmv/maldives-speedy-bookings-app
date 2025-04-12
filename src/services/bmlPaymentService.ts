
import { BookingInfo } from "@/types/booking";
import { supabase } from "@/integrations/supabase/client";

// BML Connect integration service
export const bmlPaymentService = {
  // Create a new payment transaction
  async createPayment(booking: BookingInfo): Promise<{ redirectUrl: string, transactionId: string }> {
    try {
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
        paymentReference: booking.paymentReference,
        customerReference: `Booking for ${booking.from || 'Male'} to ${booking.island || booking.to || 'Resort Island'}`,
        redirectUrl: `${window.location.origin}/confirmation?transaction=`,
        appVersion: "RetourMaldives_1.0"
      };
      
      // Call the Supabase edge function to create the payment
      const { data, error } = await supabase.functions.invoke("bml-payment/create", {
        body: paymentPayload
      });
      
      if (error) {
        console.error("Error creating BML payment:", error);
        throw new Error(`Payment creation failed: ${error.message}`);
      }
      
      if (!data || !data.id || !data.qrcode?.url) {
        console.error("Invalid payment response:", data);
        throw new Error("Invalid payment response received");
      }
      
      // Return the QR code URL and transaction ID
      return {
        redirectUrl: data.qrcode.url,
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
      const { data, error } = await supabase.functions.invoke("bml-payment/verify", {
        body: { transactionId }
      });
      
      if (error) {
        console.error("Error verifying payment:", error);
        throw new Error(`Payment verification failed: ${error.message}`);
      }
      
      return {
        status: data.state,
        success: data.state === "CONFIRMED",
        bookingReference: data.bookingReference
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
