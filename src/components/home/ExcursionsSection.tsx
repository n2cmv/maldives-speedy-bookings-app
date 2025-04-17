
import { Ship, ChevronRight } from "lucide-react";
import ContentSection from "./ContentSection";

const activities = [
  {
    imageSrc: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    title: "Whale Shark Spotting",
    description: "Swim alongside magnificent whale sharks in their natural habitat."
  },
  {
    imageSrc: "https://images.unsplash.com/photo-1513316564811-ee3c49558c8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    title: "Dolphin Cruise",
    description: "Enjoy an evening cruise watching playful dolphins in the sunset."
  },
  {
    imageSrc: "https://images.unsplash.com/photo-1582160540665-34914319be0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    title: "Snorkeling Adventure",
    description: "Explore vibrant coral reefs and diverse marine life up close."
  },
  {
    imageSrc: "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    title: "Sandbank Picnic",
    description: "Enjoy a private picnic on a pristine sandbank in the middle of the ocean."
  },
  {
    imageSrc: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80",
    title: "Sunset Fishing",
    description: "Experience traditional Maldivian line fishing as the sun sets."
  },
  {
    imageSrc: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2068&q=80",
    title: "Scuba Diving",
    description: "Dive into the deep blue and discover the underwater treasures of the Maldives."
  }
];

const ExcursionsSection = () => {
  return (
    <ContentSection
      tagline="EXCURSIONS"
      title="Beyond the Island"
      description="Explore marine life up close like never before. Set off from your island for a true secluded experience in the heart of the sea."
      items={activities}
      ctaLink="/activities"
      ctaText="Book Now"
      icon={<>
        <Ship className="w-5 h-5" />
        <ChevronRight className="w-4 h-4 ml-1" />
      </>}
    />
  );
};

export default ExcursionsSection;
