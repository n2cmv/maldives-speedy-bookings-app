
import { supabase } from "@/integrations/supabase/client";
import { BookingInfo } from "@/types/booking";

export async function saveBookingToDatabase(booking: BookingInfo): Promise<{ data: any; error: any }> {
  try {
    // Format booking data for database storage
    const bookingData = {
      user_email: booking.passengers?.[0].email || "",
      from_location: booking.from,
      to_location: booking.island,
      departure_time: booking.time,
      departure_date: booking.date,
      return_trip: booking.returnTrip || false,
      return_from_location: booking.returnTripDetails?.from || null,
      return_to_location: booking.returnTripDetails?.island || null,
      return_time: booking.returnTripDetails?.time || null,
      return_date: booking.returnTripDetails?.date || null,
      passenger_count: booking.seats,
      payment_complete: booking.paymentComplete || false,
      payment_reference: booking.paymentReference || null,
      passenger_info: booking.passengers || []
    };

    const { data, error } = await supabase
      .from('bookings')
      .insert(bookingData)
      .select()
      .single();

    if (error) {
      console.error("Error saving booking:", error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Exception saving booking:", error);
    return { data: null, error };
  }
}

export async function sendBookingConfirmationEmail(booking: BookingInfo): Promise<{ success: boolean; error?: any }> {
  try {
    if (!booking.passengers || booking.passengers.length === 0) {
      return { success: false, error: "No passenger information provided" };
    }

    const primaryPassenger = booking.passengers[0];
    const { data, error } = await supabase.functions.invoke("send-confirmation", {
      body: {
        email: primaryPassenger.email,
        name: primaryPassenger.name,
        bookingDetails: {
          from: booking.from,
          to: booking.island,
          date: booking.date ? new Date(booking.date).toLocaleDateString() : "",
          time: booking.time,
          returnTrip: booking.returnTrip,
          returnDate: booking.returnTripDetails?.date ? new Date(booking.returnTripDetails.date).toLocaleDateString() : undefined,
          returnTime: booking.returnTripDetails?.time,
          passengerCount: booking.seats,
          paymentReference: booking.paymentReference || "Unknown"
        }
      }
    });

    if (error) {
      console.error("Error sending confirmation email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Exception sending confirmation email:", error);
    return { success: false, error };
  }
}

export async function getBookingsByEmail(email: string): Promise<{ data: any[]; error: any }> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_email', email)
      .order('created_at', { ascending: false });

    return { data, error };
  } catch (error) {
    console.error("Exception fetching bookings:", error);
    return { data: [], error };
  }
}
