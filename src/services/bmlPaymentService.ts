import { BookingInfo } from "@/types/booking";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Compute total amount in USD (major units)
function calculateTotalAmount(booking: BookingInfo): number {
  const PRICE_PER_PERSON = 70;
  const totalPassengers = booking.passengers?.length || booking.seats || 1;
  const isReturnTrip = booking.returnTrip && booking.returnTripDetails;
  return totalPassengers * PRICE_PER_PERSON * (isReturnTrip ? 2 : 1);
}

async function getAuthHeader(): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession();
  const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
  return `Bearer ${session?.access_token || anon}`;
}

async function postToFunction<T>(path: string, body: unknown): Promise<T> {
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1${path}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Authorization": await getAuthHeader(), "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let data: any = {};
  try { data = text ? JSON.parse(text) : {}; } catch { data = text; }
  if (!res.ok) {
    const msg = typeof data === "object" && data?.error
      ? `${data.error}${data.status ? ` (${data.status})` : ""}${data.details ? `: ${JSON.stringify(data.details)}` : ""}`
      : text || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data as T;
}

export const bmlPaymentService = {
  async createPayment(booking: BookingInfo): Promise<{ redirectUrl: string; transactionId: string }> {
    if (!booking) throw new Error("Invalid booking data");

    const totalAmount = calculateTotalAmount(booking);
    if (totalAmount <= 0) throw new Error("Invalid payment amount");

    const fromLocation = booking.from || "Male";
    const toLocation = booking.island || "Resort Island";
    const customerReference = `Booking for ${fromLocation} to ${toLocation}`;
    const paymentReference = booking.paymentReference || `RTM-${Math.floor(Math.random() * 10000)}`;

    // Lean payload: server sets redirectUrl and (optionally) provider
    const payload: Record<string, unknown> = {
      amountCents: Math.round(totalAmount * 100),
      currency: "USD",
      signMethod: "sha1",
      paymentReference,
      customerReference,
      ...booking,
    };
    // If (and only if) your BML account has a specific provider enabled, you can pass it from UI:
    if ((booking as any).provider) payload.provider = (booking as any).provider;

    console.log("Creating payment with payload:", payload);

    const data: any = await postToFunction("/bml-payment/create", payload);

    if (!data || !data.id) throw new Error("Payment creation failed: Invalid response from payment gateway");
    console.log(data);
    const finalRedirectUrl: string | undefined = data?.url;
    if (!finalRedirectUrl) throw new Error("Payment gateway did not provide redirection details");

    localStorage.setItem("lastTransactionId", data.id);

    return { redirectUrl: finalRedirectUrl, transactionId: data.id };
  },

  async verifyPayment(transactionId: string): Promise<{ status: string; success: boolean; bookingReference?: string; }> {
    if (!transactionId) throw new Error("Transaction ID is required");
    const data: any = await postToFunction("/bml-payment/verify", { transactionId });
    const status = String(data?.status || data?.state || "FAILED").toUpperCase();
    const bookingReference: string | undefined = data?.bookingReference || data?.details?.merchantReference;
    return { status, success: status === "CONFIRMED", bookingReference };
  },
};
