
import { MapPin, ChevronRight } from "lucide-react";
import ContentSection from "./ContentSection";
import { islands } from "./data/tours-data";

const IslandsSection = () => {
  return (
    <ContentSection
      tagline="ISLAND DISCOVERY"
      title="Discover Islands"
      description="Explore the breathtaking local islands of Maldives with their unique cultures, pristine beaches, and authentic experiences waiting to be discovered."
      items={islands}
      ctaLink="/islands"
      ctaText="Explore Islands"
      icon={<>
        <MapPin className="w-5 h-5" />
        <ChevronRight className="w-4 h-4 ml-1" />
      </>}
    />
  );
};

export default IslandsSection;
