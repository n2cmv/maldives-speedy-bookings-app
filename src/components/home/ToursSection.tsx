
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem,
  CarouselNext,
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

// Define a type for activity card props
type ActivityCardProps = {
  imageSrc: string;
  title: string;
  description: string;
};

const ActivityCard = ({ imageSrc, title, description }: ActivityCardProps) => (
  <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-300 h-full">
    <div className="overflow-hidden">
      <AspectRatio ratio={4/3} className="bg-muted">
        <img 
          src={imageSrc} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </AspectRatio>
    </div>
    <CardContent className="p-5">
      <h3 className="text-xl font-semibold text-[#1D1D1F] mb-2">{title}</h3>
      <p className="text-[#505056] text-sm leading-relaxed">{description}</p>
    </CardContent>
  </Card>
);

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
    <div className="py-16 px-4 sm:px-0">
      <div className="bg-white rounded-3xl p-8 md:p-12 lg:p-16 shadow-sm">
        <div className="mb-10 lg:mb-12 max-w-lg">
          <span className="uppercase text-sm font-medium tracking-wider text-[#0AB3B8]">EXCURSIONS</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#1D1D1F] mt-2 mb-4">Things To Do</h2>
          <p className="text-[#505056] text-base md:text-lg leading-relaxed">
            Explore marine life up close like never before.
            Set off from your island for a true secluded
            experience in the heart of the sea.
          </p>
        </div>
        
        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
              dragFree: true
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {activities.map((activity, index) => (
                <CarouselItem 
                  key={index} 
                  className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/5"
                >
                  <ActivityCard 
                    imageSrc={activity.imageSrc}
                    title={activity.title}
                    description={activity.description}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <div className="hidden md:block">
              <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white shadow-lg border-none hover:bg-[#0AB3B8] hover:text-white" />
              <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white shadow-lg border-none hover:bg-[#0AB3B8] hover:text-white" />
            </div>
          </Carousel>
        </div>
        
        <div className="mt-10 md:mt-12 flex justify-center">
          <Link 
            to="/booking" 
            className="inline-flex items-center bg-[#0AB3B8] text-white font-medium py-3 px-6 rounded-xl 
            transition-all duration-300 hover:bg-[#0897a4] shadow-sm hover:shadow-md"
          >
            Explore More Activities
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ToursSection;
