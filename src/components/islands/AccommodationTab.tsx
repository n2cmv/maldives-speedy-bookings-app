
import { Bed, Utensils } from "lucide-react";
import { IslandDetails } from "@/types/island";

interface AccommodationTabProps {
  islandData: IslandDetails;
}

const AccommodationTab = ({ islandData }: AccommodationTabProps) => {
  return (
    <div className="pt-8">
      {(islandData.accommodation && islandData.accommodation.length > 0) || (islandData.dining && islandData.dining.length > 0) ? (
        <>
          {islandData.accommodation && islandData.accommodation.length > 0 && (
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
          )}
          
          {islandData.dining && islandData.dining.length > 0 && (
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
          )}
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No accommodation or dining information available for this island yet.</p>
        </div>
      )}
    </div>
  );
};

export default AccommodationTab;
