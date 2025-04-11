
import { format } from "date-fns";

interface PaymentSummaryProps {
  bookingReference: string;
  totalAmount: number;
  isActivityBooking?: boolean;
  activity?: string;
}

const PaymentSummary = ({ bookingReference, totalAmount, isActivityBooking, activity }: PaymentSummaryProps) => {
  const formattedDate = format(new Date(), "MMMM d, yyyy");
  
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4 pb-4 border-b">
        <div>
          <h3 className="text-lg font-medium">{isActivityBooking ? "Activity Booking" : "Speedboat Booking"}</h3>
          <p className="text-sm text-gray-500">{formattedDate}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Reference</p>
          <p className="font-medium">{bookingReference}</p>
        </div>
      </div>

      {isActivityBooking && activity && (
        <div className="mb-4 pb-4 border-b">
          <p className="text-sm text-gray-500">Activity</p>
          <p className="font-medium">{activity}</p>
        </div>
      )}
      
      <div className="flex justify-between items-center pt-2">
        <p className="font-bold">Total</p>
        <p className="font-bold text-xl">${totalAmount.toFixed(2)} USD</p>
      </div>
    </div>
  );
};

export default PaymentSummary;
