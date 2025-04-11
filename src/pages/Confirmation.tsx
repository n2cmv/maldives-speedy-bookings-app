import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import HeaderExtras from "@/components/HeaderExtras";
import { BookingInfo } from "@/types/booking";
import { CheckCircle2, Mail, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { saveBookingToLocalStorage } from "@/services/bookingStorage";
import { sendBookingConfirmationEmail } from "@/services/bookingService";
import { QrCode } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import TripDetails from "@/components/confirmation/TripDetails";
import PassengerInfo from "@/components/confirmation/PassengerInfo";
import PaymentInfo from "@/components/confirmation/PaymentInfo";
import SpeedboatInfo from "@/components/confirmation/SpeedboatInfo";
import QrCodeDisplay from "@/components/confirmation/QrCodeDisplay";
import ConfirmationHeader from "@/components/confirmation/ConfirmationHeader";
import ConfirmationFooter from "@/components/confirmation/ConfirmationFooter";

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingInfo, setBookingInfo] = useState<BookingInfo | any>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isActivityBooking, setIsActivityBooking] = useState(false);
  
  const isMobile = useIsMobile();
  
  const calculateTotal = () => {
    if (!bookingInfo?.passengers) return 0;
    
    const totalPassengers = bookingInfo.passengers.length || 0;
    const isReturnTrip = bookingInfo.returnTrip && bookingInfo.returnTripDetails;
    const journeyMultiplier = isReturnTrip ? 2 : 1;
    
    return totalPassengers * 70 * journeyMultiplier;
  };
  
  useEffect(() => {
    const booking = location.state;
    if (!booking) {
      navigate("/booking");
      return;
    }
    
    console.log("Confirmation page received booking:", booking);
    console.log("Booking payment reference:", booking.paymentReference);
    
    const updatedBooking = {
      ...booking,
      paymentReference: booking.paymentReference
    };
    
    setBookingInfo(updatedBooking);
    
    if (booking.isActivityBooking) {
      setIsActivityBooking(true);
    }
    
    saveBookingToLocalStorage(updatedBooking);
    
    const sendConfirmation = async () => {
      setIsLoading(true);
      try {
        const result = await sendBookingConfirmationEmail(updatedBooking);
        if (result.success) {
          setEmailSent(true);
          toast.success("Confirmation email sent successfully!");
        } else {
          toast.error("Failed to send confirmation email. Please try again.");
        }
      } catch (error) {
        console.error("Error sending confirmation email:", error);
        toast.error("Failed to send confirmation email. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    sendConfirmation();
  }, [location.state, navigate]);
  
  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      if (!bookingInfo) {
        throw new Error("No booking information available to resend.");
      }
      
      const result = await sendBookingConfirmationEmail(bookingInfo);
      if (result.success) {
        setEmailSent(true);
        toast.success("Confirmation email resent successfully!");
      } else {
        toast.error("Failed to resend confirmation email. Please try again.");
      }
    } catch (error) {
      console.error("Error resending confirmation email:", error);
      toast.error("Failed to resend confirmation email. Please try again.");
    } finally {
      setIsResending(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-ocean border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800">Processing Confirmation</h2>
          <p className="text-gray-600">Please wait while we confirm your booking and send you an email...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="absolute top-4 right-4 z-20">
        <HeaderExtras />
      </div>
      
      <Header />
      
      <div className="pt-28 pb-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <ConfirmationHeader 
              booking={bookingInfo} 
              isEmailSent={emailSent}
              isActivityBooking={isActivityBooking}
            />
            
            <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-10">
                <TripDetails booking={bookingInfo} isActivityBooking={isActivityBooking} />
                <PassengerInfo booking={bookingInfo} isActivityBooking={isActivityBooking} />
              </div>
              
              <div className="space-y-8">
                <PaymentInfo 
                  booking={bookingInfo} 
                  totalAmount={calculateTotal()}
                  isActivityBooking={isActivityBooking}
                />
                
                <SpeedboatInfo 
                  outbound={bookingInfo.outboundSpeedboatDetails} 
                  return={bookingInfo.returnSpeedboatDetails}
                  isActivityBooking={isActivityBooking}
                />
                
                <QrCodeDisplay booking={bookingInfo} />
              </div>
            </div>
            
            <ConfirmationFooter 
              booking={bookingInfo}
              resendEmail={handleResendEmail}
              isResending={isResending}
              isActivityBooking={isActivityBooking}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Confirmation;
