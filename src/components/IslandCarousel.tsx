
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card } from "@/components/ui/card";

const IslandCarousel = () => {
  const islandImages = [
    {
      src: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21",
      alt: "Beautiful ocean waves in the Maldives",
      title: "Crystal Clear Waters"
    },
    {
      src: "https://images.unsplash.com/photo-1518877593221-1f28583780b4",
      alt: "Humpback whale jumping in Maldivian sea",
      title: "Marine Life"
    },
    {
      src: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb",
      alt: "Scenic view of Maldives islands",
      title: "Island Paradise"
    }
  ];

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent>
        {islandImages.map((image, index) => (
          <CarouselItem key={index} className="md:basis-2/3 lg:basis-1/2">
            <div className="p-1">
              <Card className="overflow-hidden border-none shadow-lg">
                <AspectRatio ratio={16 / 9}>
                  <div className="relative w-full h-full">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="object-cover w-full h-full rounded-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                      <h3 className="text-white text-2xl font-semibold">{image.title}</h3>
                    </div>
                  </div>
                </AspectRatio>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2 bg-white/80" />
      <CarouselNext className="right-2 bg-white/80" />
    </Carousel>
  );
};

export default IslandCarousel;
