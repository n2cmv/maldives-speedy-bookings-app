
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Users, Check, Calendar, ArrowLeft, ArrowRight, CreditCard } from "lucide-react";
import { BookingInfo } from "@/types/booking";
import Header from "@/components/Header";
import { format } from "date-fns";
import { useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

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
  const departureDate = booking.date ? format(new Date(booking.date), 'PPPP') : '';
  const returnDate = booking.returnTripDetails?.date 
    ? format(new Date(booking.returnTripDetails.date), 'PPPP') 
    : '';

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
            <div className="flex items-center justify-center mb-6">
              <div className="bg-green-100 rounded-full p-3">
                <Check className="h-8 w-8 text-green-600" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-ocean-dark text-center mb-6">
              Booking Confirmed!
            </h2>
            
            <div className="space-y-6 mb-8">
              {/* Payment Information */}
              <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-start">
                <CreditCard className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                <div>
                  <p className="font-medium text-green-800">Payment Successful</p>
                  <p className="text-sm text-green-700">
                    Payment Reference: {booking.paymentReference}
                  </p>
                </div>
              </div>
            
              {/* Outbound Journey - Changed to Your Trip */}
              <div className="border-t border-gray-100 pt-4">
                <h3 className="font-medium mb-4 flex items-center">
                  {isReturnTrip && <ArrowRight className="h-4 w-4 mr-1.5 text-blue-500" />}
                  Your Trip
                </h3>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-ocean mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">From</p>
                    <p className="font-medium text-gray-900">{booking.from}</p>
                  </div>
                </div>
                
                <div className="flex items-start mt-3">
                  <MapPin className="h-5 w-5 text-ocean mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">To</p>
                    <p className="font-medium text-gray-900">{booking.island}</p>
                  </div>
                </div>
                
                {departureDate && (
                  <div className="flex items-start mt-3">
                    <Calendar className="h-5 w-5 text-ocean mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium text-gray-900">{departureDate}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start mt-3">
                  <Clock className="h-5 w-5 text-ocean mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Departure Time</p>
                    <p className="font-medium text-gray-900">{booking.time}</p>
                  </div>
                </div>
              </div>
              
              {/* Return Journey (if applicable) */}
              {isReturnTrip && booking.returnTripDetails && (
                <div className="border-t border-gray-100 pt-4">
                  <h3 className="font-medium mb-4 flex items-center">
                    <ArrowLeft className="h-4 w-4 mr-1.5 text-green-500" />
                    Return Journey
                  </h3>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-ocean mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">From</p>
                      <p className="font-medium text-gray-900">{booking.returnTripDetails.from}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start mt-3">
                    <MapPin className="h-5 w-5 text-ocean mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">To</p>
                      <p className="font-medium text-gray-900">{booking.returnTripDetails.island}</p>
                    </div>
                  </div>
                  
                  {returnDate && (
                    <div className="flex items-start mt-3">
                      <Calendar className="h-5 w-5 text-ocean mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium text-gray-900">{returnDate}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start mt-3">
                    <Clock className="h-5 w-5 text-ocean mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Return Time</p>
                      <p className="font-medium text-gray-900">{booking.returnTripDetails.time}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex items-start mt-3">
                <Users className="h-5 w-5 text-ocean mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Number of Seats</p>
                  <p className="font-medium text-gray-900">{booking.seats}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <h3 className="font-medium mb-4">Passenger Information</h3>
                {booking.passengers && booking.passengers.map((passenger, index) => (
                  <div key={passenger.id} className="mb-3 border-b border-gray-100 pb-3 last:border-0">
                    <p className="font-medium">{passenger.name} <span className="text-xs text-gray-500">({passenger.type})</span></p>
                    <p className="text-sm text-gray-600">{passenger.email}</p>
                    <p className="text-sm text-gray-600">{passenger.phone}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <p className="text-center text-gray-700 mb-6">
                Thank you for booking with us. Your journey{isReturnTrip ? 's' : ''} to {booking.island}{isReturnTrip ? ' and back' : ''} await{isReturnTrip ? '' : 's'}!
              </p>
              
              <div className="flex justify-center">
                <Button
                  onClick={() => navigate("/booking")}
                  className="bg-ocean hover:bg-ocean-dark text-white"
                >
                  Book Another Trip
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Confirmation;
