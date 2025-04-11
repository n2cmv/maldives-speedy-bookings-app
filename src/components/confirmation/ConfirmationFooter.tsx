
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface ConfirmationFooterProps {
  island?: string;
  isReturnTrip?: boolean;
  booking?: any;
  resendEmail?: () => Promise<void>;
  isResending?: boolean;
  isActivityBooking?: boolean;
}

const ConfirmationFooter = ({ 
  island, 
  isReturnTrip, 
  booking, 
  resendEmail, 
  isResending,
  isActivityBooking
}: ConfirmationFooterProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Extract values from booking if provided
  const destinationIsland = booking?.island || island || '';
  const hasReturnTrip = booking?.returnTrip || isReturnTrip || false;
  
  return (
    <div className="border-t border-gray-200 pt-6">
      <p className="text-center text-gray-700 mb-6">
        {isActivityBooking ? (
          t("confirmation.thankYouActivity", "Thank you for booking your activity experience with us!")
        ) : (
          t("confirmation.thankYou", {
            s: hasReturnTrip ? 's' : '',
            island: destinationIsland,
            return: hasReturnTrip ? ' ' + t("confirmation.andBack") : '',
            s2: hasReturnTrip ? '' : 's',
            defaultValue: "Thank you for booking with us. Your journey{{s}} to {{island}}{{return}} await{{s2}}!"
          })
        )}
      </p>
      
      <div className="flex justify-center gap-4">
        {resendEmail && (
          <Button
            onClick={resendEmail}
            variant="outline"
            disabled={isResending}
          >
            {isResending ? t("confirmation.resending", "Resending...") : t("confirmation.resendEmail", "Resend Email")}
          </Button>
        )}
        
        <Button
          onClick={() => navigate(isActivityBooking ? "/activity-booking" : "/booking")}
          className="bg-ocean hover:bg-ocean-dark text-white"
        >
          {t("confirmation.bookAnother", isActivityBooking ? "Book Another Activity" : "Book Another Trip")}
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationFooter;
