
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { QrCode } from "lucide-react";

interface BookingFormFooterProps {
  onSubmit: (e?: React.FormEvent) => void;
  isDisabled?: boolean;
}

const BookingFormFooter = ({ onSubmit, isDisabled = false }: BookingFormFooterProps) => {
  const { t } = useTranslation();
  
  return (
    <Button 
      type="button"
      onClick={onSubmit}
      disabled={isDisabled}
      className="w-full bg-ocean hover:bg-ocean-dark text-white h-[60px] text-base font-medium"
    >
      <QrCode className="w-5 h-5 mr-2" />
      {t("common.bookNow", "Book Now")}
    </Button>
  );
};

export default BookingFormFooter;
