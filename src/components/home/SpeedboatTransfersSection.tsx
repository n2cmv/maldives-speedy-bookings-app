
import { Anchor, ChevronRight } from "lucide-react";
import ContentSection from "./ContentSection";
import { speedboatTransfers } from "./data/tours-data";

const SpeedboatTransfersSection = () => {
  return (
    <div className="py-12 -mt-10">
      <ContentSection
        tagline="Speed boat transfers"
        title="Popular Speedboat Transfers"
        description="Discover unique island landscapes and hidden gems. Experience the untouched beauty of the Maldivian archipelago."
        items={speedboatTransfers}
        ctaLink="/speedboat-transfers"
        ctaText="Explore Locations"
        icon={<>
          <Anchor className="w-5 h-5" />
          <ChevronRight className="w-4 h-4 ml-1" />
        </>}
      />
    </div>
  );
};

export default SpeedboatTransfersSection;
