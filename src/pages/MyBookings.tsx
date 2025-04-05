
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import HeaderExtras from "@/components/HeaderExtras";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getBookingsByEmail } from "@/services/bookingService";
import { ChevronLeft, Search, Ship, Calendar, MapPin, Loader2, Users } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { toast } from "sonner";

const MyBookings = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleGoBack = () => {
    navigate("/");
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    setLoading(true);
    
    try {
      const { data, error } = await getBookingsByEmail(email);
      
      if (error) {
        toast.error("Error fetching bookings", {
          description: "Please try again later"
        });
        return;
      }
      
      setBookings(data || []);
      setSearched(true);
      
      if (data && data.length === 0) {
        toast.info("No bookings found", {
          description: "No bookings were found with this email address"
        });
      }
    } catch (err) {
      toast.error("Error fetching bookings", {
        description: "Please try again later"
      });
    } finally {
      setLoading(false);
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
      <div className="absolute top-4 right-4 z-20">
        <HeaderExtras />
      </div>
      
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
                Search for your bookings by email address
              </p>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleSearch} className="space-y-4">
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
                      <Search className="h-4 w-4 mr-2" />
                    )}
                    Search
                  </Button>
                </div>
              </form>
            </div>
          </div>
          
          {searched && (
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
