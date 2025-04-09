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
        
        <div className="absolute inset-0 bg-black/50"></div>
        
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
        <div className="py-16 px-4">
          <div className="bg-[#F8FCFA] rounded-3xl p-8 md:p-16">
            <div className="mb-10">
              <span className="uppercase text-sm font-medium tracking-wider text-[#0AB3B8]">EXCURSIONS</span>
              <h2 className="text-4xl md:text-5xl font-semibold text-[#1D1D1F] mt-2 mb-6">Beyond the Island</h2>
              <p className="text-[#505056] max-w-md text-lg">
                Explore marine life up close like never before.
                Set off from your island for a true secluded
                experience in the heart of the sea.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              <div className="space-y-4">
                <div className="overflow-hidden rounded-2xl h-64">
                  <img 
                    src="https://images.unsplash.com/photo-1513316564811-ee3c49558c8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                    alt="Manta Ray Experience" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-[#1D1D1F]">Manta Ray Experience</h3>
                <p className="text-[#505056]">Get up close with these majestic creatures in their natural habitat.</p>
                <p className="font-medium text-[#0AB3B8]">$70 per person</p>
              </div>
              
              <div className="space-y-4">
                <div className="overflow-hidden rounded-2xl h-64">
                  <img 
                    src="https://images.unsplash.com/photo-1583212292454-1fe6229603b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80" 
                    alt="Whale Shark Adventure" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-[#1D1D1F]">Whale Shark Adventure</h3>
                <p className="text-[#505056]">Encounter gentle whale sharks in Maldives' Baa and Ari Atolls year-round.</p>
                <p className="font-medium text-[#0AB3B8]">$80 per person</p>
              </div>
              
              <div className="space-y-4">
                <div className="overflow-hidden rounded-2xl h-64">
                  <img 
                    src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                    alt="Turtle Expedition" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-[#1D1D1F]">Shark Encounters</h3>
                <p className="text-[#505056]">Spot various sharks in Maldives—from docile nurse to thrilling tiger sharks.</p>
                <p className="font-medium text-[#0AB3B8]">$50 per person</p>
              </div>
              
              <div className="space-y-4">
                <div className="overflow-hidden rounded-2xl h-64">
                  <img 
                    src="https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2068&q=80" 
                    alt="Sunset Fishing" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-[#1D1D1F]">Sunset Fishing</h3>
                <p className="text-[#505056]">Cast your lines from island piers or venture out to the sea for fishing.</p>
                <p className="font-medium text-[#0AB3B8]">$55 per person</p>
              </div>
              
              <div className="space-y-4">
                <div className="overflow-hidden rounded-2xl h-64">
                  <img 
                    src="https://images.unsplash.com/photo-1544551763-92ab472cad5d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                    alt="Sand Bank Escape" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-[#1D1D1F]">Sand Bank Escape</h3>
                <p className="text-[#505056]">Visit a secluded sandbank for a private beach day away from everyone.</p>
                <p className="font-medium text-[#0AB3B8]">$120 per trip</p>
              </div>
              
              <div className="space-y-4">
                <div className="overflow-hidden rounded-2xl h-64">
                  <img 
                    src="https://images.unsplash.com/photo-1602002418816-5c0aeef426aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80" 
                    alt="Resort Day Trip" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-[#1D1D1F]">Resort Day Trip</h3>
                <p className="text-[#505056]">Enjoy a full day of luxury amenities at one of our partner resorts.</p>
                <p className="font-medium text-[#0AB3B8]">$75 per person</p>
              </div>
            </div>
            
            <div className="flex justify-center mt-12">
              <Link to="/booking" className="inline-flex items-center bg-[#0AB3B8] hover:bg-[#0055B0] text-white font-medium py-3 px-6 rounded-xl transition-all duration-300">
                Book an Activity
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
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
          <h2 className="text-3xl font-semibold text-[#1D1D1F] mb-12 text-center">How to book a Speedboat?</h2>
          
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
