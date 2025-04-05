
import { Users } from "lucide-react";
import { Passenger } from "@/types/booking";

interface PassengerInfoProps {
  seats: number;
  passengers?: Passenger[];
}

const PassengerInfo = ({ seats, passengers }: PassengerInfoProps) => {
  return (
    <>
      <div className="flex items-start mt-3">
        <Users className="h-5 w-5 text-ocean mr-3 mt-0.5" />
        <div>
          <p className="text-sm text-gray-500">Number of Seats</p>
          <p className="font-medium text-gray-900">{seats}</p>
        </div>
      </div>

      {passengers && passengers.length > 0 && (
        <div className="border-t border-gray-200 pt-4 mt-4">
          <h3 className="font-medium mb-4">Passenger Information</h3>
          {passengers.map((passenger) => (
            <div key={passenger.id} className="mb-3 border-b border-gray-100 pb-3 last:border-0">
              <p className="font-medium">
                {passenger.name} <span className="text-xs text-gray-500">({passenger.type})</span>
              </p>
              <p className="text-sm text-gray-600">{passenger.email}</p>
              <p className="text-sm text-gray-600">{passenger.phone}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default PassengerInfo;
