
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CarouselSection from "./CarouselSection";

interface ContentSectionProps {
  tagline: string;
  title: string;
  description: string;
  items: Array<{
    imageSrc: string;
    title: string;
    description: string;
  }>;
  ctaLink: string;
  ctaText: string;
  icon: ReactNode;
}

const ContentSection = ({
  tagline,
  title,
  description,
  items,
  ctaLink,
  ctaText,
  icon
}: ContentSectionProps) => {
  return (
    <div className="py-12 -mt-10">
      <div className="bg-[#F8FCFA] rounded-3xl p-8 md:p-16 overflow-hidden"> 
        <div className="mb-12 max-w-md">
          <span className="uppercase text-sm font-medium tracking-wider text-[#0AB3B8]">{tagline}</span>
          <h2 className="text-4xl md:text-5xl font-semibold text-[#1D1D1F] mt-2 mb-6">{title}</h2>
          <p className="text-[#505056] text-lg leading-relaxed">
            {description}
          </p>
        </div>
        
        <CarouselSection items={items} />
        
        <div className="flex justify-center mt-12">
          <Link to={ctaLink}>
            <Button className="bg-ocean hover:bg-ocean-dark text-white px-6 py-6 rounded-lg shadow-md flex items-center gap-2 text-base mx-auto">
              {icon}
              {ctaText}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ContentSection;
