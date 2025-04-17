
import React from "react";
import { BookingData } from "@/types/database";
import { format } from "date-fns";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";

interface BookingDetailsProps {
  booking: BookingData | null;
}

const BookingDetails = ({ booking }: BookingDetailsProps) => {
  if (!booking) return null;

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP");
    } catch (error) {
      return "Invalid date";
    }
  };

  const isActivityBooking = booking.is_activity_booking === true;

  return (
    <DialogContent className="sm:max-w-md md:max-w-xl p-6 max-h-[90vh] overflow-y-auto">
      <DialogHeader className="mb-4">
        <div className="flex items-center justify-between">
          <DialogTitle className="text-xl">Booking Details</DialogTitle>
          {isActivityBooking && (
            <Badge variant="secondary" className="flex items-center gap-1 bg-amber-100 text-amber-800">
              <Activity className="h-3 w-3" />
              Activity Booking
            </Badge>
          )}
        </div>
        <DialogDescription className="mt-1">
          Reference: {booking.payment_reference || "N/A"}
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-8 py-4">
        {/* Trip Information */}
        <div className="bg-gray-50 p-5 rounded-lg">
          <h3 className="text-lg font-medium text-ocean mb-3">
            {isActivityBooking ? "Activity Information" : "Trip Information"}
          </h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 mt-2">
            {isActivityBooking && booking.activity && (
              <>
                <div className="text-sm font-medium">Activity:</div>
                <div className="text-sm">{booking.activity}</div>
              </>
            )}
            
            <div className="text-sm font-medium">From:</div>
            <div className="text-sm">{booking.from_location}</div>
            
            <div className="text-sm font-medium">To:</div>
            <div className="text-sm">{booking.to_location}</div>
            
            <div className="text-sm font-medium">Date:</div>
            <div className="text-sm">{formatDate(booking.departure_date)}</div>
            
            <div className="text-sm font-medium">Time:</div>
            <div className="text-sm">{booking.departure_time}</div>
          </div>
        </div>
        
        <Separator className="my-2" />
        
        {/* Return Trip Information */}
        {booking.return_trip && !isActivityBooking && (
          <>
            <div className="bg-gray-50 p-5 rounded-lg">
              <h3 className="text-lg font-medium text-ocean mb-3">Return Trip</h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 mt-2">
                <div className="text-sm font-medium">From:</div>
                <div className="text-sm">{booking.return_from_location}</div>
                
                <div className="text-sm font-medium">To:</div>
                <div className="text-sm">{booking.return_to_location}</div>
                
                <div className="text-sm font-medium">Date:</div>
                <div className="text-sm">{booking.return_date ? formatDate(booking.return_date) : "N/A"}</div>
                
                <div className="text-sm font-medium">Time:</div>
                <div className="text-sm">{booking.return_time || "N/A"}</div>
              </div>
            </div>
            <Separator className="my-2" />
          </>
        )}
        
        {/* Passenger Information */}
        <div>
          <h3 className="text-lg font-medium text-ocean mb-3">Passengers ({booking.passenger_count})</h3>
          <div className="space-y-5 mt-2">
            {booking.passenger_info && booking.passenger_info.length > 0 ? (
              booking.passenger_info.map((passenger, index) => (
                <div key={index} className="bg-gray-50 p-5 rounded-lg">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                    <div className="text-sm font-medium">Name:</div>
                    <div className="text-sm">{passenger.name || "N/A"}</div>
                    
                    <div className="text-sm font-medium">Email:</div>
                    <div className="text-sm">{passenger.email || "N/A"}</div>
                    
                    <div className="text-sm font-medium">Phone:</div>
                    <div className="text-sm">{passenger.phone || "N/A"}</div>
                    
                    {passenger.passport && (
                      <>
                        <div className="text-sm font-medium">Passport:</div>
                        <div className="text-sm">{passenger.passport}</div>
                      </>
                    )}
                    
                    {passenger.nationality && (
                      <>
                        <div className="text-sm font-medium">Nationality:</div>
                        <div className="text-sm">{passenger.nationality}</div>
                      </>
                    )}
                    
                    {passenger.id_number && (
                      <>
                        <div className="text-sm font-medium">ID Number:</div>
                        <div className="text-sm">{passenger.id_number}</div>
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500 p-4 bg-gray-50 rounded-lg">No detailed passenger information available</div>
            )}
          </div>
        </div>
        
        <Separator className="my-2" />
        
        {/* Payment Information */}
        <div className="bg-gray-50 p-5 rounded-lg">
          <h3 className="text-lg font-medium text-ocean mb-3">Payment Information</h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 mt-2">
            <div className="text-sm font-medium">Status:</div>
            <div className="text-sm">
              {booking.payment_complete ? (
                <span className="text-green-600 font-medium">Completed</span>
              ) : (
                <span className="text-amber-600 font-medium">Pending</span>
              )}
            </div>
            
            <div className="text-sm font-medium">Reference:</div>
            <div className="text-sm">{booking.payment_reference || "N/A"}</div>
          </div>
        </div>
        
        {/* Metadata */}
        <div className="text-xs text-gray-400 pt-2 px-1">
          <div>Booking ID: {booking.id}</div>
          <div>Created: {format(new Date(booking.created_at), "PPp")}</div>
          {booking.updated_at && booking.updated_at !== booking.created_at && (
            <div>Last Updated: {format(new Date(booking.updated_at), "PPp")}</div>
          )}
        </div>
      </div>
    </DialogContent>
  );
};

export default BookingDetails;
