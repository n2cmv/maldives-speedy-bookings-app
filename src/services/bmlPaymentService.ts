
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
export const BML_CONFIG: BMLPaymentConfig = {
  appId: "b83c8c6b-12bc-4b2e-8640-5d9e66786adc",
  publicKey: "pk_production_ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmpJam9pTmpKbFlqTmtOV0kyTnpVNU1tSXdNREE1Wm1SbU1UQXhJaXdpYUNJNkltaDBkSEJ6T2k4dmJXRnNaR2wyWlhNdGMzQmxaV1I1TFdKdmIydHBibWR6TFdGd2NDNXNiM1poWW14bExtRndjQzhpTENKaElqb2lZamd6WXpoak5tSXRNVEppWXkwMFlqSmxMVGcyTkRBdE5XUTVaVFkyTnpnMllXUmpJaXdpZFhFaU9pSXpNREE1WWpSak9TMHhaV001TFRRMVlqa3RPRFprT0MxbU5qY3pZelptTlRFeFlqTWlMQ0pwWVhRaU9qRTNORFF6T0RNNU16WXNJbVY0Y0NJNk5Ea3dNREExTnpVek5uMC5LdFJJQ0pVb0VQaHY1clM4YWFoOG53U3k5WE92NHRNb1hIb0RrNzdqNlVz",
  apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6ImI4M2M4YzZiLTEyYmMtNGIyZS04NjQwLTVkOWU2Njc4NmFkYyIsImNvbXBhbnlJZCI6IjYyZWIzZDViNjc1OTJiMDAwOWZkZjEwMSIsImlhdCI6MTc0NDM4MzkzNiwiZXhwIjo0OTAwMDU3NTM2fQ._09EMmA2kYHhHd1ytmBIEv0oAgn_8pakQkviFino9Vo"
};

// BML API endpoints - using UAT (test) endpoints
export const API_BASE_URL = "https://api.uat.merchants.bankofmaldives.com.mv";
const CREATE_PAYMENT_ENDPOINT = "/public/v1/payments";

// Helper function to ensure we have the full URL for API endpoints
export const getApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};

/**
 * Tests the BML API connection
 * @returns Promise with the connection status
 */
export async function testBmlApiConnection(): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> {
  try {
    console.log("BML Service: Testing API connection");
    // Send a simple HEAD request to check if API is reachable
    const response = await fetch(getApiUrl("/public/v1/health"), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${BML_CONFIG.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`BML Service: API health check response status: ${response.status}`);
    let responseBody = null;
    try {
      responseBody = await response.json();
      console.log("BML Service: API health response:", responseBody);
    } catch (e) {
      console.log("BML Service: No JSON response from health endpoint");
    }
    
    if (response.ok) {
      return {
        success: true,
        message: "Successfully connected to BML API",
        details: responseBody
      };
    } else {
      return {
        success: false,
        message: `Failed to connect to BML API: Status ${response.status}`,
        details: responseBody
      };
    }
  } catch (error) {
    console.error("BML Service: Error testing API connection:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown connection error",
      details: error
    };
  }
}

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
  console.log("BML Service: Creating payment session with amount:", amount);
  
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

    console.log("BML Service: Initiating payment request with data:", JSON.stringify(paymentData, null, 2));

    // Make API request to BML to create a payment session
    const response = await fetch(`${API_BASE_URL}${CREATE_PAYMENT_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BML_CONFIG.apiKey}`
      },
      body: JSON.stringify(paymentData)
    });

    const responseStatus = response.status;
    console.log("BML Service: Payment request status:", responseStatus);
    
    const data = await response.json();
    console.log("BML Service: Payment request response:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error("BML Service: Payment request error:", data);
      return {
        success: false,
        error: data.message || `Failed to initialize payment (Status ${responseStatus})`
      };
    }

    // In test mode, if using the UAT endpoint, you'll get a test payment URL
    return {
      success: true,
      paymentUrl: data.redirectUrl || data.checkoutUrl,
      reference: txnId
    };
  } catch (error) {
    console.error("BML Service: Error creating payment:", error);
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
  rawResponse?: any;
}> {
  console.log("BML Service: Verifying payment with transaction ID:", transactionId);
  
  try {
    const verifyUrl = `${API_BASE_URL}/public/v1/payments/${transactionId}/status`;
    console.log("BML Service: Verification URL:", verifyUrl);
    
    const response = await fetch(verifyUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${BML_CONFIG.apiKey}`
      }
    });

    const responseStatus = response.status;
    console.log("BML Service: Verification status code:", responseStatus);
    
    let data: any;
    try {
      data = await response.json();
      console.log("BML Service: Verification response:", JSON.stringify(data, null, 2));
    } catch (e) {
      console.error("BML Service: Failed to parse verification response:", e);
      return {
        success: false,
        verified: false,
        error: "Invalid response from payment gateway"
      };
    }

    if (!response.ok) {
      return {
        success: false,
        verified: false,
        error: data.message || `Failed to verify payment (Status ${responseStatus})`,
        rawResponse: data
      };
    }

    return {
      success: true,
      verified: data.status === "COMPLETED" || data.status === "AUTHORIZED",
      status: data.status,
      rawResponse: data
    };
  } catch (error) {
    console.error("BML Service: Error verifying payment:", error);
    return {
      success: false,
      verified: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}

/**
 * Navigate to a payment test page for debugging BML integration
 */
export function openBmlTestPage(): void {
  window.open("https://uat.merchants.bankofmaldives.com.mv/test-payment-page", "_blank");
}
