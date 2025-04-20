
import { Bed } from "lucide-react";
import { IslandDetails } from "@/types/island";

interface AccommodationTabProps {
  islandData: IslandDetails;
}

const AccommodationTab = ({ islandData }: AccommodationTabProps) => {
  return (
    <div className="pt-8">
      {islandData.accommodation && islandData.accommodation.length > 0 ? (
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <Bed className="h-6 w-6 mr-3 text-ocean" />
            <h2 className="text-3xl font-bold text-gray-900">Where to Stay</h2>
          </div>
          <p className="text-gray-700 mb-8 max-w-4xl">
            {islandData.name} offers a variety of accommodation options to suit different preferences, 
            from cozy guesthouses to boutique hotels and private beach villas.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {islandData.accommodation.map((option, index) => (
              <div 
                key={index} 
                className="group overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
              >
                {option.image && (
                  <div className="relative w-full aspect-square overflow-hidden">
                    <img 
                      src={option.image} 
                      alt={option.type} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                
                <div className="p-4 bg-white">
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">
                    {option.type}
                  </h3>
                  <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">
                    {option.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No accommodation information available for this island yet.</p>
        </div>
      )}
    </div>
  );
};

export default AccommodationTab;
