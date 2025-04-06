
import { Ship, Ticket } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/hooks/use-mobile";

const Header = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const location = useLocation();
  
  // Check if we're on the home page
  const isHomePage = location.pathname === '/';
  
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
        
        <nav className="flex items-center space-x-4">
          {isHomePage && (
            <Link to="/booking" className="inline-flex items-center gap-2 bg-ocean hover:bg-ocean-dark text-white font-medium py-2 px-4 rounded-lg transition-all duration-300">
              {t("common.bookNow", "Book Now")}
            </Link>
          )}
          
          <Link to="/my-bookings" className={`flex items-center ${isMobile && isHomePage ? "" : "space-x-1"} text-ocean-dark hover:text-ocean transition-colors font-medium`}>
            <Ticket className="h-5 w-5" />
            {(!isMobile || !isHomePage) && <span>{t("common.myBookings", "My Bookings")}</span>}
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
