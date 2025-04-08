
import { ArrowRight, Ship, MapPin, Calendar, Users, Star, Fish, Turtle, Sun, Utensils } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const WelcomeSection = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchVideo = async () => {
      // For now, we'll use a default video URL since no video has been uploaded yet
      // Once a video is uploaded to Supabase, you can replace this with the actual path
      const { data } = await supabase.storage
        .from('videos')
        .getPublicUrl('maldives-background.mp4');
        
      if (data?.publicUrl) {
        setVideoUrl(data.publicUrl);
      }
      setIsLoading(false);
    };
    
    fetchVideo();
  }, []);
  
  return (
    <div className="min-h-[80vh] font-[SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif]">
      <div className="relative w-full h-[80vh] overflow-hidden mb-16">
        <div className="absolute inset-0 w-full h-full">
          {isLoading ? (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-ocean border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : videoUrl ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                minWidth: '100%',
                minHeight: '100%'
              }}
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            // Fallback to the previous YouTube iframe if no video is available
            <iframe 
              src="https://www.youtube.com/embed/Voytv2JfdCc?autoplay=1&mute=1&loop=1&playlist=Voytv2JfdCc&controls=0&showinfo=0" 
              title="Experience the Maldives" 
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              frameBorder="0"
              style={{ 
                pointerEvents: 'none',
                width: '300vw',
                height: '300vh',
                objectFit: 'cover',
                objectPosition: 'center',
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%) scale(2)',
                minWidth: '300%',
                minHeight: '300%',
              }}
            ></iframe>
          )}
        </div>
        
        {/* Static dark overlay - adjusted opacity to 50% to make video darker */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        {/* Moving gradient overlay - reduced opacity to 30% */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0AB3B8]/30 via-[#005C99]/30 to-[#0AB3B8]/30 animate-gradient-x"></div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-semibold text-white tracking-tight mb-6 drop-shadow-md">
            <span className="text-white">Easy Speedboat</span><br />
            Transfers & Trips!
          </h1>
          
          <p className="text-xl md:text-2xl text-white mb-12 max-w-2xl leading-relaxed drop-shadow-md">
            Seamless speedboat transfers between Maldivian islands.
            Efficient, reliable, and designed with you in mind.
          </p>
          
          <Link to="/booking" className="inline-flex items-center bg-[#0AB3B8] hover:bg-[#0AB3B8]/80 text-white font-medium py-4 px-10 rounded-xl shadow-lg transition-all duration-300 text-xl">
            {t('common.bookNow')}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
      
      <div className="max-w-5xl mx-auto">
        <div className="py-16">
          <h2 className="text-3xl font-semibold text-[#1D1D1F] mb-6 text-center">Exciting Tours & Activities</h2>
          <p className="text-center text-[#86868B] mb-12 max-w-2xl mx-auto">
            Discover the beauty of Maldives with our curated experiences and guided tours
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 text-center">
              <div className="w-16 h-16 bg-[#0AB3B8]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Fish className="h-8 w-8 text-[#0AB3B8]" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#1D1D1F]">Manta Ray Experience</h3>
              <p className="text-[#86868B] mb-4">Get up close with these majestic creatures in their natural habitat.</p>
              <p className="text-[#0AB3B8] font-bold">$70 per person</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 text-center">
              <div className="w-16 h-16 bg-[#0AB3B8]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Fish className="h-8 w-8 text-[#0AB3B8]" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#1D1D1F]">Whale Shark Adventure</h3>
              <p className="text-[#86868B] mb-4">Swim alongside the gentle giants of the ocean in crystal clear waters.</p>
              <p className="text-[#0AB3B8] font-bold">$80 per person</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 text-center">
              <div className="w-16 h-16 bg-[#0AB3B8]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Turtle className="h-8 w-8 text-[#0AB3B8]" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#1D1D1F]">Turtle Expedition</h3>
              <p className="text-[#86868B] mb-4">Meet sea turtles in their natural environment with expert guides.</p>
              <p className="text-[#0AB3B8] font-bold">$50 per person</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 text-center">
              <div className="w-16 h-16 bg-[#0AB3B8]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sun className="h-8 w-8 text-[#0AB3B8]" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#1D1D1F]">Sand Bank Escape</h3>
              <p className="text-[#86868B] mb-4">Visit a secluded sandbank near Machafushi Resort for a private beach day.</p>
              <p className="text-[#0AB3B8] font-bold">$120 per trip</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 text-center">
              <div className="w-16 h-16 bg-[#0AB3B8]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="h-8 w-8 text-[#0AB3B8]" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#1D1D1F]">Resort Day Trip</h3>
              <p className="text-[#86868B] mb-4">Enjoy a full day of luxury amenities at one of our partner resorts.</p>
              <p className="text-[#0AB3B8] font-bold">$75 per person</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 text-center">
              <div className="w-16 h-16 bg-[#0AB3B8]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Ship className="h-8 w-8 text-[#0AB3B8]" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#1D1D1F]">Resort Transfer</h3>
              <p className="text-[#86868B] mb-4">Comfortable and swift boat transfers to and from your resort of choice.</p>
              <p className="text-[#0AB3B8] font-bold">$45 per way</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 text-center">
              <div className="w-16 h-16 bg-[#0AB3B8]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Utensils className="h-8 w-8 text-[#0AB3B8]" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#1D1D1F]">Beach Dinner</h3>
              <p className="text-[#86868B] mb-4">Romantic dining experience on the beach with à la carte menu options.</p>
              <p className="text-[#0AB3B8] font-bold">$40 per person</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 text-center">
              <div className="w-16 h-16 bg-[#0AB3B8]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Fish className="h-8 w-8 text-[#0AB3B8]" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#1D1D1F]">Sunset Fishing</h3>
              <p className="text-[#86868B] mb-4">Traditional Maldivian line fishing during a breathtaking sunset.</p>
              <p className="text-[#0AB3B8] font-bold">$55 per person</p>
            </div>
          </div>
          
          <div className="flex justify-center mt-12">
            <Link to="/booking" className="inline-flex items-center bg-[#0AB3B8] hover:bg-[#0055B0] text-white font-medium py-3 px-6 rounded-xl transition-all duration-300">
              Book an Activity
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
        
        <div className="py-16">
          <h2 className="text-3xl font-semibold text-[#1D1D1F] mb-12 text-center">Why Choose Us</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 text-center">
              <div className="w-16 h-16 bg-[#0AB3B8]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Ship className="h-8 w-8 text-[#0AB3B8]" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-[#1D1D1F]">Premium Fleet</h3>
              <p className="text-[#86868B]">Modern, well-maintained speedboats with comfortable seating and safety features.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 text-center">
              <div className="w-16 h-16 bg-[#0AB3B8]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="h-8 w-8 text-[#0AB3B8]" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-[#1D1D1F]">Full Coverage</h3>
              <p className="text-[#86868B]">Service to all major islands and resorts throughout the Maldives archipelago.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 text-center">
              <div className="w-16 h-16 bg-[#0AB3B8]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-8 w-8 text-[#0AB3B8]" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-[#1D1D1F]">Flexible Scheduling</h3>
              <p className="text-[#86868B]">Daily departures with convenient timing options to fit your travel plans.</p>
            </div>
          </div>
        </div>
        
        <div className="py-16">
          <h2 className="text-3xl font-semibold text-[#1D1D1F] mb-12 text-center">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm relative">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-[#0AB3B8] text-white rounded-full flex items-center justify-center font-medium">1</div>
              <h3 className="text-xl font-semibold mb-4 text-[#1D1D1F]">Select Your Route</h3>
              <p className="text-[#86868B]">Choose your departure and destination islands from our network.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm relative">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-[#0AB3B8] text-white rounded-full flex items-center justify-center font-medium">2</div>
              <h3 className="text-xl font-semibold mb-4 text-[#1D1D1F]">Book Your Journey</h3>
              <p className="text-[#86868B]">Select date, time, and number of passengers for your trip.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm relative">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-[#0AB3B8] text-white rounded-full flex items-center justify-center font-medium">3</div>
              <h3 className="text-xl font-semibold mb-4 text-[#1D1D1F]">Travel with Ease</h3>
              <p className="text-[#86868B]">Receive your e-ticket and enjoy a comfortable transfer between islands.</p>
            </div>
          </div>
          
          <div className="flex justify-center mt-12">
            <Link to="/booking" className="inline-flex items-center bg-[#0AB3B8] hover:bg-[#0055B0] text-white font-medium py-3 px-6 rounded-xl transition-all duration-300">
              Start Booking Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
        
        <div className="py-16">
          <h2 className="text-3xl font-semibold text-[#1D1D1F] mb-12 text-center">Customer Experiences</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="flex text-[#0AB3B8]">
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
                <div className="flex text-[#0AB3B8]">
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
                <div className="flex text-[#0AB3B8]">
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
