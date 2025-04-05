
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
      departure_date: booking.date ? booking.date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      return_trip: booking.returnTrip || false,
      return_from_location: booking.returnTripDetails?.from || null,
      return_to_location: booking.returnTripDetails?.island || null,
      return_time: booking.returnTripDetails?.time || null,
      return_date: booking.returnTripDetails?.date 
        ? booking.returnTripDetails.date.toISOString().split('T')[0] 
        : null,
      passenger_count: booking.seats,
      payment_complete: booking.paymentComplete || false,
      payment_reference: booking.paymentReference || null,
      // Explicitly cast passenger_info to match Json type required by Supabase
      passenger_info: booking.passengers ? JSON.parse(JSON.stringify(booking.passengers)) : []
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
      console.error("No passenger information provided for email");
      return { success: false, error: "No passenger information provided" };
    }

    const primaryPassenger = booking.passengers[0];
    console.log("Sending confirmation email to:", primaryPassenger.email);
    
    // Validate email format
    if (!primaryPassenger.email || !isValidEmail(primaryPassenger.email)) {
      console.error("Invalid email address:", primaryPassenger.email);
      return { success: false, error: "Invalid email address" };
    }
    
    const emailData = {
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
    };
    
    console.log("Email payload:", emailData);
    
    const response = await supabase.functions.invoke("send-confirmation", {
      body: emailData
    });

    if (response.error) {
      console.error("Error sending confirmation email:", response.error);
      return { success: false, error: response.error };
    }

    console.log("Confirmation email response:", response.data);
    return { success: true };
  } catch (error) {
    console.error("Exception sending confirmation email:", error);
    return { success: false, error };
  }
}

// Helper function to validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
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

// New function to get booking by reference number
export async function getBookingByReference(reference: string): Promise<{ data: any; error: any }> {
  try {
    console.log("Looking up booking with reference:", reference);
    
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('payment_reference', reference)
      .maybeSingle();
      
    if (error) {
      console.error("Error fetching booking by reference:", error);
      return { data: null, error };
    }
    
    if (!data) {
      console.log("No booking found with reference:", reference);
      return { data: null, error: "Booking not found" };
    }
    
    console.log("Found booking:", data);
    return { data, error: null };
  } catch (error) {
    console.error("Exception fetching booking by reference:", error);
    return { data: null, error };
  }
}
