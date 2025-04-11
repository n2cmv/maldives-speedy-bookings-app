
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import BookingsManager from "@/components/admin/BookingsManager";
import RoutesManager from "@/components/admin/RoutesManager";
import { Shield, BarChart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("bookings");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [bookingSummary, setBookingSummary] = useState({
    totalBookings: 0,
    ferryBookings: 0,
    activityBookings: 0
  });

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
        
        // Get booking statistics
        await fetchBookingSummary();
        
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

  const fetchBookingSummary = async () => {
    try {
      // Get total bookings
      const { count: totalCount, error: totalError } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true });
      
      // Get activity bookings
      const { count: activityCount, error: activityError } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('is_activity_booking', true);
      
      if (totalError || activityError) {
        throw new Error("Error fetching booking summary");
      }
      
      setBookingSummary({
        totalBookings: totalCount || 0,
        ferryBookings: (totalCount || 0) - (activityCount || 0),
        activityBookings: activityCount || 0
      });
    } catch (error) {
      console.error("Error fetching booking summary:", error);
    }
  };

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
        
        {/* Dashboard Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium text-gray-500">Total Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{bookingSummary.totalBookings}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium text-gray-500">Ferry Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{bookingSummary.ferryBookings}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium text-gray-500">Activity Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{bookingSummary.activityBookings}</div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="bookings">Bookings Management</TabsTrigger>
            <TabsTrigger value="routes">Routes Management</TabsTrigger>
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
          
          <TabsContent value="routes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Routes Management</CardTitle>
                <CardDescription>Add, edit, or remove ferry routes between locations</CardDescription>
              </CardHeader>
              <CardContent>
                <RoutesManager />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
