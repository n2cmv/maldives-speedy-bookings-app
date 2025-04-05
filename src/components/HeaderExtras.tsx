
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Ship } from "lucide-react";
import { useTheme } from "@/components/ui/use-theme";
import LanguageSwitcher from "./LanguageSwitcher";
import SavedBookings from "./SavedBookings";

const HeaderExtras = () => {
  const { setTheme } = useTheme();

  return (
    <div className="flex space-x-2">
      <LanguageSwitcher />
      <SavedBookings />
      <Link to="/my-bookings">
        <Button variant="ghost" size="icon" title="My Bookings">
          <Ship className="h-5 w-5" />
        </Button>
      </Link>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          setTheme(theme => (theme === "light" ? "dark" : "light"));
        }}
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </div>
  );
};

export default HeaderExtras;
