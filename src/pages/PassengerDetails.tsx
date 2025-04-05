
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BookingInfo, Passenger } from "@/types/booking";
import Header from "@/components/Header";
import TripSummaryCard from "@/components/TripSummaryCard";
import PassengerForm from "@/components/PassengerForm";

const PassengerDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  
  // Initialize from location state
  useEffect(() => {
    const booking = location.state as BookingInfo | null;
    if (!booking) {
      navigate("/booking");
      return;
    }
    
    setBookingInfo(booking);
    
    // Initialize passenger list based on counts
    if (booking.passengerCounts) {
      const initialPassengers: Passenger[] = [];
      let id = 1;
      
      // Add adults
      for (let i = 0; i < booking.passengerCounts.adults; i++) {
        initialPassengers.push({
          id,
          name: "",
          email: "",
          phone: "",
          countryCode: "+960", // Default to Maldives country code
          passport: "",
          type: "adult"
        });
        id++;
      }
      
      // Add children
      for (let i = 0; i < booking.passengerCounts.children; i++) {
        initialPassengers.push({
          id,
          name: "",
          email: "",
          phone: "",
          countryCode: "+960", // Default to Maldives country code
          passport: "",
          type: "child"
        });
        id++;
      }
      
      // Add seniors
      for (let i = 0; i < booking.passengerCounts.seniors; i++) {
        initialPassengers.push({
          id,
          name: "",
          email: "",
          phone: "",
          countryCode: "+960", // Default to Maldives country code
          passport: "",
          type: "senior"
        });
        id++;
      }
      
      setPassengers(initialPassengers);
    }
  }, [location.state, navigate]);

  if (!bookingInfo) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      <Header />
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="booking-card mb-6">
              <h2 className="text-2xl font-bold text-ocean-dark mb-6">Passenger Details</h2>
              
              <div className="border-t border-gray-200 pt-2 mb-6">
                <p className="text-sm text-gray-600">
                  Please fill in details for all passengers
                  <span className="block mt-1 text-xs text-gray-500">
                    (Email and phone number only required for primary passenger)
                  </span>
                </p>
              </div>
              
              <PassengerForm 
                bookingInfo={bookingInfo}
                passengers={passengers}
                setPassengers={setPassengers}
              />
            </div>
          </div>
          
          {/* Trip Summary Card */}
          <div className="md:col-span-1">
            <TripSummaryCard bookingInfo={{...bookingInfo, passengers}} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassengerDetails;
