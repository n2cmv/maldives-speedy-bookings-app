
import { IslandDetails } from "@/types/island";
import { GalleryHorizontal, Maximize2, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState, useCallback } from "react";

interface GalleryTabProps {
  islandData: IslandDetails;
}

const GalleryTab = ({ islandData }: GalleryTabProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Create a gallery from both heroImage and galleryImages, filtering out any null values
  const images = [
    islandData.heroImage, 
    ...(islandData.galleryImages || [])
  ].filter(Boolean);
  
  const handleImageClick = useCallback((image: string) => {
    setSelectedImage(image);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedImage(null);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!selectedImage) return;
    
    const currentIndex = images.indexOf(selectedImage);
    
    if (e.key === 'ArrowLeft' && currentIndex > 0) {
      setSelectedImage(images[currentIndex - 1]);
    }
    else if (e.key === 'ArrowRight' && currentIndex < images.length - 1) {
      setSelectedImage(images[currentIndex + 1]);
    }
    else if (e.key === 'Escape') {
      handleClose();
    }
  }, [selectedImage, images, handleClose]);
  
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
                onClick={() => handleImageClick(image)}
                className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group relative cursor-pointer"
              >
                <img 
                  src={image} 
                  alt={`${islandData.name} - ${index + 1}`} 
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity">
                  <Maximize2 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>

          <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
            <DialogContent 
              className="max-w-[95vw] max-h-[95vh] p-0 bg-transparent border-none shadow-none" 
              onKeyDown={handleKeyDown}
            >
              <button 
                onClick={handleClose}
                className="absolute right-4 top-4 z-50 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors"
                aria-label="Close fullscreen view"
              >
                <X className="h-6 w-6" />
              </button>
              
              {selectedImage && (
                <div className="relative w-full h-full flex items-center justify-center">
                  <img
                    src={selectedImage}
                    alt="Fullscreen view"
                    className="max-w-full max-h-[90vh] object-contain rounded-lg"
                  />
                  
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm text-white bg-black/50 px-4 py-2 rounded-full">
                    Use arrow keys to navigate • ESC to close
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
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
