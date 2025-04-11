
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
import { Edit, Trash2, Send, AlertCircle, Bug } from "lucide-react";
import { BookingData } from "@/types/database";

interface ActivityBookingTableProps {
  bookings: BookingData[];
  onEdit: (booking: BookingData) => void;
  onDelete: (bookingId: string) => void;
  onSendEmail: (booking: BookingData) => void;
  emailStatus: Record<string, { sending: boolean; error?: string }>;
  onShowEmailError: (bookingId: string) => void;
}

const ActivityBookingTable = ({ 
  bookings, 
  onEdit, 
  onDelete, 
  onSendEmail, 
  emailStatus,
  onShowEmailError
}: ActivityBookingTableProps) => {
  // Helper function to inspect booking details in console
  const debugBooking = (booking: BookingData) => {
    console.log(`Debugging activity booking ${booking.id}:`, {
      id: booking.id,
      activity: booking.activity,
      is_activity_booking: booking.is_activity_booking,
      from: booking.from_location,
      to: booking.to_location,
      date: booking.departure_date,
      passenger_count: booking.passenger_count,
      full_object: booking
    });
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Reference</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Activity</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Participants</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.payment_reference || "N/A"}</TableCell>
                <TableCell>{booking.passenger_info && booking.passenger_info[0]?.email || booking.user_email || "N/A"}</TableCell>
                <TableCell>{booking.activity || "N/A"}</TableCell>
                <TableCell>
                  {new Date(booking.departure_date).toLocaleDateString()}
                </TableCell>
                <TableCell>{booking.departure_time}</TableCell>
                <TableCell>{booking.passenger_count}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
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
                        onClick={() => onSendEmail(booking)}
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
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => debugBooking(booking)}
                      className="text-slate-400 hover:text-slate-600"
                      title="Debug booking info in console"
                    >
                      <Bug className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                No activity bookings found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ActivityBookingTable;
