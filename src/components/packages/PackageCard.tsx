import { Check, Users, Clock } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TourPackage } from "@/pages/TourPackages";

interface PackageCardProps {
  package: TourPackage;
}

const PackageCard = ({ package: pkg }: PackageCardProps) => {
  const handleInquiry = () => {
    const message = `Hi, I'm interested in the "${pkg.name}" package. Can you provide more details?`;
    const whatsappUrl = `https://wa.me/9607780739?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <div className="relative h-48 overflow-hidden">
        {pkg.image_url ? (
          <img 
            src={pkg.image_url} 
            alt={pkg.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-ocean/20 to-ocean-dark/30 flex items-center justify-center">
            <span className="text-ocean-dark/50 text-lg">No image</span>
          </div>
        )}
        <Badge className="absolute top-3 right-3 bg-ocean text-white">
          {pkg.duration}
        </Badge>
      </div>
      
      <CardHeader className="pb-2">
        <h3 className="text-xl font-bold text-ocean-dark">{pkg.name}</h3>
        {pkg.description && (
          <p className="text-gray-600 text-sm line-clamp-2">{pkg.description}</p>
        )}
      </CardHeader>
      
      <CardContent className="flex-1">
        <div className="space-y-3">
          {pkg.inclusions.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Includes:</p>
              <ul className="space-y-1">
                {pkg.inclusions.slice(0, 4).map((item, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
                {pkg.inclusions.length > 4 && (
                  <li className="text-sm text-ocean">+{pkg.inclusions.length - 4} more</li>
                )}
              </ul>
            </div>
          )}
          
          {pkg.rules.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {pkg.rules.map((rule, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {rule}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col gap-3 border-t pt-4">
        <div className="flex items-center justify-between w-full">
          <div>
            <span className="text-2xl font-bold text-ocean-dark">${pkg.price_per_person}</span>
            <span className="text-gray-500 text-sm"> /person</span>
          </div>
          {pkg.min_pax > 1 && (
            <div className="flex items-center text-sm text-gray-500">
              <Users className="h-4 w-4 mr-1" />
              Min {pkg.min_pax} pax
            </div>
          )}
        </div>
        <Button 
          onClick={handleInquiry}
          className="w-full bg-ocean hover:bg-ocean-dark"
        >
          Inquire Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PackageCard;
