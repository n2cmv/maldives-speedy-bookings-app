
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
                className="group aspect-square overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
              >
                {option.image && (
                  <div className="relative w-full h-full overflow-hidden">
                    <img 
                      src={option.image} 
                      alt={option.type} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent text-white">
                  <h3 className="text-sm font-semibold line-clamp-2">
                    {option.type}
                  </h3>
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
