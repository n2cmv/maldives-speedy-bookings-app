
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import PopularDestinations from "./PopularDestinations";
import { Island } from "@/types/booking";
import { useNavigate } from "react-router-dom";

const WelcomeSection = () => {
  const navigate = useNavigate();
  
  const handleSelectDestination = (island: Island) => {
    navigate("/booking", { state: { island } });
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-ocean-dark mb-6">
          Explore the Maldives <br />
          by <span className="text-ocean">Speedboat</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
          Welcome to the Speedboat Booking App for Maldivian Islands! To get started, 
          please select your destination island, choose your preferred timing, and 
          enter the number of seats you wish to book. Enjoy your journey!
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
          <Link to="/booking" className="inline-flex items-center bg-ocean hover:bg-ocean-dark text-white font-medium py-3 px-6 rounded-lg shadow-lg transition-all duration-300">
            Book Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
        
        <div className="max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-ocean-dark mb-3">Popular Destinations</h3>
          <PopularDestinations onSelectDestination={handleSelectDestination} />
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white/30 to-transparent" />
    </div>
  );
};

export default WelcomeSection;
