
import { useState } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { MapPin } from "lucide-react";

interface ReportFormProps {
  children: React.ReactNode;
}

const ReportForm = ({ children }: ReportFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [incidentType, setIncidentType] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast.success("Report submitted successfully", {
        description: "Thank you for your report. Authorities have been notified."
      });
      
      // Reset form
      setIncidentType("");
      setLocation("");
      setDescription("");
      setIsSubmitting(false);
    }, 1500);
  };

  const handleUseCurrentLocation = () => {
    // In a real app, this would use the browser's geolocation API
    setLocation("Current location (37.7749, -122.4194)");
    toast.info("Using your current location");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh]">
        <SheetHeader className="mb-4">
          <SheetTitle>Report an Incident</SheetTitle>
          <SheetDescription>
            Fill out this form to report an emergency or incident in your area.
          </SheetDescription>
        </SheetHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="incidentType">Incident Type</Label>
            <Select 
              value={incidentType} 
              onValueChange={setIncidentType}
              required
            >
              <SelectTrigger id="incidentType">
                <SelectValue placeholder="Select incident type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weather">Weather Emergency</SelectItem>
                <SelectItem value="fire">Fire</SelectItem>
                <SelectItem value="medical">Medical Emergency</SelectItem>
                <SelectItem value="crime">Crime</SelectItem>
                <SelectItem value="traffic">Traffic Incident</SelectItem>
                <SelectItem value="utility">Utility Outage</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="location">Location</Label>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="text-xs flex items-center"
                onClick={handleUseCurrentLocation}
              >
                <MapPin className="h-3 w-3 mr-1" />
                Use my location
              </Button>
            </div>
            <Input 
              id="location" 
              placeholder="Enter location" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              placeholder="Describe the incident in detail" 
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="resize-none"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="photo">Add Photo (Optional)</Label>
            <div className="border-2 border-dashed border-border rounded-md p-6 text-center">
              <p className="text-sm text-muted-foreground">
                Click to upload or drag and drop
              </p>
              <input type="file" className="hidden" id="photo" />
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="mt-2" 
                onClick={() => document.getElementById("photo")?.click()}
              >
                Select File
              </Button>
            </div>
          </div>
          
          <SheetFooter className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
            <SheetClose asChild>
              <Button variant="outline" className="w-full sm:w-auto">Cancel</Button>
            </SheetClose>
            <Button 
              type="submit" 
              className="w-full sm:w-auto bg-crisis-red hover:bg-crisis-red/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default ReportForm;
