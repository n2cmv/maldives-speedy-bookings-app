
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
    
    // Create a Supabase client with the service role key for admin access
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceRole) {
      console.error("Missing Supabase environment variables");
      return new Response(
        JSON.stringify({ success: false, error: "Server configuration error" }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceRole);
    
    // Generate an OTP code
    const otpCode = generateOTP();
    console.log(`Generated OTP for ${email}: ${otpCode}`);
    
    // Store the OTP in Supabase with an expiry (30 minutes)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30); // OTP valid for 30 minutes
    
    try {
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
          JSON.stringify({ 
            success: false, 
            error: "Failed to generate verification code", 
            details: storeError.message 
          }),
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
            JSON.stringify({ 
              success: false, 
              error: "Failed to send verification code email",
              details: typeof emailResponse.error === 'object' ? JSON.stringify(emailResponse.error) : String(emailResponse.error)
            }),
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
          JSON.stringify({ 
            success: false, 
            error: "Failed to send verification code email",
            details: typeof emailError === 'object' ? JSON.stringify(emailError) : String(emailError)
          }),
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
    } catch (dbError) {
      console.error("Database error storing OTP:", dbError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Error processing your request", 
          details: typeof dbError === 'object' ? JSON.stringify(dbError) : String(dbError)
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
  } catch (error) {
    console.error("Error processing OTP request:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "An unexpected error occurred",
        details: typeof error === 'object' ? JSON.stringify(error) : String(error)
      }),
      { 
        status: 400, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
