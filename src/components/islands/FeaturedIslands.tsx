
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Island } from "@/types/island";
import { Link } from "react-router-dom";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { MapPin, Ship, Compass, ChevronRight } from "lucide-react";

interface FeaturedIslandsProps {
  islands: Island[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const FeaturedIslands = ({ islands, isLoading, page, totalPages, onPageChange }: FeaturedIslandsProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-12 w-12 border-4 border-t-ocean border-opacity-50 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Islands</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {islands.length > 0 ? islands.map(island => (
          <Card key={island.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100">
            <div className="relative h-48">
              <img 
                src={island.name === "A.Dh Dhigurah" 
                  ? "/lovable-uploads/125dc6dd-4147-48d6-8647-6e58d133ba76.png" 
                  : (island.name === "A.Dh Dhangethi" 
                    ? "/lovable-uploads/b72749c4-7068-4513-969d-21e3e99ad078.png" 
                    : (island.image_url || "https://images.unsplash.com/photo-1506744038136-46273834b3fb"))} 
                alt={island.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="text-xl font-bold text-white mb-1">{island.name}</h3>
                <div className="flex items-center text-white/90 text-sm">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>Maldives</span>
                </div>
              </div>
            </div>
            
            <CardContent className="p-4">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 line-clamp-2">{island.description}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <span className="inline-flex items-center gap-1 text-xs bg-ocean/10 text-ocean px-2 py-1 rounded-full">
                    <Compass className="w-3 h-3" />
                    Activities
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs bg-ocean/10 text-ocean px-2 py-1 rounded-full">
                    <Ship className="w-3 h-3" />
                    Ferry
                  </span>
                </div>
                <Link to={`/islands/${island.name.toLowerCase().replace(/\s+/g, '-')}`}>
                  <Button variant="ghost" size="sm" className="text-ocean hover:text-ocean-dark">
                    View <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg col-span-full">
            <h3 className="text-xl font-medium text-gray-700">No islands found matching your search</h3>
            <p className="text-gray-500 mt-2">Try different keywords or clear your search</p>
            <Button variant="outline" className="mt-4" onClick={() => onPageChange(1)}>
              Clear Search
            </Button>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={e => {
                    e.preventDefault();
                    onPageChange(Math.max(1, page - 1));
                  }} 
                  isActive={page > 1} 
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink 
                    href="#" 
                    onClick={e => {
                      e.preventDefault();
                      onPageChange(i + 1);
                    }} 
                    isActive={page === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={e => {
                    e.preventDefault();
                    onPageChange(Math.min(totalPages, page + 1));
                  }} 
                  isActive={page < totalPages} 
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default FeaturedIslands;
