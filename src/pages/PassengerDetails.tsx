
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BookingInfo, Passenger } from "@/types/booking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Plus, Trash2, User } from "lucide-react";
import Header from "@/components/Header";
import TripSummaryCard from "@/components/TripSummaryCard";
import CountryCodeSelector from "@/components/CountryCodeSelector";

const MAX_PASSENGERS = 15;

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
  
  const handlePassengerChange = (id: number, field: keyof Passenger, value: string) => {
    setPassengers(prevPassengers => 
      prevPassengers.map(passenger => 
        passenger.id === id ? { ...passenger, [field]: value } : passenger
      )
    );
  };
  
  const handleRemovePassenger = (id: number) => {
    setPassengers(prevPassengers => prevPassengers.filter(passenger => passenger.id !== id));
  };
  
  const handleAddPassenger = () => {
    if (passengers.length >= MAX_PASSENGERS) {
      toast({
        title: "Maximum passengers reached",
        description: `You cannot add more than ${MAX_PASSENGERS} passengers.`,
        variant: "destructive"
      });
      return;
    }
    
    const newId = Math.max(...passengers.map(p => p.id), 0) + 1;
    setPassengers(prevPassengers => [
      ...prevPassengers, 
      {
        id: newId,
        name: "",
        email: "",
        phone: "",
        countryCode: "+960", // Default to Maldives country code
        passport: "",
        type: "adult" // Default type
      }
    ]);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if first passenger has all required fields
    const firstPassenger = passengers[0];
    if (!firstPassenger?.name || !firstPassenger?.email || !firstPassenger?.phone || !firstPassenger?.passport) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields for the primary passenger",
        variant: "destructive"
      });
      return;
    }
    
    // Check if all passengers have name and passport (only these are required for all)
    const missingRequiredInfo = passengers.some(p => !p.name || !p.passport);
    
    if (missingRequiredInfo) {
      toast({
        title: "Missing information",
        description: "Please fill in name and passport number for all passengers",
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
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="booking-card mb-6">
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
                  <p className="text-sm text-gray-600">
                    Please fill in details for all passengers
                    <span className="block mt-1 text-xs text-gray-500">
                      (Email and phone number only required for primary passenger)
                    </span>
                  </p>
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
                          {index === 0 ? "Primary Passenger" : `Passenger ${index + 1}`} ({passenger.type})
                        </h3>
                      </div>
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemovePassenger(passenger.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="text"
                          value={passenger.name}
                          onChange={(e) => handlePassengerChange(passenger.id, "name", e.target.value)}
                          placeholder="Enter full name"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address {index === 0 && <span className="text-red-500">*</span>}
                        </label>
                        <Input
                          type="email"
                          value={passenger.email}
                          onChange={(e) => handlePassengerChange(passenger.id, "email", e.target.value)}
                          placeholder="Enter email address"
                          required={index === 0}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number {index === 0 && <span className="text-red-500">*</span>}
                        </label>
                        <div className="flex items-center gap-2">
                          <CountryCodeSelector 
                            value={passenger.countryCode}
                            onChange={(value) => handlePassengerChange(passenger.id, "countryCode", value)}
                          />
                          <Input
                            type="tel"
                            value={passenger.phone}
                            onChange={(e) => handlePassengerChange(passenger.id, "phone", e.target.value)}
                            placeholder="Enter phone number"
                            required={index === 0}
                            className="flex-1"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Passport Number <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="text"
                          value={passenger.passport}
                          onChange={(e) => handlePassengerChange(passenger.id, "passport", e.target.value)}
                          placeholder="Enter passport number"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="mb-6">
                  <Button 
                    type="button" 
                    onClick={handleAddPassenger}
                    variant="outline"
                    className="w-full border-dashed border-gray-300 py-3 flex items-center justify-center text-ocean hover:bg-ocean/5"
                    disabled={passengers.length >= MAX_PASSENGERS}
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Another Passenger
                  </Button>
                  <p className="text-xs text-gray-500 mt-1 text-center">
                    Maximum {MAX_PASSENGERS} passengers per booking ({passengers.length}/{MAX_PASSENGERS})
                  </p>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-ocean hover:bg-ocean-dark text-white h-[60px] text-base font-medium"
                >
                  Continue to Confirmation
                </Button>
              </form>
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
