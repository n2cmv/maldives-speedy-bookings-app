
import React from "react";
import { Check, ChevronRight } from "lucide-react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

type Step = {
  id: number;
  name: string;
  path: string;
};

const steps: Step[] = [
  { id: 1, name: "Select Island", path: "/booking" },
  { id: 2, name: "Passenger Details", path: "/passenger-details" },
  { id: 3, name: "Payment", path: "/payment" },
  { id: 4, name: "Confirmation", path: "/confirmation" },
];

const StepIndicator = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Find the current step based on path
  const currentStepIndex = steps.findIndex(step => step.path === currentPath);
  const currentStep = currentStepIndex !== -1 ? currentStepIndex + 1 : 1;
  
  // Calculate progress percentage
  const progressPercentage = Math.round((currentStep / steps.length) * 100);

  return (
    <motion.div
      className="w-full py-5 px-4 md:px-6 bg-white rounded-xl shadow-md"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Progress value={progressPercentage} className="h-2 mb-5" />
      
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center relative">
              <div 
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300
                  ${index < currentStep 
                    ? "bg-ocean text-white" 
                    : index === currentStep - 1 
                      ? "bg-ocean-light text-white ring-4 ring-ocean/20" 
                      : "bg-gray-100 text-gray-400"
                  }`}
              >
                {index < currentStep - 1 ? <Check size={16} /> : step.id}
              </div>
              <p className={`text-xs mt-2 font-medium hidden md:block
                ${index === currentStep - 1 ? "text-ocean-dark" : "text-gray-500"}`}>
                {step.name}
              </p>
            </div>
            
            {index < steps.length - 1 && (
              <div className="flex-1 flex items-center">
                <div 
                  className={`h-[1px] w-full ${index < currentStep - 1 
                    ? "bg-ocean" 
                    : "bg-gray-200"
                  }`}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </motion.div>
  );
};

export default StepIndicator;
