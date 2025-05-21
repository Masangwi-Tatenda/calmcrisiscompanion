
import { AlertOctagon } from "lucide-react";
import { useState, useEffect } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface SOSButtonProps {
  hidden?: boolean;
}

const SOSButton = ({ hidden = false }: SOSButtonProps) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [emergencyContacts, setEmergencyContacts] = useState<{ name: string; email: string; phone: string }[]>([]);
  
  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);
  
  // Get emergency contacts when SOS is opened
  useEffect(() => {
    const fetchEmergencyContacts = async () => {
      if (!user) return;
      
      try {
        // Fetch emergency contacts from the contacts table
        const { data, error } = await supabase
          .from('contacts')
          .select('name, phone, email')
          .eq('user_id', user.id)
          .eq('is_emergency_contact', true);
        
        if (error) throw error;
        
        // Filter to only include contacts with email addresses
        const contactsWithEmail = data.filter(contact => contact.email);
        setEmergencyContacts(contactsWithEmail);
        
        // If no emergency contacts, also check profile
        if (contactsWithEmail.length === 0) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('emergency_contact_name, emergency_contact_phone')
            .eq('id', user.id)
            .single();
          
          if (profileError) throw profileError;
          
          if (profileData?.emergency_contact_name && profileData?.emergency_contact_phone) {
            // We don't have email in profiles table, this is for informational purposes only
            setEmergencyContacts([{
              name: profileData.emergency_contact_name,
              phone: profileData.emergency_contact_phone,
              email: ''
            }]);
          }
        }
      } catch (error) {
        console.error("Error fetching emergency contacts:", error);
      }
    };
    
    if (isOpen) {
      fetchEmergencyContacts();
    }
  }, [isOpen, user]);

  const handleSOS = async () => {
    setIsSOSActive(true);
    setIsOpen(false);
    
    // Get user's name
    let userName = "A user";
    try {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', user.id)
          .single();
        
        if (!error && data) {
          userName = data.first_name && data.last_name
            ? `${data.first_name} ${data.last_name}`
            : user.email || "A user";
        }
      }
    } catch (error) {
      console.error("Error getting user profile:", error);
    }
    
    // Show toast notification
    toast.error("Emergency SOS Activated", {
      description: "Your location is being shared with emergency contacts",
      duration: 10000,
    });
    
    // Send notification to emergency contacts
    try {
      if (emergencyContacts.length > 0 && userLocation) {
        // Create Google Maps link with location
        const locationLink = `https://maps.google.com/?q=${userLocation.lat},${userLocation.lng}`;
        
        // Send email to each emergency contact
        for (const contact of emergencyContacts) {
          if (contact.email) {
            // Call our edge function to send email
            await fetch('https://cxzkpusamrplmlijgzld.supabase.co/functions/v1/send-sos-alert', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${supabase.auth.getSession()}`
              },
              body: JSON.stringify({
                recipientEmail: contact.email,
                recipientName: contact.name,
                userName: userName,
                userLocation: locationLink,
                timestamp: new Date().toISOString()
              })
            });
          }
        }
        
        toast.success("Emergency contacts notified", {
          description: "Your emergency contacts have been alerted via email."
        });
      } else if (emergencyContacts.length === 0) {
        toast.warning("No emergency contacts found", {
          description: "Add emergency contacts in your profile to enable notifications."
        });
      } else if (!userLocation) {
        toast.warning("Location not available", {
          description: "Your location could not be determined. Enable location services."
        });
      }
    } catch (error) {
      console.error("Error sending SOS notifications:", error);
      toast.error("Failed to notify all contacts", {
        description: "Some emergency contacts may not have been notified."
      });
    }
  };

  const handleCancelSOS = () => {
    setIsSOSActive(false);
    toast.success("SOS Deactivated", {
      description: "Emergency mode has been turned off",
    });
  };

  if (hidden) return null;

  return (
    <>
      {isSOSActive ? (
        <button
          className="sos-button active fixed bottom-24 right-6 z-50 p-4 rounded-full bg-crisis-red shadow-lg flex items-center justify-center animate-pulse"
          onClick={handleCancelSOS}
          aria-label="Cancel Emergency SOS"
        >
          <AlertOctagon size={24} className="text-white" />
          <span className="absolute w-full h-full rounded-full bg-crisis-red/60 z-[-1] animate-ping"></span>
        </button>
      ) : (
        <button
          className="fixed bottom-24 right-6 z-50 p-4 bg-crisis-red rounded-full shadow-lg"
          onClick={() => setIsOpen(true)}
          aria-label="Emergency SOS"
        >
          <AlertOctagon size={24} className="animate-pulse text-white" />
        </button>
      )}

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="max-w-[350px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-crisis-red flex items-center">
              <AlertOctagon className="mr-2" size={20} />
              Emergency SOS
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will alert emergency contacts and share your location. Are you sure you want to proceed?
            </AlertDialogDescription>
            {emergencyContacts.length === 0 ? (
              <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-md text-xs text-amber-700">
                No emergency contacts found. Add emergency contacts in your profile settings first.
              </div>
            ) : (
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md text-xs text-blue-700">
                {emergencyContacts.length} emergency contact{emergencyContacts.length !== 1 ? 's' : ''} will be notified.
              </div>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-crisis-red hover:bg-crisis-red/90"
              onClick={handleSOS}
            >
              Activate SOS
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SOSButton;
