
import { Ship } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Header = () => {
  const { t } = useTranslation();
  
  return (
    <header className="bg-white bg-opacity-90 backdrop-blur-sm shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="bg-ocean/10 p-2 rounded-full group-hover:bg-ocean/20 transition-colors">
            <Ship className="h-6 w-6 text-ocean" />
          </div>
          <span className="text-xl font-bold text-ocean-dark group-hover:text-ocean transition-colors">
            {t("app.name", "Retour")}
          </span>
        </Link>
        <nav className="flex items-center space-x-6">
          <Link to="/booking" className="text-ocean-dark hover:text-ocean transition-colors font-medium">
            {t("common.bookNow", "Book Now")}
          </Link>
          <Link to="/my-bookings" className="text-ocean-dark hover:text-ocean transition-colors font-medium">
            {t("common.myBookings", "My Bookings")}
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
