
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// BML merchant details from the dashboard
const BML_MERCHANT_DETAILS = {
  applicationId: Deno.env.get('BML_APPLICATION_ID'),
  merchantId: Deno.env.get('BML_MERCHANT_ID'),
  currency: "USD",
  domain: "https://visitdhigurah.com", // Use the provided website URL
  publicKey: Deno.env.get('BML_PUBLIC_KEY')
};

// Add the secret API key from the environment
const BML_API_KEY = Deno.env.get('BML_API_KEY');

// BML API endpoints with improved error handling
const BML_CONNECT_API = {
  createPayment: "https://api.merchant.bankofmaldives.com.mv/payments",
  verifyPayment: "https://api.merchant.bankofmaldives.com.mv/payments/"
};

// Create payment transaction with BML Connect
async function createPayment(req: Request) {
  try {
    // Validate API key and application ID are present
    if (!BML_API_KEY || !BML_MERCHANT_DETAILS.applicationId) {
      console.error('Missing BML API configuration');
      return new Response(
        JSON.stringify({ error: 'Payment gateway not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const paymentPayload = await req.json();
    
    console.log('Received payment payload:', JSON.stringify(paymentPayload));

    const bmlRequestPayload = {
      amount: paymentPayload.amount,
      currency: BML_MERCHANT_DETAILS.currency,
      redirectUrl: paymentPayload.redirectUrl || `${BML_MERCHANT_DETAILS.domain}/payment-confirmation`,
      customerReference: paymentPayload.customerReference || "Booking Payment",
      merchantReference: paymentPayload.paymentReference || `RTM-${Math.floor(Math.random() * 10000)}`,
      merchantId: BML_MERCHANT_DETAILS.merchantId
    };

    console.log('Prepared BML request payload:', JSON.stringify(bmlRequestPayload));

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout

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
            details: errorText 
          }),
          { 
            status: apiResponse.status, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      const bmlResponse = await apiResponse.json();
      console.log('BML API success response:', JSON.stringify(bmlResponse));

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

// Route handler for different endpoints
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  const url = new URL(req.url);
  
  if (url.pathname === '/bml-payment/create') {
    return createPayment(req);
  }
  
  return new Response(
    JSON.stringify({ error: 'Not Found' }),
    {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
});

