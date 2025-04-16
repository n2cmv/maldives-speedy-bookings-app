import { Ship, Ticket } from "lucide-react";
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

  // Check if we're on the home page
  const isHomePage = location.pathname === '/';
  return <>
      <header className="backdrop-blur-md bg-white/60 shadow-sm fixed top-0 left-0 right-0 z-50">
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
        
        {/* Narrower subnavigation with blur effect */}
        {!isMobile && <div className="backdrop-blur-md border-t border-gray-100 bg-transparent">
            <div className="container mx-auto px-4 py-2">
              <div className="flex space-x-8 text-sm font-medium">
                <Link to="/" className="text-[#005C99] hover:text-[#0AB3B8] transition-colors">
                  Popular Speedboat Transfers
                </Link>
                <Link to="/activities" className="text-[#005C99] hover:text-[#0AB3B8] transition-colors">
                  Popular Activities
                </Link>
                <Link to="/islands" className="text-[#005C99] hover:text-[#0AB3B8] transition-colors">
                  Discover Islands
                </Link>
              </div>
            </div>
          </div>}
      </header>
      
      <BookingTypeModal isOpen={showBookingModal} onClose={() => setShowBookingModal(false)} />
    </>;
};
export default Header;