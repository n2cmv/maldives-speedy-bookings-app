
import Header from "@/components/Header";
import WelcomeSection from "@/components/WelcomeSection";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Ship, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto'
    });
  }, [location.pathname]);
  
  // If user lands on homepage with transaction parameter, redirect to payment-confirmation
  useEffect(() => {
    if (location.search.includes('transaction=')) {
      navigate(`/payment-confirmation${location.search}`, { replace: true });
    }
  }, [location.search, navigate]);
  
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
  
  return <div className="min-h-screen bg-[#F5F5F7] overflow-hidden relative">
      <div className="absolute top-20 right-10 w-60 h-60 bg-[#A2D2FF]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-[#A2D2FF]/10 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <Header />
        <main>  {/* Removed pt-24 */}
          <WelcomeSection />
        </main>
      </div>

      {showScrollTop && <button onClick={scrollToTop} className="fixed bottom-32 right-8 z-50 bg-[#0AB3B8]/90 hover:bg-[#0AB3B8] text-white p-3 rounded-full shadow-lg transition-all duration-300" aria-label="Scroll to top">
          <ChevronUp className="h-5 w-5" />
        </button>}

      <div className={`relative z-10 w-full flex flex-col items-center justify-center pb-${isMobile ? '20' : '8'} pt-4 text-sm text-[#86868B]`}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <Ship className="h-4 w-4 text-[#0066CC]" />
          <span className="font-medium text-[#1D1D1F]">Retour Maldives</span>
        </div>
        <p>© 2025 Retour Maldives - Speedboat Transfers &amp; Excursions</p>
      </div>
      
      <WhatsAppButton phoneNumber="+960 7443777" welcomeMessage="Hello! I'm interested in booking a speedboat transfer with Retour Maldives." />
    </div>;
};

export default Index;
