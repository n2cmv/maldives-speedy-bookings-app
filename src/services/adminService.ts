
import { supabase } from "@/integrations/supabase/client";

// Function to initialize the admin user
export const initializeAdminUser = async () => {
  try {
    // Call the Supabase Edge Function that creates the admin user
    const { data, error } = await supabase.functions.invoke(
      "create-admin-user",
      {
        method: "POST",
      }
    );

    if (error) {
      console.error("Error initializing admin user:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Error calling admin initialization:", err);
    return { success: false, error: err.message };
  }
};
