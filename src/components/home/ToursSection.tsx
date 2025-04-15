
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Anchor, ChevronRight, MapPin } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
type ActivityCardProps = {
  imageSrc: string;
  title: string;
  description: string;
  isFirst?: boolean;
};
const ActivityCard = ({
  imageSrc,
  title,
  description,
  isFirst = false
}: ActivityCardProps) => {
  const [transform, setTransform] = useState('');
  const cardRef = useRef<HTMLDivElement>(null);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = -1 * ((y / rect.height - 0.5) * 5);
    const rotateY = (x / rect.width - 0.5) * 5;
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
  };
  const handleMouseLeave = () => {
    setTransform('');
  };
  return <div className="px-1"> 
      <div ref={cardRef} className="space-y-3 transition-all duration-200 ease-out transform-gpu max-w-[280px] mx-auto" style={{
      transform
    }} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
        <div className="overflow-hidden rounded-3xl h-72 shadow-md">
          <img src={imageSrc} alt={title} className="w-full h-full object-cover" />
        </div>
        <h3 className="text-2xl font-semibold text-[#1D1D1F] mt-4">{title}</h3>
        <p className="text-[#505056] leading-relaxed">{description}</p>
      </div>
    </div>;
};
const ToursSection = () => {
  const activities = [{
    imageSrc: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2068&q=80",
    title: "Fishing",
    description: "Cast your lines from island piers or venture out to the sea for fishing."
  }, {
    imageSrc: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80",
    title: "Whale Sharks",
    description: "Encounter gentle whale sharks in Maldives' Baa and Ari Atolls year-round."
  }, {
    imageSrc: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    title: "Sharks",
    description: "Spot various sharks in Maldives—from docile nurse to thrilling tiger sharks."
  }, {
    imageSrc: "https://images.unsplash.com/photo-1513316564811-ee3c49558c8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    title: "Manta Rays",
    description: "Visit a secluded atoll for a chance to swim with these majestic creatures."
  }, {
    imageSrc: "https://images.unsplash.com/photo-1582160540665-34914319be0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    title: "Turtles",
    description: "Swim alongside gentle sea turtles in their natural habitat in crystal clear waters."
  }];
  
  const islands = [{
    imageSrc: "https://images.unsplash.com/photo-1512100356356-de1b84283e18?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80",
    title: "Dhigurah",
    description: "A paradise for whale shark enthusiasts with pristine beaches and vibrant marine life."
  }, {
    imageSrc: "https://images.unsplash.com/photo-1586861256632-52a3db1bf5ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=2012&q=80",
    title: "Dhangethi",
    description: "Authentic Maldivian culture meets stunning beaches and rich coral reefs."
  }, {
    imageSrc: "https://images.unsplash.com/photo-1589979481223-deb893043163?ixlib=rb-4.0.3&auto=format&fit=crop&w=2076&q=80",
    title: "Maamigili",
    description: "Known for its incredible diving spots and abundant marine wildlife."
  }, {
    imageSrc: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80",
    title: "Fenfushi",
    description: "Untouched natural beauty with traditional Maldivian hospitality and charm."
  }, {
    imageSrc: "https://images.unsplash.com/photo-1540202404-a2f29016b523?ixlib=rb-4.0.3&auto=format&fit=crop&w=2333&q=80",
    title: "Thoddoo",
    description: "Famous for lush vegetation, fruit farms, and breathtaking beach views."
  }];
  
  const isMobile = useIsMobile();
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [api, setApi] = useState<any>(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  useEffect(() => {
    if (isMobile) {
      const timer = setTimeout(() => {
        setShowScrollIndicator(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isMobile]);
  const scrollPrev = () => {
    api?.scrollPrev();
  };
  const scrollNext = () => {
    api?.scrollNext();
  };
  return <div className="space-y-16">
      {/* Island Exploration Section - Now moved to the top */}
      <div className="py-12 -mt-10">
        <div className="bg-[#F8FCFA] rounded-3xl p-8 md:p-16 overflow-hidden"> 
          <div className="mb-12 max-w-md">
            <span className="uppercase text-sm font-medium tracking-wider text-[#0AB3B8]">Speed boat transfers</span>
            <h2 className="text-4xl md:text-5xl font-semibold text-[#1D1D1F] mt-2 mb-6">Popular Islands</h2>
            <p className="text-[#505056] text-lg leading-relaxed">
              Discover unique island landscapes and hidden gems.
              Experience the untouched beauty of the Maldivian archipelago.
            </p>
          </div>
          
          <div className="relative overflow-hidden"> 
            {isMobile && <>
                <button onClick={scrollPrev} className="absolute left-2 top-1/3 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-white border border-input shadow-sm flex items-center justify-center hover:bg-accent hover:text-accent-foreground" aria-label="Previous slide">
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button onClick={scrollNext} className="absolute right-2 top-1/3 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-white border border-input shadow-sm flex items-center justify-center hover:bg-accent hover:text-accent-foreground" aria-label="Next slide">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </>}

            <Carousel ref={carouselRef} setApi={setApi} opts={{
            align: "start",
            dragFree: true
          }} className="w-full">
              <CarouselContent className="-ml-2 md:-ml-2">
                {activities.map((activity, index) => <CarouselItem key={index} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/3 xl:basis-1/4 pl-2 md:pl-2">
                    <ActivityCard imageSrc={activity.imageSrc} title={activity.title} description={activity.description} />
                  </CarouselItem>)}
              </CarouselContent>
              <div className="hidden md:block">
                <CarouselPrevious className="absolute left-4 top-1/3 -translate-y-1/2" />
                <CarouselNext className="absolute right-4 top-1/3 -translate-y-1/2" />
              </div>
            </Carousel>
          </div>
          
          <div className="flex justify-center mt-12">
            <Link to="/activities">
              <Button className="bg-ocean hover:bg-ocean-dark text-white px-6 py-6 rounded-lg shadow-md flex items-center gap-2 text-base mx-auto">
                <Anchor className="w-5 h-5" />
                Explore Locations
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Excursions Section */}
      <div className="py-12 -mt-10">
        <div className="bg-[#F8FCFA] rounded-3xl p-8 md:p-16 overflow-hidden"> 
          <div className="mb-12 max-w-md">
            <span className="uppercase text-sm font-medium tracking-wider text-[#0AB3B8]">EXCURSIONS</span>
            <h2 className="text-4xl md:text-5xl font-semibold text-[#1D1D1F] mt-2 mb-6">Beyond the Island</h2>
            <p className="text-[#505056] text-lg leading-relaxed">
              Explore marine life up close like never before.
              Set off from your island for a true secluded
              experience in the heart of the sea.
            </p>
          </div>
          
          <div className="relative overflow-hidden"> 
            {isMobile && <>
                <button onClick={scrollPrev} className="absolute left-2 top-1/3 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-white border border-input shadow-sm flex items-center justify-center hover:bg-accent hover:text-accent-foreground" aria-label="Previous slide">
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button onClick={scrollNext} className="absolute right-2 top-1/3 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-white border border-input shadow-sm flex items-center justify-center hover:bg-accent hover:text-accent-foreground" aria-label="Next slide">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </>}

            <Carousel ref={carouselRef} setApi={setApi} opts={{
            align: "start",
            dragFree: true
          }} className="w-full">
              <CarouselContent className="-ml-2 md:-ml-2">
                {activities.map((activity, index) => <CarouselItem key={index} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/3 xl:basis-1/4 pl-2 md:pl-2">
                    <ActivityCard imageSrc={activity.imageSrc} title={activity.title} description={activity.description} />
                  </CarouselItem>)}
              </CarouselContent>
              <div className="hidden md:block">
                <CarouselPrevious className="absolute left-4 top-1/3 -translate-y-1/2" />
                <CarouselNext className="absolute right-4 top-1/3 -translate-y-1/2" />
              </div>
            </Carousel>
          </div>
          
          <div className="flex justify-center mt-12">
            <Link to="/activities">
              <Button className="bg-ocean hover:bg-ocean-dark text-white px-6 py-6 rounded-lg shadow-md flex items-center gap-2 text-base mx-auto">
                <Anchor className="w-5 h-5" />
                Explore Activities
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Discover Islands Section - New section added below */}
      <div className="py-12 -mt-10">
        <div className="bg-[#F8FCFA] rounded-3xl p-8 md:p-16 overflow-hidden"> 
          <div className="mb-12 max-w-md">
            <span className="uppercase text-sm font-medium tracking-wider text-[#0AB3B8]">ISLAND DISCOVERY</span>
            <h2 className="text-4xl md:text-5xl font-semibold text-[#1D1D1F] mt-2 mb-6">Discover Islands</h2>
            <p className="text-[#505056] text-lg leading-relaxed">
              Explore the breathtaking local islands of Maldives with
              their unique cultures, pristine beaches, and authentic
              experiences waiting to be discovered.
            </p>
          </div>
          
          <div className="relative overflow-hidden"> 
            {isMobile && <>
                <button onClick={scrollPrev} className="absolute left-2 top-1/3 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-white border border-input shadow-sm flex items-center justify-center hover:bg-accent hover:text-accent-foreground" aria-label="Previous slide">
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button onClick={scrollNext} className="absolute right-2 top-1/3 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-white border border-input shadow-sm flex items-center justify-center hover:bg-accent hover:text-accent-foreground" aria-label="Next slide">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </>}

            <Carousel ref={carouselRef} setApi={setApi} opts={{
            align: "start",
            dragFree: true
          }} className="w-full">
              <CarouselContent className="-ml-2 md:-ml-2">
                {islands.map((island, index) => <CarouselItem key={index} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/3 xl:basis-1/4 pl-2 md:pl-2">
                    <ActivityCard imageSrc={island.imageSrc} title={island.title} description={island.description} />
                  </CarouselItem>)}
              </CarouselContent>
              <div className="hidden md:block">
                <CarouselPrevious className="absolute left-4 top-1/3 -translate-y-1/2" />
                <CarouselNext className="absolute right-4 top-1/3 -translate-y-1/2" />
              </div>
            </Carousel>
          </div>
          
          <div className="flex justify-center mt-12">
            <Link to="/islands">
              <Button className="bg-ocean hover:bg-ocean-dark text-white px-6 py-6 rounded-lg shadow-md flex items-center gap-2 text-base mx-auto">
                <MapPin className="w-5 h-5" />
                Explore Islands
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>;
};
export default ToursSection;
