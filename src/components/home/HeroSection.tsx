
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const HeroSection = () => {
  const { t } = useTranslation();
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

  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight * 0.8,
      behavior: "smooth"
    });
  };
  
  return (
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
    </div>
  );
};

export default HeroSection;
