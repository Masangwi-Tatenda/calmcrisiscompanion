
import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useGetContacts, Contact } from "@/services/contactsService";
import { sendSOSAlert } from "@/services/sosAlertService";

const SOSButton = () => {
  const { user } = useAuth();
  const { data: contacts } = useGetContacts();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [message, setMessage] = useState("I need help! This is an emergency.");
  const [isSending, setIsSending] = useState(false);
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);
  
  // Default to Chinhoyi location if geolocation is not available
  const CHINHOYI_LATITUDE = -17.3667;
  const CHINHOYI_LONGITUDE = 30.2;
  
  const handleOpenDialog = () => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          // Use Chinhoyi as default location
          toast.warning("Could not get your precise location", {
            description: "Using Chinhoyi, Zimbabwe as your default location"
          });
          setUserLocation({
            latitude: CHINHOYI_LATITUDE,
            longitude: CHINHOYI_LONGITUDE
          });
        }
      );
    } else {
      toast.warning("Geolocation is not supported by your browser", {
        description: "Using Chinhoyi, Zimbabwe as your default location"
      });
      setUserLocation({
        latitude: CHINHOYI_LATITUDE,
        longitude: CHINHOYI_LONGITUDE
      });
    }
    
    setIsDialogOpen(true);
  };
  
  const handleSendSOS = async () => {
    if (!user) {
      toast.error("You must be logged in to send an SOS alert");
      return;
    }
    
    // Get emergency contacts
    const emergencyContacts = contacts?.filter(
      (contact: Contact) => contact.type === "emergency"
    ) || [];
    
    if (emergencyContacts.length === 0) {
      toast.warning("No emergency contacts found", {
        description: "Add emergency contacts to use the SOS feature"
      });
      setIsDialogOpen(false);
      return;
    }
    
    try {
      setIsSending(true);
      
      await sendSOSAlert(
        user.id,
        userLocation || { latitude: CHINHOYI_LATITUDE, longitude: CHINHOYI_LONGITUDE },
        message,
        emergencyContacts
      );
      
      toast.success("SOS alert sent", {
        description: "Your emergency contacts have been notified"
      });
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error("Failed to send SOS alert", {
        description: error.message || "Please try again"
      });
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <>
      <Button
        variant="destructive"
        size="lg"
        className="fixed bottom-20 right-4 z-50 rounded-full shadow-lg h-16 w-16 flex items-center justify-center"
        onClick={handleOpenDialog}
      >
        <AlertTriangle className="h-8 w-8" />
        <span className="sr-only">SOS</span>
      </Button>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-crisis-red flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Emergency SOS Alert
            </DialogTitle>
            <DialogDescription>
              This will send an emergency alert to all your emergency contacts.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="sos-message" className="text-sm font-medium">
                Emergency Message
              </label>
              <Textarea
                id="sos-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your emergency message"
                className="min-h-[100px]"
              />
            </div>
            
            <div className="bg-muted p-3 rounded-md text-xs">
              <p className="font-medium mb-1">Location Information:</p>
              <p>
                {userLocation 
                  ? `Latitude: ${userLocation.latitude.toFixed(6)}, Longitude: ${userLocation.longitude.toFixed(6)}`
                  : "Obtaining your location..."}
              </p>
              <p className="mt-1 text-muted-foreground">
                This location will be shared with your emergency contacts.
              </p>
            </div>
          </div>
          
          <DialogFooter className="sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleSendSOS}
              disabled={isSending}
              className="gap-1"
            >
              {isSending ? (
                <>
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Sending...
                </>
              ) : (
                "Send SOS Alert"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SOSButton;
