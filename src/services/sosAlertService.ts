
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Contact } from "./contactsService";

/**
 * Send an SOS alert to emergency contacts
 */
export const sendSOSAlert = async (
  userId: string,
  location: { latitude: number, longitude: number } | null,
  message: string,
  emergencyContacts: Contact[]
) => {
  try {
    // First, log the SOS alert in the database
    const { error: alertError } = await supabase.from("sos_alerts").insert({
      user_id: userId,
      message: message,
      latitude: location?.latitude,
      longitude: location?.longitude,
      status: "sent",
    });

    if (alertError) throw alertError;

    // For each contact, send notifications
    // In a real app, this would use a backend service to send SMS
    const contactPromises = emergencyContacts.map(async (contact) => {
      // Log that we're sending a notification to this contact
      const { error: notificationError } = await supabase
        .from("sos_notifications")
        .insert({
          alert_id: userId, // This is not the actual alert ID but will do for now
          contact_id: contact.id,
          status: "pending",
          notification_type: "sms",
        });

      if (notificationError) {
        console.error("Error logging notification:", notificationError);
      }

      // If contact has email, send email notification
      if (contact.email) {
        try {
          // In a real app, this would call a backend function to send email
          // Here we're just calling a Supabase Edge Function
          const { data: emailResult, error: emailError } = await supabase.functions.invoke(
            "send-sos-email",
            {
              body: {
                recipientEmail: contact.email,
                recipientName: contact.name,
                userLocation: location
                  ? `${location.latitude},${location.longitude}`
                  : "Unknown location",
                message: message,
              },
            }
          );

          if (emailError) throw emailError;
          console.log("Email sent successfully:", emailResult);

          // Update notification status
          await supabase
            .from("sos_notifications")
            .update({ status: "sent" })
            .eq("contact_id", contact.id)
            .eq("alert_id", userId);
        } catch (e) {
          console.error("Failed to send email:", e);
        }
      }
    });

    await Promise.all(contactPromises);

    return { success: true };
  } catch (error: any) {
    console.error("Error sending SOS alert:", error);
    throw new Error(
      error.message || "Failed to send SOS alert. Please try again."
    );
  }
};
