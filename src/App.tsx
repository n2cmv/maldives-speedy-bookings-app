import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import WelcomeSection from '@/components/WelcomeSection';
import BookingPage from '@/pages/BookingPage';
import IslandsPage from '@/pages/Islands/IslandsPage';
import IslandDetailsPage from '@/pages/Islands/IslandDetails';
import ActivitiesPage from '@/pages/ActivitiesPage';
import PaymentConfirmation from '@/pages/PaymentConfirmation';
import MyBookingsPage from '@/pages/MyBookingsPage';
import AdminPanel from '@/pages/AdminPanel';
import { Toaster } from 'sonner';
import ScrollToTop from '@/components/ScrollToTop';
import { useTranslation } from 'react-i18next';
import i18n from './i18n/i18n';
import BlogPage from "@/pages/Blog/index";
import MaleToDhigurahGuide from "@/pages/Blog/MaleToDhigurah";
import MaleToDhangethiGuide from "@/pages/Blog/MaleToDhangethi";

const App = () => {
  return (
    <Router>
      <HelmetProvider>
        <Toaster />
        <Routes>
          <Route path="/" element={<WelcomeSection />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/payment-confirmation" element={<PaymentConfirmation />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
          <Route path="/activities" element={<ActivitiesPage />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/islands" element={<IslandsPage />} />
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
