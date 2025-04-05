
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Generate a random 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // For actual requests
  try {
    const { email } = await req.json();
    if (!email) {
      return new Response(
        JSON.stringify({ success: false, error: "Email is required" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Log the action
    console.log(`Processing OTP verification request for: ${email}`);
    
    // Create a Supabase client with the URL and anon key from environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "https://fbgeiasbtjfpqfqmllde.supabase.co";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZiZ2VpYXNidGpmcHFmcW1sbGRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NTgyODYsImV4cCI6MjA1OTQzNDI4Nn0.tiZnJeHMWYSfQiR-jd9i9f3z31Bi4_d1XzXx9tDIXFA";
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Generate an OTP code
    const otpCode = generateOTP();
    console.log(`Generated OTP for ${email}: ${otpCode}`);
    
    // Store the OTP in Supabase with an expiry (30 minutes)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30); // OTP valid for 30 minutes
    
    // Insert or update OTP record for this email
    const { error: storeError } = await supabase
      .from('booking_otps')
      .upsert([
        {
          email: email.toLowerCase(),
          otp_code: otpCode,
          expires_at: expiresAt.toISOString(),
        }
      ], { onConflict: 'email' });
    
    if (storeError) {
      console.error("Error storing OTP:", storeError);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to generate verification code" }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    // Send email with OTP using the send-confirmation function
    try {
      const emailResponse = await supabase.functions.invoke("send-confirmation", {
        body: {
          email: email,
          name: "Customer",
          bookingDetails: {
            otpCode: otpCode,
            isOtpEmail: true
          }
        }
      });
      
      if (emailResponse.error) {
        console.error("Error sending OTP email:", emailResponse.error);
        return new Response(
          JSON.stringify({ success: false, error: "Failed to send verification code email" }),
          { 
            status: 500, 
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }
      
      console.log("OTP email sent successfully");
    } catch (emailError) {
      console.error("Exception sending OTP email:", emailError);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to send verification code email" }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Verification code sent to your email" 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Error processing OTP request:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 400, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
