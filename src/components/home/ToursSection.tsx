
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import ExcursionsSection from "./ExcursionsSection";
import IslandsSection from "./IslandsSection";

const ToursSection = () => {
  const isMobile = useIsMobile();
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  useEffect(() => {
    if (isMobile) {
      const timer = setTimeout(() => {
        setShowScrollIndicator(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isMobile]);

  return (
    <div className="space-y-16">
      <ExcursionsSection />
      <IslandsSection />
    </div>
  );
};

export default ToursSection;
