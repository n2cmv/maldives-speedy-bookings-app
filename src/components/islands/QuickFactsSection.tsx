
import { Ship, CalendarDays, Bed, Utensils } from "lucide-react";
import { IslandDetails } from "@/types/island";

interface QuickFactsSectionProps {
  quickFacts: IslandDetails['quickFacts'];
}

const QuickFactsSection = ({ quickFacts }: QuickFactsSectionProps) => {
  if (!quickFacts || quickFacts.length === 0) return null;
  
  return (
    <div className="bg-white border-t border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-5 py-4">
          {quickFacts.map((fact, index) => (
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
  );
};

export default QuickFactsSection;
