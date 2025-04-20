
import { Button } from "@/components/ui/button";
import { MapPin, Ship, CalendarDays, Sun, Cloud } from "lucide-react";
import { IslandDetails } from "@/types/island";
import { Link } from "react-router-dom";
import { Anchor } from "lucide-react";

interface OverviewTabProps {
  islandData: IslandDetails;
  setActiveTab: (tab: string) => void;
}

const OverviewTab = ({ islandData, setActiveTab }: OverviewTabProps) => {
  return (
    <div className="space-y-12 pt-8">
      <div>
        <h2 className="text-3xl font-bold mb-6">About {islandData.name}</h2>
        <p className="text-gray-700 leading-relaxed mb-8">{islandData.fullDescription || islandData.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {islandData.location && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-ocean" /> Location
              </h3>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700"><span className="font-medium">Atoll:</span> {islandData.location.atoll || 'Not specified'}</p>
                {islandData.location.coordinates && (
                  <p className="text-gray-700 mt-2"><span className="font-medium">Coordinates:</span> {islandData.location.coordinates}</p>
                )}
              </div>
            </div>
          )}
          
          {islandData.travelInfo && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Ship className="h-5 w-5 mr-2 text-ocean" /> How to Get There
              </h3>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700"><span className="font-medium">From Malé:</span> {islandData.travelInfo.fromMale || 'Contact for details'}</p>
                <p className="text-gray-700 mt-2"><span className="font-medium">Recommended:</span> {islandData.travelInfo.bestWayToReach || 'Speedboat transfer'}</p>
              </div>
            </div>
          )}
          
          {islandData.weather && (
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
                        <p className="text-gray-700 mt-1">{islandData.weather.bestTime || 'November to April'}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-start mb-1">
                      <Sun className="h-5 w-5 mr-2 text-ocean mt-0.5" />
                      <div>
                        <p className="font-medium">Temperature</p>
                        <p className="text-gray-700 mt-1">{islandData.weather.temperature || '25°C - 31°C'}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-start">
                      <Cloud className="h-5 w-5 mr-2 text-ocean mt-0.5" />
                      <div>
                        <p className="font-medium">Rainfall</p>
                        <p className="text-gray-700 mt-1">{islandData.weather.rainfall || 'Varies by season'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
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
    </div>
  );
};

export default OverviewTab;
