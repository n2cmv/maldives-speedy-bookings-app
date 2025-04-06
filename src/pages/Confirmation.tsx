
import { useLocation, useNavigate } from "react-router-dom";
import { BookingInfo } from "@/types/booking";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ConfirmationHeader from "@/components/confirmation/ConfirmationHeader";
import PaymentInfo from "@/components/confirmation/PaymentInfo";
import TripDetails from "@/components/confirmation/TripDetails";
import PassengerInfo from "@/components/confirmation/PassengerInfo";
import ConfirmationFooter from "@/components/confirmation/ConfirmationFooter";
import { saveBookingToLocalStorage } from "@/services/bookingStorage";
import { useTranslation } from "react-i18next";
import HeaderExtras from "@/components/HeaderExtras";
import { motion } from "framer-motion";
import { saveBookingToDatabase, sendBookingConfirmationEmail } from "@/services/bookingService";
import QrCodeDisplay from "@/components/confirmation/QrCodeDisplay";

const Confirmation = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state as BookingInfo & { paymentComplete?: boolean; paymentReference?: string };
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
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
    if (booking.paymentComplete && booking.paymentReference && !isSaved) {
      setIsProcessing(true);
      saveBookingToLocalStorage(booking);
      
      // Save to database
      saveBookingToDatabase(booking).then(({ error }) => {
        if (error) {
          console.error("Error saving booking to database:", error);
          toast.error(t("error.savingBooking", "Error saving booking"), {
            description: t("error.tryAgainLater", "Please try again later")
          });
          setIsProcessing(false);
        } else {
          // Send confirmation email
          if (!emailSent) {
            sendBookingConfirmationEmail(booking).then(({ success, error }) => {
              if (!success) {
                console.error("Error sending confirmation email:", error);
                toast.error(t("error.emailSending", "Error sending confirmation email"), {
                  description: t("error.tryAgainLater", "Please try again later")
                });
              } else {
                setEmailSent(true);
                toast.success(t("email.sent", "Confirmation email sent!"), {
                  description: t("email.check", "Please check your inbox")
                });
              }
              
              setIsProcessing(false);
              setIsSaved(true);
              
              // Show success toast when page loads and data is saved
              toast.success(t("payment.success", "Payment Successful!"), {
                description: t("payment.description", "Your booking has been confirmed.")
              });
            });
          } else {
            setIsProcessing(false);
            setIsSaved(true);
            
            // Show success toast when page loads and data is saved
            toast.success(t("payment.success", "Payment Successful!"), {
              description: t("payment.description", "Your booking has been confirmed.")
            });
          }
        }
      });
    }
  }, [booking, navigate, t, isSaved, emailSent]);
  
  if (!booking?.paymentComplete || isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 border-4 border-ocean border-t-transparent rounded-full animate-spin"></div>
            <h2 className="text-2xl font-bold text-gray-800">{t("confirmation.processing", "Processing Your Booking")}</h2>
            <p className="text-gray-600">
              {t("confirmation.wait", "Please wait while we confirm your booking...")}
            </p>
          </div>
        </div>
      </div>
    );
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
          <HeaderExtras />
        </div>
        
        <Header />
        <main className="pt-20 pb-12 px-4">
          {/* StepIndicator component removed */}
          
          <motion.div 
            className="max-w-md mx-auto booking-card mt-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <ConfirmationHeader />
            </motion.div>
            
            {/* QR Code Display */}
            <motion.div variants={itemVariants}>
              <QrCodeDisplay 
                booking={booking} 
                paymentReference={booking.paymentReference} 
              />
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
