
import { format } from "date-fns";
import { Activity, ActivityBookingForm } from "./ActivityForm";
import { Sailboat, Clock, Users, Calendar, CreditCard } from "lucide-react";

interface ActivitySummaryProps {
  booking: ActivityBookingForm;
}

const ActivitySummary = ({ booking }: ActivitySummaryProps) => {
  if (!booking.activity) return null;

  const formatPrice = (price: number): string => {
    return `$${price.toFixed(2)} USD`;
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-ocean-dark">Booking Summary</h2>

      <div className="bg-ocean/5 rounded-lg p-5 border border-ocean/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-ocean text-white p-3 rounded-full">
              <Sailboat className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{booking.activity.name}</h3>
              <p className="text-gray-500 text-sm">
                {booking.activity.description || "Experience the best of Maldives"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-ocean" />
            <div>
              <p className="text-sm text-gray-500">Trip Date</p>
              <p className="font-medium">{booking.date ? format(booking.date, "PPP") : "Not selected"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-ocean" />
            <div>
              <p className="text-sm text-gray-500">Passengers</p>
              <p className="font-medium">{booking.passengers} {booking.passengers === 1 ? 'person' : 'people'}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="mb-2">
            <p className="text-sm text-gray-600">Booking Details</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Full Name:</span>
              <span className="font-medium">{booking.fullName}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{booking.email}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Phone:</span>
              <span className="font-medium">{booking.countryCode} {booking.phone}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">ID/Passport:</span>
              <span className="font-medium">{booking.passportNumber}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="flex justify-between mb-1">
            <span className="text-gray-600">{booking.activity.name} {booking.activity.id === "resort_transfer" ? "(per way)" : "(per person)"}</span>
            <span className="font-medium">${booking.activity.price}</span>
          </div>
          
          <div className="flex justify-between mb-1">
            <span className="text-gray-600">
              {booking.activity.id === "sandbank_trip" 
                ? "Flat fee for trip" 
                : `${booking.passengers} ${booking.passengers === 1 ? 'passenger' : 'passengers'}`}
            </span>
            <span className="font-medium">
              {booking.activity.id === "sandbank_trip"
                ? ""
                : `× ${booking.passengers}`}
            </span>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-ocean-dark" />
              <span className="font-semibold">Total Amount</span>
            </div>
            <span className="text-xl font-bold text-ocean-dark">{formatPrice(booking.totalPrice)}</span>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-500">
        By clicking "Send Booking", your booking details will be sent to our team. 
        We will contact you shortly to confirm your booking and arrange payment details.
      </p>
    </div>
  );
};

export default ActivitySummary;
