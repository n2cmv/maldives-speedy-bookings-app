
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { CheckCircle, AlertTriangle, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { useTranslation } from "react-i18next";
import { getBookingByReference } from "@/services/bookingService";
import { format } from 'date-fns';
import { useQuery } from "@tanstack/react-query";
import { BookingInfo } from "@/types/booking";

const Confirmation = () => {
  const { reference } = useParams<{ reference: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [booking, setBooking] = useState<BookingInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (reference) {
      setIsLoading(true);
      getBookingByReference(reference)
        .then(response => {
          if (response.data) {
            // Convert database format to BookingInfo format
            const bookingInfo: BookingInfo = {
              from: response.data.from_location || '',
              island: response.data.to_location || '',
              time: response.data.departure_time || '',
              seats: response.data.passenger_count || 0,
              date: response.data.departure_date ? new Date(response.data.departure_date) : undefined,
              returnTrip: response.data.return_trip || false,
              returnTripDetails: response.data.return_trip ? {
                from: response.data.return_from_location || '',
                island: response.data.return_to_location || '',
                time: response.data.return_time || '',
                date: response.data.return_date ? new Date(response.data.return_date) : undefined
              } : undefined,
              passengers: response.data.passenger_info || [],
              paymentComplete: response.data.payment_complete || false,
              paymentReference: response.data.payment_reference || '',
              id: response.data.id
            };
            setBooking(bookingInfo);
            setError(null);
          } else {
            throw new Error(response.error || "Booking not found");
          }
        })
        .catch(err => {
          setError(err);
          setBooking(null);
        })
        .finally(() => setIsLoading(false));
    }
  }, [reference]);

  return (
    <div className="min-h-screen bg-white">
      <div className="h-16 pb-safe"></div>
      
      <Header />
      
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center">
        {isLoading && <div className="text-center">
            <div className="h-12 w-12 border-4 border-t-ocean border-opacity-50 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">{t("confirmation.loading", "Loading your booking...")}</p>
          </div>}

        {error && <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-red-500 mb-2">{t("confirmation.errorTitle", "Booking Not Found")}</h2>
            <p className="text-gray-600 mb-4">{t("confirmation.errorDescription", "We couldn't find a booking with the reference provided.")}</p>
            <Button onClick={() => navigate("/")} className="bg-ocean hover:bg-ocean-dark text-white">
              <Home className="h-4 w-4 mr-2" />
              {t("common.returnHome", "Return Home")}
            </Button>
          </div>}

        {booking && <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-semibold text-ocean-dark mb-2">{t("confirmation.successTitle", "Booking Confirmed!")}</h2>
            <p className="text-gray-600 mb-8">{t("confirmation.successDescription", "Thank you! Your booking has been successfully processed.")}</p>

            <div className="bg-gray-50 rounded-lg p-6 mb-6 w-full max-w-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">{t("confirmation.bookingDetails", "Booking Details")}</h3>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-700">{t("confirmation.reference", "Reference")}:</span>
                <span className="font-medium text-gray-800">{booking.paymentReference}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-700">{t("confirmation.date", "Date")}:</span>
                <span className="font-medium text-gray-800">{booking.date ? format(new Date(booking.date), 'PPP') : ''}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-700">{t("confirmation.time", "Time")}:</span>
                <span className="font-medium text-gray-800">{booking.time}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-700">{t("confirmation.destination", "Destination")}:</span>
                <span className="font-medium text-gray-800">{booking.island}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-700">{t("confirmation.total", "Total")}:</span>
                <span className="font-medium text-gray-800">MVR {/* We don't have totalPrice in BookingInfo */}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => navigate("/")} className="bg-ocean hover:bg-ocean-dark text-white">
                <Home className="h-4 w-4 mr-2" />
                {t("common.returnHome", "Return Home")}
              </Button>
              <Button variant="outline" onClick={() => navigate("/my-bookings")} className="text-ocean hover:bg-ocean/5">
                <Search className="h-4 w-4 mr-2" />
                {t("common.myBookings", "My Bookings")}
              </Button>
            </div>
          </div>}
      </div>
    </div>
  );
};

export default Confirmation;
