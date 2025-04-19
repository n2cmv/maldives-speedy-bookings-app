
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface CallToActionProps {
  islandName: string;
}

const CallToAction = ({ islandName }: CallToActionProps) => {
  return (
    <div className="bg-ocean bg-gradient-to-r from-ocean to-ocean-dark py-16 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Experience {islandName}?</h2>
        <p className="text-lg mb-8 max-w-xl mx-auto">
          Book your transportation to this beautiful island destination and start planning your perfect getaway.
        </p>
        <Link to="/booking">
          <Button className="bg-white text-ocean hover:bg-gray-100 px-8 py-3 text-lg font-medium">
            Book Now
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CallToAction;
