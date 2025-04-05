
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

    // Set up admin credentials
    const adminEmail = "retouradmin";
    const adminPassword = "Retouradmin7443777!!!";

    // Create admin user if it doesn't exist
    const { data: existingUser, error: findError } = await supabaseAdmin.auth.admin.listUsers();
    
    let userId;
    
    // Find if user exists
    const foundUser = existingUser?.users?.find(user => user.email === adminEmail);
    
    if (foundUser) {
      userId = foundUser.id;
      console.log("Admin user already exists");
    } else {
      // Create new admin user
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
      });

      if (createError) {
        throw createError;
      }

      userId = newUser.user.id;
      console.log("Created new admin user");
    }

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
