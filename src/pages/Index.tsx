
import Header from "@/components/Header";
import WelcomeSection from "@/components/WelcomeSection";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Ship, ChevronUp, Anchor, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] overflow-hidden relative">
      <div className="absolute top-20 right-10 w-60 h-60 bg-[#A2D2FF]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-[#A2D2FF]/10 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <Header />
        <main className="pt-16">
          <WelcomeSection />
          
          <div className="max-w-4xl mx-auto px-4 py-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-ocean-dark mb-3">
              Explore Exciting Activities
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover the best of Maldives with our curated selection of activities. From swimming with whale sharks to sunset fishing trips, we have something for every adventurer.
            </p>
            
            <Link to="/activities">
              <Button 
                className="bg-ocean hover:bg-ocean-dark text-white px-6 py-6 rounded-lg shadow-md flex items-center gap-2 text-base mx-auto"
              >
                <Anchor className="w-5 h-5" />
                Explore Activities
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </main>
      </div>

      {showScrollTop && (
        <button 
          onClick={scrollToTop}
          className="fixed bottom-32 right-8 z-50 bg-[#0AB3B8]/90 hover:bg-[#0AB3B8] text-white p-3 rounded-full shadow-lg transition-all duration-300"
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      )}

      <div className="relative z-10 w-full flex flex-col items-center justify-center pb-8 pt-4 text-sm text-[#86868B]">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Ship className="h-4 w-4 text-[#0066CC]" />
          <span className="font-medium text-[#1D1D1F]">Retour Maldives</span>
        </div>
        <p>© 2025 Retour Maldives - Premium Speedboat Transfers</p>
      </div>
      
      <WhatsAppButton 
        phoneNumber="+960 7443777" 
        welcomeMessage="Hello! I'm interested in booking a speedboat transfer with Retour Maldives."
      />
    </div>
  );
};

export default Index;
