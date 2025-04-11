import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import HeaderExtras from "@/components/HeaderExtras";
import { getBookingsByEmail, sendBookingConfirmationEmail } from "@/services/bookingService";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarIcon, ChevronRight, Loader, MailCheck, MapPin, Palmtree, Ship } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QRCode from "react-qr-code";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface EmailFormValues {
  email: string;
}

const MyBookings = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [resendingConfirmation, setResendingConfirmation] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<EmailFormValues>();
  
  const onSubmit = async (data: EmailFormValues) => {
    setIsLoading(true);
    
    try {
      const result = await getBookingsByEmail(data.email);
      
      if (result.error) {
        toast.error("Error retrieving bookings", {
          description: "There was a problem retrieving your bookings. Please try again."
        });
        return;
      }
      
      setBookings(result.data || []);
      setEmailSubmitted(true);
      
      // Log activity bookings found
      const activityBookings = result.data.filter(booking => 
        booking.is_activity_booking === true || 
        (booking.activity !== null && booking.activity !== '')
      );
      console.log("Activity bookings found:", activityBookings.length);
      
    } catch (error) {
      console.error("Error in retrieving bookings:", error);
      toast.error("Failed to retrieve bookings", {
        description: "An error occurred while retrieving your bookings."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSelectBooking = (booking: any) => {
    setSelectedBooking(booking);
  };

  const handleGoBack = () => {
    setSelectedBooking(null);
  };
  
  const handleResendConfirmation = async () => {
    if (!selectedBooking) return;
    
    setResendingConfirmation(true);
    
    try {
      const result = await sendBookingConfirmationEmail(selectedBooking);
      
      if (result.success) {
        toast.success("Confirmation email resent", {
          description: `A confirmation email has been sent to ${result.emailSentTo}`
        });
      } else {
        toast.error("Failed to resend confirmation", {
          description: "There was an error sending the confirmation email."
        });
      }
    } catch (error) {
      console.error("Error resending confirmation:", error);
      toast.error("Failed to resend confirmation", {
        description: "An unexpected error occurred."
      });
    } finally {
      setResendingConfirmation(false);
    }
  };

  const isActivityBooking = (booking: any): boolean => {
    // Detailed logging for debugging
    if (booking && booking.id) {
      console.log(`Booking ${booking.id} activity flags:`, {
        is_activity_booking: booking.is_activity_booking,
        activity: booking.activity,
        has_activity: booking.activity !== null && booking.activity !== ''
      });
    }
    
    // Check both the is_activity_booking flag AND the activity field for maximum compatibility
    if (booking.is_activity_booking === true) {
      console.log(`Booking ${booking.id} is marked as activity booking with flag`);
      return true;
    }
    
    if (booking.activity !== null && booking.activity !== '') {
      console.log(`Booking ${booking.id} is an activity booking with activity: ${booking.activity}`);
      return true;
    }
    
    console.log(`Booking ${booking.id} is NOT an activity booking`);
    return false;
  };
  
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="absolute top-4 right-4 z-20">
        <HeaderExtras />
      </div>
      
      <Header />

      <div className="pt-28 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          {!emailSubmitted ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-md p-8"
            >
              <h1 className="text-2xl font-bold text-gray-800 mb-6">My Bookings</h1>
              <p className="text-gray-600 mb-4">
                Enter your email address to view your bookings.
              </p>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-ocean focus:ring-ocean sm:text-sm"
                    {...register("email", { 
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email format"
                      }
                    })}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                  )}
                </div>
                <div>
                  <Button 
                    type="submit" 
                    className="w-full bg-ocean hover:bg-ocean-dark text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        <span>Loading...</span>
                      </div>
                    ) : (
                      "View Bookings"
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          ) : selectedBooking ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="md:flex md:items-start md:justify-between md:space-x-4">
                <div className="mb-6">
                  <Button 
                    variant="outline" 
                    onClick={handleGoBack}
                    className="mb-4 flex items-center gap-2 text-ocean-dark border-ocean-dark hover:bg-ocean-light/20"
                  >
                    <ChevronRight className="h-4 w-4 rotate-180" />
                    Back to Bookings
                  </Button>
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">Booking Details</h1>
                  <p className="text-gray-600">
                    Reference: {selectedBooking.payment_reference}
                  </p>
                </div>
                
                <Button 
                  variant="secondary"
                  onClick={handleResendConfirmation}
                  disabled={resendingConfirmation}
                  className="h-11"
                >
                  {resendingConfirmation ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <MailCheck className="mr-2 h-4 w-4" />
                      Resend Confirmation
                    </>
                  )}
                </Button>
              </div>

              <Card className="mb-4">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    {isActivityBooking(selectedBooking) ? selectedBooking.activity : `${selectedBooking.from_location} to ${selectedBooking.to_location}`}
                  </CardTitle>
                  <CardDescription className="text-gray-500">
                    {format(new Date(selectedBooking.departure_date), 'PPP')} at {selectedBooking.departure_time}
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{selectedBooking.passenger_count} Passengers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-gray-500" />
                    <span>
                      {format(new Date(selectedBooking.departure_date), 'PPP')} at {selectedBooking.departure_time}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="justify-between">
                  <Badge variant={isActivityBooking(selectedBooking) ? "outline" : "secondary"}>
                    {isActivityBooking(selectedBooking) ? "Activity" : "Ferry"}
                  </Badge>
                  {selectedBooking.payment_complete ? (
                    <Badge variant="success">Confirmed</Badge>
                  ) : (
                    <Badge variant="destructive">Pending</Badge>
                  )}
                </CardFooter>
              </Card>

              <Tabs defaultValue="details" className="w-full">
                <TabsList>
                  <TabsTrigger value="details">Booking Details</TabsTrigger>
                  <TabsTrigger value="qr">QR Code</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="space-y-2">
                  <div className="grid gap-4">
                    <div>
                      <Label>From</Label>
                      <p className="font-medium">{selectedBooking.from_location}</p>
                    </div>
                    <div>
                      <Label>To</Label>
                      <p className="font-medium">{selectedBooking.to_location}</p>
                    </div>
                    <div>
                      <Label>Date</Label>
                      <p className="font-medium">{format(new Date(selectedBooking.departure_date), 'PPP')}</p>
                    </div>
                    <div>
                      <Label>Time</Label>
                      <p className="font-medium">{selectedBooking.departure_time}</p>
                    </div>
                    <div>
                      <Label>Passengers</Label>
                      <p className="font-medium">{selectedBooking.passenger_count}</p>
                    </div>
                    {selectedBooking.payment_reference && (
                      <div>
                        <Label>Payment Reference</Label>
                        <p className="font-medium">{selectedBooking.payment_reference}</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="qr" className="place-items-center py-10">
                  {selectedBooking.payment_reference ? (
                    <QRCode value={`${window.location.origin}/booking-lookup?ref=${selectedBooking.payment_reference}`} size={256} level="H" />
                  ) : (
                    <p className="text-center text-gray-500">No payment reference found.</p>
                  )}
                </TabsContent>
              </Tabs>
            </motion.div>
          ) : (
            <div>
              <div className="flex items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Your Bookings</h1>
                <Button 
                  variant="ghost" 
                  onClick={() => setEmailSubmitted(false)}
                  className="ml-auto text-sm text-ocean"
                >
                  Use Different Email
                </Button>
              </div>
              
              {bookings.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-6 w-6 text-gray-400" />
                  </div>
                  <h2 className="text-xl font-medium text-gray-700 mb-2">No Bookings Found</h2>
                  <p className="text-gray-500 max-w-md mx-auto">
                    We couldn't find any bookings associated with your email address. 
                    If you've recently made a booking, it might take a few minutes to appear.
                  </p>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="grid grid-cols-1 gap-4">
                    {bookings.map((booking) => {
                      const isActivity = isActivityBooking(booking);
                      
                      // Debug the activity status of each booking
                      console.log(`Booking ${booking.id} activity flags:`, {
                        is_activity_booking: booking.is_activity_booking,
                        activity: booking.activity,
                        has_activity: booking.activity !== null && booking.activity !== ''
                      });
                      
                      return (
                        <Card 
                          key={booking.id} 
                          className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => handleSelectBooking(booking)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  {isActivity ? (
                                    <>
                                      <Palmtree className="h-4 w-4 text-green-500" />
                                      <span className="font-medium">{booking.activity || "Activity"}</span>
                                    </>
                                  ) : (
                                    <>
                                      <Ship className="h-4 w-4 text-ocean" />
                                      <span className="font-medium">
                                        {booking.from_location} → {booking.to_location}
                                      </span>
                                    </>
                                  )}
                                  <Badge variant={isActivity ? "outline" : "secondary"} className="ml-2 text-xs">
                                    {isActivity ? "Activity" : "Ferry"}
                                  </Badge>
                                </div>
                                
                                <div className="flex items-center text-xs text-gray-500 mt-1">
                                  <CalendarIcon className="h-3 w-3 mr-1" />
                                  <span>
                                    {format(new Date(booking.departure_date), 'PP')} at {booking.departure_time}
                                  </span>
                                </div>
                                
                                <div className="mt-3 flex items-center gap-2">
                                  {booking.payment_complete && (
                                    <Badge variant="success" className="text-xs">
                                      Confirmed
                                    </Badge>
                                  )}
                                  {booking.payment_reference && (
                                    <span className="text-xs text-gray-500">
                                      Ref: {booking.payment_reference}
                                    </span>
                                  )}
                                </div>
                              </div>
                              
                              <ChevronRight className="h-4 w-4 text-gray-400" />
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
