
import React from "react";
import { Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const AdminLogin = () => {
  const { isLoading, authError, loginAdmin } = useAdminAuth();
  
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
          <AdminLoginForm 
            defaultEmail="natteynattson@gmail.com"
            onSubmit={loginAdmin}
            isLoading={isLoading}
            authError={authError}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
