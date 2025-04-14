
import { Link } from "react-router-dom";
import { Anchor, CalendarDays } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BookingTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BookingTypeModal = ({ isOpen, onClose }: BookingTypeModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-gray-900">
            What would you like to book?
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <Link 
            to="/booking"
            className="flex flex-col items-center justify-center p-6 bg-white hover:bg-blue-50 border-2 border-blue-100 hover:border-[#0AB3B8] rounded-xl transition-all duration-300"
            onClick={onClose}
          >
            <div className="bg-[#0AB3B8]/10 p-4 rounded-full mb-4">
              <Anchor className="h-10 w-10 text-[#0AB3B8]" />
            </div>
            <h3 className="font-bold text-lg text-gray-900">Speedboat Transfer</h3>
            <p className="text-gray-500 text-center text-sm mt-2">Book transportation between islands</p>
          </Link>
          
          <Link 
            to="/activities"
            className="flex flex-col items-center justify-center p-6 bg-white hover:bg-blue-50 border-2 border-blue-100 hover:border-[#0AB3B8] rounded-xl transition-all duration-300"
            onClick={onClose}
          >
            <div className="bg-[#0AB3B8]/10 p-4 rounded-full mb-4">
              <Anchor className="h-10 w-10 text-[#0AB3B8]" />
            </div>
            <h3 className="font-bold text-lg text-gray-900">Activities</h3>
            <p className="text-gray-500 text-center text-sm mt-2">Explore excursions and experiences</p>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingTypeModal;
