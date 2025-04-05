
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
    
    // Create a Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "https://fbgeiasbtjfpqfqmllde.supabase.co";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZiZ2VpYXNidGpmcHFmcW1sbGRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NTgyODYsImV4cCI6MjA1OTQzNDI4Nn0.tiZnJeHMWYSfQiR-jd9i9f3z31Bi4_d1XzXx9tDIXFA";
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Query the booking_otps table directly
    const { data, error } = await supabase
      .from('booking_otps')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('otp_code', code)
      .single();
    
    if (error || !data) {
      console.log("OTP validation failed:", error);
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
  } catch (error) {
    console.error("Error validating OTP:", error);
    
    return new Response(
      JSON.stringify({ 
        valid: false,
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
