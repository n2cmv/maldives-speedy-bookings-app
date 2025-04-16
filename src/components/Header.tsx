
import { Ship, Ticket, Compass, Map, Sailboat } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import BookingTypeModal from "./BookingTypeModal";

const Header = () => {
  const {
    t
  } = useTranslation();
  const isMobile = useIsMobile();
  const location = useLocation();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const isHomePage = location.pathname === '/';
  
  return <>
      <header className="bg-white bg-opacity-90 backdrop-blur-sm shadow-md fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-[#0AB3B8]/10 p-2 rounded-full group-hover:bg-[#0AB3B8]/20 transition-colors">
              <Ship className="h-6 w-6 text-[#0AB3B8]" />
            </div>
            <span className="text-xl font-bold text-[#005C99] group-hover:text-[#0AB3B8] transition-colors">
              {t("app.name", "Retour")}
            </span>
          </Link>
          
          <nav className="flex items-center space-x-4">
            {isHomePage && <button onClick={() => setShowBookingModal(true)} className="inline-flex items-center gap-2 bg-[#0AB3B8] hover:bg-[#005C99] text-white font-medium py-2 px-4 rounded-lg transition-all duration-300">
                {t("common.bookNow", "Book Now")}
              </button>}
            
            <Link to="/my-bookings" className={`flex items-center ${isMobile ? "" : "space-x-1"} text-[#005C99] hover:text-[#0AB3B8] transition-colors font-medium`}>
              <Ticket className="h-5 w-5" />
              {!isMobile && <span>{t("common.myBookings", "My Bookings")}</span>}
            </Link>
          </nav>
        </div>
        
        {/* Secondary Menu - glass effect */}
        {!isMobile && <div className="absolute left-0 right-0 top-full z-50 bg-white/70 backdrop-blur-[8.4px] border-t border-white/43 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
            <div className="container mx-auto px-4 py-2">
              <nav className="flex items-start space-x-8">
                <Link to="/speedboat-transfers" className="flex items-center space-x-2 text-[#005C99] hover:text-[#0AB3B8] py-1 text-sm">
                  <Sailboat className="h-4 w-4" />
                  <span>Popular Speedboat Transfers</span>
                </Link>
                <Link to="/activities" className="flex items-center space-x-2 text-[#005C99] hover:text-[#0AB3B8] py-1 text-sm">
                  <Compass className="h-4 w-4" />
                  <span>Popular Activities</span>
                </Link>
                <Link to="/islands" className="flex items-center space-x-2 text-[#005C99] hover:text-[#0AB3B8] py-1 text-sm">
                  <Map className="h-4 w-4" />
                  <span>Discover Islands</span>
                </Link>
              </nav>
            </div>
          </div>}
      </header>
      
      <div className={`h-${isMobile ? '16' : '24'}`}></div>
      
      <BookingTypeModal isOpen={showBookingModal} onClose={() => setShowBookingModal(false)} />
    </>;
};

export default Header;
