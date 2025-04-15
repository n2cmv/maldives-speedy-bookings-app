
import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
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
  Anchor,
  Star
} from "lucide-react";
import { IslandDetails } from "@/types/island";

interface IslandPageTemplateProps {
  islandData: IslandDetails;
}

const IslandPageTemplate = ({ islandData }: IslandPageTemplateProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <div className="relative h-[70vh] overflow-hidden">
        <img 
          src={islandData.heroImage} 
          alt={islandData.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30 flex items-end">
          <div className="container mx-auto px-4 pb-12">
            <div className="flex flex-col items-center text-center md:text-left md:items-start text-white max-w-4xl">
              <div className="bg-ocean px-4 py-1 rounded-full text-sm font-medium mb-4">
                {islandData.location.atoll}
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-yellow-400">
                {islandData.name}
              </h1>
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Facts */}
      {islandData.quickFacts && (
        <div className="bg-white border-t border-b border-gray-200">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-5 py-4">
              {islandData.quickFacts.map((fact, index) => (
                <div key={index} className="flex flex-col items-center justify-center py-4 px-2 text-center">
                  <div className="text-ocean mb-1">
                    {fact.icon === "ship" ? <Ship className="h-6 w-6 mx-auto" /> : 
                    fact.icon === "dollar-sign" ? <span className="text-2xl font-semibold">$</span> :
                    fact.icon === "home" ? <Bed className="h-6 w-6 mx-auto" /> :
                    fact.icon === "clock" ? <CalendarDays className="h-6 w-6 mx-auto" /> :
                    <Utensils className="h-6 w-6 mx-auto" />}
                  </div>
                  <p className="text-sm text-gray-500">{fact.label}</p>
                  <p className="font-semibold">{fact.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      <main className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/islands" className="inline-flex items-center text-ocean hover:text-ocean-dark transition-colors">
            <ChevronLeft className="h-4 w-4 mr-1" />
            <span>Back to Islands</span>
          </Link>
        </div>
        
        {/* Description */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Discover our Island</h2>
          <p className="text-gray-700 leading-relaxed max-w-4xl">
            {islandData.fullDescription}
          </p>
        </div>
        
        {/* Content Tabs */}
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-12">
          <TabsList className="w-full justify-start overflow-x-auto bg-white border-b border-gray-200 p-0 h-auto">
            <TabsTrigger value="overview" className="py-4 px-6 data-[state=active]:border-b-2 data-[state=active]:border-ocean rounded-none data-[state=active]:bg-white">Overview</TabsTrigger>
            <TabsTrigger value="activities" className="py-4 px-6 data-[state=active]:border-b-2 data-[state=active]:border-ocean rounded-none data-[state=active]:bg-white">Things to Do</TabsTrigger>
            <TabsTrigger value="stay" className="py-4 px-6 data-[state=active]:border-b-2 data-[state=active]:border-ocean rounded-none data-[state=active]:bg-white">Where to Stay</TabsTrigger>
            <TabsTrigger value="essential" className="py-4 px-6 data-[state=active]:border-b-2 data-[state=active]:border-ocean rounded-none data-[state=active]:bg-white">Essential Info</TabsTrigger>
            <TabsTrigger value="gallery" className="py-4 px-6 data-[state=active]:border-b-2 data-[state=active]:border-ocean rounded-none data-[state=active]:bg-white">Gallery</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-12 pt-8">
            <div>
              <h2 className="text-3xl font-bold mb-6">About {islandData.name}</h2>
              <p className="text-gray-700 leading-relaxed mb-8">{islandData.fullDescription}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-ocean" /> Location
                  </h3>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <p className="text-gray-700"><span className="font-medium">Atoll:</span> {islandData.location.atoll}</p>
                    {islandData.location.coordinates && (
                      <p className="text-gray-700 mt-2"><span className="font-medium">Coordinates:</span> {islandData.location.coordinates}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <Ship className="h-5 w-5 mr-2 text-ocean" /> How to Get There
                  </h3>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <p className="text-gray-700"><span className="font-medium">From Malé:</span> {islandData.travelInfo.fromMale}</p>
                    <p className="text-gray-700 mt-2"><span className="font-medium">Recommended:</span> {islandData.travelInfo.bestWayToReach}</p>
                  </div>
                </div>
                
                <div className="space-y-4 md:col-span-2">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <Sun className="h-5 w-5 mr-2 text-ocean" /> Weather
                  </h3>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="flex items-start mb-1">
                          <CalendarDays className="h-5 w-5 mr-2 text-ocean mt-0.5" />
                          <div>
                            <p className="font-medium">Best Time to Visit</p>
                            <p className="text-gray-700 mt-1">{islandData.weather.bestTime}</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-start mb-1">
                          <Sun className="h-5 w-5 mr-2 text-ocean mt-0.5" />
                          <div>
                            <p className="font-medium">Temperature</p>
                            <p className="text-gray-700 mt-1">{islandData.weather.temperature}</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-start">
                          <Cloud className="h-5 w-5 mr-2 text-ocean mt-0.5" />
                          <div>
                            <p className="font-medium">Rainfall</p>
                            <p className="text-gray-700 mt-1">{islandData.weather.rainfall}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold mb-6">Top Activities</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {islandData.activities.slice(0, 4).map((activity, index) => (
                  <div key={index} className="overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <div className="h-48 overflow-hidden">
                      {activity.image && (
                        <img 
                          src={activity.image} 
                          alt={activity.name} 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      )}
                    </div>
                    <div className="p-4 bg-white">
                      <h3 className="font-medium text-lg text-gray-900 mb-1">{activity.name}</h3>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  className="text-ocean hover:text-ocean-dark border-ocean hover:bg-ocean/5"
                  onClick={() => setActiveTab("activities")}
                >
                  Explore All Activities →
                </Button>
              </div>
            </div>
            
            <div className="flex justify-center py-8">
              <Link to="/booking">
                <Button 
                  className="bg-ocean hover:bg-ocean-dark text-white px-8 py-6 rounded-md shadow-md flex items-center gap-3 text-lg"
                >
                  <Anchor className="w-5 h-5" />
                  Book Transportation to {islandData.name}
                </Button>
              </Link>
            </div>
          </TabsContent>
          
          {/* Activities Tab */}
          <TabsContent value="activities" className="pt-8">
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Things to Do in {islandData.name}</h2>
              <p className="text-gray-700 mb-8 max-w-4xl">
                {islandData.name} offers a variety of activities for nature lovers and adventure seekers. 
                From marine excursions to relaxing beach experiences, there's something for everyone.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {islandData.activities.map((activity, index) => (
                  <div key={index} className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-md">
                    {activity.image && (
                      <div className="h-64">
                        <img 
                          src={activity.image} 
                          alt={activity.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{activity.name}</h3>
                      <p className="text-gray-700">{activity.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-center py-8">
              <Link to="/booking">
                <Button 
                  className="bg-ocean hover:bg-ocean-dark text-white px-8 py-6 rounded-md shadow-md flex items-center gap-3 text-lg"
                >
                  <Anchor className="w-5 h-5" />
                  Book Transportation to {islandData.name}
                </Button>
              </Link>
            </div>
          </TabsContent>
          
          {/* Accommodation Tab */}
          <TabsContent value="stay" className="pt-8">
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <Bed className="h-6 w-6 mr-3 text-ocean" />
                <h2 className="text-3xl font-bold text-gray-900">Where to Stay</h2>
              </div>
              <p className="text-gray-700 mb-8 max-w-4xl">
                {islandData.name} offers a variety of accommodation options to suit different budgets and preferences, 
                from cozy guesthouses to boutique hotels and private beach villas.
              </p>
              
              <div className="space-y-8">
                {islandData.accommodation.map((option, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{option.type}</h3>
                    <p className="text-gray-700 mb-3">{option.description}</p>
                    {option.priceRange && (
                      <div className="inline-flex items-center bg-gray-100 px-3 py-1 rounded-full">
                        <span className="text-sm font-medium">Price range: {option.priceRange}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <Utensils className="h-6 w-6 mr-3 text-ocean" />
                <h2 className="text-3xl font-bold text-gray-900">Dining Options</h2>
              </div>
              
              <div className="space-y-6">
                {islandData.dining.map((option, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{option.type}</h3>
                    <p className="text-gray-700">{option.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          {/* Essential Info Tab */}
          <TabsContent value="essential" className="pt-8">
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <Info className="h-6 w-6 mr-3 text-ocean" />
                <h2 className="text-3xl font-bold text-gray-900">Essential Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {islandData.essentialInfo.map((info, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{info.title}</h3>
                    <p className="text-gray-700">{info.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Travel Tips</h2>
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="bg-ocean/10 text-ocean p-2 rounded-full mr-3">
                      <TreePalm className="h-5 w-5" />
                    </span>
                    <span className="text-gray-700 pt-1">Pack reef-safe sunscreen to protect the coral ecosystem.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-ocean/10 text-ocean p-2 rounded-full mr-3">
                      <Waves className="h-5 w-5" />
                    </span>
                    <span className="text-gray-700 pt-1">Bring water shoes for beach walks as coral fragments can wash up on shore.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-ocean/10 text-ocean p-2 rounded-full mr-3">
                      <Sun className="h-5 w-5" />
                    </span>
                    <span className="text-gray-700 pt-1">Don't forget insect repellent, especially for evenings.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-ocean/10 text-ocean p-2 rounded-full mr-3">
                      <Ship className="h-5 w-5" />
                    </span>
                    <span className="text-gray-700 pt-1">Book your speedboat transfer in advance, especially during high season.</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {islandData.faqs && (
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                <div className="space-y-6">
                  {islandData.faqs.map((faq, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.question}</h3>
                      <p className="text-gray-700">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
          
          {/* Gallery Tab */}
          <TabsContent value="gallery" className="pt-8">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Photo Gallery</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[islandData.heroImage, ...islandData.galleryImages].map((image, index) => (
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
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Call to action */}
      <div className="bg-ocean bg-gradient-to-r from-ocean to-ocean-dark py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Experience {islandData.name}?</h2>
          <p className="text-lg mb-8 max-w-xl mx-auto">
            Book your transportation to this beautiful island destination and start planning your perfect getaway.
          </p>
          <Link to="/booking">
            <Button className="bg-white text-ocean hover:bg-gray-100 px-8 py-3 text-lg font-medium">
              Book Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default IslandPageTemplate;
