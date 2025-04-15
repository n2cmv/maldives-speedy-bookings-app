
import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { 
  MapPin, 
  Ship, 
  CalendarDays, 
  Sun, 
  Cloud, 
  Waves, 
  TreePalm, 
  Bed, 
  Utensils, 
  Info, 
  ChevronLeft, 
  Anchor 
} from "lucide-react";

const DhigurahIsland = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  const islandData = {
    name: "Dhigurah Island",
    slug: "dhigurah",
    fullDescription: "Dhigurah is a beautiful island located in the South Ari Atoll, famous for its pristine beaches and stunning coral reefs. The island stretches about 3 km in length but is only about 300 meters wide. A paradise for nature lovers, it's known for whale shark sightings year-round and its vibrant marine ecosystem. The island name 'Dhigurah' translates to 'long island' in Dhivehi, perfectly describing its unique elongated shape. With its white sandy beaches, crystal clear waters, and lush vegetation, Dhigurah offers an authentic Maldivian experience away from the crowds.",
    heroImage: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2068&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2068&q=80",
      "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1513316564811-ee3c49558c8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    location: {
      atoll: "South Ari Atoll (Alif Dhaal)",
      coordinates: "3.4833° N, 72.9333° E"
    },
    travelInfo: {
      fromMale: "1.5 hours by speedboat or 20 minutes by domestic flight to nearby Maamigili Airport followed by a 10-minute boat ride",
      bestWayToReach: "Speedboat transfer with Retour Maldives - direct, comfortable and scenic journey"
    },
    activities: [
      {
        name: "Whale Shark Excursions",
        description: "Dhigurah is famous for year-round whale shark sightings. Join guided excursions to swim alongside these gentle giants in their natural habitat.",
        image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80"
      },
      {
        name: "Snorkeling at House Reef",
        description: "Explore the vibrant house reef just off the beach, home to colorful coral formations and diverse marine life including reef sharks, rays, and tropical fish.",
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
      },
      {
        name: "Manta Ray Point Visits",
        description: "Take a short boat ride to nearby manta cleaning stations where you can observe these majestic creatures up close.",
        image: "https://images.unsplash.com/photo-1513316564811-ee3c49558c8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
      },
      {
        name: "Beach Walks",
        description: "Enjoy long walks along the pristine 3km beach that surrounds the island, perfect for sunrise or sunset strolls.",
        image: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2068&q=80"
      }
    ],
    accommodation: [
      {
        type: "Guesthouses",
        description: "Several comfortable guesthouses offering rooms with modern amenities, air conditioning, and often direct beach access.",
        priceRange: "$50-150 per night"
      },
      {
        type: "Boutique Hotels",
        description: "Small boutique hotels with personalized service, swimming pools, and restaurant facilities.",
        priceRange: "$100-250 per night"
      },
      {
        type: "Beach Villas",
        description: "Private beach villas with stunning ocean views and premium services.",
        priceRange: "$150-300 per night"
      }
    ],
    dining: [
      {
        type: "Local Cuisine",
        description: "Try authentic Maldivian dishes featuring fresh seafood, coconut, and spices at local cafes and guesthouse restaurants."
      },
      {
        type: "International Options",
        description: "Most accommodations offer international cuisine alongside local dishes, catering to diverse preferences."
      },
      {
        type: "Beachfront Dining",
        description: "Enjoy special beachfront dining experiences arranged by many guesthouses for a memorable meal."
      }
    ],
    weather: {
      bestTime: "November to April (dry season) for clearest waters and optimal whale shark sightings",
      temperature: "25°C - 32°C year-round",
      rainfall: "Low during dry season (Jan-Mar), higher during May-November"
    },
    essentialInfo: [
      {
        title: "Local Culture",
        description: "Respect local customs and dress modestly when away from tourist beaches. The island is inhabited by locals with a traditional lifestyle.",
        icon: "users"
      },
      {
        title: "Internet",
        description: "Most accommodations offer WiFi, and mobile data is available but may be limited in some areas.",
        icon: "wifi"
      },
      {
        title: "Currency",
        description: "US Dollars are widely accepted alongside the local currency (Rufiyaa). Credit cards are accepted at most establishments.",
        icon: "credit-card"
      },
      {
        title: "Health",
        description: "Basic medical facilities are available on the island, with major medical services requiring transfer to Male.",
        icon: "heart-pulse"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pt-16 max-w-6xl">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/islands" className="inline-flex items-center text-ocean hover:text-ocean-dark transition-colors">
            <ChevronLeft className="h-4 w-4 mr-1" />
            <span>Back to Islands</span>
          </Link>
        </div>
        
        {/* Hero Section */}
        <div className="relative rounded-xl overflow-hidden mb-8 shadow-lg">
          <AspectRatio ratio={21/9} className="bg-muted">
            <img 
              src={islandData.heroImage} 
              alt={islandData.name} 
              className="object-cover w-full h-full"
            />
          </AspectRatio>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6 md:p-8">
            <div className="text-white">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">{islandData.name}</h1>
              <div className="flex items-center text-white/90 text-sm md:text-base">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{islandData.location.atoll}, Maldives</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content Tabs */}
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activities">Things to Do</TabsTrigger>
            <TabsTrigger value="stay">Where to Stay</TabsTrigger>
            <TabsTrigger value="essential">Essential Info</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">About Dhigurah Island</h2>
              <p className="text-gray-700 leading-relaxed mb-6">{islandData.fullDescription}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-ocean" /> Location
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700"><span className="font-medium">Atoll:</span> {islandData.location.atoll}</p>
                    {islandData.location.coordinates && (
                      <p className="text-sm text-gray-700"><span className="font-medium">Coordinates:</span> {islandData.location.coordinates}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <Ship className="h-5 w-5 mr-2 text-ocean" /> How to Get There
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700"><span className="font-medium">From Malé:</span> {islandData.travelInfo.fromMale}</p>
                    <p className="text-sm text-gray-700 mt-1"><span className="font-medium">Recommended:</span> {islandData.travelInfo.bestWayToReach}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <Sun className="h-5 w-5 mr-2 text-ocean" /> Weather
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start mb-1">
                      <CalendarDays className="h-4 w-4 mr-2 text-ocean-light mt-0.5" />
                      <p className="text-sm text-gray-700"><span className="font-medium">Best Time to Visit:</span> {islandData.weather.bestTime}</p>
                    </div>
                    <div className="flex items-start mb-1">
                      <Sun className="h-4 w-4 mr-2 text-ocean-light mt-0.5" />
                      <p className="text-sm text-gray-700"><span className="font-medium">Temperature:</span> {islandData.weather.temperature}</p>
                    </div>
                    <div className="flex items-start">
                      <Cloud className="h-4 w-4 mr-2 text-ocean-light mt-0.5" />
                      <p className="text-sm text-gray-700"><span className="font-medium">Rainfall:</span> {islandData.weather.rainfall}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Top Activities</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {islandData.activities.slice(0, 4).map((activity, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-40 overflow-hidden">
                      {activity.image && (
                        <img 
                          src={activity.image} 
                          alt={activity.name} 
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium text-gray-900 mb-1">{activity.name}</h3>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mt-4 text-center">
                <Button
                  variant="ghost"
                  className="text-ocean hover:text-ocean-dark hover:bg-ocean-light/10"
                  onClick={() => setActiveTab("activities")}
                >
                  Explore All Activities →
                </Button>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Link to="/booking">
                <Button 
                  className="bg-ocean hover:bg-ocean-dark text-white px-6 py-6 rounded-lg shadow-md flex items-center gap-2 text-base mx-auto"
                >
                  <Anchor className="w-5 h-5" />
                  Book Transportation to Dhigurah
                </Button>
              </Link>
            </div>
          </TabsContent>
          
          {/* Activities Tab */}
          <TabsContent value="activities" className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Things to Do in Dhigurah</h2>
              <p className="text-gray-700 mb-6">
                Dhigurah Island offers a variety of activities for nature lovers and adventure seekers. 
                From marine excursions to relaxing beach experiences, there's something for everyone.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {islandData.activities.map((activity, index) => (
                  <div key={index} className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm">
                    {activity.image && (
                      <div className="h-48">
                        <img 
                          src={activity.image} 
                          alt={activity.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{activity.name}</h3>
                      <p className="text-gray-700 text-sm">{activity.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-center">
              <Link to="/activities">
                <Button 
                  className="bg-ocean hover:bg-ocean-dark text-white px-6 py-6 rounded-lg shadow-md flex items-center gap-2 text-base mx-auto"
                >
                  <Anchor className="w-5 h-5" />
                  Book an Activity
                </Button>
              </Link>
            </div>
          </TabsContent>
          
          {/* Accommodation Tab */}
          <TabsContent value="stay" className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <Bed className="h-6 w-6 mr-2 text-ocean" />
                <h2 className="text-2xl font-semibold text-gray-900">Where to Stay</h2>
              </div>
              <p className="text-gray-700 mb-6">
                Dhigurah offers a variety of accommodation options to suit different budgets and preferences, 
                from cozy guesthouses to boutique hotels and private beach villas.
              </p>
              
              <div className="space-y-6">
                {islandData.accommodation.map((option, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-5">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{option.type}</h3>
                    <p className="text-gray-700 mb-2">{option.description}</p>
                    {option.priceRange && (
                      <p className="text-sm text-gray-500">Price range: {option.priceRange}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <Utensils className="h-6 w-6 mr-2 text-ocean" />
                <h2 className="text-2xl font-semibold text-gray-900">Dining Options</h2>
              </div>
              
              <div className="space-y-4">
                {islandData.dining.map((option, index) => (
                  <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{option.type}</h3>
                    <p className="text-gray-700">{option.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          {/* Essential Info Tab */}
          <TabsContent value="essential" className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <Info className="h-6 w-6 mr-2 text-ocean" />
                <h2 className="text-2xl font-semibold text-gray-900">Essential Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {islandData.essentialInfo.map((info, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{info.title}</h3>
                    <p className="text-gray-700 text-sm">{info.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Travel Tips</h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="bg-ocean-light/20 text-ocean p-1 rounded-full mr-2">
                    <TreePalm className="h-4 w-4" />
                  </span>
                  <span>Pack reef-safe sunscreen to protect the coral ecosystem.</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-ocean-light/20 text-ocean p-1 rounded-full mr-2">
                    <Waves className="h-4 w-4" />
                  </span>
                  <span>Bring water shoes for beach walks as coral fragments can wash up on shore.</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-ocean-light/20 text-ocean p-1 rounded-full mr-2">
                    <Sun className="h-4 w-4" />
                  </span>
                  <span>Don't forget insect repellent, especially for evenings.</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-ocean-light/20 text-ocean p-1 rounded-full mr-2">
                    <Ship className="h-4 w-4" />
                  </span>
                  <span>Book your speedboat transfer in advance, especially during high season.</span>
                </li>
              </ul>
            </div>
          </TabsContent>
          
          {/* Gallery Tab */}
          <TabsContent value="gallery" className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Photo Gallery</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {islandData.galleryImages.map((image, index) => (
                  <div key={index} className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-sm">
                    <img 
                      src={image} 
                      alt={`Dhigurah Island - ${index + 1}`} 
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
                {islandData.heroImage && (
                  <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-sm">
                    <img 
                      src={islandData.heroImage} 
                      alt="Dhigurah Island - Hero" 
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default DhigurahIsland;
