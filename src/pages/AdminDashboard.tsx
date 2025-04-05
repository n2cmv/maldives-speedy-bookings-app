
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import BookingsManager from "@/components/admin/BookingsManager";
import IslandsManager from "@/components/admin/IslandsManager";
import { Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("bookings");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAdminAccess = async () => {
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.log("No session found, redirecting to login");
          toast({
            title: "Authentication required",
            description: "Please log in to access the admin dashboard",
            variant: "destructive",
          });
          navigate("/admin/login");
          return;
        }
        
        // Check if the authenticated user is in admin_users table
        const { data, error } = await supabase
          .from('admin_users')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        
        if (error || !data) {
          console.error("Admin check failed:", error);
          toast({
            title: "Access denied",
            description: "You don't have admin privileges",
            variant: "destructive",
          });
          navigate("/admin/login");
          return;
        }
        
        console.log("Admin access verified");
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking admin access:", error);
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
        navigate("/admin/login");
      }
    };
    
    checkAdminAccess();
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-12 w-12 border-4 border-t-ocean border-opacity-50 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      <Header />
      
      <div className="container mx-auto pt-28 pb-12 px-4">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="h-8 w-8 text-ocean-dark" />
          <h1 className="text-3xl font-bold text-ocean-dark">Admin Dashboard</h1>
        </div>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="bookings">Bookings Management</TabsTrigger>
            <TabsTrigger value="islands">Islands Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Bookings Management</CardTitle>
                <CardDescription>View, edit, delete bookings and resend confirmation emails</CardDescription>
              </CardHeader>
              <CardContent>
                <BookingsManager />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="islands" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Islands Management</CardTitle>
                <CardDescription>Add, edit, or remove islands and their information</CardDescription>
              </CardHeader>
              <CardContent>
                <IslandsManager />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
