
import { useLocation, useNavigate } from "react-router-dom";
import { BookingInfo } from "@/types/booking";
import Header from "@/components/Header";
import { useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import ConfirmationHeader from "@/components/confirmation/ConfirmationHeader";
import PaymentInfo from "@/components/confirmation/PaymentInfo";
import TripDetails from "@/components/confirmation/TripDetails";
import PassengerInfo from "@/components/confirmation/PassengerInfo";
import ConfirmationFooter from "@/components/confirmation/ConfirmationFooter";

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state as BookingInfo & { paymentComplete?: boolean; paymentReference?: string };
  
  // Redirect if no booking data or if payment not complete
  useEffect(() => {
    if (!booking?.island || !booking?.passengers) {
      navigate("/booking");
      return;
    }
    
    if (!booking.paymentComplete) {
      // If someone tries to access confirmation without payment
      navigate("/passenger-details");
      return;
    }
    
    // Show success toast when page loads
    toast({
      title: "Payment Successful!",
      description: "Your booking has been confirmed.",
      variant: "default",
    });
  }, [booking, navigate]);
  
  if (!booking?.paymentComplete) {
    return null;
  }
  
  const isReturnTrip = booking.returnTrip && booking.returnTripDetails;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 overflow-hidden relative">
      <div
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230AB3B8' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      
      <div className="relative z-10">
        <Header />
        <main className="pt-24 pb-12 px-4">
          <div className="max-w-md mx-auto booking-card">
            <ConfirmationHeader />
            
            <div className="space-y-6 mb-8">
              {/* Payment Information */}
              <PaymentInfo paymentReference={booking.paymentReference} />
            
              {/* Outbound Journey - Changed to Your Trip */}
              <TripDetails
                title="Your Trip"
                from={booking.from}
                to={booking.island}
                time={booking.time}
                date={booking.date}
                isOutbound={isReturnTrip}
              />
              
              {/* Return Journey (if applicable) */}
              {isReturnTrip && booking.returnTripDetails && (
                <TripDetails
                  title="Return Journey"
                  from={booking.returnTripDetails.from}
                  to={booking.returnTripDetails.island}
                  time={booking.returnTripDetails.time}
                  date={booking.returnTripDetails.date}
                  isReturn
                />
              )}
              
              {/* Passenger Information */}
              <PassengerInfo 
                seats={booking.seats}
                passengers={booking.passengers}
              />
            </div>
            
            <ConfirmationFooter 
              island={booking.island}
              isReturnTrip={!!isReturnTrip}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Confirmation;
