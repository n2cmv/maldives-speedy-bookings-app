
import { CheckCircle2, Mail, AlertTriangle } from "lucide-react";

interface ConfirmationHeaderProps {
  booking: any;
  isEmailSent: boolean;
  isActivityBooking?: boolean;
}

const ConfirmationHeader = ({ booking, isEmailSent, isActivityBooking = false }: ConfirmationHeaderProps) => {
  return (
    <div className="bg-ocean-light/10 py-8 px-6 md:px-10 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-ocean-dark">
            {isActivityBooking ? "Activity Booking Confirmed!" : "Booking Confirmed!"}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {isEmailSent ? "Your booking has been successfully processed." : "Your booking is confirmed, and an email receipt has been sent."}
          </p>
        </div>
        
        <div className="flex items-center">
          {isEmailSent ? (
            <div className="flex items-center text-green-600">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              <span>Confirmation email sent</span>
            </div>
          ) : (
            <div className="flex items-center text-yellow-600">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <span>Failed to send email. Please check your inbox.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmationHeader;
