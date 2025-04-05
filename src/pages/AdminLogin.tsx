
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, LogIn } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { initializeAdminUser } from "@/services/adminService";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState<string>("natteynattson@gmail.com");
  const [password, setPassword] = useState<string>("");
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
            navigate("/admin");
          }
        }
      } catch (error) {
        console.error("Error checking admin session:", error);
      }
    };
    
    checkAdminSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
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
      navigate("/admin");
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 justify-center mb-4">
            <Shield className="h-8 w-8 text-ocean-dark" />
            <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
          </div>
          <CardDescription className="text-center">
            Enter your credentials to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          {authError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
              {authError}
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                placeholder="Enter your email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                  Logging in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Login
                </span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
