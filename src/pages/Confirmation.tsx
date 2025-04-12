
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BookingInfo } from "@/types/booking";
import { toast } from "sonner";
import Header from "@/components/Header";
import ConfirmationHeader from "@/components/confirmation/ConfirmationHeader";
import TripDetails from "@/components/confirmation/TripDetails";
import PassengerInfo from "@/components/confirmation/PassengerInfo";
import SpeedboatInfo from "@/components/confirmation/SpeedboatInfo";
import PaymentInfo from "@/components/confirmation/PaymentInfo";
import ConfirmationFooter from "@/components/confirmation/ConfirmationFooter";
import QrCodeDisplay from "@/components/confirmation/QrCodeDisplay";
import HeaderExtras from "@/components/HeaderExtras";
import { saveBookingToLocalStorage } from "@/services/bookingStorage";
import { 
  saveBookingToDatabase, 
  sendBookingConfirmationEmail, 
  getRouteDetails 
} from "@/services/bookingService";
import { RouteData } from "@/types/database";
import ActivityConfirmation from "@/components/activities/ActivityConfirmation";
import { saveActivityBookingToDatabase, sendActivityConfirmationEmail } from "@/services/activityService";

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null);
  const [activityBooking, setActivityBooking] = useState<any>(null);
  const [isEmailSent, setIsEmailSent] = useState<boolean>(false);
  const [outboundSpeedboatDetails, setOutboundSpeedboatDetails] = useState<RouteData | null>(null);
  const [returnSpeedboatDetails, setReturnSpeedboatDetails] = useState<RouteData | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  
  useEffect(() => {
    if (location.state?.isActivityBooking) {
      const activityData = location.state;
      if (!activityData) {
        navigate("/");
        return;
      }
      setActivityBooking(activityData);
      
      if (activityData.paymentComplete && activityData.paymentReference && !isEmailSent) {
        saveActivityBookingAndSendConfirmation(activityData);
      }
    } else {
      const booking = location.state as BookingInfo | null;
      if (!booking || !booking.paymentComplete) {
        navigate("/");
        return;
      }
      
      setBookingInfo(booking);
      
      saveBookingToLocalStorage(booking);
      
      fetchRouteDetails(booking);
      
      if (booking.paymentComplete && booking.paymentReference && !isEmailSent) {
        saveBookingAndSendConfirmation(booking);
      }
    }
  }, [location.state, navigate, isEmailSent]);
  
  const saveActivityBookingAndSendConfirmation = async (booking: any) => {
    try {
      const { data, error } = await saveActivityBookingToDatabase(booking);
      
      if (error) {
        console.error("Error saving activity booking:", error);
        toast.error("Error processing your booking", { 
          description: "Please contact support with your booking reference." 
        });
        return;
      }
      
      const emailResult = await sendActivityConfirmationEmail(booking);
      
      if (emailResult.success) {
        setIsEmailSent(true);
        toast.success("Booking confirmation sent", {
          description: `We've sent a confirmation email to ${emailResult.emailSentTo}`
        });
      } else if (emailResult.error) {
        setEmailError(emailResult.error);
        toast.error("Could not send confirmation email", {
          description: "Please check your email address or try again later."
        });
      }
    } catch (error) {
      console.error("Error processing activity booking confirmation:", error);
      toast.error("Error processing your booking", { 
        description: "Please contact support with your booking reference." 
      });
    }
  };
  
  const saveBookingAndSendConfirmation = async (booking: BookingInfo) => {
    try {
      const { data, error } = await saveBookingToDatabase(booking);
      
      if (error) {
        console.error("Error saving booking:", error);
        toast.error("Error processing your booking", { 
          description: "Please contact support with your booking reference." 
        });
        return;
      }
      
      const enrichedBooking = {
        ...booking,
        outboundSpeedboatDetails,
        returnSpeedboatDetails
      };
      
      const emailResult = await sendBookingConfirmationEmail(enrichedBooking);
      
      if (emailResult.success) {
        setIsEmailSent(true);
        toast.success("Booking confirmation sent", {
          description: `We've sent a confirmation email to ${emailResult.emailSentTo}`
        });
      } else if (emailResult.error) {
        setEmailError(emailResult.error);
        toast.error("Could not send confirmation email", {
          description: "Please check your email address or try again later."
        });
      }
    } catch (error) {
      console.error("Error processing booking confirmation:", error);
      toast.error("Error processing your booking", { 
        description: "Please contact support with your booking reference." 
      });
    }
  };
  
  const fetchRouteDetails = async (booking: BookingInfo) => {
    if (!booking) return;
    
    try {
      const { data: outboundData } = await getRouteDetails(booking.from, booking.island);
      if (outboundData) {
        setOutboundSpeedboatDetails(outboundData);
      }
      
      if (booking.returnTrip && booking.returnTripDetails) {
        const { data: returnData } = await getRouteDetails(
          booking.returnTripDetails.from, 
          booking.returnTripDetails.island
        );
        if (returnData) {
          setReturnSpeedboatDetails(returnData);
        }
      }
    } catch (error) {
      console.error("Error fetching route details:", error);
    }
  };

  const handleFinish = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <div className="absolute top-4 right-4 z-20">
        <HeaderExtras />
      </div>
      
      <Header />
      
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <ConfirmationHeader />
          
          <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100 mt-8">
            {activityBooking ? (
              <ActivityConfirmation 
                booking={activityBooking}
                emailError={emailError}
              />
            ) : bookingInfo && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                  <div className="space-y-6">
                    {bookingInfo.from && bookingInfo.island && (
                      <TripDetails 
                        title="Outbound Journey"
                        from={bookingInfo.from}
                        to={bookingInfo.island}
                        time={bookingInfo.time}
                        date={bookingInfo.date}
                        isOutbound={true}
                        speedboatName={outboundSpeedboatDetails?.speedboat_name || null}
                        speedboatImageUrl={outboundSpeedboatDetails?.speedboat_image_url || null}
                        pickupLocation={outboundSpeedboatDetails?.pickup_location || null}
                        pickupMapUrl={outboundSpeedboatDetails?.pickup_map_url || null}
                      />
                    )}
                    
                    <QrCodeDisplay 
                      bookingReference={bookingInfo.paymentReference || ""}
                    />
                    
                    <div className="hidden lg:block">
                      <PaymentInfo 
                        paymentReference={bookingInfo.paymentReference || ""}
                        paymentMethod={bookingInfo.paymentMethod}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {(outboundSpeedboatDetails || returnSpeedboatDetails) && (
                      <div>
                        <h3 className="font-medium mb-4">Speedboat Information</h3>
                        {outboundSpeedboatDetails && (
                          <SpeedboatInfo 
                            speedboatName={outboundSpeedboatDetails.speedboat_name || null}
                            speedboatImageUrl={outboundSpeedboatDetails.speedboat_image_url || null}
                            pickupLocation={outboundSpeedboatDetails.pickup_location || null}
                            pickupMapUrl={outboundSpeedboatDetails.pickup_map_url || null}
                          />
                        )}
                        
                        {returnSpeedboatDetails && (
                          <SpeedboatInfo 
                            speedboatName={returnSpeedboatDetails.speedboat_name || null}
                            speedboatImageUrl={returnSpeedboatDetails.speedboat_image_url || null}
                            pickupLocation={returnSpeedboatDetails.pickup_location || null}
                            pickupMapUrl={returnSpeedboatDetails.pickup_map_url || null}
                            isReturn={true}
                          />
                        )}
                      </div>
                    )}
                    
                    <PassengerInfo 
                      seats={bookingInfo.seats} 
                      passengers={bookingInfo.passengers}
                    />
                    
                    <div className="lg:hidden">
                      <PaymentInfo 
                        paymentReference={bookingInfo.paymentReference || ""}
                        paymentMethod={bookingInfo.paymentMethod}
                      />
                    </div>
                  </div>
                </div>
                
                <ConfirmationFooter 
                  island={bookingInfo.island || "your destination"}
                  isReturnTrip={Boolean(bookingInfo.returnTrip)}
                  onFinish={handleFinish}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
