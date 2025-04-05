
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // For actual requests
  try {
    const { email, code } = await req.json();
    
    if (!email || !code) {
      console.error("Missing required parameters:", { email, code });
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: "Email and verification code are required" 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Log the action
    console.log(`Validating OTP for: ${email}, code: ${code}`);
    
    // Create a Supabase client with service role key for admin access
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceRole) {
      console.error("Missing Supabase environment variables");
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: "Server configuration error" 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceRole);
    
    try {
      console.log("Querying booking_otps table for:", email.toLowerCase(), code);
      
      // Query the booking_otps table directly
      const { data, error } = await supabase
        .from('booking_otps')
        .select('*')
        .eq('email', email.toLowerCase())
        .eq('otp_code', code)
        .maybeSingle();
      
      if (error) {
        console.error("OTP validation query error:", error);
        return new Response(
          JSON.stringify({ 
            valid: false, 
            error: "Failed to validate code", 
            details: error.message 
          }),
          { 
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }
      
      if (!data) {
        console.log("No OTP record found");
        return new Response(
          JSON.stringify({ valid: false, error: "Invalid verification code" }),
          { 
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }
      
      // Check if OTP has expired
      const now = new Date();
      const expiresAt = new Date(data.expires_at);
      
      if (expiresAt < now) {
        console.log("OTP expired");
        return new Response(
          JSON.stringify({ valid: false, error: "Verification code has expired" }),
          { 
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }
      
      console.log("OTP validated successfully");
      return new Response(
        JSON.stringify({ valid: true }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    } catch (dbError) {
      console.error("Database error validating OTP:", dbError);
      const errorMessage = typeof dbError === 'object' && dbError !== null ? 
        (dbError.message || JSON.stringify(dbError)) : 
        String(dbError);
        
      return new Response(
        JSON.stringify({ 
          valid: false,
          error: "Error validating code, please try again",
          details: errorMessage
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
  } catch (error) {
    console.error("Error validating OTP:", error);
    const errorMessage = typeof error === 'object' && error !== null ? 
      (error.message || JSON.stringify(error)) : 
      String(error);
      
    return new Response(
      JSON.stringify({ 
        valid: false,
        error: "An unexpected error occurred",
        details: errorMessage
      }),
      {
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
