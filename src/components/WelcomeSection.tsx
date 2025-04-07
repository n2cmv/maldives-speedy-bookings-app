
import { ArrowRight, Ship, MapPin, Calendar, Users, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

const WelcomeSection = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-[80vh] px-4 font-[SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif]">
      <div className="max-w-5xl mx-auto">
        {/* Hero Section with Apple-inspired design */}
        <div className="flex flex-col items-center text-center py-24">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-semibold text-[#1D1D1F] tracking-tight mb-6">
            <span className="text-[#0066CC]">Island</span> Travel <br />
            Simplified
          </h1>
          
          <p className="text-xl md:text-2xl text-[#86868B] mb-12 max-w-2xl leading-relaxed">
            Seamless speedboat transfers between Maldivian islands.
            Efficient, reliable, and designed with you in mind.
          </p>
          
          <div className="flex flex-wrap gap-6 justify-center mb-16">
            <Link to="/booking" className="inline-flex items-center bg-[#0066CC] hover:bg-[#0055B0] text-white font-medium py-4 px-8 rounded-xl shadow-lg transition-all duration-300 text-lg">
              {t('common.bookNow')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link to="/my-bookings" className="inline-flex items-center border-2 border-[#0066CC] text-[#0066CC] hover:bg-[#0066CC]/5 font-medium py-4 px-8 rounded-xl transition-all duration-300 text-lg">
              Manage Bookings
            </Link>
          </div>
        </div>
        
        {/* Features Section - Apple-inspired cards */}
        <div className="py-16">
          <h2 className="text-3xl font-semibold text-[#1D1D1F] mb-12 text-center">Why Choose Us</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 text-center">
              <div className="w-16 h-16 bg-[#0066CC]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Ship className="h-8 w-8 text-[#0066CC]" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-[#1D1D1F]">Premium Fleet</h3>
              <p className="text-[#86868B]">Modern, well-maintained speedboats with comfortable seating and safety features.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 text-center">
              <div className="w-16 h-16 bg-[#0066CC]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="h-8 w-8 text-[#0066CC]" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-[#1D1D1F]">Full Coverage</h3>
              <p className="text-[#86868B]">Service to all major islands and resorts throughout the Maldives archipelago.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 text-center">
              <div className="w-16 h-16 bg-[#0066CC]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-8 w-8 text-[#0066CC]" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-[#1D1D1F]">Flexible Scheduling</h3>
              <p className="text-[#86868B]">Daily departures with convenient timing options to fit your travel plans.</p>
            </div>
          </div>
        </div>
        
        {/* How It Works - Simplified steps */}
        <div className="py-16">
          <h2 className="text-3xl font-semibold text-[#1D1D1F] mb-12 text-center">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm relative">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-[#0066CC] text-white rounded-full flex items-center justify-center font-medium">1</div>
              <h3 className="text-xl font-semibold mb-4 text-[#1D1D1F]">Select Your Route</h3>
              <p className="text-[#86868B]">Choose your departure and destination islands from our network.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm relative">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-[#0066CC] text-white rounded-full flex items-center justify-center font-medium">2</div>
              <h3 className="text-xl font-semibold mb-4 text-[#1D1D1F]">Book Your Journey</h3>
              <p className="text-[#86868B]">Select date, time, and number of passengers for your trip.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm relative">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-[#0066CC] text-white rounded-full flex items-center justify-center font-medium">3</div>
              <h3 className="text-xl font-semibold mb-4 text-[#1D1D1F]">Travel with Ease</h3>
              <p className="text-[#86868B]">Receive your e-ticket and enjoy a comfortable transfer between islands.</p>
            </div>
          </div>
          
          <div className="flex justify-center mt-12">
            <Link to="/booking" className="inline-flex items-center bg-[#0066CC] hover:bg-[#0055B0] text-white font-medium py-3 px-6 rounded-xl transition-all duration-300">
              Start Booking Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
        
        {/* Testimonials - Simplified */}
        <div className="py-16">
          <h2 className="text-3xl font-semibold text-[#1D1D1F] mb-12 text-center">Customer Experiences</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="flex text-[#0066CC]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-[#86868B] mb-4">"The speedboat service was excellent! Clean boats, punctual departures and friendly staff."</p>
              <div className="font-medium text-[#1D1D1F]">- Sarah J.</div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="flex text-[#0066CC]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-[#86868B] mb-4">"Booking was simple and straightforward. The online system worked perfectly."</p>
              <div className="font-medium text-[#1D1D1F]">- Michael T.</div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="flex text-[#0066CC]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-[#86868B] mb-4">"The captain was professional and the journey was smooth. Will definitely use Retour again!"</p>
              <div className="font-medium text-[#1D1D1F]">- Emma L.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
