
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import WelcomeSection from '@/components/WelcomeSection';
import BookingForm from '@/pages/BookingForm';
import Islands from '@/pages/Islands/index';
import IslandDetailsPage from '@/pages/Islands/IslandDetails';
import Activities from '@/pages/Activities';
import Confirmation from '@/pages/Confirmation';
import MyBookings from '@/pages/MyBookings';
import AdminDashboard from '@/pages/AdminDashboard';
import { Toaster } from 'sonner';
import ScrollToTop from '@/components/ScrollToTop';
import { useTranslation } from 'react-i18next';
import i18n from './i18n/i18n';
import BlogPage from "@/pages/Blog/index";
import MaleToDhigurahGuide from "@/pages/Blog/MaleToDhigurah";
import MaleToDhangethiGuide from "@/pages/Blog/MaleToDhangethi";

// Create ScrollToTop component since it's being imported but doesn't exist
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <HelmetProvider>
        <Toaster />
        <Routes>
          <Route path="/" element={<WelcomeSection />} />
          <Route path="/booking" element={<BookingForm />} />
          <Route path="/payment-confirmation" element={<Confirmation />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/islands" element={<Islands />} />
          <Route path="/islands/:slug" element={<IslandDetailsPage />} />
          
          {/* Blog Routes */}
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/male-to-dhigurah-guide" element={<MaleToDhigurahGuide />} />
          <Route path="/blog/male-to-dhangethi-guide" element={<MaleToDhangethiGuide />} />
          
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
              <p className="text-gray-600">Sorry, the page you are looking for does not exist.</p>
            </div>
          } />
        </Routes>
      </HelmetProvider>
    </Router>
  );
};

export default App;
