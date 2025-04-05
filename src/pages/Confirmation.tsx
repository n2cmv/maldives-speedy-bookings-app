
import { useLocation, useNavigate } from "react-router-dom";
import { BookingInfo } from "@/types/booking";
import Header from "@/components/Header";
import { useEffect } from "react";
import { toast } from "sonner";
import ConfirmationHeader from "@/components/confirmation/ConfirmationHeader";
import PaymentInfo from "@/components/confirmation/PaymentInfo";
import TripDetails from "@/components/confirmation/TripDetails";
import PassengerInfo from "@/components/confirmation/PassengerInfo";
import ConfirmationFooter from "@/components/confirmation/ConfirmationFooter";
import StepIndicator from "@/components/StepIndicator";
import { saveBookingToLocalStorage } from "@/services/bookingStorage";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { motion } from "framer-motion";

const Confirmation = () => {
  const { t } = useTranslation();
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
    
    // Save booking to local storage for future reference
    if (booking.paymentComplete && booking.paymentReference) {
      saveBookingToLocalStorage(booking);
    }
    
    // Show success toast when page loads
    toast.success("Payment Successful!", {
      description: "Your booking has been confirmed."
    });
  }, [booking, navigate]);
  
  if (!booking?.paymentComplete) {
    return null;
  }
  
  const isReturnTrip = Boolean(booking.returnTrip && booking.returnTripDetails);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 overflow-hidden relative">
      <div
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230AB3B8' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      
      <div className="relative z-10">
        <div className="absolute top-4 right-4 z-20">
          <LanguageSwitcher />
        </div>
        
        <Header />
        <main className="pt-20 pb-12 px-4">
          <div className="max-w-4xl mx-auto">
            <StepIndicator />
          </div>
          
          <motion.div 
            className="max-w-md mx-auto booking-card"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <ConfirmationHeader />
            </motion.div>
            
            <div className="space-y-6 mb-8">
              {/* Payment Information */}
              <motion.div variants={itemVariants}>
                <PaymentInfo paymentReference={booking.paymentReference} />
              </motion.div>
              
              {/* Outbound Journey - Changed to Your Trip */}
              <motion.div variants={itemVariants}>
                <TripDetails
                  title={t("confirmation.yourTrip")}
                  from={booking.from}
                  to={booking.island}
                  time={booking.time}
                  date={booking.date}
                  isOutbound={isReturnTrip}
                />
              </motion.div>
              
              {/* Return Journey (if applicable) */}
              {isReturnTrip && booking.returnTripDetails && (
                <motion.div variants={itemVariants}>
                  <TripDetails
                    title={t("confirmation.returnTrip")}
                    from={booking.returnTripDetails.from}
                    to={booking.returnTripDetails.island}
                    time={booking.returnTripDetails.time}
                    date={booking.returnTripDetails.date}
                    isReturn
                  />
                </motion.div>
              )}
              
              {/* Passenger Information */}
              <motion.div variants={itemVariants}>
                <PassengerInfo 
                  seats={booking.seats}
                  passengers={booking.passengers}
                />
              </motion.div>
            </div>
            
            <motion.div variants={itemVariants}>
              <ConfirmationFooter 
                island={booking.island}
                isReturnTrip={!!isReturnTrip}
              />
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Confirmation;
