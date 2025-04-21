
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// BML merchant details
const BML_MERCHANT_DETAILS = {
  applicationId: Deno.env.get('BML_APPLICATION_ID'),
  merchantId: Deno.env.get('BML_MERCHANT_ID'),
  currency: "USD",
  domain: "https://visitdhigurah.com", // Website URL from your BML configuration
  publicKey: Deno.env.get('BML_PUBLIC_KEY')
};

// BML API key from environment
const BML_API_KEY = Deno.env.get('BML_API_KEY');

// BML API endpoints
const BML_CONNECT_API = {
  createPayment: "https://api.merchant.bankofmaldives.com.mv/payments",
  verifyPayment: "https://api.merchant.bankofmaldives.com.mv/payments/"
};

// Check environment configuration
function checkEnvironmentConfig() {
  const missingVars = [];
  
  if (!BML_API_KEY) missingVars.push('BML_API_KEY');
  if (!BML_MERCHANT_DETAILS.applicationId) missingVars.push('BML_APPLICATION_ID');
  if (!BML_MERCHANT_DETAILS.merchantId) missingVars.push('BML_MERCHANT_ID');
  
  return missingVars;
}

// Create payment transaction with BML Connect
async function createPayment(req: Request) {
  try {
    // Log incoming request information for debugging
    console.log("Received payment creation request");
    
    // Check environment configuration
    const missingVars = checkEnvironmentConfig();
    
    if (missingVars.length > 0) {
      console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
      return new Response(
        JSON.stringify({ 
          error: 'Payment gateway configuration missing', 
          details: `Missing required environment variables: ${missingVars.join(', ')}`,
          missingVars
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const paymentPayload = await req.json();
    
    console.log('Received payment payload:', JSON.stringify(paymentPayload));

    // Create a unique reference if none is provided
    const merchantReference = paymentPayload.paymentReference || `RTM-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const bmlRequestPayload = {
      amount: paymentPayload.amount,
      currency: BML_MERCHANT_DETAILS.currency,
      redirectUrl: paymentPayload.redirectUrl || `${BML_MERCHANT_DETAILS.domain}/payment-confirmation`,
      customerReference: paymentPayload.customerReference || "Booking Payment",
      merchantReference,
      merchantId: BML_MERCHANT_DETAILS.merchantId
    };

    console.log('Prepared BML request payload:', JSON.stringify(bmlRequestPayload));
    console.log('Using API key:', BML_API_KEY ? 'Present (hidden for security)' : 'Missing');
    console.log('Using Application ID:', BML_MERCHANT_DETAILS.applicationId);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30-second timeout

      const apiResponse = await fetch(BML_CONNECT_API.createPayment, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${BML_API_KEY}`,
          'X-Application-Id': BML_MERCHANT_DETAILS.applicationId
        },
        body: JSON.stringify(bmlRequestPayload),
        signal: controller.signal
      }).finally(() => clearTimeout(timeoutId));

      console.log('BML API Response Status:', apiResponse.status);

      if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        console.error('BML API error response:', errorText);
        
        return new Response(
          JSON.stringify({ 
            error: 'Payment creation failed', 
            details: errorText,
            status: apiResponse.status
          }),
          { 
            status: apiResponse.status, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      const bmlResponse = await apiResponse.json();
      console.log('BML API success response:', JSON.stringify(bmlResponse));

      // For testing purposes, if in a development environment, provide a mock QR code
      if (!bmlResponse.qrcode && Deno.env.get('ENVIRONMENT') === 'development') {
        bmlResponse.qrcode = {
          url: `${BML_MERCHANT_DETAILS.domain}/payment-confirmation?mock=true&transaction=${bmlResponse.id}`
        };
      }

      return new Response(
        JSON.stringify(bmlResponse),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );

    } catch (apiError) {
      console.error('Error calling BML API:', apiError);
      
      return new Response(
        JSON.stringify({ 
          error: 'Payment gateway communication error', 
          details: apiError.message 
        }),
        { 
          status: 502, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
  } catch (error) {
    console.error('Unexpected error in payment creation:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error', message: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}

// Verify BML payment transaction
async function verifyPayment(req: Request) {
  try {
    const { transactionId } = await req.json();
    
    if (!transactionId) {
      return new Response(
        JSON.stringify({ error: 'Transaction ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    console.log('Verifying payment transaction:', transactionId);
    
    // Check environment configuration
    const missingVars = checkEnvironmentConfig();
    
    if (missingVars.length > 0) {
      console.error(`Missing required environment variables for verification: ${missingVars.join(', ')}`);
      return new Response(
        JSON.stringify({ 
          error: 'Payment gateway not configured for verification',
          details: `Missing required environment variables: ${missingVars.join(', ')}`
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30-second timeout
      
      const apiResponse = await fetch(`${BML_CONNECT_API.verifyPayment}${transactionId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${BML_API_KEY}`,
          'X-Application-Id': BML_MERCHANT_DETAILS.applicationId
        },
        signal: controller.signal
      }).finally(() => clearTimeout(timeoutId));
      
      console.log('BML Verification API Response Status:', apiResponse.status);
      
      if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        console.error('BML API verification error:', errorText);
        
        return new Response(
          JSON.stringify({ 
            error: 'Payment verification failed', 
            details: errorText,
            status: 'FAILED' 
          }),
          { 
            status: apiResponse.status, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      
      const verificationResponse = await apiResponse.json();
      console.log('BML verification response:', JSON.stringify(verificationResponse));
      
      return new Response(
        JSON.stringify({
          status: verificationResponse.state || 'UNKNOWN',
          success: verificationResponse.state === 'CONFIRMED',
          details: verificationResponse
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
      
    } catch (apiError) {
      console.error('Error calling BML verification API:', apiError);
      
      return new Response(
        JSON.stringify({ 
          error: 'Payment verification communication error', 
          details: apiError.message,
          status: 'ERROR' 
        }),
        { 
          status: 502, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
  } catch (error) {
    console.error('Unexpected error in payment verification:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal verification error', 
        message: error.message,
        status: 'ERROR'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}

// Route handler for different endpoints
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  const url = new URL(req.url);
  
  console.log(`Processing request: ${req.method} ${url.pathname}`);
  
  if (url.pathname === '/bml-payment/create') {
    return createPayment(req);
  } else if (url.pathname === '/bml-payment/verify') {
    return verifyPayment(req);
  }
  
  return new Response(
    JSON.stringify({ error: 'Not Found' }),
    {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
});
