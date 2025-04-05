
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role key (using environment variables)
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Use the manually created user ID
    const userId = "a8848e6f-0cf5-4e0c-a26b-b16309b07219";

    // Check if user already exists in admin_users table
    const { data: existingAdminUser } = await supabaseAdmin
      .from("admin_users")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!existingAdminUser) {
      // Add the user to admin_users table
      const { error: adminTableError } = await supabaseAdmin
        .from("admin_users")
        .insert({ user_id: userId });

      if (adminTableError) {
        throw adminTableError;
      }
      
      console.log("Added user to admin_users table");
    } else {
      console.log("User already exists in admin_users table");
    }

    return new Response(
      JSON.stringify({ success: true, message: "Admin user configured successfully" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error setting up admin user:", error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
