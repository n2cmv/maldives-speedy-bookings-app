
import { Anchor, ChevronRight } from "lucide-react";
import ContentSection from "./ContentSection";

const activities = [
  {
    imageSrc: "/lovable-uploads/d4c89786-07eb-4efc-9bdc-c3520c8c1231.png",
    title: "Whale Shark Spotting",
    description: "Swim alongside magnificent whale sharks in their natural habitat."
  },
  {
    imageSrc: "/lovable-uploads/4a16a25b-4f38-429c-a0d8-d70234b02187.png",
    title: "Dolphin Cruise",
    description: "Enjoy an evening cruise watching playful dolphins in the sunset."
  },
  {
    imageSrc: "/lovable-uploads/3d2bf820-e6f5-4202-99a3-331f42903cd8.png",
    title: "Snorkeling Adventure",
    description: "Explore vibrant coral reefs and diverse marine life up close."
  },
  {
    imageSrc: "/lovable-uploads/62af84cd-6d65-4501-aeaf-6eaeb7e0e378.png",
    title: "Sandbank Picnic",
    description: "Enjoy a private picnic on a pristine sandbank in the middle of the ocean."
  },
  {
    imageSrc: "/lovable-uploads/96956a23-2383-45ab-b32a-505d1e3d40fd.png",
    title: "Sunset Fishing",
    description: "Experience traditional Maldivian line fishing as the sun sets."
  },
  {
    imageSrc: "/lovable-uploads/d4d0c569-2079-4d9b-9a1a-4ceb17a607a9.png",
    title: "Scuba Diving",
    description: "Dive into the deep blue and discover the underwater treasures of the Maldives."
  }
];

const ExcursionsSection = () => {
  return (
    <ContentSection
      tagline="MARINE ADVENTURES"
      title="Sea Escapes Unleashed"
      description="Explore marine life up close like never before. Set off from your island for a true secluded experience in the heart of the sea."
      items={activities}
      ctaLink="/activities"
      ctaText="Book Now"
      icon={<>
        <Anchor className="w-5 h-5" />
        <ChevronRight className="w-4 h-4 ml-1" />
      </>}
    />
  );
};

export default ExcursionsSection;
