
import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Ship, ChevronRight } from "lucide-react";

const Islands = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const featuredIslands = [
    {
      name: "Dhigurah Island",
      slug: "dhigurah",
      image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2068&q=80",
      description: "Famous for its pristine beaches, whale sharks, and stunning coral reefs.",
      location: "South Ari Atoll",
      travelTime: "1.5 hours by speedboat"
    },
    {
      name: "Dhangethi Island",
      slug: "dhangethi",
      image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      description: "A charming local island with rich cultural heritage and beautiful beaches.",
      location: "Ari Atoll",
      travelTime: "2 hours by speedboat"
    }
  ];
  
  const filteredIslands = featuredIslands.filter(island => 
    island.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    island.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    island.location.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pt-16 max-w-6xl">
        <div className="bg-[#F8FCFA] rounded-3xl p-6 md:p-10 mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1D1D1F] mb-4">
            Explore Maldives Islands
          </h1>
          <p className="text-lg text-[#505056] max-w-3xl mb-6">
            Discover detailed information about the beautiful islands of the Maldives. Plan your perfect getaway with our comprehensive island guides.
          </p>
          
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search islands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 pl-4 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent"
            />
            <svg
              className="absolute right-3 top-3.5 h-5 w-5 text-gray-400"
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
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-[#1D1D1F] mb-6">Featured Islands</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIslands.map((island) => (
              <Card key={island.name} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-48">
                  <img
                    src={island.image}
                    alt={`${island.name}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 rounded-full py-1 px-3 flex items-center">
                    <Ship className="w-4 h-4 text-ocean mr-1" />
                    <span className="text-xs font-medium text-ocean-dark">{island.travelTime}</span>
                  </div>
                </div>
                
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-bold text-ocean-dark">{island.name}</CardTitle>
                  <div className="flex items-center text-gray-500 text-sm">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{island.location}, Maldives</span>
                  </div>
                </CardHeader>
                
                <CardContent className="py-2">
                  <p className="text-gray-600">{island.description}</p>
                </CardContent>
                
                <CardFooter className="pt-2">
                  <Link 
                    to={`/islands/${island.slug}`} 
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
            ))}
          </div>
          
          {filteredIslands.length === 0 && (
            <div className="text-center py-16">
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
      </main>
    </div>
  );
};

export default Islands;
