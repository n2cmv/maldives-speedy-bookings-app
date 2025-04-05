
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import PopularDestinations from "./PopularDestinations";
import { Island } from "@/types/booking";
import { useNavigate } from "react-router-dom";
import IslandCarousel from "./IslandCarousel";
import IslandCards from "./IslandCards";

const WelcomeSection = () => {
  const navigate = useNavigate();
  
  const handleSelectDestination = (island: Island) => {
    navigate("/booking", { state: { island } });
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 mt-16">
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-ocean-dark mb-6">
          Explore the Maldives <br />
          with <span className="text-ocean">Retour</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
          Welcome to Retour Maldives! To get started, 
          please select your destination island, choose your preferred timing, and 
          enter the number of seats you wish to book. Enjoy your journey!
        </p>
        
        <div className="flex justify-center mb-12">
          <Link to="/booking" className="inline-flex items-center bg-ocean hover:bg-ocean-dark text-white font-medium py-3 px-6 rounded-lg shadow-lg transition-all duration-300">
            Book Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>

      <div className="w-full max-w-5xl mx-auto mb-12">
        <IslandCarousel />
      </div>
      
      <div className="w-full max-w-6xl mx-auto mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-ocean-dark mb-8">Featured Destinations</h2>
        <IslandCards onSelectDestination={handleSelectDestination} />
      </div>
      
      <div className="w-full max-w-md mx-auto">
        <PopularDestinations onSelectDestination={handleSelectDestination} />
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white/30 to-transparent"></div>
    </div>
  );
};

export default WelcomeSection;
