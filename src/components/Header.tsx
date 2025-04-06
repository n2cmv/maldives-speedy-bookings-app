
import { Ship, Calendar, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const Header = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  
  const navigationLinks = (
    <>
      <Link to="/booking" className="inline-flex items-center gap-2 bg-ocean hover:bg-ocean-dark text-white font-medium py-2 px-4 rounded-lg transition-all duration-300">
        {t("common.bookNow", "Book Now")}
      </Link>
      <Link to="/my-bookings" className="flex items-center space-x-1 text-ocean-dark hover:text-ocean transition-colors font-medium">
        <Calendar className="h-5 w-5" />
        <span>{t("common.myBookings", "My Bookings")}</span>
      </Link>
    </>
  );

  const mobileDrawerLinks = (
    <div className="flex flex-col space-y-4 p-4">
      <Link to="/booking" className="inline-flex items-center justify-center gap-2 bg-ocean hover:bg-ocean-dark text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 w-full">
        {t("common.bookNow", "Book Now")}
      </Link>
      <Link to="/my-bookings" className="flex items-center space-x-2 text-ocean-dark hover:text-ocean transition-colors font-medium py-3 px-2">
        <Calendar className="h-5 w-5" />
        <span>{t("common.myBookings", "My Bookings")}</span>
      </Link>
    </div>
  );
  
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
        
        {isMobile ? (
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Menu</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>{t("app.name", "Retour")}</DrawerTitle>
              </DrawerHeader>
              <DrawerClose className="absolute right-4 top-4" />
              {mobileDrawerLinks}
            </DrawerContent>
          </Drawer>
        ) : (
          <nav className="hidden md:flex items-center space-x-4">
            {navigationLinks}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
