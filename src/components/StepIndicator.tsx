
import { Check, ChevronRight } from "lucide-react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

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

  return (
    <motion.div
      className="w-full py-4 px-2 md:px-6 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm mb-8"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center 
                  ${index < currentStep 
                    ? "bg-ocean text-white" 
                    : index === currentStep - 1 
                      ? "bg-ocean-light text-white ring-4 ring-ocean/20" 
                      : "bg-gray-200 text-gray-500"
                  }`}
              >
                {index < currentStep - 1 ? <Check size={16} /> : step.id}
              </div>
              <p className={`text-xs md:text-sm mt-2 font-medium 
                ${index === currentStep - 1 ? "text-ocean-dark" : "text-gray-500"}`}>
                {step.name}
              </p>
            </div>
            
            {index < steps.length - 1 && (
              <div className="flex-1 flex items-center">
                <div 
                  className={`h-0.5 w-full ${index < currentStep - 1 
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
