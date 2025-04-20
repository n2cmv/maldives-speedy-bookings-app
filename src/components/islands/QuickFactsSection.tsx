
import { Ship, Users, Bed, CalendarDays, MapPin, LucideProps } from "lucide-react";
import { IslandDetails } from "@/types/island";
import { lazy, Suspense } from 'react';
import * as lucideIcons from "lucide-react";

interface QuickFactsSectionProps {
  quickFacts: IslandDetails['quickFacts'];
}

const QuickFactsSection = ({ quickFacts }: QuickFactsSectionProps) => {
  if (!quickFacts || quickFacts.length === 0) return null;
  
  const renderIcon = (iconName: string) => {
    // Convert to kebab case for matching lucide icon names
    const normalizedIconName = iconName
      .toLowerCase()
      .replace(/\s+/g, '-')
      // Convert to PascalCase for accessing from lucideIcons
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');
    
    // First try with direct imports for common icons (faster loading)
    switch (iconName.toLowerCase()) {
      case "ship":
        return <Ship className="h-6 w-6 mx-auto" />;
      case "users":
        return <Users className="h-6 w-6 mx-auto" />;
      case "home":
      case "bed":
        return <Bed className="h-6 w-6 mx-auto" />;
      case "clock":
      case "calendar-days":
        return <CalendarDays className="h-6 w-6 mx-auto" />;
      case "map":
      case "map-pin":
        return <MapPin className="h-6 w-6 mx-auto" />;
    }

    // Check if the icon exists in lucide icons
    if (normalizedIconName in lucideIcons) {
      const IconComponent = lucideIcons[normalizedIconName as keyof typeof lucideIcons];
      return <IconComponent className="h-6 w-6 mx-auto" />;
    }

    // Fallback to ship icon if not found
    console.warn(`Icon "${iconName}" not found, using default ship icon`);
    return <Ship className="h-6 w-6 mx-auto" />;
  };
  
  return (
    <div className="bg-white border-t border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-5 py-4">
          {quickFacts.map((fact, index) => (
            <div key={index} className="flex flex-col items-center justify-center py-4 px-2 text-center">
              <div className="text-ocean mb-1">
                {renderIcon(fact.icon)}
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
