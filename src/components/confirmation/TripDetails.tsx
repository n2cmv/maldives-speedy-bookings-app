
import { format } from "date-fns";
import { CalendarIcon, Clock, MapPin, Users } from "lucide-react";

interface TripDetailsProps {
  booking: any;
  isActivityBooking?: boolean;
}

const TripDetails = ({ booking, isActivityBooking = false }: TripDetailsProps) => {
  const formatDate = (date: string | Date) => {
    if (!date) return "Not specified";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return format(dateObj, "EEEE, MMMM d, yyyy");
  };

  const totalPassengers = booking?.passengers?.length || 0;

  if (isActivityBooking) {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-800">Activity Details</h3>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="bg-ocean-light/20 p-2 rounded-lg mr-4">
              <MapPin className="h-5 w-5 text-ocean" />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Activity</p>
              <p className="font-medium">{booking.activity}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-ocean-light/20 p-2 rounded-lg mr-4">
              <CalendarIcon className="h-5 w-5 text-ocean" />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Date</p>
              <p className="font-medium">{formatDate(booking.date)}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-ocean-light/20 p-2 rounded-lg mr-4">
              <Clock className="h-5 w-5 text-ocean" />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Time</p>
              <p className="font-medium">{booking.time}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-ocean-light/20 p-2 rounded-lg mr-4">
              <Users className="h-5 w-5 text-ocean" />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Participants</p>
              <p className="font-medium">{totalPassengers} person{totalPassengers !== 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Trip Details</h3>
      
      <div className="space-y-4">
        <div className="flex items-start">
          <div className="bg-ocean-light/20 p-2 rounded-lg mr-4">
            <MapPin className="h-5 w-5 text-ocean" />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">From</p>
            <p className="font-medium">{booking.from}</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="bg-ocean-light/20 p-2 rounded-lg mr-4">
            <MapPin className="h-5 w-5 text-ocean" />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">To</p>
            <p className="font-medium">{booking.island}</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="bg-ocean-light/20 p-2 rounded-lg mr-4">
            <CalendarIcon className="h-5 w-5 text-ocean" />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Departure Date</p>
            <p className="font-medium">{formatDate(booking.date)}</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="bg-ocean-light/20 p-2 rounded-lg mr-4">
            <Clock className="h-5 w-5 text-ocean" />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Departure Time</p>
            <p className="font-medium">{booking.time}</p>
          </div>
        </div>
        
        {booking.returnTrip && booking.returnTripDetails && (
          <>
            <div className="flex items-start">
              <div className="bg-ocean-light/20 p-2 rounded-lg mr-4">
                <CalendarIcon className="h-5 w-5 text-ocean" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Return Date</p>
                <p className="font-medium">{formatDate(booking.returnTripDetails.date)}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-ocean-light/20 p-2 rounded-lg mr-4">
                <Clock className="h-5 w-5 text-ocean" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Return Time</p>
                <p className="font-medium">{booking.returnTripDetails.time}</p>
              </div>
            </div>
          </>
        )}
        
        <div className="flex items-start">
          <div className="bg-ocean-light/20 p-2 rounded-lg mr-4">
            <Users className="h-5 w-5 text-ocean" />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Passengers</p>
            <p className="font-medium">{totalPassengers} person{totalPassengers !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetails;
