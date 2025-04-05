
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Search, Edit, Trash2, Send, Plus, AlertCircle } from "lucide-react";
import { BookingInfo } from "@/types/booking";
import { sendBookingConfirmationEmail } from "@/services/bookingService";
import BookingForm from "@/components/admin/BookingForm";

const BookingsManager = () => {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isBookingFormOpen, setIsBookingFormOpen] = useState<boolean>(false);
  const [currentBooking, setCurrentBooking] = useState<any | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);
  const [emailStatus, setEmailStatus] = useState<Record<string, { sending: boolean; error?: string }>>({});
  const [emailDetailsDialogOpen, setEmailDetailsDialogOpen] = useState<boolean>(false);
  const [emailErrorDetails, setEmailErrorDetails] = useState<string>("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

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

  const handleEdit = (booking: any) => {
    setCurrentBooking(booking);
    setIsBookingFormOpen(true);
  };

  const handleDelete = async () => {
    if (!bookingToDelete) return;

    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingToDelete);

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

  const handleResendEmail = async (booking: any) => {
    // Update email status to sending
    setEmailStatus(prev => ({
      ...prev,
      [booking.id]: { sending: true }
    }));
    
    try {
      // Check if passenger info contains valid email
      if (!booking.passenger_info || booking.passenger_info.length === 0 || !booking.passenger_info[0].email) {
        throw new Error("Missing or invalid passenger email address");
      }

      // Convert database booking to BookingInfo format
      const bookingInfo: BookingInfo = {
        from: booking.from_location,
        island: booking.to_location,
        time: booking.departure_time,
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
          from: booking.return_from_location,
          island: booking.return_to_location,
          time: booking.return_time,
          date: booking.return_date ? new Date(booking.return_date) : undefined,
        };
      }

      console.log("Attempting to send email to:", booking.passenger_info[0].email);
      const { success, error, emailSentTo } = await sendBookingConfirmationEmail(bookingInfo);

      if (!success || error) {
        // Store error details for potential viewing
        const errorMessage = typeof error === 'object' 
          ? JSON.stringify(error, null, 2) 
          : String(error);
          
        setEmailStatus(prev => ({
          ...prev,
          [booking.id]: { sending: false, error: errorMessage }
        }));
        
        throw error || new Error("Failed to send email");
      }

      // Email sent successfully
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
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      booking.user_email?.toLowerCase().includes(query) ||
      booking.payment_reference?.toLowerCase().includes(query) ||
      booking.from_location?.toLowerCase().includes(query) ||
      booking.to_location?.toLowerCase().includes(query) ||
      (booking.passenger_info && booking.passenger_info[0]?.email?.toLowerCase().includes(query))
    );
  });

  const handleBookingSaved = () => {
    setIsBookingFormOpen(false);
    fetchBookings();
    setCurrentBooking(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bookings..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsBookingFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Booking
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Passengers</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>{booking.payment_reference || "N/A"}</TableCell>
                    <TableCell>{booking.passenger_info && booking.passenger_info[0]?.email || booking.user_email || "N/A"}</TableCell>
                    <TableCell>{booking.from_location}</TableCell>
                    <TableCell>{booking.to_location}</TableCell>
                    <TableCell>
                      {new Date(booking.departure_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{booking.passenger_count}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(booking)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setBookingToDelete(booking.id);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <div className="relative">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleResendEmail(booking)}
                            disabled={emailStatus[booking.id]?.sending}
                            className={emailStatus[booking.id]?.sending ? "opacity-50" : ""}
                          >
                            {emailStatus[booking.id]?.sending ? (
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                            ) : (
                              <Send className="h-4 w-4" />
                            )}
                          </Button>
                          {emailStatus[booking.id]?.error && (
                            <Button
                              variant="ghost" 
                              size="icon"
                              className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-100 p-0 text-red-600 hover:bg-red-200"
                              onClick={() => showEmailError(booking.id)}
                            >
                              <AlertCircle className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No bookings found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isBookingFormOpen} onOpenChange={setIsBookingFormOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {currentBooking ? "Edit Booking" : "Add New Booking"}
            </DialogTitle>
            <DialogDescription>
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
        <DialogContent className="max-w-xl">
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
    </div>
  );
};

export default BookingsManager;
