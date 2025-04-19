
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
