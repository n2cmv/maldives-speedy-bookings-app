
import { IslandDetails } from "@/types/island";
import { GalleryHorizontal } from "lucide-react";

interface GalleryTabProps {
  islandData: IslandDetails;
}

const GalleryTab = ({ islandData }: GalleryTabProps) => {
  // Create a gallery from both heroImage and galleryImages, filtering out any null values
  const images = [
    islandData.heroImage, 
    ...(islandData.galleryImages || [])
  ].filter(Boolean);
  
  return (
    <div className="pt-8">
      {images.length > 0 ? (
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-8">
            <GalleryHorizontal className="h-6 w-6 text-ocean" />
            <h2 className="text-3xl font-bold text-gray-900">Photo Gallery</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div 
                key={index} 
                className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group relative"
              >
                <img 
                  src={image} 
                  alt={`${islandData.name} - ${index + 1}`} 
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <GalleryHorizontal className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No gallery images available for this island yet.</p>
        </div>
      )}
    </div>
  );
};

export default GalleryTab;
