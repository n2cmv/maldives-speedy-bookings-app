
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

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
      className="w-full bg-[#0AB3B8] hover:bg-[#005C99] text-white h-[60px] text-base font-medium"
    >
      {t("common.bookNow", "Book Now")}
    </Button>
  );
};

export default BookingFormFooter;
