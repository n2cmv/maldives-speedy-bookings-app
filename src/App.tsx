
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { ThemeProvider } from "@/components/ui/use-theme";

// Import pages
import Index from "./pages/Index";
import BookingForm from "./pages/BookingForm";
import PassengerDetails from "./pages/PassengerDetails";
import PaymentGateway from "./pages/PaymentGateway";
import Confirmation from "./pages/Confirmation";
import NotFound from "./pages/NotFound";
import MyBookings from "./pages/MyBookings";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";

// Import local storage service
import { saveBookingToLocalStorage } from "./services/bookingStorage";
import { BookingInfo } from "./types/booking";

const App = () => {
  // Create a client instance inside the component to avoid React hook issues
  const [queryClient] = useState(() => new QueryClient());
  
  // Set up listener to save booking info to local storage when navigation happens
  useEffect(() => {
    const handleBeforeUnload = () => {
      const bookingInfoString = sessionStorage.getItem("currentBooking");
      if (bookingInfoString) {
        const booking = JSON.parse(bookingInfoString) as BookingInfo;
        saveBookingToLocalStorage(booking);
      }
    };
    
    window.addEventListener("beforeunload", handleBeforeUnload);
    
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  
  return (
    <ThemeProvider defaultTheme="system">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster position="top-center" richColors closeButton />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/booking" element={<BookingForm />} />
              <Route path="/passenger-details" element={<PassengerDetails />} />
              <Route path="/payment" element={<PaymentGateway />} />
              <Route path="/confirmation" element={<Confirmation />} />
              <Route path="/my-bookings" element={<MyBookings />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
