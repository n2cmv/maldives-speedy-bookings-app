
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Filter } from "lucide-react";
import { BookingInfo } from "@/types/booking";
import { sendBookingConfirmationEmail } from "@/services/bookingService";
import BookingForm from "@/components/admin/BookingForm";
import SearchBar from "@/components/admin/common/SearchBar";
import BookingTable from "@/components/admin/bookings/BookingTable";
import BookingDetails from "@/components/admin/bookings/BookingDetails";
import { BookingData } from "@/types/database";
import { Time } from "@/types/booking";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const BookingsManager = () => {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isBookingFormOpen, setIsBookingFormOpen] = useState<boolean>(false);
  const [currentBooking, setCurrentBooking] = useState<any | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);
  const [emailStatus, setEmailStatus] = useState<Record<string, { sending: boolean; error?: string }>>({});
  const [emailDetailsDialogOpen, setEmailDetailsDialogOpen] = useState<boolean>(false);
  const [emailErrorDetails, setEmailErrorDetails] = useState<string>("");
  const [viewBookingDetails, setViewBookingDetails] = useState<BookingData | null>(null);
  const [bookingDetailsDialogOpen, setBookingDetailsDialogOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    showFerryBookings: true,
    showActivityBookings: true,
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false }) as unknown as { data: BookingData[], error: any };

      if (error) {
        throw error;
      }

      setBookings(data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast({
        title: "Error",
        description: "Failed to fetch bookings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (booking: BookingData) => {
    setCurrentBooking(booking);
    setIsBookingFormOpen(true);
  };

  const handleViewDetails = (booking: BookingData) => {
    setViewBookingDetails(booking);
    setBookingDetailsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!bookingToDelete) return;

    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingToDelete) as any;

      if (error) {
        throw error;
      }

      setBookings(bookings.filter(booking => booking.id !== bookingToDelete));
      toast({
        title: "Success",
        description: "Booking has been deleted",
      });
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast({
        title: "Error",
        description: "Failed to delete booking",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setBookingToDelete(null);
    }
  };

  const handleResendEmail = async (booking: BookingData) => {
    setEmailStatus(prev => ({
      ...prev,
      [booking.id]: { sending: true }
    }));
    
    try {
      if (!booking.passenger_info || booking.passenger_info.length === 0 || !booking.passenger_info[0].email) {
        throw new Error("Missing or invalid passenger email address");
      }

      const bookingInfo: BookingInfo = {
        from: booking.from_location,
        island: booking.to_location,
        time: booking.departure_time as Time | '',
        date: new Date(booking.departure_date),
        seats: booking.passenger_count,
        passengers: booking.passenger_info,
        returnTrip: booking.return_trip,
        paymentComplete: booking.payment_complete,
        paymentReference: booking.payment_reference,
        id: booking.id,
      };

      if (booking.return_trip) {
        bookingInfo.returnTripDetails = {
          from: booking.return_from_location || "",
          island: booking.return_to_location || "",
          time: booking.return_time as Time | '',
          date: booking.return_date ? new Date(booking.return_date) : undefined,
        };
      }

      console.log("Attempting to send email to:", booking.passenger_info[0].email);
      const { success, error, emailSentTo } = await sendBookingConfirmationEmail(bookingInfo);

      if (!success || error) {
        const errorMessage = typeof error === 'object' 
          ? JSON.stringify(error, null, 2) 
          : String(error);
          
        setEmailStatus(prev => ({
          ...prev,
          [booking.id]: { sending: false, error: errorMessage }
        }));
        
        throw error || new Error("Failed to send email");
      }

      setEmailStatus(prev => ({
        ...prev,
        [booking.id]: { sending: false }
      }));
      
      toast({
        title: "Success",
        description: `Confirmation email sent to ${emailSentTo || booking.passenger_info[0].email}`,
      });
    } catch (error: any) {
      console.error("Error sending confirmation email:", error);
      
      toast({
        title: "Error",
        description: `Failed to send email: ${error.message || "Unknown error"}`,
        variant: "destructive",
      });
    }
  };
  
  const showEmailError = (bookingId: string) => {
    const error = emailStatus[bookingId]?.error;
    if (error) {
      setEmailErrorDetails(error);
      setEmailDetailsDialogOpen(true);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    // Apply search query filter
    if (searchQuery && !(
      booking.user_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.payment_reference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.from_location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.to_location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (booking.passenger_info && booking.passenger_info[0]?.email?.toLowerCase().includes(searchQuery.toLowerCase()))
    )) {
      return false;
    }
    
    // Apply booking type filters
    const isActivityBooking = booking.is_activity_booking === true;
    if (isActivityBooking && !filters.showActivityBookings) return false;
    if (!isActivityBooking && !filters.showFerryBookings) return false;
    
    return true;
  });

  const handleBookingSaved = () => {
    setIsBookingFormOpen(false);
    fetchBookings();
    setCurrentBooking(null);
  };

  const handleFilterChange = (key: keyof typeof filters) => {
    setFilters(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div className="flex-1 mr-2">
          <SearchBar
            placeholder="Search bookings..."
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" /> Filter
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-60 p-4">
              <div className="space-y-3">
                <h4 className="font-medium">Booking Types</h4>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="ferry-bookings" 
                    checked={filters.showFerryBookings}
                    onCheckedChange={() => handleFilterChange('showFerryBookings')}
                  />
                  <Label htmlFor="ferry-bookings">Ferry Bookings</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="activity-bookings" 
                    checked={filters.showActivityBookings}
                    onCheckedChange={() => handleFilterChange('showActivityBookings')}
                  />
                  <Label htmlFor="activity-bookings">Activity Bookings</Label>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Button onClick={() => setIsBookingFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Booking
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <BookingTable
          bookings={filteredBookings}
          onEdit={handleEdit}
          onDelete={(bookingId) => {
            setBookingToDelete(bookingId);
            setIsDeleteDialogOpen(true);
          }}
          onSendEmail={handleResendEmail}
          onViewDetails={handleViewDetails}
          emailStatus={emailStatus}
          onShowEmailError={showEmailError}
        />
      )}

      <Dialog open={isBookingFormOpen} onOpenChange={setIsBookingFormOpen}>
        <DialogContent className="max-w-2xl bg-white p-4">
          <DialogHeader className="mb-2">
            <DialogTitle className="text-lg">
              {currentBooking ? "Edit Booking" : "Add New Booking"}
            </DialogTitle>
            <DialogDescription className="text-sm">
              {currentBooking
                ? "Update booking details"
                : "Enter booking information"}
            </DialogDescription>
          </DialogHeader>
          <BookingForm
            booking={currentBooking}
            onSaved={handleBookingSaved}
            onCancel={() => setIsBookingFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this booking? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Dialog open={emailDetailsDialogOpen} onOpenChange={setEmailDetailsDialogOpen}>
        <DialogContent className="max-w-xl bg-white">
          <DialogHeader>
            <DialogTitle>Email Error Details</DialogTitle>
          </DialogHeader>
          <div className="max-h-[400px] overflow-auto">
            <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-md text-sm">
              {emailErrorDetails}
            </pre>
          </div>
          <DialogFooter>
            <Button onClick={() => setEmailDetailsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Booking Details Dialog */}
      <Dialog open={bookingDetailsDialogOpen} onOpenChange={setBookingDetailsDialogOpen}>
        <BookingDetails booking={viewBookingDetails} />
      </Dialog>
    </div>
  );
};

export default BookingsManager;
