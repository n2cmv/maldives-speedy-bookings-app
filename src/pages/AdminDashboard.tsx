
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import BookingsManager from "@/components/admin/BookingsManager";
import IslandsManager from "@/components/admin/IslandsManager";
import { Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("bookings");

  React.useEffect(() => {
    const checkAdminAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/");
        return;
      }
      
      // In a real world scenario, you'd check for admin role
      // This is just a placeholder for demonstration
      const { data } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
      
      if (!data) {
        navigate("/");
      }
    };
    
    checkAdminAccess();
  }, [navigate]);

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
