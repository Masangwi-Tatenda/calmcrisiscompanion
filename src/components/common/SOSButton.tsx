
import { AlertOctagon } from "lucide-react";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface SOSButtonProps {
  hidden?: boolean;
}

const SOSButton = ({ hidden = false }: SOSButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSOS = () => {
    // Would handle the emergency actions here
    console.log("SOS activated");
  };

  if (hidden) return null;

  return (
    <>
      <button
        className="sos-button"
        onClick={() => setIsOpen(true)}
        aria-label="Emergency SOS"
      >
        <AlertOctagon size={24} className="animate-pulse" />
      </button>

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
    </>
  );
};

export default SOSButton;
