
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { recipientEmail, recipientName, userLocation, message } = await req.json();
    
    // Basic validation
    if (!recipientEmail || !message) {
      return new Response(
        JSON.stringify({ error: 'Email and message are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create a Supabase client with the service role key (needed for email sending permissions)
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // In a real implementation, this would call an email service like Resend, SendGrid, etc.
    // For this demo, we'll just log the email details
    console.log(`Sending SOS email to ${recipientName} <${recipientEmail}>`);
    console.log(`Message: ${message}`);
    console.log(`User Location: ${userLocation}`);
    
    // Simulate email sending
    // In a real app, you'd use Supabase edge functions with proper email integration
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Log the email in the database for reference
    const { error: emailLogError } = await supabase
      .from('email_logs')
      .insert({
        recipient_email: recipientEmail,
        recipient_name: recipientName,
        subject: 'EMERGENCY SOS ALERT',
        content: `Emergency Message: ${message}\nLocation: ${userLocation}`,
        status: 'sent'
      });
      
    if (emailLogError) {
      console.error('Error logging email:', emailLogError);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error sending SOS email:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
