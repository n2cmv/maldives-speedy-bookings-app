
import { motion } from "framer-motion";
import LanguageSwitcher from "./LanguageSwitcher";
import SavedBookings from "./SavedBookings";

const HeaderExtras = () => {
  return (
    <motion.div 
      className="flex items-center gap-2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <SavedBookings />
      <LanguageSwitcher />
    </motion.div>
  );
};

export default HeaderExtras;
