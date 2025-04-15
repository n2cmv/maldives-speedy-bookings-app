
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  HeroSection, 
  ToursSection, 
  WhyChooseUsSection, 
  HowToBookSection
} from "./home";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, ChevronRight } from "lucide-react";

const WelcomeSection = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-[80vh] font-[SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif]">
      <HeroSection />
      
      <div className="max-w-5xl mx-auto">
        <ToursSection />
        <WhyChooseUsSection />
        <HowToBookSection />
        
        <div className="py-12 -mt-10">
          <div className="bg-[#F8FCFA] rounded-3xl p-8 md:p-16 overflow-hidden">
            <div className="mb-8 max-w-md">
              <span className="uppercase text-sm font-medium tracking-wider text-[#0AB3B8]">DESTINATIONS</span>
              <h2 className="text-4xl md:text-5xl font-semibold text-[#1D1D1F] mt-2 mb-6">Explore Islands</h2>
              <p className="text-[#505056] text-lg leading-relaxed">
                Discover more about our beautiful destinations. 
                Plan your visit with detailed information about accommodations, activities, and more.
              </p>
            </div>
            
            <Link to="/islands">
              <Button 
                className="bg-ocean hover:bg-ocean-dark text-white px-6 py-6 rounded-lg shadow-md flex items-center gap-2 text-base"
              >
                <MapPin className="w-5 h-5" />
                View All Islands
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
