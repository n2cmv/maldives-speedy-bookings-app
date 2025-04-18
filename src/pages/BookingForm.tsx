
import React from "react";
import { useLocation } from "react-router-dom";
import BookingSection from "@/components/BookingSection";
import Header from "@/components/Header";
import { Island } from "@/types/booking";
import StepIndicator from "@/components/StepIndicator";
import { motion } from "framer-motion";
import HeaderExtras from "@/components/HeaderExtras";
import { useScrollToTop } from "@/hooks/use-scroll-top";

const BookingForm = () => {
  const location = useLocation();
  const preSelectedIsland = location.state?.island as Island | undefined;
  
  // Apply scroll to top hook
  useScrollToTop();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      <div className="h-16 pb-safe"></div>
      
      <div className="absolute top-4 right-4 z-20">
        <HeaderExtras />
      </div>
      
      <Header />
      
      <motion.div
        className="max-w-4xl mx-auto pt-28 px-4 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <StepIndicator />
      </motion.div>
      
      <BookingSection preSelectedIsland={preSelectedIsland} />
    </div>
  );
};

export default BookingForm;
