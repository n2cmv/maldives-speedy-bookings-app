
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2, Send, AlertCircle, Eye, Activity } from "lucide-react";
import { BookingData } from "@/types/database";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface BookingTableProps {
  bookings: BookingData[];
  onEdit: (booking: BookingData) => void;
  onDelete: (bookingId: string) => void;
  onSendEmail: (booking: BookingData) => void;
  onViewDetails: (booking: BookingData) => void;
  emailStatus: Record<string, { sending: boolean; error?: string }>;
  onShowEmailError: (bookingId: string) => void;
}

const BookingTable = ({ 
  bookings, 
  onEdit, 
  onDelete, 
  onSendEmail, 
  onViewDetails,
  emailStatus,
  onShowEmailError
}: BookingTableProps) => {
  // Helper function to send email with toast notifications
  const handleSendEmail = (booking: BookingData) => {
    toast.promise(
      () => new Promise((resolve, reject) => {
        // Use the provided onSendEmail function
        onSendEmail(booking);
        
        // This is just for the toast - the actual sending happens in the parent component
        if (emailStatus[booking.id]?.error) {
          reject(new Error(emailStatus[booking.id].error));
        } else {
          resolve(true);
        }
      }),
      {
        loading: 'Sending email...',
        success: 'Email sent successfully!',
        error: (err) => `Failed to send email: ${err.message || 'Unknown error'}`
      }
    );
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
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
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>
                  {booking.is_activity_booking ? (
                    <Badge variant="secondary" className="flex items-center gap-1 bg-amber-100 text-amber-800">
                      <Activity className="h-3 w-3" />
                      Activity
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-blue-50 text-blue-800">Ferry</Badge>
                  )}
                </TableCell>
                <TableCell>{booking.payment_reference || "N/A"}</TableCell>
                <TableCell>{booking.passenger_info && booking.passenger_info[0]?.email || booking.user_email || "N/A"}</TableCell>
                <TableCell>{booking.from_location}</TableCell>
                <TableCell>
                  {booking.is_activity_booking ? (
                    <span title={booking.activity}>
                      {booking.activity?.length > 15 
                        ? `${booking.activity.substring(0, 15)}...` 
                        : booking.activity || booking.to_location}
                    </span>
                  ) : (
                    booking.to_location
                  )}
                </TableCell>
                <TableCell>
                  {new Date(booking.departure_date).toLocaleDateString()}
                </TableCell>
                <TableCell>{booking.passenger_count}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onViewDetails(booking)}
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEdit(booking)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onDelete(booking.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <div className="relative">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleSendEmail(booking)}
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
                          onClick={() => onShowEmailError(booking.id)}
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
              <TableCell colSpan={8} className="text-center py-4">
                No bookings found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default BookingTable;
