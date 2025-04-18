
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BookmarkIcon, BookmarkX, Calendar, MapPin, Ship, ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getSavedBookingsFromLocalStorage, loadSavedBooking, removeSavedBooking } from "@/services/bookingStorage";
import { BookingInfo } from "@/types/booking";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const SavedBookings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [savedBookings, setSavedBookings] = useState<(BookingInfo & { id: string })[]>([]);
  
  useEffect(() => {
    if (open) {
      setSavedBookings(getSavedBookingsFromLocalStorage());
    }
  }, [open]);
  
  const handleLoadBooking = (id: string) => {
    const booking = loadSavedBooking(id);
    if (booking) {
      setOpen(false);
      toast.info("Booking loaded", {
        description: "Your saved booking has been loaded"
      });
      
      // Determine which page to navigate to
      if (booking.paymentComplete) {
        navigate("/confirmation", { state: booking });
      } else if (booking.passengers?.length) {
        navigate("/passenger-details", { state: booking });
      } else {
        navigate("/booking", { state: booking });
      }
    }
  };
  
  const handleDeleteBooking = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeSavedBooking(id);
    setSavedBookings(getSavedBookingsFromLocalStorage());
    toast.success("Booking deleted", {
      description: "Your saved booking has been removed"
    });
  };
  
  if (savedBookings.length === 0 && open) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" title="Saved Bookings">
            <BookmarkIcon className="h-5 w-5" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Saved Bookings</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-8">
            <BookmarkX className="h-16 w-16 text-gray-300 mb-4" />
            <p className="text-gray-500">You don't have any saved bookings yet</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button variant="ghost" size="icon" title="Saved Bookings">
            <BookmarkIcon className="h-5 w-5" />
          </Button>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Saved Bookings</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <AnimatePresence>
            {savedBookings.map((booking) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => handleLoadBooking(booking.id)}
                className="mb-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow relative"
              >
                <div className="absolute top-2 right-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => handleDeleteBooking(booking.id, e)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center mb-1">
                      <Ship className="h-4 w-4 text-ocean-light mr-1" />
                      <span className="text-sm font-medium">
                        {booking.from} → {booking.island}
                      </span>
                    </div>
                    
                    {booking.date && (
                      <div className="flex items-center text-xs text-gray-500 mb-2">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(new Date(booking.date), 'PP')} at {booking.time}
                      </div>
                    )}
                    
                    <div className="flex items-center text-xs text-gray-500">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>
                        {booking.seats} {booking.seats === 1 ? 'passenger' : 'passengers'}
                      </span>
                    </div>
                    
                    {booking.paymentComplete && (
                      <div className="mt-2">
                        <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          Confirmed
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <button 
                    className="flex items-center text-ocean hover:text-ocean-dark text-xs"
                    onClick={() => handleLoadBooking(booking.id)}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default SavedBookings;
