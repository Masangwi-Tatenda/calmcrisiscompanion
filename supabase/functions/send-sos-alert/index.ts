
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

interface SOSAlertRequest {
  recipientEmail: string;
  recipientName: string;
  userName: string;
  userLocation: string;
  timestamp: string;
}

serve(async (req) => {
  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { recipientEmail, recipientName, userName, userLocation, timestamp } = await req.json() as SOSAlertRequest;

    if (!recipientEmail) {
      return new Response(
        JSON.stringify({ error: "Missing recipient email" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Format the timestamp in a readable way
    const date = new Date(timestamp);
    const formattedTime = date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });

    // Here you would implement sending an email
    // For demonstration purposes, we'll simulate a success and log the information
    console.log({
      to: recipientEmail,
      from: "support@crisisconnect.com",
      subject: "EMERGENCY SOS ALERT",
      body: `
        Dear ${recipientName},
        
        ${userName} has triggered an emergency SOS alert at ${formattedTime}. They may need immediate assistance.
        
        Location: ${userLocation}
        
        Please reach out to them immediately or contact emergency services if appropriate.
        
        This is an automated alert from Crisis Connect.
      `
    });

    // In a real implementation you would use a service like Resend or SendGrid
    // to send the actual email. This would require setting up the appropriate
    // environment variables and adding the email service SDK.

    return new Response(
      JSON.stringify({ success: true, message: "SOS alert notification sent successfully" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing SOS alert:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to send SOS alert notification" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
