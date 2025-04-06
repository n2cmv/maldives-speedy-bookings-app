
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BookingInfo, Passenger } from "@/types/booking";
import Header from "@/components/Header";
import TripSummaryCard from "@/components/TripSummaryCard";
import PassengerForm from "@/components/PassengerForm";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import StepIndicator from "@/components/StepIndicator";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const PassengerDetails = () => {
  const { t } = useTranslation();
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
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-900">
      <Header />
      
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="max-w-4xl mx-auto mb-6 pt-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <StepIndicator />
          </motion.div>
          
          <Button 
            variant="outline" 
            onClick={handleGoBack}
            className="mb-6 flex items-center gap-2 text-ocean-dark dark:text-white border-ocean-dark dark:border-white/20 hover:bg-ocean-light/20 dark:hover:bg-white/10"
          >
            <ChevronLeft className="h-4 w-4" />
            {t("common.previous", "Previous")}
          </Button>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <motion.div 
                className="bg-white dark:bg-gray-800 shadow-md rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 mb-6 apple-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="bg-ocean-light/10 dark:bg-ocean-dark/30 py-4 px-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-2xl font-bold text-ocean-dark dark:text-white">{t("booking.passenger.details", "Passenger Details")}</h2>
                </div>
                
                <div className="p-6">
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {t("booking.passenger.fillDetails", "Please fill in details for all passengers")}
                      <span className="block mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {t("booking.passenger.primaryOnly", "(Email and phone number only required for primary passenger)")}
                      </span>
                    </p>
                  </div>
                  
                  <PassengerForm 
                    bookingInfo={bookingInfo}
                    passengers={passengers}
                    setPassengers={setPassengers}
                  />
                </div>
              </motion.div>
            </div>
            
            {/* Trip Summary Card */}
            <div className="md:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <TripSummaryCard bookingInfo={{...bookingInfo, passengers}} />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassengerDetails;
