
import { Link } from "react-router-dom";
import HeaderExtras from "./HeaderExtras";

const Header = () => {
  return (
    <header className="bg-white bg-opacity-90 dark:bg-gray-800/90 backdrop-blur-sm shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="bg-ocean/10 p-2 rounded-full group-hover:bg-ocean/20 transition-colors">
          </div>
          <span className="text-xl font-bold text-ocean-dark dark:text-white group-hover:text-ocean transition-colors">
            Retour
          </span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/booking" className="text-ocean-dark dark:text-white hover:text-ocean transition-colors font-medium">
            Book Now
          </Link>
        </nav>
        <HeaderExtras />
      </div>
    </header>
  );
};

export default Header;
