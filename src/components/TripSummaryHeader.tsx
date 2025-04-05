
import { BookingInfo } from "@/types/booking";

interface TripSummaryHeaderProps {
  bookingInfo: BookingInfo;
}

const TripSummaryHeader = ({ bookingInfo }: TripSummaryHeaderProps) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-sm text-gray-600">Trip to</p>
          <p className="font-medium">{bookingInfo.island}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Departure</p>
          <p className="font-medium">{bookingInfo.time}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Total seats</p>
          <p className="font-medium">{bookingInfo.seats}</p>
        </div>
      </div>
      <div className="border-t border-gray-200 pt-2">
        <p className="text-sm text-gray-600">
          Please fill in details for all passengers
          <span className="block mt-1 text-xs text-gray-500">
            (Email and phone number only required for primary passenger)
          </span>
        </p>
      </div>
    </div>
  );
};

export default TripSummaryHeader;
