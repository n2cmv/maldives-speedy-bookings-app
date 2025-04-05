
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

// Check if API key is available before initializing Resend
const resendApiKey = Deno.env.get("RESEND_API_KEY");
if (!resendApiKey) {
  console.error("RESEND_API_KEY environment variable is not set");
}

const resend = resendApiKey ? new Resend(resendApiKey) : null;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface BookingEmailRequest {
  email: string;
  name: string;
  bookingDetails: {
    from: string;
    to: string;
    date: string;
    time: string;
    returnTrip?: boolean;
    returnDate?: string;
    returnTime?: string;
    passengerCount: number;
    paymentReference: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Email function triggered");
    
    // Check if Resend is properly initialized
    if (!resend) {
      console.error("Resend client not initialized - missing API key");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    let requestData;
    try {
      requestData = await req.json();
      console.log("Request data received:", JSON.stringify(requestData));
    } catch (error) {
      console.error("Failed to parse request JSON:", error);
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    const { email, name, bookingDetails }: BookingEmailRequest = requestData;

    if (!email || !name || !bookingDetails) {
      console.error("Missing required email data:", { email, name, bookingDetails });
      return new Response(
        JSON.stringify({ error: "Missing required email data" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      console.error("Invalid email address format:", email);
      return new Response(
        JSON.stringify({ error: "Invalid email address format" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Format trip details
    const tripInfo = `${bookingDetails.from} to ${bookingDetails.to} on ${bookingDetails.date} at ${bookingDetails.time}`;
    
    // Format return trip info if applicable
    const returnInfo = bookingDetails.returnTrip && bookingDetails.returnDate && bookingDetails.returnTime
      ? `<p><strong>Return Trip:</strong> ${bookingDetails.to} to ${bookingDetails.from} on ${bookingDetails.returnDate} at ${bookingDetails.returnTime}</p>`
      : '';

    console.log("Preparing to send email to:", email);
    
    try {
      const emailResponse = await resend.emails.send({
        from: "Island Ferry Bookings <onboarding@resend.dev>",
        to: [email],
        subject: "Your Island Ferry Booking Confirmation",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
            <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eaeaea;">
              <h1 style="color: #0AB3B8;">Island Ferry Booking Confirmation</h1>
            </div>
            
            <div style="padding: 20px 0;">
              <p>Dear ${name},</p>
              <p>Thank you for booking with Island Ferry. Your booking has been confirmed!</p>
              
              <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h2 style="color: #0AB3B8; margin-top: 0;">Booking Details</h2>
                <p><strong>Booking Reference:</strong> ${bookingDetails.paymentReference}</p>
                <p><strong>Trip:</strong> ${tripInfo}</p>
                ${returnInfo}
                <p><strong>Passengers:</strong> ${bookingDetails.passengerCount}</p>
              </div>
              
              <p>Please arrive at the ferry terminal at least 30 minutes before your scheduled departure time.</p>
              <p>If you need to make any changes to your booking, please contact our customer service.</p>
            </div>
            
            <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eaeaea; font-size: 12px; color: #666;">
              <p>Island Ferry Services &copy; 2025</p>
            </div>
          </div>
        `,
      });

      console.log("Email sent successfully:", emailResponse);

      return new Response(JSON.stringify(emailResponse), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    } catch (emailError: any) {
      console.error("Resend API error:", emailError);
      return new Response(
        JSON.stringify({ 
          error: emailError.message,
          errorDetails: emailError 
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
  } catch (error: any) {
    console.error("Error in send-confirmation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

// Helper function to validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

serve(handler);
