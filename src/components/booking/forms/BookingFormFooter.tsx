
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

interface BookingFormFooterProps {
  onSubmit: (e?: React.FormEvent) => void;
  isDisabled?: boolean;
}

const BookingFormFooter = ({ onSubmit, isDisabled = false }: BookingFormFooterProps) => {
  const { t } = useTranslation();
  
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Button 
        type="button"
        onClick={onSubmit}
        disabled={isDisabled}
        className="w-full bg-ocean hover:bg-ocean-dark text-white h-[60px] text-base font-medium rounded-xl shadow-md transition-all duration-300"
      >
        {t("common.bookNow", "Book Now")}
      </Button>
    </motion.div>
  );
};

export default BookingFormFooter;
