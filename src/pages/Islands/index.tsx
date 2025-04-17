
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useScrollToTop } from "@/hooks/use-scroll-top";
import Header from "@/components/Header";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TreePalm, Ship, ChevronRight, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Island } from "@/types/island";
import { useToast } from "@/hooks/use-toast";  // Updated import path
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const Islands = () => {
  useScrollToTop();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [islands, setIslands] = useState<Island[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchIslands = async () => {
      try {
        const { data, error } = await supabase
          .from('islands')
          .select('*')
          .order('name');
        
        if (error) throw error;
        
        setIslands(data || []);
      } catch (error) {
        console.error('Error fetching islands:', error);
        toast({
          title: "Error",
          description: "Unable to fetch islands. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchIslands();

    // Set up real-time subscription
    const channel = supabase
      .channel('public:islands')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'islands' },
        (payload) => {
          switch (payload.eventType) {
            case 'INSERT':
              setIslands(prev => [...prev, payload.new as Island]);
              break;
            case 'UPDATE':
              setIslands(prev => prev.map(island => 
                island.id === payload.new.id ? payload.new as Island : island
              ));
              break;
            case 'DELETE':
              setIslands(prev => prev.filter(island => island.id !== payload.old.id));
              break;
          }
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  const filteredIslands = islands.filter(island => {
    if (!searchTerm) return true;
    
    const query = searchTerm.toLowerCase();
    return (
      island.name?.toLowerCase().includes(query) ||
      island.description?.toLowerCase().includes(query)
    );
  });

  // Pagination logic
  const paginatedIslands = filteredIslands.slice(
    (page - 1) * itemsPerPage, 
    page * itemsPerPage
  );

  const totalPages = Math.ceil(filteredIslands.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="relative h-[50vh] overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80" 
          alt="Maldives Islands"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-bold text-yellow-400 mb-4">
                Explore Maldives Islands
              </h1>
              <p className="text-lg md:text-xl text-white mb-8">
                Discover paradise on Earth with our comprehensive guide to the local islands of the Maldives. 
                Find your perfect island getaway.
              </p>
              
              <div className="relative max-w-lg bg-white/20 backdrop-blur-md rounded-full overflow-hidden">
                <input
                  type="text"
                  placeholder="Search islands..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-4 pl-6 pr-12 rounded-full bg-transparent text-white placeholder:text-white/70 focus:outline-none"
                />
                <svg
                  className="absolute right-5 top-4 h-6 w-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Islands</h2>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="h-12 w-12 border-4 border-t-ocean border-opacity-50 rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {paginatedIslands.length > 0 ? (
                  paginatedIslands.map((island) => (
                    <Card key={island.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 border-0 shadow-lg">
                      <div className="relative h-64">
                        <img
                          src={island.image_url || "https://images.unsplash.com/photo-1506744038136-46273834b3fb"}
                          alt={island.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4 bg-white/90 rounded-full py-1 px-3 flex items-center shadow-md">
                          <Ship className="w-4 h-4 text-ocean mr-1" />
                          <span className="text-xs font-medium text-ocean-dark">View Details</span>
                        </div>
                      </div>
                      
                      <CardHeader className="pb-2">
                        <CardTitle className="text-2xl font-bold text-gray-900">{island.name}</CardTitle>
                        <div className="flex items-center text-gray-500 text-sm">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>Maldives</span>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="py-2">
                        <p className="text-gray-700">{island.description}</p>
                      </CardContent>
                      
                      <CardFooter className="pt-2">
                        <Link 
                          to={`/islands/${island.name.toLowerCase().replace(/\s+/g, '-')}`}
                          className="w-full"
                        >
                          <Button 
                            className="w-full bg-ocean hover:bg-ocean-dark text-white flex items-center justify-center gap-2"
                          >
                            Explore Island
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-16 bg-gray-50 rounded-lg col-span-2">
                    <h3 className="text-xl font-medium text-gray-700">No islands found matching your search</h3>
                    <p className="text-gray-500 mt-2">Try different keywords or clear your search</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setSearchTerm("")}
                    >
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
                          onClick={(e) => {
                            e.preventDefault();
                            setPage(Math.max(1, page - 1));
                          }}
                          isActive={page > 1}
                        />
                      </PaginationItem>
                      {[...Array(totalPages)].map((_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink 
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setPage(i + 1);
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
                          onClick={(e) => {
                            e.preventDefault();
                            setPage(Math.min(totalPages, page + 1));
                          }}
                          isActive={page < totalPages}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </div>
        
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Why Visit Maldives Islands?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-ocean/5 p-6 rounded-lg">
              <div className="bg-ocean text-white w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Ship className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Incredible Marine Life</h3>
              <p className="text-gray-700">
                Experience some of the world's best snorkeling and diving with vibrant coral reefs, whale sharks, manta rays, and colorful fish.
              </p>
            </div>
            
            <div className="bg-ocean/5 p-6 rounded-lg">
              <div className="bg-ocean text-white w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Authentic Experiences</h3>
              <p className="text-gray-700">
                Stay on local islands to experience genuine Maldivian culture, cuisine, and hospitality away from resort crowds.
              </p>
            </div>
            
            <div className="bg-ocean/5 p-6 rounded-lg">
              <div className="bg-ocean text-white w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <TreePalm className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Pristine Beaches</h3>
              <p className="text-gray-700">
                Enjoy white sandy beaches and crystal-clear turquoise waters with much more affordable access than exclusive resorts.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-ocean to-blue-700 text-white p-8 md:p-12 rounded-xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to explore paradise?</h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Book your speedboat transportation to these beautiful local islands and begin your Maldivian adventure!
          </p>
          <Link to="/booking">
            <Button className="bg-white text-ocean hover:bg-gray-100 px-8 py-3 text-lg font-medium">
              Book Transportation
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Islands;
