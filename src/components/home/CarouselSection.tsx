
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef, useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";
import ActivityCard from "./ActivityCard";

interface CarouselSectionProps {
  items: Array<{
    imageSrc: string;
    title: string;
    description: string;
  }>;
}

const CarouselSection = ({ items }: CarouselSectionProps) => {
  const isMobile = useIsMobile();
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [api, setApi] = useState<any>(null);

  const scrollPrev = () => {
    api?.scrollPrev();
  };

  const scrollNext = () => {
    api?.scrollNext();
  };

  return (
    <div className="relative overflow-hidden"> 
      {isMobile && (
        <>
          <button 
            onClick={scrollPrev} 
            className="absolute left-2 top-1/3 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-white border border-input shadow-sm flex items-center justify-center hover:bg-accent hover:text-accent-foreground" 
            aria-label="Previous slide"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button 
            onClick={scrollNext} 
            className="absolute right-2 top-1/3 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-white border border-input shadow-sm flex items-center justify-center hover:bg-accent hover:text-accent-foreground" 
            aria-label="Next slide"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </>
      )}

      <Carousel 
        ref={carouselRef} 
        setApi={setApi} 
        opts={{
          align: "start",
          dragFree: true
        }} 
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-2">
          {items.map((item, index) => (
            <CarouselItem key={index} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/3 xl:basis-1/4 pl-2 md:pl-2">
              <ActivityCard 
                imageSrc={item.imageSrc} 
                title={item.title} 
                description={item.description} 
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden md:block">
          <CarouselPrevious className="absolute left-4 top-1/3 -translate-y-1/2" />
          <CarouselNext className="absolute right-4 top-1/3 -translate-y-1/2" />
        </div>
      </Carousel>
    </div>
  );
};

export default CarouselSection;
