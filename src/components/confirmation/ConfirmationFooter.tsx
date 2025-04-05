
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface ConfirmationFooterProps {
  island: string;
  isReturnTrip: boolean;
}

const ConfirmationFooter = ({ island, isReturnTrip }: ConfirmationFooterProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  return (
    <div className="border-t border-gray-200 pt-6">
      <p className="text-center text-gray-700 mb-6">
        {t("confirmation.thankYou", "Thank you for booking with us. Your journey{{s}} to {{island}}{{return}} await{{s}}!", {
          s: isReturnTrip ? 's' : '',
          island: island,
          return: isReturnTrip ? ' ' + t("confirmation.andBack", "and back") : '',
          s2: isReturnTrip ? '' : 's'
        })}
      </p>
      
      <div className="flex justify-center">
        <Button
          onClick={() => navigate("/booking")}
          className="bg-ocean hover:bg-ocean-dark text-white"
        >
          {t("confirmation.bookAnother", "Book Another Trip")}
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationFooter;
