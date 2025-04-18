
import { IslandDetails } from "@/types/island";

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
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Photo Gallery</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image, index) => (
              <div key={index} className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <img 
                  src={image} 
                  alt={`${islandData.name} - ${index}`} 
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No gallery images available for this island yet.</p>
        </div>
      )}
    </div>
  );
};

export default GalleryTab;
