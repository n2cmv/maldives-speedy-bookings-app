
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Important headers for CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// BML Connect API Configuration
const BML_API_KEY = Deno.env.get('BML_API_KEY');
const BML_CLIENT_ID = Deno.env.get('BML_CLIENT_ID');
const BML_BASE_URL = Deno.env.get('BML_BASE_URL') || 'https://api.uat.merchants.bankofmaldives.com.mv/public'; // Using test URL by default

// Create Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Generate signature for BML API
function generateSignature(amount: number, currency: string, method = 'sha1'): string {
  // Import crypto modules based on the method
  if (method === 'sha1') {
    const encoder = new TextEncoder();
    const data = encoder.encode(`amount=${amount}&currency=${currency}&apiKey=${BML_API_KEY}`);
    
    // Use SubtleCrypto for SHA-1 hashing
    return crypto.subtle.digest('SHA-1', data)
      .then(hashBuffer => {
        // Convert hash to hex string
        return Array.from(new Uint8Array(hashBuffer))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
      });
  } else if (method === 'md5') {
    // For MD5, we would need a different approach as it's not directly supported in SubtleCrypto
    // This would require additional libraries or different implementation
    throw new Error('MD5 signature method not implemented');
  } else {
    throw new Error(`Unsupported signature method: ${method}`);
  }
}

// Create a transaction with BML Connect
async function createTransaction(data: any) {
  try {
    // Generate signature asynchronously
    const signature = await generateSignature(data.amount, data.currency, data.signMethod || 'sha1');
    
    // Prepare the payload for BML Connect API
    const payload = {
      localId: data.localId || crypto.randomUUID(),
      customerReference: data.customerReference || `Booking ${new Date().toISOString()}`,
      signature,
      amount: data.amount,
      currency: data.currency || 'MVR',
      provider: data.provider || 'bml_epos',
      appVersion: data.appVersion || '1.0',
      apiVersion: '2.0',
      deviceId: BML_CLIENT_ID,
      signMethod: data.signMethod || 'sha1',
      redirectUrl: data.redirectUrl
    };

    // Make the API request to BML Connect
    const response = await fetch(`${BML_BASE_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Authorization': `${BML_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('BML Connect API error:', errorData);
      throw new Error(`BML Connect API error: ${errorData.message || response.statusText}`);
    }

    const transaction = await response.json();
    
    // Store transaction in Supabase for reference
    const { data: savedTransaction, error } = await supabase
      .from('bml_transactions')
      .insert([{
        transaction_id: transaction.id,
        local_id: payload.localId,
        customer_reference: payload.customerReference,
        booking_reference: data.paymentReference,
        amount: data.amount,
        currency: data.currency,
        provider: payload.provider,
        state: transaction.state,
        created_at: new Date().toISOString()
      }]);

    if (error) {
      console.error('Error saving transaction to database:', error);
    }

    return transaction;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
}

// Get transaction details from BML Connect
async function getTransaction(transactionId: string) {
  try {
    const response = await fetch(`${BML_BASE_URL}/transactions/${transactionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `${BML_API_KEY}`,
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('BML Connect API error:', errorData);
      throw new Error(`BML Connect API error: ${errorData.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching transaction:', error);
    throw error;
  }
}

// Verify transaction status and update booking
async function verifyTransaction(transactionId: string) {
  try {
    // Get transaction details from BML Connect
    const transaction = await getTransaction(transactionId);
    
    // Find the corresponding local transaction in our database
    const { data: localTransaction, error } = await supabase
      .from('bml_transactions')
      .select('*')
      .eq('transaction_id', transactionId)
      .single();

    if (error) {
      console.error('Error finding local transaction:', error);
      throw error;
    }

    // Update the transaction status in our database
    const { error: updateError } = await supabase
      .from('bml_transactions')
      .update({ state: transaction.state })
      .eq('transaction_id', transactionId);

    if (updateError) {
      console.error('Error updating transaction status:', updateError);
    }

    // If the transaction is confirmed, update the booking status
    if (transaction.state === 'CONFIRMED' && localTransaction.booking_reference) {
      const { error: bookingError } = await supabase
        .from('bookings')
        .update({ 
          payment_complete: true,
          payment_method: 'BML Connect',
          payment_reference: localTransaction.booking_reference || transaction.id
        })
        .eq('payment_reference', localTransaction.booking_reference);

      if (bookingError) {
        console.error('Error updating booking status:', bookingError);
        throw bookingError;
      }
    }

    return { 
      transactionId, 
      state: transaction.state, 
      bookingReference: localTransaction.booking_reference 
    };
  } catch (error) {
    console.error('Error verifying transaction:', error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();

    // Create new transaction
    if (req.method === 'POST' && path === 'create') {
      const requestData = await req.json();
      const transaction = await createTransaction(requestData);
      return new Response(JSON.stringify(transaction), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }
    
    // Verify transaction status
    else if (req.method === 'GET' && path === 'verify') {
      const transactionId = url.searchParams.get('id');
      if (!transactionId) {
        return new Response(JSON.stringify({ error: 'Transaction ID is required' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        });
      }
      
      const result = await verifyTransaction(transactionId);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }
    
    // Webhook handler for BML Connect callbacks
    else if (req.method === 'POST' && path === 'webhook') {
      const webhookData = await req.json();
      
      // Update transaction in database
      const { error } = await supabase
        .from('bml_transactions')
        .update({ state: webhookData.state })
        .eq('transaction_id', webhookData.transactionId);
      
      if (error) {
        console.error('Error updating transaction from webhook:', error);
      }
      
      // Find the booking reference associated with this transaction
      const { data: transaction } = await supabase
        .from('bml_transactions')
        .select('booking_reference')
        .eq('transaction_id', webhookData.transactionId)
        .single();
      
      // If the transaction is confirmed, update the booking
      if (webhookData.state === 'CONFIRMED' && transaction?.booking_reference) {
        const { error: bookingError } = await supabase
          .from('bookings')
          .update({ 
            payment_complete: true,
            payment_method: 'BML Connect'
          })
          .eq('payment_reference', transaction.booking_reference);
        
        if (bookingError) {
          console.error('Error updating booking from webhook:', bookingError);
        }
      }
      
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }
    
    // Default response for unhandled routes
    return new Response(JSON.stringify({ error: 'Not found' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 404,
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
