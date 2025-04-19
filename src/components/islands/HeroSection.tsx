import { Star } from "lucide-react";
import { IslandDetails } from "@/types/island";
interface HeroSectionProps {
  islandData: IslandDetails;
}
const HeroSection = ({
  islandData
}: HeroSectionProps) => {
  // Default hero image if one is not provided
  const heroImage = islandData.heroImage || "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?q=80&w=3433&auto=format&fit=crop";
  return <div className="relative h-[70vh] overflow-hidden">
      <img src={heroImage} alt={islandData.name} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/30 flex items-end">
        <div className="container mx-auto px-4 pb-12">
          <div className="flex flex-col items-center text-center md:text-left md:items-start text-white max-w-4xl">
            <div className="bg-ocean px-4 py-1 rounded-full text-sm font-medium mb-4">
              {islandData.location?.atoll || 'Maldives'}
            </div>
            <h1 className="text-4xl font-bold mb-4 text-slate-50 md:text-6xl">
              {islandData.name}
            </h1>
            <div className="flex mb-4">
              {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-5 h-5 text-yellow-400 fill-yellow-400" />)}
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default HeroSection;