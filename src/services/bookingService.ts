
import { supabase } from "@/integrations/supabase/client";
import { BookingInfo } from "@/types/booking";
import { RouteData } from "@/types/database";

// Function to generate a payment reference with RTM prefix and a shorter 4-digit number
export const generatePaymentReference = () => {
  // Generate a random 4-digit number (1000-9999)
  const randomDigits = Math.floor(Math.random() * 9000) + 1000;
  return `RTM-${randomDigits}`;
};

// Helper function to convert Date or string to ISO date string
const formatDateForDatabase = (dateInput: Date | string | undefined): string | null => {
  if (!dateInput) return null;
  if (typeof dateInput === 'string') {
    return dateInput.includes('T') ? dateInput.split('T')[0] : dateInput;
  }
  return dateInput.toISOString().split('T')[0];
};

export async function saveBookingToDatabase(booking: BookingInfo): Promise<{ data: any; error: any }> {
  try {
    // Generate payment reference if not provided
    if (booking.paymentComplete && !booking.paymentReference) {
      booking.paymentReference = generatePaymentReference();
    }

    const isActivityBooking = !!booking.activity || !!booking.isActivityBooking;

    const bookingData = {
      user_email: booking.passengers?.[0].email || "",
      from_location: booking.from,
      to_location: booking.island,
      departure_time: booking.time,
      departure_date: formatDateForDatabase(booking.date) || new Date().toISOString().split('T')[0],
      return_trip: booking.returnTrip || false,
      return_from_location: booking.returnTripDetails?.from || null,
      return_to_location: booking.returnTripDetails?.island || null,
      return_time: booking.returnTripDetails?.time || null,
      return_date: formatDateForDatabase(booking.returnTripDetails?.date),
      passenger_count: booking.seats,
      payment_complete: booking.paymentComplete || false,
      payment_reference: booking.paymentReference || null,
      passenger_info: booking.passengers ? JSON.parse(JSON.stringify(booking.passengers)) : [],
      // Add activity-specific fields to passenger_info
      ...(isActivityBooking && {
        passenger_info: booking.passengers ? 
          JSON.parse(JSON.stringify(booking.passengers.map(p => ({
            ...p,
            activity: booking.activity
          })))) : []
      }),
      // Store activity-specific fields directly in the booking record
      activity: booking.activity || null,
      is_activity_booking: isActivityBooking
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

export async function sendBookingConfirmationEmail(booking: BookingInfo & { 
  outboundSpeedboatDetails?: RouteData | null; 
  returnSpeedboatDetails?: RouteData | null;
}): Promise<{ success: boolean; error?: any; emailSentTo?: string }> {
  try {
    if (!booking.passengers || booking.passengers.length === 0) {
      console.error("No passenger information provided for email");
      return { success: false, error: "No passenger information provided" };
    }

    const primaryPassenger = booking.passengers[0];
    console.log("Attempting to send confirmation email to:", primaryPassenger.email);
    
    if (!primaryPassenger.email || !isValidEmail(primaryPassenger.email)) {
      console.error("Invalid email address:", primaryPassenger.email);
      return { 
        success: false, 
        error: "Invalid email address: " + primaryPassenger.email,
        emailSentTo: primaryPassenger.email
      };
    }
    
    // Get current domain from window for QR code generation
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    
    // Define outbound and return speedboat details with proper typing
    const outboundSpeedboatDetails: RouteData | null = booking.outboundSpeedboatDetails || null;
    const returnSpeedboatDetails: RouteData | null = booking.returnSpeedboatDetails || null;
    
    // Prepare the email data, including activity information if applicable
    const emailData = {
      email: primaryPassenger.email.trim().toLowerCase(),
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
        paymentReference: booking.paymentReference || "Unknown",
        origin: origin, // Add origin for QR code generation
        // Add speedboat details with proper type safety
        outboundSpeedboatName: outboundSpeedboatDetails?.speedboat_name || null,
        outboundSpeedboatImage: outboundSpeedboatDetails?.speedboat_image_url || null,
        outboundPickupLocation: outboundSpeedboatDetails?.pickup_location || null,
        outboundPickupMapUrl: outboundSpeedboatDetails?.pickup_map_url || null,
        returnSpeedboatName: returnSpeedboatDetails?.speedboat_name || null,
        returnSpeedboatImage: returnSpeedboatDetails?.speedboat_image_url || null,
        returnPickupLocation: returnSpeedboatDetails?.pickup_location || null,
        returnPickupMapUrl: returnSpeedboatDetails?.pickup_map_url || null,
        // Add activity details if this is an activity booking
        isActivityBooking: !!booking.activity,
        activity: booking.activity || "",
        activityDate: booking.date ? new Date(booking.date).toLocaleDateString() : "",
        activityTime: booking.time
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
        error: typeof response.error === 'object' ? JSON.stringify(response.error) : String(response.error),
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
      error: typeof error === 'object' ? JSON.stringify(error) : String(error),
      emailSentTo: booking.passengers?.[0].email
    };
  }
}

function isValidEmail(email: string): boolean {
  if (!email) return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return false;
  
  if (email.length > 320) return false;
  if (email.indexOf('@') === -1) return false;
  
  const [localPart, domain] = email.split('@');
  if (!localPart || !domain) return false;
  if (localPart.length > 64) return false;
  if (domain.length > 255) return false;
  
  return true;
}

export async function getBookingsByEmail(email: string): Promise<{ data: any[]; error: any }> {
  try {
    console.log("Fetching bookings for email:", email);
    
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_email', email.toLowerCase().trim())
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching bookings:", error);
    } else {
      console.log("Successfully retrieved bookings:", data?.length || 0);
    }

    return { data, error };
  } catch (error) {
    console.error("Exception fetching bookings:", error);
    return { data: [], error };
  }
}

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

export async function getAllRoutes(): Promise<{ data: RouteData[]; error: any }> {
  try {
    const { data, error } = await supabase
      .from('routes')
      .select('*')
      .order('display_order', { ascending: true }) as unknown as { data: RouteData[], error: any };
    
    if (data) {
      console.log("BookingService - Retrieved routes data:", data.length, "routes");
      
      // Verify that each route has the required fields
      data.forEach(route => {
        if (!route.timings) {
          console.warn(`BookingService - Route from ${route.from_location} to ${route.to_location} has no timings array`);
          route.timings = []; // Ensure timings is at least an empty array
        }
        
        // Log each route's timings for debugging
        console.log(`BookingService - Route from ${route.from_location} to ${route.to_location}:`, 
          "Timings:", route.timings, 
          "Display order:", route.display_order);
      });
    }
      
    return { data: data || [], error };
  } catch (error) {
    console.error("Exception fetching routes:", error);
    return { data: [], error };
  }
}

export async function getRouteDetails(fromLocation: string, toLocation: string): Promise<{ data: RouteData | null; error: any }> {
  try {
    console.log(`BookingService - Fetching route details for ${fromLocation} to ${toLocation}`);
    
    const { data, error } = await supabase
      .from('routes')
      .select('*')
      .eq('from_location', fromLocation)
      .eq('to_location', toLocation)
      .maybeSingle() as unknown as { data: RouteData | null, error: any };
    
    if (data) {
      console.log("BookingService - Retrieved route details:", data);
      
      // Ensure timings is at least an empty array
      if (!data.timings) {
        console.warn(`BookingService - Route from ${fromLocation} to ${toLocation} has no timings array`);
        data.timings = [];
      }
    } else {
      console.log(`BookingService - No route found for ${fromLocation} to ${toLocation}`);
    }
      
    return { data, error };
  } catch (error) {
    console.error("Exception fetching route details:", error);
    return { data: null, error };
  }
}
