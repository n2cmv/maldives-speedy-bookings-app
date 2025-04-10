
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem,
  CarouselNext,
  CarouselPrevious 
} from "@/components/ui/carousel";

// Define a type for activity card props
type ActivityCardProps = {
  imageSrc: string;
  title: string;
  description: string;
};

const ActivityCard = ({ imageSrc, title, description }: ActivityCardProps) => {
  const [transform, setTransform] = useState('');
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Calculate mouse position relative to card
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation based on mouse position
    // Maximum rotation is 8 degrees
    const rotateX = -1 * ((y / rect.height - 0.5) * 8);
    const rotateY = (x / rect.width - 0.5) * 8;
    
    // Apply transform
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
  };

  const handleMouseLeave = () => {
    // Reset transform when mouse leaves
    setTransform('');
  };

  return (
    <div 
      ref={cardRef}
      className="space-y-3 transition-all duration-200 ease-out"
      style={{ transform }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="overflow-hidden rounded-3xl h-72 shadow-md">
        <img 
          src={imageSrc} 
          alt={title} 
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="text-2xl font-semibold text-[#1D1D1F] mt-4">{title}</h3>
      <p className="text-[#505056] leading-relaxed">{description}</p>
    </div>
  );
};

const ToursSection = () => {
  const activities = [
    {
      imageSrc: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2068&q=80",
      title: "Fishing",
      description: "Cast your lines from island piers or venture out to the sea for fishing."
    },
    {
      imageSrc: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80",
      title: "Whale Sharks",
      description: "Encounter gentle whale sharks in Maldives' Baa and Ari Atolls year-round."
    },
    {
      imageSrc: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      title: "Sharks",
      description: "Spot various sharks in Maldives—from docile nurse to thrilling tiger sharks."
    },
    {
      imageSrc: "https://images.unsplash.com/photo-1513316564811-ee3c49558c8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      title: "Manta Rays",
      description: "Visit a secluded atoll for a chance to swim with these majestic creatures."
    },
    {
      imageSrc: "https://images.unsplash.com/photo-1582160540665-34914319be0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      title: "Turtles",
      description: "Swim alongside gentle sea turtles in their natural habitat in crystal clear waters."
    }
  ];

  return (
    <div className="py-16">
      <div className="bg-[#F8FCFA] rounded-3xl p-8 md:p-16">
        <div className="mb-12 max-w-md">
          <span className="uppercase text-sm font-medium tracking-wider text-[#0AB3B8]">EXCURSIONS</span>
          <h2 className="text-4xl md:text-5xl font-semibold text-[#1D1D1F] mt-2 mb-6">Beyond the Island</h2>
          <p className="text-[#505056] text-lg leading-relaxed">
            Explore marine life up close like never before.
            Set off from your island for a true secluded
            experience in the heart of the sea.
          </p>
        </div>
        
        <div className="relative -mx-4 md:-mx-16 lg:-mx-20">
          <Carousel
            opts={{
              align: "start",
              dragFree: true
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {activities.map((activity, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 basis-4/5 sm:basis-2/3 md:basis-1/2 lg:basis-2/5">
                  <ActivityCard 
                    imageSrc={activity.imageSrc}
                    title={activity.title}
                    description={activity.description}
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
        
        <div className="flex justify-center mt-12">
          <Link to="/booking" className="inline-flex items-center bg-[#0AB3B8] hover:bg-[#0055B0] text-white font-medium py-3 px-6 rounded-xl transition-all duration-300">
            Book an Activity
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ToursSection;
