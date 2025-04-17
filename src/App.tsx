import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { scrollToTopWithoutRouter } from "@/hooks/use-scroll-top";

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
import BookingLookup from "./pages/BookingLookup";
import Activities from "./pages/Activities";
import BmlPaymentHandler from "./components/payment/BmlPaymentHandler";

// Import Islands pages
import Islands from "./pages/Islands";
import IslandDetailsPage from "./pages/Islands/IslandDetailsPage";

// Import i18n configuration
import "./i18n/i18n";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n/i18n";

// Import language context
import { LanguageProvider } from "./contexts/LanguageContext";

// Import local storage service
import { saveBookingToLocalStorage } from "./services/bookingStorage";
import { BookingInfo } from "./types/booking";

const App = () => {
  // Create a client instance inside the component to avoid React hook issues
  const [queryClient] = useState(() => new QueryClient());
  
  // Initial scroll to top on app load without using Router hooks
  useEffect(() => {
    scrollToTopWithoutRouter();
  }, []);
  
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
    <I18nextProvider i18n={i18n}>
      <LanguageProvider>
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
                <Route path="/confirmation/:reference" element={<Confirmation />} />
                <Route path="/my-bookings" element={<MyBookings />} />
                <Route path="/booking-lookup" element={<BookingLookup />} />
                <Route path="/activities" element={<Activities />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/payment-confirmation" element={<BmlPaymentHandler />} />
                
                {/* Islands routes */}
                <Route path="/islands" element={<Islands />} />
                <Route path="/islands/:slug" element={<IslandDetailsPage />} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </LanguageProvider>
    </I18nextProvider>
  );
};

export default App;
