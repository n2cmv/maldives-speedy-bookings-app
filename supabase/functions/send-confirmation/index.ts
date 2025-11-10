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
  isAdminNotification?: boolean;
  bookingDetails: {
    from?: string;
    to?: string;
    date?: string;
    time?: string;
    returnTrip?: boolean;
    returnDate?: string;
    returnTime?: string;
    passengerCount?: number;
    paymentReference?: string;
    otpCode?: string;
    isOtpEmail?: boolean;
    outboundSpeedboatName?: string | null;
    outboundSpeedboatImage?: string | null;
    outboundPickupLocation?: string | null;
    outboundPickupMapUrl?: string | null;
    returnSpeedboatName?: string | null;
    returnSpeedboatImage?: string | null;
    returnPickupLocation?: string | null;
    returnPickupMapUrl?: string | null;
    isActivity?: boolean;
    activityName?: string;
    activityPrice?: number;
    activityDescription?: string;
    activityDuration?: string;
    activityLocation?: string;
    fullName?: string;
    phone?: string;
    passport?: string;
    email?: string;
    specialRequests?: string;
    passengers?: number;
    totalPrice?: number;
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
    
    const { email, name, isAdminNotification, bookingDetails }: {
      email: string;
      name: string;
      isAdminNotification: boolean;
      bookingDetails: any;
    } = requestData;

    if (!email || !name) {
      console.error("[send-confirmation] Missing required email data:", { email, name });
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

    // Check if this is an OTP email or a booking confirmation
    if (bookingDetails.isOtpEmail && bookingDetails.otpCode) {
      // This is an OTP verification email
      console.log("[send-confirmation] Preparing to send OTP email to:", email);
      
      try {
        console.log("[send-confirmation] Sending OTP email with code:", bookingDetails.otpCode);
        
        const emailResponse = await resend.emails.send({
          from: "Visit Dhigurah <onboarding@resend.dev>",
          to: [email],
          subject: "Your Island Ferry Verification Code",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
              <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eaeaea;">
                <h1 style="color: #0AB3B8;">Island Ferry Verification Code</h1>
              </div>
              
              <div style="padding: 20px 0;">
                <p>Dear ${name},</p>
                <p>Your verification code for accessing your Island Ferry bookings is:</p>
                
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
                  <h2 style="color: #0AB3B8; margin-top: 0; font-size: 32px; letter-spacing: 5px;">${bookingDetails.otpCode}</h2>
                </div>
                
                <p>This code will expire in 30 minutes.</p>
                <p>If you did not request this code, you can safely ignore this email.</p>
              </div>
              
              <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eaeaea; font-size: 12px; color: #666;">
                <p>Island Ferry Services &copy; 2025</p>
              </div>
            </div>
          `,
        });

        console.log("[send-confirmation] OTP email sent successfully. Resend response:", JSON.stringify(emailResponse));
        return new Response(JSON.stringify(emailResponse), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        });
      } catch (emailError: any) {
        console.error("[send-confirmation] Error sending OTP email:", emailError);
        return new Response(
          JSON.stringify({ 
            error: emailError.message || "Failed to send OTP email",
            errorDetails: emailError,
            emailAddress: email 
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }
    } else if (bookingDetails.activityName) {
      // This is an activity booking confirmation email
      console.log("[send-confirmation] Preparing activity booking confirmation email to:", email);
      
      try {
        console.log("[send-confirmation] Sending activity booking confirmation email");
        
        // Prepare different email content based on whether this is for admin or user
        let emailSubject, emailHtml;
        
        if (isAdminNotification) {
          // Admin notification email with all booking details
          emailSubject = `New Activity Booking: ${bookingDetails.activityName}`;
          emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
              <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eaeaea;">
                <h1 style="color: #0AB3B8;">New Activity Booking</h1>
              </div>
              
              <div style="padding: 20px 0;">
                <p>A new activity booking has been received:</p>
                
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                  <h2 style="color: #0AB3B8; margin-top: 0; margin-bottom: 15px;">Booking Information</h2>
                  <p><strong>Activity:</strong> ${bookingDetails.activityName || 'Not specified'}</p>
                  <p><strong>Date:</strong> ${bookingDetails.date || 'Not specified'}</p>
                  <p><strong>Number of Passengers:</strong> ${bookingDetails.passengers || 'Not specified'}</p>
                  <p><strong>Total Amount:</strong> $${(bookingDetails.totalPrice || 0).toFixed(2)}</p>
                  
                  <div style="margin-top: 15px; border-top: 1px solid #eaeaea; padding-top: 15px;">
                    <h3 style="color: #0AB3B8; margin-top: 0; font-size: 16px;">Customer Information</h3>
                    <p><strong>Full Name:</strong> ${bookingDetails.fullName || 'Not provided'}</p>
                    <p><strong>Email:</strong> ${bookingDetails.email || 'Not provided'}</p>
                    <p><strong>Phone:</strong> ${bookingDetails.phone || 'Not provided'}</p>
                    <p><strong>ID/Passport:</strong> ${bookingDetails.passport || 'Not provided'}</p>
                  </div>
                </div>
                
                <p>Please contact the customer to confirm their booking.</p>
              </div>
              
              <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eaeaea; font-size: 12px; color: #666;">
                <p>Island Ferry Services &copy; ${new Date().getFullYear()}</p>
              </div>
            </div>
          `;
        } else {
          // User confirmation email - simple acknowledgment without details
          emailSubject = `Your ${bookingDetails.activityName || 'Activity'} Inquiry Received`;
          emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
              <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eaeaea;">
                <h1 style="color: #0AB3B8;">Activity Inquiry Received</h1>
              </div>
              
              <div style="padding: 20px 0;">
                <p>Dear ${name},</p>
                <p>Thank you for your interest in our ${bookingDetails.activityName || 'activity'} booking.</p>
                <p>We have received your inquiry and our team will contact you as soon as possible to confirm the details and provide next steps.</p>
                
                <div style="background-color: #f0f7ff; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #0AB3B8;">
                  <p style="margin: 0;">If you have any urgent questions, please feel free to contact us directly.</p>
                </div>
                
                <p>We look forward to helping you enjoy your time in the Maldives!</p>
              </div>
              
              <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eaeaea; font-size: 12px; color: #666;">
                <p>Island Ferry Services &copy; ${new Date().getFullYear()}</p>
              </div>
            </div>
          `;
        }

        emailHtml = emailHtml.replace(/Island Ferry Services/g, 'Visit Dhigurah');

        const emailResponse = await resend.emails.send({
          from: "Visit Dhigurah <onboarding@resend.dev>",
          to: [email],
          subject: emailSubject,
          html: emailHtml,
        });

        console.log("[send-confirmation] Activity booking email sent successfully. Resend response:", JSON.stringify(emailResponse));
        return new Response(JSON.stringify(emailResponse), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        });
      } catch (emailError: any) {
        console.error("[send-confirmation] Error sending activity booking email:", emailError);
        return new Response(
          JSON.stringify({ 
            error: emailError.message || "Failed to send activity booking email",
            errorDetails: emailError,
            emailAddress: email 
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }
    } else {
      // Regular ferry booking confirmation email
      // Format trip details
      const tripInfo = `${bookingDetails.from} to ${bookingDetails.to} on ${bookingDetails.date} at ${bookingDetails.time}`;
      
      // Format return trip info if applicable
      const returnInfo = bookingDetails.returnTrip && bookingDetails.returnDate && bookingDetails.returnTime
        ? `<p><strong>Return Trip:</strong> ${bookingDetails.to} to ${bookingDetails.from} on ${bookingDetails.returnDate} at ${bookingDetails.returnTime}</p>`
        : '';

      // Generate QR code URL using a service like QR Server
      const bookingLookupUrl = `${req.headers.get('origin') || 'https://your-site.lovable.app'}/booking-lookup?ref=${bookingDetails.paymentReference}`;
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(bookingLookupUrl)}`;

      // Generate speedboat details HTML
      const outboundSpeedboatHtml = bookingDetails.outboundSpeedboatName || bookingDetails.outboundPickupLocation
        ? `<div style="margin-top: 15px; padding: 12px; background-color: #f0f7ff; border-radius: 5px;">
            <h3 style="color: #0AB3B8; margin-top: 0; font-size: 16px;">Speedboat Details</h3>
            ${bookingDetails.outboundSpeedboatName 
              ? `<p><strong>Vessel:</strong> ${bookingDetails.outboundSpeedboatName}</p>` 
              : ''}
            ${bookingDetails.outboundPickupLocation 
              ? `<p><strong>Pickup Location:</strong> ${bookingDetails.outboundPickupLocation}</p>` 
              : ''}
            ${bookingDetails.outboundPickupMapUrl 
              ? `<p><a href="${bookingDetails.outboundPickupMapUrl}" target="_blank" style="color: #0AB3B8; font-size: 12px;">View Pickup Location Map</a></p>` 
              : ''}
            ${bookingDetails.outboundSpeedboatImage 
              ? `<img src="${bookingDetails.outboundSpeedboatImage}" alt="Speedboat" style="width: 100%; height: auto; max-height: 120px; object-fit: cover; border-radius: 4px; margin-top: 10px;">` 
              : ''}
          </div>`
        : '';

      const returnSpeedboatHtml = bookingDetails.returnTrip && (bookingDetails.returnSpeedboatName || bookingDetails.returnPickupLocation)
        ? `<div style="margin-top: 15px; padding: 12px; background-color: #f0fff4; border-radius: 5px;">
            <h3 style="color: #0AB3B8; margin-top: 0; font-size: 16px;">Return Speedboat Details</h3>
            ${bookingDetails.returnSpeedboatName 
              ? `<p><strong>Vessel:</strong> ${bookingDetails.returnSpeedboatName}</p>` 
              : ''}
            ${bookingDetails.returnPickupLocation 
              ? `<p><strong>Pickup Location:</strong> ${bookingDetails.returnPickupLocation}</p>` 
              : ''}
            ${bookingDetails.returnPickupMapUrl 
              ? `<p><a href="${bookingDetails.returnPickupMapUrl}" target="_blank" style="color: #0AB3B8; font-size: 12px;">View Pickup Location Map</a></p>` 
              : ''}
            ${bookingDetails.returnSpeedboatImage 
              ? `<img src="${bookingDetails.returnSpeedboatImage}" alt="Return Speedboat" style="width: 100%; height: auto; max-height: 120px; object-fit: cover; border-radius: 4px; margin-top: 10px;">` 
              : ''}
          </div>`
        : '';

      console.log("[send-confirmation] Preparing to send booking confirmation email to:", email);
      console.log("[send-confirmation] QR Code URL:", qrCodeUrl);
      
      try {
        console.log("[send-confirmation] Calling Resend API with from: Island Ferry Bookings <onboarding@resend.dev>");
        console.log("[send-confirmation] Sending to:", email);
        
        // Attempt to send the email
        const emailResponse = await resend.emails.send({
          from: "Visit Dhigurah <onboarding@resend.dev>",
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
                  
                  ${outboundSpeedboatHtml}
                  ${returnSpeedboatHtml}
                </div>

                <div style="text-align: center; margin: 30px 0;">
                  <h3 style="color: #0AB3B8;">Your Ticket QR Code</h3>
                  <p>Scan this QR code to access your booking details</p>
                  <img src="${qrCodeUrl}" alt="Booking QR Code" style="width: 150px; height: 150px; margin: 10px auto; display: block;">
                  <p style="font-size: 12px; color: #666; margin-top: 10px;">
                    You can also access your booking at: ${bookingLookupUrl}
                  </p>
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

  // Update in regular ferry booking confirmation email
  const footer = `
    <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eaeaea; font-size: 12px; color: #666;">
      <p>Visit Dhigurah &copy; ${new Date().getFullYear()}</p>
    </div>
  `;

  // Replace the Island Ferry Services footer with the Visit Dhigurah footer
  const responseHtml = (await new Response(emailHtml).text()).replace(/<div style="text-align: center; padding-top: 20px; border-top: 1px solid #eaeaea; font-size: 12px; color: #666;">\s*<p>Island Ferry Services &copy; 2025<\/p>\s*<\/div>/g, footer);

  return new Response(responseHtml, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
    },
  });
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
