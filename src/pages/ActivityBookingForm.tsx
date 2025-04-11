
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import { motion } from "framer-motion";
import StepIndicator from "@/components/StepIndicator";
import HeaderExtras from "@/components/HeaderExtras";
import ActivityBookingSection from "@/components/activity/ActivityBookingSection";

const ActivityBookingForm = () => {
  const location = useLocation();
  const preSelectedActivity = location.state?.activity;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
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
      
      <ActivityBookingSection preSelectedActivity={preSelectedActivity} />
    </div>
  );
};

export default ActivityBookingForm;
