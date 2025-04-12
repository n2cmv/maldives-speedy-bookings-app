
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

// Create payment transaction with BML Connect
async function createPayment(req: Request) {
  try {
    const { amount, currency, provider, signMethod, paymentReference, customerReference, redirectUrl, appVersion } = 
      await req.json() as BmlPaymentRequest;
    
    // For demo purposes, generate a mock BML payment URL
    // In production, you would call the actual BML API with your API key
    const transactionId = crypto.randomUUID().replace(/-/g, '');
    
    // Create a signature (in production, this would use the actual algorithm from BML)
    const signature = await createMockSignature(amount, currency);
    
    // Store transaction details in Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { error } = await supabase
      .from('bml_transactions')
      .insert({
        transaction_id: transactionId,
        local_id: crypto.randomUUID(),
        customer_reference: customerReference,
        booking_reference: paymentReference,
        amount,
        currency,
        provider,
        state: 'QR_CODE_GENERATED'
      });
      
    if (error) {
      console.error('Error storing transaction:', error);
      return new Response(JSON.stringify({ 
        error: 'Failed to create payment' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Generate mock QR code URL - in production this would come from BML
    const qrCodeUrl = `https://example.com/qr/${transactionId}`;
    
    // In a real implementation, this would be the actual response from the BML API
    return new Response(
      JSON.stringify({
        id: transactionId,
        state: 'QR_CODE_GENERATED',
        created: new Date().toISOString(),
        amount,
        currency,
        qrcode: {
          url: qrCodeUrl
        }
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error creating payment:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
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
    
    // In a real implementation, we would call the BML API to verify the transaction status
    // For this demo, we'll simulate a successful payment
    
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
      return new Response(
        JSON.stringify({ state: 'FAILED', error: 'Transaction not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Update status to CONFIRMED - in a real app, this would be based on the actual status
    const { error: updateError } = await supabase
      .from('bml_transactions')
      .update({ state: 'CONFIRMED' })
      .eq('transaction_id', transactionId);
      
    if (updateError) {
      console.error('Error updating transaction:', updateError);
      return new Response(
        JSON.stringify({ state: 'FAILED', error: 'Could not update transaction' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Return success response with the transaction booking reference
    return new Response(
      JSON.stringify({
        state: 'CONFIRMED',
        bookingReference: transaction.booking_reference
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error verifying payment:', error);
    return new Response(
      JSON.stringify({ state: 'FAILED', error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}

// Mock helper function to create signatures
async function createMockSignature(amount: number, currency: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`amount=${amount}&currency=${currency}`);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  
  // Convert to base64
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
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
