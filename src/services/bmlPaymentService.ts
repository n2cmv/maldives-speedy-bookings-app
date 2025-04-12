
import { BookingInfo } from "@/types/booking";

interface BMLPaymentResponse {
  success: boolean;
  paymentUrl?: string;
  error?: string;
  reference?: string;
}

export interface BMLPaymentConfig {
  clientId: string;
  apiKey: string;
}

// BML API configuration
export const BML_CONFIG: BMLPaymentConfig = {
  clientId: "b83c8c6b-12bc-4b2e-8640-5d9e66786adc",
  apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6ImI4M2M4YzZiLTEyYmMtNGIyZS04NjQwLTVkOWU2Njc4NmFkYyIsImNvbXBhbnlJZCI6IjYyZWIzZDViNjc1OTJiMDAwOWZkZjEwMSIsImlhdCI6MTc0NDM4MzkzNiwiZXhwIjo0OTAwMDU3NTM2fQ._09EMmA2kYHhHd1ytmBIEv0oAgn_8pakQkviFino9Vo"
};

// BML Settings
export interface BMLSettings {
  apiBaseUrl: string;
}

// Default BML settings
export const defaultBmlSettings: BMLSettings = {
  apiBaseUrl: "https://api.merchants.bankofmaldives.com.mv"
};

// API endpoints
const CREATE_PAYMENT_ENDPOINT = "/public/transactions";

// Helper function to ensure we have the full URL for API endpoints
export const getApiUrl = (endpoint: string, settings?: BMLSettings): string => {
  const baseUrl = settings?.apiBaseUrl || defaultBmlSettings.apiBaseUrl;
  return `${baseUrl}${endpoint}`;
};

/**
 * SHA-256 signature generator for BML API
 */
const generateSignature = async (amount: number, currency: string, apiKey: string): Promise<string> => {
  try {
    // Format according to the updated API documentation
    const signString = `amount=${amount}&currency=${currency}&apiKey=${apiKey}`;
    
    console.log("BML Service: Generating signature with string:", signString);
    
    // Convert the string to Uint8Array for Web Crypto API
    const encoder = new TextEncoder();
    const data = encoder.encode(signString);
    
    // Generate SHA-256 hash
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    
    // Convert to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    console.log("BML Service: Generated signature:", hashHex);
    return hashHex;
  } catch (error) {
    console.error("Error generating signature:", error);
    throw new Error("Failed to generate payment signature");
  }
};

/**
 * Tests the BML API connection
 * @returns Promise with the connection status
 */
export async function testBmlApiConnection(settings?: BMLSettings): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> {
  try {
    console.log("BML Service: Testing API connection");
    // Use health endpoint for checking connectivity
    const response = await fetch(getApiUrl("/public/v1/health", settings), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${BML_CONFIG.apiKey}`,
        'Accept': 'application/json',
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
 * @param settings Optional settings to configure BML payment behavior
 */
export async function createBmlPaymentSession(
  booking: BookingInfo, 
  amount: number,
  returnUrl: string,
  cancelUrl: string,
  settings?: BMLSettings
): Promise<BMLPaymentResponse> {
  const bmlSettings = settings || defaultBmlSettings;
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

    // Convert amount to cents as per API requirements
    const amountInCents = Math.round(amount * 100);
    
    // Generate signature according to BML API v2.0
    const signature = await generateSignature(amountInCents, "USD", BML_CONFIG.apiKey);

    // Prepare payment request data according to BML API v2.0 specifications
    const paymentData = {
      localId: txnId,
      customerReference: `Booking for ${customer.name}`,
      signature: signature,
      amount: amountInCents,
      currency: "USD",
      provider: "bml_epos", // Using BML EPOS provider as specified in docs
      appVersion: "RetourMaldives1.0", // App version for tracking
      apiVersion: "2.0", // API version
      deviceId: BML_CONFIG.clientId, // Using client ID as device ID
      signMethod: "sha256", // Using sha256 for signature
      redirectUrl: returnUrl,
      cancelUrl: cancelUrl,
      notificationUrl: returnUrl // Adding webhook notification URL
    };

    console.log("BML Service: Initiating payment request with data:", JSON.stringify(paymentData, null, 2));

    // Make API request to BML to create a payment session
    const apiUrl = getApiUrl(CREATE_PAYMENT_ENDPOINT, bmlSettings);
    console.log("BML Service: Using API URL:", apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BML_CONFIG.apiKey}`,
        'Accept': 'application/json'
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

    // For successful responses, extract QR code URL or redirect URL
    return {
      success: true,
      paymentUrl: data.qrCode?.url || data.redirectUrl,
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
export async function verifyBmlPayment(
  transactionId: string,
  settings?: BMLSettings
): Promise<{
  success: boolean;
  verified: boolean;
  status?: string;
  error?: string;
  rawResponse?: any;
}> {
  const bmlSettings = settings || defaultBmlSettings;
  console.log("BML Service: Verifying payment with transaction ID:", transactionId);
  
  try {
    // For real verification
    const verifyUrl = getApiUrl(`${CREATE_PAYMENT_ENDPOINT}/${transactionId}`, bmlSettings);
    console.log("BML Service: Verification URL:", verifyUrl);
    
    const response = await fetch(verifyUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${BML_CONFIG.apiKey}`,
        'Accept': 'application/json'
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

    // Check state according to v2.0 API documentation
    return {
      success: true,
      verified: data.state === "CONFIRMED",
      status: data.state,
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
 * Get BML payment webhook URL for configuration in BML merchant portal
 */
export function getBmlWebhookUrl(): string {
  return window.location.origin + "/api/bml-webhook";
}
