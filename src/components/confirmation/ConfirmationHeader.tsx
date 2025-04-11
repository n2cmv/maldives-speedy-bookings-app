
import { CheckCircle2, Mail, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ConfirmationHeaderProps {
  booking: any;
  isEmailSent: boolean;
  isActivityBooking?: boolean;
}

const ConfirmationHeader = ({ booking, isEmailSent, isActivityBooking = false }: ConfirmationHeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-ocean to-ocean-dark p-6 md:p-8 text-white relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="mb-4 md:mb-0">
          <div className="flex items-center">
            <div className="mr-4 bg-white bg-opacity-20 rounded-full p-3">
              {isActivityBooking ? (
                <Activity className="h-6 w-6 text-white" />
              ) : (
                <CheckCircle2 className="h-6 w-6 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{isActivityBooking ? "Activity" : "Trip"} Confirmed!</h1>
              <p className="text-white text-opacity-90 mt-1">
                {isActivityBooking
                  ? `Your ${booking.activity} reservation has been confirmed`
                  : "Your island trip has been confirmed"
                }
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:items-end">
          <div className="flex items-center mb-2">
            <Mail className="h-4 w-4 mr-2" />
            <span className="text-sm text-white text-opacity-90">
              {isEmailSent 
                ? "Confirmation sent to your email" 
                : "Sending confirmation email..."
              }
            </span>
          </div>
          <Badge className="bg-white text-ocean-dark hover:bg-white">
            Ref: {booking.paymentReference}
          </Badge>
        </div>
      </div>
      
      {/* Decorative circles background */}
      <div className="absolute top-[-50px] right-[-50px] w-[150px] h-[150px] rounded-full bg-white opacity-5"></div>
      <div className="absolute bottom-[-70px] left-[10%] w-[170px] h-[170px] rounded-full bg-white opacity-5"></div>
    </div>
  );
};

export default ConfirmationHeader;
