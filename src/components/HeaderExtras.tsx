import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ui/use-theme";
import LanguageSwitcher from "./LanguageSwitcher";
import SavedBookings from "./SavedBookings";

const HeaderExtras = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex space-x-2">
      {/* All buttons have been removed */}
    </div>
  );
};

export default HeaderExtras;
