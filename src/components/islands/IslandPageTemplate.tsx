
import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft } from "lucide-react";
import { IslandDetails } from "@/types/island";

// Import the newly created components
import HeroSection from "./HeroSection";
import QuickFactsSection from "./QuickFactsSection";
import OverviewTab from "./OverviewTab";
import ActivitiesTab from "./ActivitiesTab";
import AccommodationTab from "./AccommodationTab";
import EssentialInfoTab from "./EssentialInfoTab";
import GalleryTab from "./GalleryTab";
import CallToAction from "./CallToAction";

interface IslandPageTemplateProps {
  islandData: IslandDetails;
}

const IslandPageTemplate = ({ islandData }: IslandPageTemplateProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <HeroSection islandData={islandData} />
      
      {/* Quick Facts */}
      {islandData.quickFacts && islandData.quickFacts.length > 0 && (
        <QuickFactsSection quickFacts={islandData.quickFacts} />
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
            {islandData.fullDescription || islandData.description}
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
          
          {/* Tab Contents */}
          <TabsContent value="overview">
            <OverviewTab islandData={islandData} setActiveTab={setActiveTab} />
          </TabsContent>
          
          <TabsContent value="activities">
            <ActivitiesTab islandData={islandData} />
          </TabsContent>
          
          <TabsContent value="stay">
            <AccommodationTab islandData={islandData} />
          </TabsContent>
          
          <TabsContent value="essential">
            <EssentialInfoTab islandData={islandData} />
          </TabsContent>
          
          <TabsContent value="gallery">
            <GalleryTab islandData={islandData} />
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Call to action */}
      <CallToAction islandName={islandData.name} />
    </div>
  );
};

export default IslandPageTemplate;
