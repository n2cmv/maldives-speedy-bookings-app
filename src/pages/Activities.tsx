
import { useState } from "react";
import Header from "@/components/Header";
import HeaderExtras from "@/components/HeaderExtras";
import ActivityForm from "@/components/activities/ActivityForm";
import { motion } from "framer-motion";
import { useScrollToTop } from "@/hooks/use-scroll-top";

const Activities = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  useScrollToTop();

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <div className="h-16 pb-safe"></div>
      
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
          
          <ActivityForm isSubmitting={isSubmitting} />
        </motion.div>
      </main>
    </div>
  );
};

export default Activities;
