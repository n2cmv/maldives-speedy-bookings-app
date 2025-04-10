
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import HeaderExtras from "@/components/HeaderExtras";
import ActivityForm from "@/components/activities/ActivityForm";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

const Activities = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = useIsMobile();
  
  // Enhanced scroll to top when component mounts
  useEffect(() => {
    // Force scroll to top with a small delay to ensure it works on mobile
    const timer = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto' // Use 'auto' instead of 'smooth' for more consistent behavior
      });
      
      // For mobile devices, try an additional approach
      if (isMobile) {
        document.body.scrollTop = 0; // For Safari on iOS
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE, and Opera
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [isMobile]);

  const handleSubmit = (formData: any) => {
    setIsSubmitting(true);
    
    // Store the activity booking data in sessionStorage for the payment page
    sessionStorage.setItem("activityBooking", JSON.stringify(formData));
    
    toast.info("Redirecting to payment", {
      description: "Please complete your payment to confirm your booking"
    });
    
    // Navigate to payment page with the activity booking data
    setTimeout(() => {
      navigate("/payment", { 
        state: {
          ...formData,
          isActivityBooking: true
        }
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <div className="absolute top-4 right-4 z-20">
        <HeaderExtras />
      </div>
      
      <Header />
      
      <main className="pt-24 pb-20 px-4">
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-ocean-dark mb-4">
              Book an Activity
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore the beauty of Maldives with our range of exclusive activities. 
              From swimming with whale sharks to sunset fishing, we have something for everyone.
            </p>
          </div>
          
          <ActivityForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </motion.div>
      </main>
    </div>
  );
};

export default Activities;
