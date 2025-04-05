
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BookingInfo, Passenger } from "@/types/booking";
import Header from "@/components/Header";
import TripSummaryCard from "@/components/TripSummaryCard";
import PassengerForm from "@/components/PassengerForm";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

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

  const handleGoBack = () => {
    navigate("/booking", { state: { island: bookingInfo.island } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      <Header />
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <Button 
            variant="outline" 
            onClick={handleGoBack}
            className="mb-6 flex items-center gap-2 text-ocean-dark border-ocean-dark hover:bg-ocean-light/20"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Booking
          </Button>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="booking-card mb-6 border border-ocean/10 rounded-xl overflow-hidden">
                <div className="bg-ocean/5 py-4 px-6 border-b border-ocean/10">
                  <h2 className="text-2xl font-bold text-ocean-dark">Passenger Details</h2>
                </div>
                
                <div className="p-6">
                  <div className="border-b border-gray-200 pb-4 mb-6">
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
            </div>
            
            {/* Trip Summary Card */}
            <div className="md:col-span-1">
              <TripSummaryCard bookingInfo={{...bookingInfo, passengers}} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassengerDetails;
