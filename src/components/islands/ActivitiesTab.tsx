
import { Button } from "@/components/ui/button";
import { IslandDetails } from "@/types/island";
import { Link } from "react-router-dom";
import { Anchor } from "lucide-react";

interface ActivitiesTabProps {
  islandData: IslandDetails;
}

const ActivitiesTab = ({ islandData }: ActivitiesTabProps) => {
  return (
    <div className="pt-8">
      {islandData.activities && islandData.activities.length > 0 ? (
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Things to Do in {islandData.name}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {islandData.activities.map((activity, index) => (
              <div 
                key={index} 
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
              >
                {activity.image && (
                  <div className="relative h-52 overflow-hidden">
                    <img 
                      src={activity.image} 
                      alt={activity.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-ocean transition-colors duration-300">{activity.name}</h3>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2 leading-relaxed">{activity.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No activities information available for this island yet.</p>
        </div>
      )}
      
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

export default ActivitiesTab;
