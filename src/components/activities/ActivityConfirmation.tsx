
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Mail, Phone } from "lucide-react";
import { format } from "date-fns";
import QrCodeDisplay from "@/components/confirmation/QrCodeDisplay";

interface ActivityConfirmationProps {
  booking: any;
  emailError: string | null;
}

const ActivityConfirmation = ({ booking, emailError }: ActivityConfirmationProps) => {
  const [sending, setSending] = useState(false);
  
  if (!booking) return null;

  return (
    <div>
      <div className="p-6 md:p-8 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-ocean-dark">Activity Booking Confirmed</h2>
          <div className="bg-green-50 text-green-700 px-4 py-1 rounded-full font-medium text-sm border border-green-200">
            Confirmed
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 p-6 md:p-8">
        <div className="lg:col-span-3 space-y-8">
          <section className="space-y-4">
            <h3 className="font-semibold text-lg text-ocean-dark">Activity Details</h3>
            
            <div className="bg-ocean/5 rounded-lg p-5">
              <h4 className="font-semibold text-lg mb-4">{booking.activity.name}</h4>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{booking.date ? format(new Date(booking.date), "PPP") : "Not specified"}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Passengers:</span>
                  <span className="font-medium">{booking.passengers} {booking.passengers === 1 ? 'person' : 'people'}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Price per {booking.activity.id === "resort_transfer" ? "way" : "person"}:</span>
                  <span className="font-medium">${booking.activity.price} USD</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Price:</span>
                  <span className="font-bold text-ocean-dark">${booking.totalPrice.toFixed(2)} USD</span>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="font-semibold text-lg text-ocean-dark">Personal Information</h3>
            
            <div className="bg-gray-50 rounded-lg p-5">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Full Name:</span>
                  <span className="font-medium">{booking.fullName}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{booking.email}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium">{booking.countryCode} {booking.phone}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">ID/Passport:</span>
                  <span className="font-medium">{booking.passportNumber}</span>
                </div>
              </div>
            </div>
          </section>
        </div>
        
        <div className="lg:col-span-2 space-y-8">
          <section className="space-y-4">
            <h3 className="font-semibold text-lg text-ocean-dark">Payment Information</h3>
            
            <div className="bg-gray-50 rounded-lg p-5">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="text-green-600 font-medium">Paid</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Reference:</span>
                  <span className="font-medium">{booking.paymentReference}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-bold text-ocean-dark">${booking.totalPrice.toFixed(2)} USD</span>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="font-semibold text-lg text-ocean-dark">Booking QR Code</h3>
            <QrCodeDisplay bookingReference={booking.paymentReference || ""} />
          </section>
        </div>
      </div>
      
      <div className="bg-gray-50 p-6 md:p-8 border-t border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-ocean-dark">Need help with your booking?</h3>
            <div className="flex items-center gap-6 mt-2">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-ocean" />
                <span>+960 7443777</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-ocean" />
                <span>info@retourmaldives.com</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline"
              className="border-gray-300 flex gap-2 items-center"
            >
              <Download className="h-4 w-4" />
              Download Receipt
            </Button>
            
            <Button 
              className="bg-ocean hover:bg-ocean-dark text-white flex gap-2 items-center"
              onClick={() => window.location.href = '/'}
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityConfirmation;
