
import { ArrowRight, Ship, MapPin, Calendar, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import BookingSection from "./BookingSection";

const WelcomeSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  return (
    <div className="min-h-[80vh] px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center gap-8 py-12">
          <div className="flex-1">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-ocean-dark mb-6">
              <span className="text-ocean">Speedboat</span> Travel <br />
              in the Maldives
            </h1>
            
            <p className="text-lg md:text-xl text-gray-700 mb-6 max-w-2xl">
              Fast, reliable, and comfortable speedboat transfers between islands in the Maldives. 
              Book your journey with Retour Maldives and experience seamless island hopping.
            </p>
            
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center text-gray-700">
                <Ship className="h-5 w-5 mr-2 text-ocean" />
                <span>Speedboat Transfers</span>
              </div>
              <div className="flex items-center text-gray-700">
                <MapPin className="h-5 w-5 mr-2 text-ocean" />
                <span>Multiple Islands</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Calendar className="h-5 w-5 mr-2 text-ocean" />
                <span>Daily Departures</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Users className="h-5 w-5 mr-2 text-ocean" />
                <span>Group & Private Options</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/booking" className="inline-flex items-center bg-ocean hover:bg-ocean-dark text-white font-medium py-3 px-6 rounded-lg shadow-lg transition-all duration-300">
                {t('common.bookNow')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link to="/my-bookings" className="inline-flex items-center border-2 border-ocean text-ocean hover:bg-ocean/10 font-medium py-3 px-6 rounded-lg transition-all duration-300">
                Manage Bookings
              </Link>
            </div>
          </div>
          
          <div className="flex-1">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-ocean to-ocean-dark rounded-lg blur-sm opacity-75"></div>
              <div className="relative bg-white rounded-lg p-6 shadow-xl">
                <h2 className="text-2xl font-bold text-ocean-dark mb-4">Book Your Speedboat</h2>
                <BookingSection />
              </div>
            </div>
          </div>
        </div>
        
        {/* How It Works Section */}
        <div className="py-16 border-t border-gray-200">
          <h2 className="text-2xl md:text-3xl font-bold text-ocean-dark mb-10 text-center">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center">
              <div className="w-12 h-12 bg-ocean/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-ocean" />
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Choose Your Islands</h3>
              <p className="text-gray-600">Select your departure and destination islands from our extensive network of Maldivian islands.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center">
              <div className="w-12 h-12 bg-ocean/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-6 w-6 text-ocean" />
              </div>
              <h3 className="text-xl font-semibold mb-3">2. Select Date & Time</h3>
              <p className="text-gray-600">Choose your preferred travel dates and times from our daily schedule of speedboat transfers.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center">
              <div className="w-12 h-12 bg-ocean/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Ship className="h-6 w-6 text-ocean" />
              </div>
              <h3 className="text-xl font-semibold mb-3">3. Enjoy Your Journey</h3>
              <p className="text-gray-600">Receive your e-ticket and enjoy a comfortable speedboat transfer between your chosen islands.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
