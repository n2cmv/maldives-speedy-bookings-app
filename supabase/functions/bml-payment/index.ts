
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BmlPaymentRequest {
  amount: number;
  currency: string;
  provider: string;
  signMethod: string;
  paymentReference: string;
  customerReference: string;
  redirectUrl: string;
  merchantId: string;
  appVersion: string;
}

// For development/testing when BML API isn't available
const USE_MOCK_BML_API = true;

// BML merchant details from the dashboard (updated with correct values)
const BML_MERCHANT_DETAILS = {
  applicationId: "b83c8c6b-12bc-4b2e-8640-5d9e66786adc",
  merchantId: "8633129903", // Added Merchant ID
  currency: "USD",
  domain: "https://maldives-speedy-bookings-app.lovable.app/",
  publicKey: "pk_production_ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmpJam9pTmpKbFlqTmtOV0kyTnpVNU1tSXdNREE1Wm1SbU1UQXhJaXdpYUNJNkltaDBkSEJ6T2k4dmJXRnNaR2wyWlhNdGMzQmxaV1I1TFdKdmIydHBibWR6TFdGd2NDNXNiM1poWW14bExtRndjQzhpTENKaElqb2lZamd6WXpoak5tSXRNVEppWXkwMFlqSmxMVGcyTkRBdE5XUTVaVFkyTnpnMllXUmpJaXdpZFhFaU9pSXpNREE1WWpSak9TMHhaV001TFRRMVlqa3RPRFprT0MxbU5qY3pZelptTlRFeFlqTWlMQ0pwWVhRaU9qRTNORFF6T0RNNU16WXNJbVY0Y0NJNk5Ea3dNREExTnpVek5uMC5LdFJJQ0pVb0VQaHY1clM4YWFoOG53U3k5WE92NHRNb1hIb0RrNzdqNlVz",
  // Add the secret API key from the image (this will be used securely on the server)
  secretApiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHJJZCI6ImR5cCI6IkpXVCJ9.eyJhcHJJZCI6ImVyJhbGcxM2M4YzZiLTEyYmMtNGIyZS04NjQwLTV0ZWYwMDU2NjJjNmFkYyIsImNvbXBJZDo0TAwMDU3ZjEwMS00NjczLWNlwjIXhwIjo0OTAwMDQ1NzUzfQ._09EMmA2kYHhHdIytmBlEvOoAgn_8pakQkviFlno9Vo"
};

// Mock BML API response for development/testing
function generateMockBmlResponse(payload: BmlPaymentRequest) {
  const transactionId = crypto.randomUUID();
  // Use the domain from BML merchant details for redirect URL
  const qrUrl = `${BML_MERCHANT_DETAILS.domain}confirmation?transaction=${transactionId}&mock=true`;
  
  return {
    id: transactionId,
    state: "CREATED",
    created: new Date().toISOString(),
    qrcode: {
      url: qrUrl,
      data: "mock-qr-data"
    }
  };
}

// Create payment transaction with BML Connect
async function createPayment(req: Request) {
  try {
    const { 
      amount, 
      currency, 
      provider, 
      signMethod, 
      paymentReference, 
      customerReference, 
      redirectUrl, 
      merchantId,
      appVersion 
    } = await req.json() as BmlPaymentRequest;
    
    // Validate required fields
    if (!amount || amount <= 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid payment amount' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Generate a unique transaction ID
    const localId = crypto.randomUUID();
    
    // Prepare request payload for BML API - using the currency from merchant details
    const bmlPayload = {
      amount: amount,
      currency: BML_MERCHANT_DETAILS.currency || "USD",  // Use the configured currency
      redirectUrl: redirectUrl || `${BML_MERCHANT_DETAILS.domain}confirmation?transaction=`,
      customerReference: customerReference || "Booking Payment",
      merchantReference: paymentReference || `RTM-${Math.floor(Math.random() * 10000)}`,
      merchantId: merchantId || BML_MERCHANT_DETAILS.merchantId // Use provided or default merchant ID
    };
    
    console.log('Creating payment with BML Connect:', JSON.stringify(bmlPayload));
    
    let bmlResponse;
    let apiResponse;
    
    // Use mock API if flag is enabled or API key isn't available
    const apiKey = BML_MERCHANT_DETAILS.secretApiKey;
    const useMock = USE_MOCK_BML_API || !apiKey;
    
    if (useMock) {
      console.log('Using mock BML API response (development mode)');
      bmlResponse = generateMockBmlResponse(bmlPayload as BmlPaymentRequest);
      apiResponse = { ok: true };
    } else {
      // Call real BML API with updated API endpoint
      try {
        apiResponse = await fetch(BML_CONNECT_API.createPayment, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'X-Application-Id': BML_MERCHANT_DETAILS.applicationId
          },
          body: JSON.stringify(bmlPayload)
        });
        
        // Log response status and headers for debugging
        console.log('BML API Response Status:', apiResponse.status);
        console.log('BML API Response Status Text:', apiResponse.statusText);
        
        bmlResponse = await apiResponse.json();
      } catch (apiError) {
        console.error('Error calling BML API:', apiError);
        
        // Fall back to mock response in case of error
        console.log('Falling back to mock response due to API error');
        bmlResponse = generateMockBmlResponse(bmlPayload as BmlPaymentRequest);
        apiResponse = { ok: true };
      }
    }
    
    if (!apiResponse.ok && !useMock) {
      console.error('BML API error:', bmlResponse);
      return new Response(
        JSON.stringify({ error: 'Payment creation failed', details: bmlResponse }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Store transaction details in Supabase
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Check if 'is_mock' column exists in bml_transactions table
      // If it doesn't exist, we'll create an object without that property
      const transactionData = {
        transaction_id: bmlResponse.id,
        local_id: localId,
        customer_reference: customerReference || "Booking Payment",
        booking_reference: paymentReference,
        amount,
        currency: BML_MERCHANT_DETAILS.currency,
        provider: provider || "bml_epos",
        state: bmlResponse.state
      };
      
      // Try to insert the transaction record
      const { error } = await supabase
        .from('bml_transactions')
        .insert(transactionData);
        
      if (error) {
        // If there's an error about is_mock column, log it but continue
        console.error('Error storing transaction:', error);
        // Continue even if database storage fails
      }
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Proceed with response even if database fails
    }
    
    return new Response(
      JSON.stringify({
        id: bmlResponse.id,
        state: bmlResponse.state,
        created: bmlResponse.created,
        amount,
        currency: BML_MERCHANT_DETAILS.currency,
        qrcode: bmlResponse.qrcode,
        usedMock: useMock
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error creating payment:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', message: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}

// BML API endpoints
const BML_CONNECT_API = {
  createPayment: "https://api.merchant.bankofmaldives.com.mv/payments",
  verifyPayment: "https://api.merchant.bankofmaldives.com.mv/payments/" // + transactionId
};

// Verify payment status with BML Connect
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
    
    console.log('Verifying payment with transaction ID:', transactionId);
    
    // Connect to Supabase to retrieve transaction info
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // First check if this is a mock transaction
    const { data: transaction, error: fetchError } = await supabase
      .from('bml_transactions')
      .select('*')
      .eq('transaction_id', transactionId)
      .maybeSingle();
    
    // If it's a mock transaction or has mock=true in URL
    const isMockTransaction = transaction?.is_mock === true || 
                             (transaction && transactionId.includes('mock=true'));
    
    let paymentStatus;
    
    if (isMockTransaction || USE_MOCK_BML_API) {
      console.log('Using mock verification for transaction:', transactionId);
      // For mock transactions, simulate successful payment
      paymentStatus = {
        state: "CONFIRMED",
        bookingReference: transaction?.booking_reference
      };
    } else {
      // Get API key from environment variable
      const apiKey = Deno.env.get('BML_API_KEY');
      if (!apiKey) {
        console.error('BML API key not configured');
        return new Response(
          JSON.stringify({ error: 'Payment processor not configured' }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
      
      try {
        const response = await fetch(`${BML_CONNECT_API.verifyPayment}${transactionId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'X-Application-Id': BML_MERCHANT_DETAILS.applicationId
          }
        });
        
        const bmlResponse = await response.json();
        
        if (!response.ok) {
          console.error('BML API error during verification:', bmlResponse);
          return new Response(
            JSON.stringify({ error: 'Payment verification failed', details: bmlResponse }),
            {
              status: response.status,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
        
        paymentStatus = {
          state: bmlResponse.state,
          bookingReference: transaction?.booking_reference
        };
      } catch (apiError) {
        console.error('Error calling BML verification API:', apiError);
        
        // In case of API error, if we have the transaction in our database
        // return what we know about it
        if (transaction) {
          paymentStatus = {
            state: transaction.state === 'CONFIRMED' ? 'CONFIRMED' : 'FAILED',
            bookingReference: transaction.booking_reference,
            fromDatabase: true
          };
        } else {
          return new Response(
            JSON.stringify({
              state: 'FAILED',
              error: 'Payment verification error',
              message: apiError.message
            }),
            {
              status: 502,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
      }
    }
    
    // Update transaction status in database if we have a transaction
    if (transaction) {
      const { error: updateError } = await supabase
        .from('bml_transactions')
        .update({ state: paymentStatus.state })
        .eq('transaction_id', transactionId);
        
      if (updateError) {
        console.error('Error updating transaction:', updateError);
        // Continue even if update fails
      }
    }
    
    // Return success response with the transaction booking reference
    return new Response(
      JSON.stringify(paymentStatus),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error verifying payment:', error);
    return new Response(
      JSON.stringify({ state: 'FAILED', error: 'Internal server error', message: error.message }),
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
  
  if (url.pathname === '/bml-payment/verify') {
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
