import { Ship, Anchor, TreePalm, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const MobileBottomNav = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] border-t border-gray-200">
      <div className="flex justify-around items-center py-2">
        <Link 
          to="/" 
          className={cn(
            "flex flex-col items-center p-2 rounded-md",
            isActive("/") ? "text-[#0AB3B8]" : "text-[#005C99]"
          )}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        
        <Link 
          to="/speedboat-transfers" 
          className={cn(
            "flex flex-col items-center p-2 rounded-md",
            isActive("/speedboat-transfers") ? "text-[#0AB3B8]" : "text-[#005C99]"
          )}
        >
          <Ship className="h-5 w-5" />
          <span className="text-xs mt-1">Transfers</span>
        </Link>
        
        <Link 
          to="/activities" 
          className={cn(
            "flex flex-col items-center p-2 rounded-md",
            isActive("/activities") ? "text-[#0AB3B8]" : "text-[#005C99]"
          )}
        >
          <Anchor className="h-5 w-5" />
          <span className="text-xs mt-1">Activities</span>
        </Link>
        
        <Link 
          to="/islands" 
          className={cn(
            "flex flex-col items-center p-2 rounded-md",
            isActive("/islands") ? "text-[#0AB3B8]" : "text-[#005C99]"
          )}
        >
          <TreePalm className="h-5 w-5" />
          <span className="text-xs mt-1">Islands</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileBottomNav;
