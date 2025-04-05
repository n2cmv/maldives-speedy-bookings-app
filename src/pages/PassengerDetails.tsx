
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BookingInfo, Passenger } from "@/types/booking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Plus, Trash2, User } from "lucide-react";
import Header from "@/components/Header";

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
          type: "senior"
        });
        id++;
      }
      
      setPassengers(initialPassengers);
    }
  }, [location.state, navigate]);
  
  const handlePassengerChange = (id: number, field: keyof Passenger, value: string) => {
    setPassengers(prevPassengers => 
      prevPassengers.map(passenger => 
        passenger.id === id ? { ...passenger, [field]: value } : passenger
      )
    );
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if all required fields are filled
    const missingInfo = passengers.some(p => !p.name || !p.email || !p.phone);
    
    if (missingInfo) {
      toast({
        title: "Missing information",
        description: "Please fill in all passenger details",
        variant: "destructive"
      });
      return;
    }
    
    // Prepare updated booking info with passenger details
    const updatedBookingInfo = {
      ...bookingInfo,
      passengers
    };
    
    // Navigate to confirmation page with updated booking info
    navigate("/confirmation", { state: updatedBookingInfo });
  };

  if (!bookingInfo) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      <Header />
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-md mx-auto booking-card">
          <h2 className="text-2xl font-bold text-ocean-dark mb-6">Passenger Details</h2>
          
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
              <p className="text-sm text-gray-600">Please fill in details for all passengers</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            {passengers.map((passenger, index) => (
              <div 
                key={passenger.id} 
                className="mb-8 border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-ocean mr-2" />
                    <h3 className="font-medium">
                      Passenger {index + 1} ({passenger.type})
                    </h3>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <Input
                      type="text"
                      value={passenger.name}
                      onChange={(e) => handlePassengerChange(passenger.id, "name", e.target.value)}
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <Input
                      type="email"
                      value={passenger.email}
                      onChange={(e) => handlePassengerChange(passenger.id, "email", e.target.value)}
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <Input
                      type="tel"
                      value={passenger.phone}
                      onChange={(e) => handlePassengerChange(passenger.id, "phone", e.target.value)}
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <Button 
              type="submit" 
              className="w-full bg-ocean hover:bg-ocean-dark text-white h-[60px] text-base font-medium"
            >
              Continue to Confirmation
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PassengerDetails;
