
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
    console.log("[send-confirmation] Email function triggered");
    
    // Check if Resend is properly initialized
    if (!resend) {
      console.error("[send-confirmation] Resend client not initialized - missing API key");
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
      console.log("[send-confirmation] Request data received:", JSON.stringify(requestData));
    } catch (error) {
      console.error("[send-confirmation] Failed to parse request JSON:", error);
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
      console.error("[send-confirmation] Missing required email data:", { email, name, bookingDetails });
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
      console.error("[send-confirmation] Invalid email address format:", email);
      return new Response(
        JSON.stringify({ error: "Invalid email address format: " + email }),
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

    console.log("[send-confirmation] Preparing to send email to:", email);
    
    try {
      console.log("[send-confirmation] Calling Resend API with from: Island Ferry Bookings <onboarding@resend.dev>");
      console.log("[send-confirmation] Sending to:", email);
      
      // Attempt to send the email
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

      console.log("[send-confirmation] Email sent successfully. Resend response:", JSON.stringify(emailResponse));

      return new Response(JSON.stringify(emailResponse), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    } catch (emailError: any) {
      console.error("[send-confirmation] Resend API error:", emailError);
      console.error("[send-confirmation] Error details:", JSON.stringify(emailError));
      
      // Extract the most relevant error message
      let errorMessage = "Failed to send email";
      if (emailError.message) {
        errorMessage = emailError.message;
      } else if (typeof emailError === 'object') {
        errorMessage = JSON.stringify(emailError);
      }
      
      return new Response(
        JSON.stringify({ 
          error: errorMessage,
          errorDetails: emailError,
          emailAddress: email 
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
  } catch (error: any) {
    console.error("[send-confirmation] Uncaught error in send-confirmation function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Unknown error occurred",
        stack: error.stack
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

// Enhanced email validation function
function isValidEmail(email: string): boolean {
  if (!email) return false;
  
  // Trim and convert to lowercase for consistency
  const cleanEmail = email.trim().toLowerCase();
  
  // Basic format check with regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) return false;
  
  // Check for common issues
  if (cleanEmail.length > 320) return false; // Too long
  if (cleanEmail.indexOf('@') === -1) return false;
  
  const [localPart, domain] = cleanEmail.split('@');
  if (!localPart || !domain) return false;
  if (localPart.length > 64) return false; // Local part too long
  if (domain.length > 255) return false; // Domain too long
  
  // Check for Gmail-specific errors (if applicable)
  if (domain === 'gmail.com') {
    // Gmail ignores dots in the local part
    const noDots = localPart.replace(/\./g, '');
    if (noDots.length < 1) return false;
    
    // Gmail ignores anything after a plus sign
    const beforePlus = localPart.split('+')[0];
    if (beforePlus.length < 1) return false;
  }
  
  return true;
}

serve(handler);
