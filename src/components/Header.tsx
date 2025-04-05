
import { Ship } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Header = () => {
  const { t } = useTranslation();
  
  return (
    <header className="bg-white bg-opacity-90 backdrop-blur-sm shadow-md fixed top-0 left-0 right-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Ship className="h-6 w-6 text-ocean" />
          <span className="text-xl font-bold text-ocean-dark">{t("app.name")}</span>
        </Link>
        <nav>
          <Link to="/booking" className="text-ocean-dark hover:text-ocean transition-colors">
            {t("common.bookNow")}
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
