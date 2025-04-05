
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Key } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { initializeAdminUser } from "@/services/adminService";

const AdminInit = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isInitializing, setIsInitializing] = useState<boolean>(false);

  const handleInitialize = async () => {
    setIsInitializing(true);
    try {
      const result = await initializeAdminUser();
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Admin user initialized successfully",
        });
        navigate("/admin/login");
      } else {
        throw new Error(result.error || "Failed to initialize admin user");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to initialize admin user",
        variant: "destructive",
      });
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 justify-center mb-4">
            <Shield className="h-8 w-8 text-ocean-dark" />
            <CardTitle className="text-2xl text-center">Initialize Admin</CardTitle>
          </div>
          <CardDescription className="text-center">
            Set up the admin user account for the dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
            <p className="text-sm text-amber-800">
              This will create the admin user account with the default credentials. 
              You can use this account to access the admin dashboard.
            </p>
            <p className="text-sm font-semibold mt-2 text-amber-800">
              Username: retouradmin
              <br />
              Password: Retouradmin7443777!!!
            </p>
          </div>
          
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => navigate("/")}
              disabled={isInitializing}
            >
              Return to Homepage
            </Button>
            <Button 
              onClick={handleInitialize}
              disabled={isInitializing}
              className="gap-2"
            >
              {isInitializing ? (
                <>
                  <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                  Initializing...
                </>
              ) : (
                <>
                  <Key className="h-4 w-4" />
                  Initialize Admin
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminInit;
