
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
  appVersion: string;
}

// Real BML merchant details
const BML_MERCHANT_DETAILS = {
  applicationId: "b83c8c6b-12bc-4b2e-8640-5d9e66786adc",
  publicKey: "pk_production_ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmpJam9pTmpKbFlqTmtOV0kyTnpVNU1tSXdNREE1Wm1SbU1UQXhJaXdpYUNJNkltaDBkSEJ6T2k4dmJXRnNaR2wyWlhNdGMzQmxaV1I1TFdKdmIydHBibWR6TFdGd2NDNXNiM1poWW14bExtRndjQzhpTENKaElqb2lZamd6WXpoak5tSXRNVEppWXkwMFlqSmxMVGcyTkRBdE5XUTVaVFkyTnpnMllXUmpJaXdpZFhFaU9pSXpNREE1WWpSak9TMHhaV001TFRRMVlqa3RPRFprT0MxbU5qY3pZelptTlRFeFlqTWlMQ0pwWVhRaU9qRTNORFF6T0RNNU16WXNJbVY0Y0NJNk5Ea3dNREExTnpVek5uMC5LdFJJQ0pVb0VQaHY1clM4YWFoOG53U3k5WE92NHRNb1hIb0RrNzdqNlVz",
  domain: "https://maldives-speedy-bookings-app.lovable.app/"
};

// BML API endpoints
const BML_CONNECT_API = {
  createPayment: "https://api.merchant.bankofmaldives.com.mv/payments",
  verifyPayment: "https://api.merchant.bankofmaldives.com.mv/payments/" // + transactionId
};

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
      appVersion 
    } = await req.json() as BmlPaymentRequest;
    
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
    
    // Generate a unique transaction ID
    const localId = crypto.randomUUID();
    
    // Prepare request payload for BML API
    const bmlPayload = {
      amount: amount,
      currency: currency,
      redirectUrl: redirectUrl || `${BML_MERCHANT_DETAILS.domain}confirmation?transaction=`,
      customerReference: customerReference || "Booking Payment",
      merchantReference: paymentReference || `RTM-${Math.floor(Math.random() * 10000)}`
    };
    
    console.log('Creating payment with BML Connect:', JSON.stringify(bmlPayload));
    
    // Call BML API to create payment with better error handling
    try {
      const response = await fetch(BML_CONNECT_API.createPayment, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'X-Application-Id': BML_MERCHANT_DETAILS.applicationId
        },
        body: JSON.stringify(bmlPayload)
      });
      
      // Log response status and headers for debugging
      console.log('BML API Response Status:', response.status);
      console.log('BML API Response Status Text:', response.statusText);
      
      const bmlResponse = await response.json();
      
      if (!response.ok) {
        console.error('BML API error:', bmlResponse);
        return new Response(
          JSON.stringify({ error: 'Payment creation failed', details: bmlResponse }),
          {
            status: response.status,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
      
      // Store transaction details in Supabase
      const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      const { error } = await supabase
        .from('bml_transactions')
        .insert({
          transaction_id: bmlResponse.id,
          local_id: localId,
          customer_reference: customerReference || "Booking Payment",
          booking_reference: paymentReference,
          amount,
          currency,
          provider,
          state: bmlResponse.state
        });
        
      if (error) {
        console.error('Error storing transaction:', error);
        // Continue even if database storage fails
      }
      
      return new Response(
        JSON.stringify({
          id: bmlResponse.id,
          state: bmlResponse.state,
          created: bmlResponse.created,
          amount,
          currency,
          qrcode: bmlResponse.qrcode
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    } catch (apiError) {
      console.error('Error calling BML API:', apiError);
      return new Response(
        JSON.stringify({ 
          error: 'Payment gateway error', 
          message: apiError.message,
          tip: 'This may be due to network issues or API key configuration'
        }),
        {
          status: 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
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
    
    console.log('Verifying payment with transaction ID:', transactionId);
    
    // Connect to BML API to verify payment status
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
      
      // Connect to Supabase to update and retrieve the transaction
      const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // First, get the transaction
      const { data: transaction, error: fetchError } = await supabase
        .from('bml_transactions')
        .select('*')
        .eq('transaction_id', transactionId)
        .single();
        
      if (fetchError || !transaction) {
        console.error('Error fetching transaction:', fetchError);
        // Continue even if transaction not found
      }
      
      // Update status based on the BML API response
      if (transaction) {
        const { error: updateError } = await supabase
          .from('bml_transactions')
          .update({ state: bmlResponse.state })
          .eq('transaction_id', transactionId);
          
        if (updateError) {
          console.error('Error updating transaction:', updateError);
          // Continue even if update fails
        }
      }
      
      // Return success response with the transaction booking reference
      return new Response(
        JSON.stringify({
          state: bmlResponse.state,
          bookingReference: transaction?.booking_reference
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
