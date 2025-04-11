
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  HeroSection, 
  ToursSection, 
  WhyChooseUsSection, 
  HowToBookSection
} from "./home";

const WelcomeSection = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-[80vh] font-[SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif]">
      <HeroSection />
      
      <div className="max-w-5xl mx-auto">
        <ToursSection />
        <WhyChooseUsSection />
        <HowToBookSection />
      </div>
    </div>
  );
};

export default WelcomeSection;
