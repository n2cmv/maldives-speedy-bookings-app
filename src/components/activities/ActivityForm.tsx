
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import ActivitySelector from "./ActivitySelector";
import PersonalInfoForm from "./PersonalInfoForm";
import ActivitySummary from "./ActivitySummary";
import { saveActivityBookingToDatabase, sendActivityConfirmationEmail } from "@/services/activityService";

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
  countryCode: "+960",
  passportNumber: "",
  date: null,
  passengers: 1,
  totalPrice: 0
};

interface ActivityFormProps {
  isSubmitting: boolean;
}

const ActivityForm = ({ isSubmitting }: ActivityFormProps) => {
  const [formData, setFormData] = useState<ActivityBookingForm>(defaultFormData);
  const [step, setStep] = useState<number>(1);
  const [isSending, setIsSending] = useState(false);
  
  const updateFormData = (data: Partial<ActivityBookingForm>) => {
    setFormData(prev => {
      const updated = { ...prev, ...data };
      
      if (data.activity || data.passengers) {
        const activityPrice = updated.activity?.price || 0;
        
        if (updated.activity?.id === "resort_transfer") {
          updated.totalPrice = activityPrice * (updated.passengers || 1);
        } else if (updated.activity?.id === "sandbank_trip") {
          updated.totalPrice = activityPrice;
        } else {
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
  
  const handleSubmit = async () => {
    if (!formData.fullName || 
        !formData.email || 
        !formData.phone || 
        !formData.passportNumber ||
        !formData.date) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsSending(true);
    
    try {
      const { error: dbError } = await saveActivityBookingToDatabase(formData);
      if (dbError) throw new Error(dbError.message);
      
      const adminEmailData = {
        email: "natteynattson@gmail.com",
        name: "Admin",
        isAdminNotification: true,
        bookingDetails: {
          fullName: formData.fullName,
          email: formData.email,
          phone: `${formData.countryCode} ${formData.phone}`,
          passport: formData.passportNumber,
          activityName: formData.activity?.name,
          passengers: formData.passengers,
          totalPrice: formData.totalPrice,
          date: formData.date ? new Date(formData.date).toLocaleDateString() : "",
        }
      };

      const userEmailData = {
        email: formData.email,
        name: formData.fullName,
        isAdminNotification: false,
        bookingDetails: {
          activityName: formData.activity?.name,
          date: formData.date ? new Date(formData.date).toLocaleDateString() : ""
        }
      };

      const { success: adminEmailSent, error: adminEmailError } = await sendActivityConfirmationEmail(adminEmailData);
      if (adminEmailError) console.error("Error sending admin email:", adminEmailError);

      const { success: userEmailSent, error: userEmailError } = await sendActivityConfirmationEmail(userEmailData);
      if (userEmailError) throw new Error(userEmailError);
      
      const whatsappMessage = `*New Activity Booking*\n\n` +
        `Activity: ${formData.activity?.name}\n` +
        `Date: ${formData.date ? new Date(formData.date).toLocaleDateString() : 'Not specified'}\n` +
        `Passengers: ${formData.passengers}\n` +
        `Total Price: $${formData.totalPrice}\n\n` +
        `Customer Details:\n` +
        `Name: ${formData.fullName}\n` +
        `Email: ${formData.email}\n` +
        `Phone: ${formData.countryCode} ${formData.phone}\n` +
        `Passport/ID: ${formData.passportNumber}`;
      
      const whatsappUrl = `https://wa.me/9609999999?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(whatsappUrl, '_blank');
      
      toast.success("Booking sent successfully!", {
        description: "We'll contact you shortly to confirm your booking."
      });
      
      setFormData(defaultFormData);
      setStep(1);
      
    } catch (error) {
      console.error('Booking error:', error);
      toast.error("Failed to send booking", {
        description: error instanceof Error ? error.message : "Please try again or contact us directly."
      });
    } finally {
      setIsSending(false);
    }
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
              disabled={isSending}
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
                disabled={isSending}
                className="bg-ocean hover:bg-ocean-dark text-white"
              >
                {isSending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Booking
                  </>
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
