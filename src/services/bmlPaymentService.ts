// src/services/bmlPaymentService.ts
import { BookingInfo } from "@/types/booking";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Helper: compute total amount in USD (major units)
function calculateTotalAmount(booking: BookingInfo): number {
  const PRICE_PER_PERSON = 70; // USD per person per way
  const totalPassengers = booking.passengers?.length || booking.seats || 1;
  const isReturnTrip = booking.returnTrip && booking.returnTripDetails;
  const journeyMultiplier = isReturnTrip ? 2 : 1;
  return totalPassengers * PRICE_PER_PERSON * journeyMultiplier;
}

// Helper: get an Authorization header (user token preferred, else anon key)
async function getAuthHeader(): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession();
  const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
  return `Bearer ${session?.access_token || anon}`;
}

// Helper: POST to an Edge Function subpath with JSON body
async function postToFunction<T>(path: string, body: unknown): Promise<T> {
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1${path}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": await getAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let data: any = {};
  try { data = text ? JSON.parse(text) : {}; } catch { data = text; }

  if (!res.ok) {
    const msg =
      typeof data === "object" && data?.error
        ? `${data.error}${data.status ? ` (${data.status})` : ""}${data.details ? `: ${JSON.stringify(data.details)}` : ""}`
        : text || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data as T;
}

// BML Connect integration service
export const bmlPaymentService = {
  /**
   * Create a new payment transaction via your Edge Function
   */
  async createPayment(booking: BookingInfo): Promise<{ redirectUrl: string; transactionId: string }> {
    try {
      if (!booking) throw new Error("Invalid booking data");

      // total in major units (USD)
      const totalAmount = calculateTotalAmount(booking);
      if (totalAmount <= 0) throw new Error("Invalid payment amount");

      // References
      const fromLocation = booking.from || "Male";
      const toLocation = booking.island || "Resort Island";
      const customerReference = `Booking for ${fromLocation} to ${toLocation}`;
      const paymentReference = booking.paymentReference || `RTM-${Math.floor(Math.random() * 10000)}`;

      // Build payload for the Edge Function (send cents)
      const payload = {
        amountCents: Math.round(totalAmount * 100),
        currency: "USD",
        provider: "bml_epos", // if enabled for your app
        signMethod: "sha1",
        paymentReference,
        customerReference,
        redirectUrl: `${window.location.origin}/payment-confirmation?transaction=`,
        // any extra metadata you want to persist can go here
        ...booking,
      };

      console.log("Creating payment with payload:", payload);

      // POST to your Edge Function subpath
      const data: any = await postToFunction("/bml-payment/create", payload);

      if (!data || !data.id) {
        console.error("Invalid payment response:", data);
        throw new Error("Payment creation failed: Invalid response from payment gateway");
      }

      // Prefer the URL BML provides
      const finalRedirectUrl: string | undefined =
        data?.qrcode?.url || data?.redirectUrl || data?.url;

      if (!finalRedirectUrl) {
        throw new Error("Payment gateway did not provide redirection details");
      }

      // Save transaction id for the return handler fallback
      localStorage.setItem("lastTransactionId", data.id);

      return {
        redirectUrl: finalRedirectUrl,
        transactionId: data.id,
      };
    } catch (error: any) {
      console.error("Payment creation failed:", error);

      if (
        typeof error?.message === "string" &&
        (error.message.includes("payment gateway") || error.message.includes("configuration"))
      ) {
        toast.error("Payment system error", {
          description:
            "There was an issue with the payment gateway. Please try again or use another payment method.",
          duration: 8000,
        });
      }

      throw error;
    }
  },

  /**
   * Verify payment status via your Edge Function
   */
  async verifyPayment(transactionId: string): Promise<{
    status: string;
    success: boolean;
    bookingReference?: string;
  }> {
    if (!transactionId) throw new Error("Transaction ID is required");

    const data: any = await postToFunction("/bml-payment/verify", { transactionId });

    const status = String(data?.status || data?.state || "FAILED").toUpperCase();
    const bookingReference: string | undefined =
      data?.bookingReference || data?.details?.merchantReference;

    return {
      status,
      success: status === "CONFIRMED",
      bookingReference,
    };
  },
};
