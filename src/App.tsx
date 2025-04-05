
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Index from "./pages/Index";
import BookingForm from "./pages/BookingForm";
import PassengerDetails from "./pages/PassengerDetails";
import PaymentGateway from "./pages/PaymentGateway";
import Confirmation from "./pages/Confirmation";
import NotFound from "./pages/NotFound";

const App = () => {
  // Create a client instance inside the component to avoid React hook issues
  // This ensures the QueryClient is created within the React lifecycle
  const [queryClient] = useState(() => new QueryClient());
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/booking" element={<BookingForm />} />
            <Route path="/passenger-details" element={<PassengerDetails />} />
            <Route path="/payment" element={<PaymentGateway />} />
            <Route path="/confirmation" element={<Confirmation />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
