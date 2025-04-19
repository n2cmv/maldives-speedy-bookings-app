
import { Info, TreePalm, Waves, Sun, Ship } from "lucide-react";
import { IslandDetails } from "@/types/island";

interface EssentialInfoTabProps {
  islandData: IslandDetails;
}

const EssentialInfoTab = ({ islandData }: EssentialInfoTabProps) => {
  return (
    <div className="pt-8">
      {(islandData.essentialInfo && islandData.essentialInfo.length > 0) || (islandData.faqs && islandData.faqs.length > 0) ? (
        <>
          {islandData.essentialInfo && islandData.essentialInfo.length > 0 && (
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
          )}
          
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
          
          {islandData.faqs && islandData.faqs.length > 0 && (
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
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No essential information available for this island yet.</p>
        </div>
      )}
    </div>
  );
};

export default EssentialInfoTab;
