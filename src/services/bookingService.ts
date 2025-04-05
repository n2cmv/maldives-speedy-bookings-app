
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

export async function sendBookingConfirmationEmail(booking: BookingInfo): Promise<{ success: boolean; error?: any; emailSentTo?: string }> {
  try {
    if (!booking.passengers || booking.passengers.length === 0) {
      console.error("No passenger information provided for email");
      return { success: false, error: "No passenger information provided" };
    }

    const primaryPassenger = booking.passengers[0];
    console.log("Attempting to send confirmation email to:", primaryPassenger.email);
    
    // Validate email format with a more comprehensive check
    if (!primaryPassenger.email || !isValidEmail(primaryPassenger.email)) {
      console.error("Invalid email address:", primaryPassenger.email);
      return { 
        success: false, 
        error: "Invalid email address: " + primaryPassenger.email,
        emailSentTo: primaryPassenger.email
      };
    }
    
    const emailData = {
      email: primaryPassenger.email.trim().toLowerCase(), // Normalize email
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
    
    console.log("Preparing email payload:", JSON.stringify(emailData));
    
    const response = await supabase.functions.invoke("send-confirmation", {
      body: emailData
    });

    console.log("Edge function raw response:", JSON.stringify(response));

    if (response.error) {
      console.error("Error from send-confirmation edge function:", response.error);
      return { 
        success: false, 
        error: response.error,
        emailSentTo: primaryPassenger.email
      };
    }

    if (response.data?.error) {
      console.error("Error in send-confirmation response data:", response.data.error);
      return { 
        success: false, 
        error: response.data.error,
        emailSentTo: primaryPassenger.email
      };
    }

    console.log("Confirmation email sent successfully to:", primaryPassenger.email, "Response:", response.data);
    return { 
      success: true,
      emailSentTo: primaryPassenger.email 
    };
  } catch (error) {
    console.error("Exception sending confirmation email:", error);
    return { 
      success: false, 
      error,
      emailSentTo: booking.passengers?.[0].email
    };
  }
}

// Enhanced email validation function
function isValidEmail(email: string): boolean {
  if (!email) return false;
  
  // Basic format check with regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return false;
  
  // Check for common issues
  if (email.length > 320) return false; // Too long
  if (email.indexOf('@') === -1) return false;
  
  const [localPart, domain] = email.split('@');
  if (!localPart || !domain) return false;
  if (localPart.length > 64) return false; // Local part too long
  if (domain.length > 255) return false; // Domain too long
  
  return true;
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
