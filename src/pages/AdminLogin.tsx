
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, LogIn } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Check if already logged in as admin
    const checkAdminSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase
          .from('admin_users')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        
        if (data) {
          navigate("/admin");
        }
      }
    };
    
    checkAdminSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Attempting login with:", { email: username, password });
      
      // Step 1: Sign in with username as the email and password
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: username,
        password
      });

      if (authError) {
        console.error("Auth error:", authError);
        throw authError;
      }

      if (!authData.user || !authData.session) {
        console.error("No user or session returned");
        throw new Error("Authentication failed");
      }

      console.log("Auth successful, checking if admin");
      
      // Step 2: Check if the user is in the admin_users table
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', authData.user.id)
        .single();

      if (adminError || !adminData) {
        console.error("Admin check failed:", adminError || "No admin data");
        // Sign out if not an admin
        await supabase.auth.signOut();
        throw new Error("Not authorized as admin");
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
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username"
                placeholder="retouradmin"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
