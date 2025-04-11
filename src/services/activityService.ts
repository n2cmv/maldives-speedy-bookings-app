
import { supabase } from "@/integrations/supabase/client";

// Function to save activity booking to database
export async function saveActivityBookingToDatabase(booking: any): Promise<{ data: any; error: any }> {
  try {
    const bookingData = {
      user_email: booking.email || "",
      from_location: "Retour Office", // Default start point
      to_location: "Activity Location",
      departure_time: "As scheduled",
      departure_date: booking.date ? new Date(booking.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      return_trip: false,
      passenger_count: booking.passengers || 1,
      payment_complete: booking.paymentComplete || false,
      payment_reference: booking.paymentReference || null,
      activity: booking.activity?.name || "Unspecified Activity",
      is_activity_booking: true,
      passenger_info: [{
        name: booking.fullName,
        email: booking.email,
        phone: `${booking.countryCode} ${booking.phone}`,
        passport: booking.passportNumber
      }]
    };

    const { data, error } = await supabase
      .from('bookings')
      .insert(bookingData)
      .select()
      .single();

    if (error) {
      console.error("Error saving activity booking:", error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Exception saving activity booking:", error);
    return { data: null, error };
  }
}

export async function sendActivityConfirmationEmail(booking: any): Promise<{ 
  success: boolean; 
  error?: any; 
  emailSentTo?: string 
}> {
  try {
    if (!booking.email) {
      console.error("No email provided for activity confirmation");
      return { success: false, error: "No email address provided" };
    }
    
    console.log("Attempting to send activity confirmation email to:", booking.email);
    
    // Get current domain from window for QR code generation
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    
    // Enhanced activity details for the email
    const emailData = {
      email: booking.email.trim().toLowerCase(),
      name: booking.fullName,
      bookingDetails: {
        activityName: booking.activity.name,
        activityPrice: booking.activity.price,
        activityDescription: booking.activity.description || "",
        activityDuration: booking.activity.duration || "",
        activityLocation: booking.activity.location || "Activity Location",
        date: booking.date ? new Date(booking.date).toLocaleDateString() : "",
        time: booking.time || "As scheduled",
        passengers: booking.passengers,
        totalPrice: booking.totalPrice,
        paymentReference: booking.paymentReference || "Unknown",
        origin: origin, // Add origin for QR code generation
        // Passenger information
        fullName: booking.fullName,
        passport: booking.passportNumber,
        phone: `${booking.countryCode} ${booking.phone}`,
        email: booking.email,
        // Special requests if available
        specialRequests: booking.specialRequests || "",
        // Flag to identify this as an activity booking
        isActivity: true
      }
    };
    
    console.log("Preparing activity email payload:", JSON.stringify(emailData));
    
    const response = await supabase.functions.invoke("send-confirmation", {
      body: emailData
    });

    console.log("Edge function raw response:", JSON.stringify(response));

    if (response.error) {
      console.error("Error from send-confirmation edge function:", response.error);
      return { 
        success: false, 
        error: typeof response.error === 'object' ? JSON.stringify(response.error) : String(response.error),
        emailSentTo: booking.email
      };
    }

    if (response.data?.error) {
      console.error("Error in send-confirmation response data:", response.data.error);
      return { 
        success: false, 
        error: response.data.error,
        emailSentTo: booking.email
      };
    }

    console.log("Activity confirmation email sent successfully to:", booking.email, "Response:", response.data);
    return { 
      success: true,
      emailSentTo: booking.email 
    };
  } catch (error) {
    console.error("Exception sending activity confirmation email:", error);
    return { 
      success: false, 
      error: typeof error === 'object' ? JSON.stringify(error) : String(error),
      emailSentTo: booking.email
    };
  }
}
