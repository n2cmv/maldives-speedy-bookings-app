
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BookingInfo } from "@/types/booking";

export interface ConfirmationFooterProps {
  island: string;
  isReturnTrip: boolean;
  booking?: BookingInfo;
  isEmailSent?: boolean;
  emailError?: string | null;
  onFinish?: () => void;
}

const ConfirmationFooter = ({ island, isReturnTrip, onFinish }: ConfirmationFooterProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const handleFinish = () => {
    if (onFinish) {
      onFinish();
    } else {
      navigate("/booking");
    }
  };
  
  return (
    <div className="border-t border-gray-200 pt-6">
      <p className="text-center text-gray-700 mb-6">
        {t("confirmation.thankYou", {
          s: isReturnTrip ? 's' : '',
          island: island,
          return: isReturnTrip ? ' ' + t("confirmation.andBack") : '',
          s2: isReturnTrip ? '' : 's',
          defaultValue: "Thank you for booking with us. Your journey{{s}} to {{island}}{{return}} await{{s2}}!"
        })}
      </p>
      
      <div className="flex justify-center">
        <Button
          onClick={handleFinish}
          className="bg-ocean hover:bg-ocean-dark text-white"
        >
          {t("confirmation.bookAnother", "Book Another Trip")}
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationFooter;
