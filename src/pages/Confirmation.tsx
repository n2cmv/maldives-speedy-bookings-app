
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Users, Check } from "lucide-react";
import { BookingInfo } from "@/types/booking";
import Header from "@/components/Header";

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state as BookingInfo;
  
  // Redirect if no booking data
  if (!booking?.island) {
    navigate("/booking");
    return null;
  }

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
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-ocean mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Destination</p>
                  <p className="font-medium text-gray-900">{booking.island}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-ocean mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Departure Time</p>
                  <p className="font-medium text-gray-900">{booking.time}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Users className="h-5 w-5 text-ocean mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Number of Seats</p>
                  <p className="font-medium text-gray-900">{booking.seats}</p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <p className="text-center text-gray-700 mb-6">
                Thank you for booking with us. Your journey to {booking.island} awaits!
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
