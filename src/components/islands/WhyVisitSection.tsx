
import { Ship, MapPin, TreePalm } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const WhyVisitSection = () => {
  return (
    <>
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Why Visit Maldives Islands?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-ocean/5 p-6 rounded-lg">
            <div className="bg-ocean text-white w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Ship className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Incredible Marine Life</h3>
            <p className="text-gray-700">
              Experience some of the world's best snorkeling and diving with vibrant coral reefs, whale sharks, manta rays, and colorful fish.
            </p>
          </div>
          
          <div className="bg-ocean/5 p-6 rounded-lg">
            <div className="bg-ocean text-white w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Authentic Experiences</h3>
            <p className="text-gray-700">
              Stay on local islands to experience genuine Maldivian culture, cuisine, and hospitality away from resort crowds.
            </p>
          </div>
          
          <div className="bg-ocean/5 p-6 rounded-lg">
            <div className="bg-ocean text-white w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <TreePalm className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Pristine Beaches</h3>
            <p className="text-gray-700">
              Enjoy white sandy beaches and crystal-clear turquoise waters with much more affordable access than exclusive resorts.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-ocean to-blue-700 text-white p-8 md:p-12 rounded-xl text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to explore paradise?</h2>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
          Book your speedboat transportation to these beautiful local islands and begin your Maldivian adventure!
        </p>
        <Link to="/booking">
          <Button className="bg-white text-ocean hover:bg-gray-100 px-8 py-3 text-lg font-medium">
            Book Transportation
          </Button>
        </Link>
      </div>
    </>
  );
};

export default WhyVisitSection;
