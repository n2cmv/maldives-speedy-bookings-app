
import { useLocation } from "react-router-dom";
import BookingSection from "@/components/booking/BookingSection";
import Header from "@/components/Header";
import StepIndicator from "@/components/StepIndicator";
import { motion } from "framer-motion";

const BookingForm = () => {
  const location = useLocation();
  const preSelectedIsland = location.state?.island as string | undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
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
