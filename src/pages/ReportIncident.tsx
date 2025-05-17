
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle, Camera, MapPin, FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import LocationMap from "@/components/common/LocationMap";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const ReportIncident = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [location, setLocation] = useState("");
  const [useCurrentLocation, setUseCurrentLocation] = useState(true);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast.success("Report submitted successfully", {
        description: "Thank you for your report. Authorities have been notified."
      });
      navigate("/app");
    }, 2000);
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="page-header border-b border-border">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-crisis-red" />
              Report Incident
            </h1>
            <p className="text-xs text-muted-foreground">
              Report an emergency situation or incident in your area
            </p>
          </div>
        </div>
      </div>
      
      <div className="page-container">
        <form onSubmit={handleSubmit} className="space-y-6 pb-24">
          <div className="space-y-4">
            <Label className="text-base font-medium">Incident Type</Label>
            <RadioGroup defaultValue="weather" className="grid grid-cols-2 gap-2">
              <Label htmlFor="weather" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                <RadioGroupItem value="weather" id="weather" className="sr-only" />
                <AlertCircle className="mb-3 h-6 w-6" />
                <span className="text-sm">Weather Emergency</span>
              </Label>
              <Label htmlFor="fire" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                <RadioGroupItem value="fire" id="fire" className="sr-only" />
                <span className="text-2xl mb-2">🔥</span>
                <span className="text-sm">Fire</span>
              </Label>
              <Label htmlFor="medical" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                <RadioGroupItem value="medical" id="medical" className="sr-only" />
                <span className="text-2xl mb-2">🏥</span>
                <span className="text-sm">Medical</span>
              </Label>
              <Label htmlFor="other" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                <RadioGroupItem value="other" id="other" className="sr-only" />
                <AlertTriangle className="mb-3 h-6 w-6" />
                <span className="text-sm">Other</span>
              </Label>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Brief description of the incident" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              placeholder="Provide details about the incident" 
              className="min-h-[100px]"
              required
            />
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Location</Label>
              <div className="flex items-center space-x-2">
                <span className="text-xs">Use my location</span>
                <button 
                  type="button"
                  className={`relative h-5 w-10 rounded-full transition-colors
                    ${useCurrentLocation ? 'bg-primary' : 'bg-muted'}`}
                  onClick={() => setUseCurrentLocation(!useCurrentLocation)}
                >
                  <span 
                    className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform
                      ${useCurrentLocation ? 'translate-x-5' : ''}`} 
                  />
                </button>
              </div>
            </div>
            
            {useCurrentLocation ? (
              <div className="rounded-md border overflow-hidden">
                <LocationMap location="Current Location" />
              </div>
            ) : (
              <div className="space-y-2">
                <Input 
                  placeholder="Enter address or description of location" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label>Add Photos</Label>
            <div className="grid grid-cols-3 gap-2">
              <div className="aspect-square border-2 border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                <Camera className="h-6 w-6 text-muted-foreground mb-1" />
                <span className="text-xs text-muted-foreground">Add Photo</span>
                <input type="file" className="hidden" accept="image/*" />
              </div>
            </div>
          </div>
          
          <div className="pt-6">
            <Button 
              type="submit" 
              className="w-full bg-crisis-red hover:bg-crisis-red/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportIncident;
