
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import ActivitySelector from "./ActivitySelector";
import PersonalInfoForm from "./PersonalInfoForm";
import ActivitySummary from "./ActivitySummary";

export interface Activity {
  id: string;
  name: string;
  price: number;
  description?: string;
}

export interface ActivityBookingForm {
  activity: Activity | null;
  fullName: string;
  email: string;
  phone: string;
  countryCode: string;
  passportNumber: string;
  date: Date | null;
  passengers: number;
  totalPrice: number;
}

const defaultFormData: ActivityBookingForm = {
  activity: null,
  fullName: "",
  email: "",
  phone: "",
  countryCode: "+960", // Default to Maldives
  passportNumber: "",
  date: null,
  passengers: 1,
  totalPrice: 0
};

interface ActivityFormProps {
  onSubmit: (data: ActivityBookingForm) => void;
  isSubmitting: boolean;
}

const ActivityForm = ({ onSubmit, isSubmitting }: ActivityFormProps) => {
  const [formData, setFormData] = useState<ActivityBookingForm>(defaultFormData);
  const [step, setStep] = useState<number>(1);
  
  const updateFormData = (data: Partial<ActivityBookingForm>) => {
    setFormData(prev => {
      const updated = { ...prev, ...data };
      
      // Calculate total price whenever activity or passengers change
      if (data.activity || data.passengers) {
        const activityPrice = updated.activity?.price || 0;
        
        // For resort transfer, each way is charged separately
        if (updated.activity?.id === "resort_transfer") {
          updated.totalPrice = activityPrice * (updated.passengers || 1);
        } 
        // For sandbank trip, it's a flat fee for the trip
        else if (updated.activity?.id === "sandbank_trip") {
          updated.totalPrice = activityPrice;
        } 
        // For all other activities, it's per person
        else {
          updated.totalPrice = activityPrice * (updated.passengers || 1);
        }
      }
      
      return updated;
    });
  };
  
  const handleNext = () => {
    if (step === 1 && !formData.activity) {
      toast.error("Please select an activity");
      return;
    }
    setStep(prev => prev + 1);
  };
  
  const handleBack = () => {
    setStep(prev => prev - 1);
  };
  
  const handleSubmit = () => {
    if (!formData.fullName || 
        !formData.email || 
        !formData.phone || 
        !formData.passportNumber ||
        !formData.date) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    onSubmit(formData);
  };
  
  return (
    <Card className="shadow-lg border-0 overflow-hidden">
      <div className="p-6 md:p-8">
        {step === 1 && (
          <ActivitySelector 
            selectedActivity={formData.activity}
            onSelectActivity={(activity) => updateFormData({ activity })}
            passengers={formData.passengers}
            onPassengerChange={(passengers) => updateFormData({ passengers })}
          />
        )}
        
        {step === 2 && (
          <PersonalInfoForm 
            formData={formData}
            onChange={updateFormData}
          />
        )}
        
        {step === 3 && (
          <ActivitySummary 
            booking={formData}
          />
        )}
        
        <div className="mt-8 flex justify-between">
          {step > 1 && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleBack}
              disabled={isSubmitting}
            >
              Back
            </Button>
          )}
          
          <div className="ml-auto">
            {step < 3 ? (
              <Button 
                type="button" 
                onClick={handleNext}
                className="bg-ocean hover:bg-ocean-dark text-white"
              >
                Next
              </Button>
            ) : (
              <Button 
                type="button" 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-ocean hover:bg-ocean-dark text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing
                  </>
                ) : (
                  "Book Now"
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ActivityForm;
