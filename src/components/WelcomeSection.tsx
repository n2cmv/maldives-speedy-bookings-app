
import { ArrowRight, Ship, MapPin, Calendar, Users, Anchor, Shield, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

const WelcomeSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  return (
    <div className="min-h-[80vh] px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center py-16 md:py-24">
          <div className="bg-ocean/10 p-4 rounded-full mb-6 animate-pulse">
            <Ship className="h-10 w-10 text-ocean" />
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-ocean-dark mb-6">
            <span className="text-ocean">Speedboat</span> Travel <br />
            in the Maldives
          </h1>
          
          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl">
            Fast, reliable, and comfortable speedboat transfers between islands in the Maldives. 
            Experience seamless island hopping with our premium service.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <Link to="/booking" className="inline-flex items-center bg-ocean hover:bg-ocean-dark text-white font-bold py-4 px-8 rounded-lg shadow-lg transition-all duration-300">
              {t('common.bookNow')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link to="/my-bookings" className="inline-flex items-center border-2 border-ocean text-ocean hover:bg-ocean/10 font-bold py-4 px-8 rounded-lg transition-all duration-300">
              Manage Bookings
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl">
            <div className="flex flex-col items-center text-gray-700 p-4 bg-white/80 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
              <Ship className="h-8 w-8 mb-3 text-ocean" />
              <span className="font-medium">Premium Fleet</span>
            </div>
            <div className="flex flex-col items-center text-gray-700 p-4 bg-white/80 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
              <MapPin className="h-8 w-8 mb-3 text-ocean" />
              <span className="font-medium">All Islands</span>
            </div>
            <div className="flex flex-col items-center text-gray-700 p-4 bg-white/80 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
              <Calendar className="h-8 w-8 mb-3 text-ocean" />
              <span className="font-medium">Daily Departures</span>
            </div>
            <div className="flex flex-col items-center text-gray-700 p-4 bg-white/80 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
              <Users className="h-8 w-8 mb-3 text-ocean" />
              <span className="font-medium">Group Options</span>
            </div>
          </div>
        </div>
        
        {/* Our Services Section */}
        <div className="py-16 border-t border-gray-200">
          <h2 className="text-3xl md:text-4xl font-bold text-ocean-dark mb-12 text-center">Our Services</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-ocean/5 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
              <div className="w-14 h-14 bg-ocean/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Ship className="h-8 w-8 text-ocean" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-center">Island Transfers</h3>
              <p className="text-gray-600 text-center">Quick and comfortable transfers between any islands in the Maldives, with daily scheduled departures.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-ocean/5 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
              <div className="w-14 h-14 bg-ocean/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-ocean" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-center">Private Charters</h3>
              <p className="text-gray-600 text-center">Exclusive speedboat hire for your group, perfect for families or friends wanting privacy and flexibility.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-ocean/5 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
              <div className="w-14 h-14 bg-ocean/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Anchor className="h-8 w-8 text-ocean" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-center">Airport Pickups</h3>
              <p className="text-gray-600 text-center">Direct transfers from Male International Airport to your resort or island of choice.</p>
            </div>
          </div>
        </div>
        
        {/* How It Works Section */}
        <div className="py-16 border-t border-gray-200">
          <h2 className="text-3xl md:text-4xl font-bold text-ocean-dark mb-12 text-center">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 text-center relative">
              <div className="absolute -top-5 -left-5 w-10 h-10 bg-ocean text-white rounded-full flex items-center justify-center font-bold">1</div>
              <div className="w-16 h-16 bg-ocean/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="h-8 w-8 text-ocean" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Choose Your Islands</h3>
              <p className="text-gray-600">Select your departure and destination islands from our extensive network of Maldivian islands.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 text-center relative">
              <div className="absolute -top-5 -left-5 w-10 h-10 bg-ocean text-white rounded-full flex items-center justify-center font-bold">2</div>
              <div className="w-16 h-16 bg-ocean/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-8 w-8 text-ocean" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Select Date & Time</h3>
              <p className="text-gray-600">Choose your preferred travel dates and times from our daily schedule of speedboat transfers.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 text-center relative">
              <div className="absolute -top-5 -left-5 w-10 h-10 bg-ocean text-white rounded-full flex items-center justify-center font-bold">3</div>
              <div className="w-16 h-16 bg-ocean/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Ship className="h-8 w-8 text-ocean" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Enjoy Your Journey</h3>
              <p className="text-gray-600">Receive your e-ticket and enjoy a comfortable speedboat transfer between your chosen islands.</p>
            </div>
          </div>
          
          <div className="flex justify-center mt-12">
            <Link to="/booking" className="inline-flex items-center bg-ocean hover:bg-ocean-dark text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-300">
              Start Booking Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
        
        {/* Testimonials Section */}
        <div className="py-16 border-t border-gray-200">
          <h2 className="text-3xl md:text-4xl font-bold text-ocean-dark mb-12 text-center">What Our Customers Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 italic mb-4">"The speedboat service was excellent! Clean boats, punctual departures and friendly staff. Made island hopping so convenient."</p>
              <div className="font-medium text-ocean-dark">- Sarah J.</div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 italic mb-4">"Booking was simple and straightforward. The online system worked perfectly and I received instant confirmation."</p>
              <div className="font-medium text-ocean-dark">- Michael T.</div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 italic mb-4">"The captain was professional and the journey was smooth. Will definitely use Retour Maldives again!"</p>
              <div className="font-medium text-ocean-dark">- Emma L.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
