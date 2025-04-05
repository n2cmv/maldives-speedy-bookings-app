
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getBookingsByEmail } from "@/services/bookingService";
import { ChevronLeft, Search, Ship, Calendar, Loader2, Users, Inbox, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const MyBookings = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleGoBack = () => {
    navigate("/");
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    setLoading(true);
    
    try {
      // Send OTP via our custom edge function
      const response = await supabase.functions.invoke("process-booking-otp", {
        body: { email }
      });
      
      if (response.error) {
        console.error("Error from edge function:", response.error);
        toast.error("Error sending verification code", {
          description: "Please try again later"
        });
        return;
      }
      
      if (!response.data?.success) {
        const errorMsg = response.data?.error || "Please try again later";
        console.error("Error response:", errorMsg);
        toast.error("Error sending verification code", {
          description: errorMsg
        });
        return;
      }
      
      toast.success("Verification code sent", {
        description: "Please check your email and enter the code below"
      });
      
      setShowOTP(true);
    } catch (err) {
      console.error("Exception sending OTP:", err);
      toast.error("Error sending verification code", {
        description: "Please try again later"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otpValue || otpValue.length < 6) {
      toast.error("Please enter the complete verification code");
      return;
    }
    
    setVerifying(true);
    
    try {
      // Use the validate-booking-otp edge function
      const { data: validationResult, error: validationError } = await supabase.functions.invoke(
        "validate-booking-otp",
        {
          body: { 
            email: email.toLowerCase(),
            code: otpValue
          }
        }
      );
      
      // Handle validation errors
      if (validationError) {
        console.error("Edge function error:", validationError);
        toast.error("Error verifying code", {
          description: "Please try again later"
        });
        setVerifying(false);
        return;
      }
      
      // If the OTP is invalid
      if (!validationResult?.valid) {
        const errorMessage = validationResult?.error || "Please check the code and try again";
        toast.error("Invalid verification code", {
          description: errorMessage
        });
        setVerifying(false);
        return;
      }
      
      // OTP is valid, set verified state to true
      setVerified(true);
      
      // Fetch bookings
      const { data: bookingsData, error: bookingsError } = await getBookingsByEmail(email);
      
      if (bookingsError) {
        console.error("Error fetching bookings:", bookingsError);
        toast.error("Error fetching bookings", {
          description: "Please try again later"
        });
        setVerifying(false);
        return;
      }
      
      setBookings(bookingsData || []);
      
      if (bookingsData && bookingsData.length === 0) {
        toast.info("No bookings found", {
          description: "No bookings were found with this email address"
        });
      }
    } catch (err) {
      console.error("Exception verifying code:", err);
      toast.error("Error verifying code", {
        description: "Please try again later"
      });
    } finally {
      setVerifying(false);
    }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      <Header />
      
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="outline" 
            onClick={handleGoBack}
            className="mb-6 flex items-center gap-2 text-ocean-dark border-ocean-dark hover:bg-ocean-light/20"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Home
          </Button>
          
          <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-100 mb-8">
            <div className="bg-ocean-light/10 py-4 px-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-ocean-dark">My Bookings</h2>
              <p className="text-sm text-gray-600 mt-1">
                Access your bookings with email verification
              </p>
            </div>
            
            <div className="p-6">
              {!showOTP ? (
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-3">
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      className="flex-1"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                    />
                    <Button 
                      type="submit" 
                      className="bg-ocean hover:bg-ocean-dark text-white"
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Inbox className="h-4 w-4 mr-2" />
                      )}
                      Send Verification Code
                    </Button>
                  </div>
                  
                  <div className="text-xs text-gray-500 flex items-center mt-2">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    <span>We'll send a 6-digit code to your email address</span>
                  </div>
                </form>
              ) : !verified ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-4">
                      We've sent a verification code to <span className="font-medium">{email}</span>
                    </p>
                    
                    <div className="flex justify-center mb-6">
                      <Card className="p-4 border border-gray-200">
                        <InputOTP 
                          maxLength={6}
                          value={otpValue}
                          onChange={(value) => setOtpValue(value)}
                          className="gap-2"
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </Card>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row justify-center gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setShowOTP(false)}
                        disabled={verifying}
                      >
                        Back
                      </Button>
                      <Button
                        onClick={handleVerifyOTP}
                        disabled={verifying || otpValue.length < 6}
                        className="bg-ocean hover:bg-ocean-dark text-white"
                      >
                        {verifying ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Search className="h-4 w-4 mr-2" />
                        )}
                        Verify & Show Bookings
                      </Button>
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-6">
                      Didn't receive the code?{" "}
                      <button 
                        className="text-ocean hover:underline" 
                        onClick={handleSendOTP}
                        disabled={loading}
                      >
                        Resend code
                      </button>
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          
          {verified && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              <h3 className="text-lg font-medium text-gray-700">
                {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'} found
              </h3>
              
              {bookings.length === 0 && (
                <motion.div 
                  variants={itemVariants}
                  className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center"
                >
                  <Ship className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No bookings found</h3>
                  <p className="text-gray-500">
                    No bookings were found with the email address {email}
                  </p>
                </motion.div>
              )}
              
              {bookings.map((booking: any) => (
                <motion.div
                  key={booking.id}
                  variants={itemVariants}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center">
                        <Ship className="h-5 w-5 text-ocean mr-2" />
                        <h3 className="font-medium text-ocean-dark">
                          {booking.from_location} → {booking.to_location}
                        </h3>
                      </div>
                      
                      <div className="flex items-center mt-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        <span>{format(new Date(booking.departure_date), 'PPP')} at {booking.departure_time}</span>
                      </div>
                      
                      <div className="flex items-center mt-1 text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-1 text-gray-400" />
                        <span>{booking.passenger_count} {booking.passenger_count === 1 ? 'passenger' : 'passengers'}</span>
                      </div>
                      
                      {booking.return_trip && booking.return_date && (
                        <div className="flex items-start mt-3">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                            <span>Return: {format(new Date(booking.return_date), 'PPP')} at {booking.return_time}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-right">
                      <div className="mb-2">
                        {booking.payment_complete ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Confirmed
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        )}
                      </div>
                      
                      {booking.payment_reference && (
                        <p className="text-xs text-gray-500">
                          Ref: {booking.payment_reference}
                        </p>
                      )}
                      
                      <p className="text-xs text-gray-500 mt-1">
                        {format(new Date(booking.created_at), 'PP')}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
