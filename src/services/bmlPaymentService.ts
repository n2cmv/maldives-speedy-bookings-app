
import { BookingInfo } from "@/types/booking";

interface BMLPaymentResponse {
  success: boolean;
  paymentUrl?: string;
  error?: string;
  reference?: string;
}

export interface BMLPaymentConfig {
  appId: string;
  publicKey: string;
  apiKey: string;
}

// BML API configuration
const BML_CONFIG: BMLPaymentConfig = {
  appId: "b83c8c6b-12bc-4b2e-8640-5d9e66786adc",
  publicKey: "pk_production_ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmpJam9pTmpKbFlqTmtOV0kyTnpVNU1tSXdNREE1Wm1SbU1UQXhJaXdpYUNJNkltaDBkSEJ6T2k4dmJXRnNaR2wyWlhNdGMzQmxaV1I1TFdKdmIydHBibWR6TFdGd2NDNXNiM1poWW14bExtRndjQzhpTENKaElqb2lZamd6WXpoak5tSXRNVEppWXkwMFlqSmxMVGcyTkRBdE5XUTVaVFkyTnpnMllXUmpJaXdpZFhFaU9pSXpNREE1WWpSak9TMHhaV001TFRRMVlqa3RPRFprT0MxbU5qY3pZelptTlRFeFlqTWlMQ0pwWVhRaU9qRTNORFF6T0RNNU16WXNJbVY0Y0NJNk5Ea3dNREExTnpVek5uMC5LdFJJQ0pVb0VQaHY1clM4YWFoOG53U3k5WE92NHRNb1hIb0RrNzdqNlVz",
  apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6ImI4M2M4YzZiLTEyYmMtNGIyZS04NjQwLTVkOWU2Njc4NmFkYyIsImNvbXBhbnlJZCI6IjYyZWIzZDViNjc1OTJiMDAwOWZkZjEwMSIsImlhdCI6MTc0NDM4MzkzNiwiZXhwIjo0OTAwMDU3NTM2fQ._09EMmA2kYHhHd1ytmBIEv0oAgn_8pakQkviFino9Vo"
};

// BML API endpoints - using UAT (test) endpoints
const API_BASE_URL = "https://api.uat.merchants.bankofmaldives.com.mv";
const CREATE_PAYMENT_ENDPOINT = "/public/v1/payments";

/**
 * Initiates a payment request to Bank of Maldives payment gateway
 * @param booking The booking information to be paid for
 * @param amount The payment amount in USD
 * @param returnUrl The URL to return to after payment completion
 * @param cancelUrl The URL to return to if payment is canceled
 */
export async function createBmlPaymentSession(
  booking: BookingInfo, 
  amount: number,
  returnUrl: string,
  cancelUrl: string
): Promise<BMLPaymentResponse> {
  try {
    // Generate a unique transaction ID for this payment
    const txnId = `RTM-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Extract customer information from booking
    const customer = booking.passengers && booking.passengers.length > 0 
      ? booking.passengers[0] 
      : null;
    
    if (!customer) {
      throw new Error("No customer information available");
    }

    // Prepare payment request data according to BML API specifications
    const paymentData = {
      amount: {
        currencyCode: "USD",
        value: amount.toFixed(2)
      },
      merchantId: BML_CONFIG.appId,
      merchantName: "Retour Maldives",
      transactionId: txnId,
      description: `Speedboat booking from ${booking.from} to ${booking.island}`,
      customerReference: customer.name,
      customerEmail: customer.email || "",
      customerPhone: customer.phone || "",
      billingAddress: {
        firstName: customer.name.split(' ')[0],
        lastName: customer.name.split(' ').slice(1).join(' '),
        email: customer.email || "",
        phone: customer.phone || "",
        countryCode: customer.countryCode?.replace('+', '') || "960"
      },
      returnUrl,
      cancelUrl
    };

    console.log("Initiating BML payment request:", paymentData);

    // Make API request to BML to create a payment session
    const response = await fetch(`${API_BASE_URL}${CREATE_PAYMENT_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BML_CONFIG.apiKey}`
      },
      body: JSON.stringify(paymentData)
    });

    const data = await response.json();
    console.log("BML payment response:", data);

    if (!response.ok) {
      console.error("BML payment error:", data);
      return {
        success: false,
        error: data.message || "Failed to initialize payment"
      };
    }

    // In test mode, if using the UAT endpoint, you'll get a test payment URL
    return {
      success: true,
      paymentUrl: data.redirectUrl || data.checkoutUrl,
      reference: txnId
    };
  } catch (error) {
    console.error("Error creating BML payment:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}

/**
 * Verify the status of a BML payment
 * @param transactionId The transaction ID to verify
 */
export async function verifyBmlPayment(transactionId: string): Promise<{
  success: boolean;
  verified: boolean;
  status?: string;
  error?: string;
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/public/v1/payments/${transactionId}/status`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${BML_CONFIG.apiKey}`
      }
    });

    const data = await response.json();
    console.log("BML payment verification response:", data);

    if (!response.ok) {
      return {
        success: false,
        verified: false,
        error: data.message || "Failed to verify payment"
      };
    }

    return {
      success: true,
      verified: data.status === "COMPLETED" || data.status === "AUTHORIZED",
      status: data.status
    };
  } catch (error) {
    console.error("Error verifying BML payment:", error);
    return {
      success: false,
      verified: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}
