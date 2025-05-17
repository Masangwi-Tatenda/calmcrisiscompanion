
import { AlertOctagon } from "lucide-react";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import ShareDialog from "./ShareDialog";

interface SOSButtonProps {
  hidden?: boolean;
}

const SOSButton = ({ hidden = false }: SOSButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  
  // Mock user location - in a real app we would use geolocation API
  const userLocation = "37.7749,-122.4194"; // San Francisco coordinates
  const shareUrl = `https://maps.google.com/?q=${userLocation}`;

  const handleSOS = () => {
    setIsSOSActive(true);
    setIsOpen(false);
    setShareOpen(true);
    
    // Log SOS activation
    console.log("SOS activated");
    
    // Show toast notification
    toast.error("Emergency SOS Activated", {
      description: "Your location is being shared with emergency contacts",
      duration: 10000,
    });
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
          className="sos-button active"
          onClick={handleCancelSOS}
          aria-label="Cancel Emergency SOS"
        >
          <AlertOctagon size={24} className="text-white" />
          <span className="sos-pulse"></span>
          <style jsx>{`
            .sos-button.active {
              background-color: #ef4444;
              animation: pulse 1.5s infinite;
            }
            .sos-pulse {
              position: absolute;
              width: 100%;
              height: 100%;
              border-radius: 50%;
              background-color: rgba(239, 68, 68, 0.6);
              z-index: -1;
              animation: pulse 1.5s infinite;
            }
            @keyframes pulse {
              0% {
                transform: scale(1);
                opacity: 0.7;
              }
              70% {
                transform: scale(1.3);
                opacity: 0;
              }
              100% {
                transform: scale(1);
                opacity: 0;
              }
            }
          `}</style>
        </button>
      ) : (
        <button
          className="sos-button"
          onClick={() => setIsOpen(true)}
          aria-label="Emergency SOS"
        >
          <AlertOctagon size={24} className="animate-pulse" />
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

      <ShareDialog
        open={shareOpen}
        onOpenChange={setShareOpen}
        title="EMERGENCY: I need help!"
        description="I've activated an emergency alert. Here is my current location:"
        url={shareUrl}
        isEmergency={true}
      />
    </>
  );
};

export default SOSButton;
