
import { Anchor, ChevronRight } from "lucide-react";
import ContentSection from "./ContentSection";
import { speedboatTransfers } from "./data/tours-data";

const ExcursionsSection = () => {
  return (
    <ContentSection
      tagline="EXCURSIONS"
      title="Beyond the Island"
      description="Explore marine life up close like never before. Set off from your island for a true secluded experience in the heart of the sea."
      items={speedboatTransfers}
      ctaLink="/activities"
      ctaText="Explore Activities"
      icon={<>
        <Anchor className="w-5 h-5" />
        <ChevronRight className="w-4 h-4 ml-1" />
      </>}
    />
  );
};

export default ExcursionsSection;
