
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import BookingTypeModal from "../BookingTypeModal";

const HeroSection = () => {
  const { t } = useTranslation();
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const { data } = await supabase.storage
          .from('videos')
          .getPublicUrl('maldives-background.mp4');
          
        if (data?.publicUrl) {
          setVideoUrl(data.publicUrl);
        } else {
          setVideoError(true);
        }
      } catch (error) {
        setVideoError(true);
      }
      setIsLoading(false);
    };
    
    fetchVideo();
  }, []);

  // New timeout logic for video loading
  useEffect(() => {
    if (videoUrl) {
      const videoLoadTimeout = setTimeout(() => {
        const videoElement = document.querySelector('video');
        if (videoElement && videoElement.readyState < 2) {
          // If video hasn't loaded enough to play (readyState < 2), set error
          setVideoError(true);
        }
      }, 5000); // 5 seconds timeout

      return () => clearTimeout(videoLoadTimeout);
    }
  }, [videoUrl]);

  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight * 0.8,
      behavior: "smooth"
    });
  };
  
  return (
    <div className="relative w-full h-[90vh] overflow-hidden mb-16">
      <div className="absolute inset-0 w-full h-full">
        {isLoading ? (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-ocean border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : videoUrl && !videoError ? (
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
            onError={() => setVideoError(true)}
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            src="/lovable-uploads/8a691bc7-4569-4e6b-ae20-72ea264d4c45.png"
            alt="Maldives Aerial View"
            className="w-full h-full object-cover"
          />
        )}
      </div>
      
      <div className="absolute inset-0 bg-black/30"></div>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-semibold text-white tracking-tight mb-6 drop-shadow-md">
          <span className="text-white">Easy Speedboat</span><br />
          Transfers & Trips!
        </h1>
        
        <p className="text-xl md:text-2xl text-white mb-12 max-w-2xl leading-relaxed drop-shadow-md">
          Seamless speedboat transfers between Maldivian islands.
          Efficient, reliable, and designed with you in mind.
        </p>
        
        <button 
          onClick={() => setShowBookingModal(true)} 
          className="inline-flex items-center bg-[#0AB3B8] hover:bg-[#0AB3B8]/80 text-white font-medium py-4 px-10 rounded-xl shadow-lg transition-all duration-300 text-xl"
        >
          {t('common.bookNow')}
          <ArrowRight className="ml-2 h-5 w-5" />
        </button>
      </div>
      
      <div className="absolute bottom-12 left-0 right-0 flex justify-center">
        <button 
          onClick={handleScrollDown}
          className="flex flex-col items-center text-white hover:text-[#0AB3B8] transition-colors duration-300 cursor-pointer"
          aria-label="Explore more"
        >
          <span className="text-sm font-medium mb-2">Explore more</span>
          <ChevronDown className="h-6 w-6 animate-bounce" />
        </button>
      </div>
      
      <BookingTypeModal 
        isOpen={showBookingModal} 
        onClose={() => setShowBookingModal(false)} 
      />
    </div>
  );
};

export default HeroSection;
