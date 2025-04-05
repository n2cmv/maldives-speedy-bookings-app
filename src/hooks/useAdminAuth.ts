
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { initializeAdminUser } from "@/services/adminService";

export const useAdminAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Check if already logged in as admin
    const checkAdminSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          // Try to initialize admin user
          await initializeAdminUser();
          
          // Check if user is in admin_users table
          const { data } = await supabase
            .from('admin_users')
            .select('*')
            .eq('user_id', session.user.id)
            .maybeSingle();
            
          if (data) {
            // Force navigation to admin dashboard
            window.location.href = "/admin";
          }
        }
      } catch (error) {
        console.error("Error checking admin session:", error);
      }
    };
    
    checkAdminSession();
  }, [navigate]);

  const loginAdmin = async (email: string, password: string) => {
    setIsLoading(true);
    setAuthError(null);

    try {
      // Step 1: Sign in with email and password
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        console.error("Auth error:", authError);
        setAuthError(authError.message);
        throw authError;
      }

      if (!authData.user || !authData.session) {
        const errorMsg = "No user or session returned";
        console.error(errorMsg);
        setAuthError(errorMsg);
        throw new Error(errorMsg);
      }

      console.log("Auth successful, checking if admin");
      
      // Step 2: Initialize admin user (which will add them to admin_users if not already there)
      const { success, error } = await initializeAdminUser();
      
      if (!success) {
        console.error("Admin initialization failed:", error);
        setAuthError(error || "Not authorized as admin");
        // Sign out if admin initialization fails
        await supabase.auth.signOut();
        throw new Error(error || "Not authorized as admin");
      }

      // Success - redirect to admin dashboard
      console.log("Admin check passed, redirecting to dashboard");
      toast({
        title: "Login successful",
        description: "Welcome to the admin dashboard",
      });
      
      // Use window.location.href instead of navigate for a full page refresh
      window.location.href = "/admin";
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error.message || "Could not authenticate",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    authError,
    loginAdmin
  };
};
