
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useCreateContact, Contact } from "@/services/contactsService";

interface AddContactFormProps {
  onClose: () => void;
  onAddContact: (contact: Contact) => void;
  initialValues?: Partial<Contact>;
  isEmergencyContact?: boolean;
}

const AddContactForm = ({
  onClose,
  onAddContact,
  initialValues,
  isEmergencyContact = false,
}: AddContactFormProps) => {
  const createContactMutation = useCreateContact();
  
  const [name, setName] = useState(initialValues?.name || "");
  const [phone, setPhone] = useState(initialValues?.phone || "");
  const [email, setEmail] = useState(initialValues?.email || "");
  const [relationship, setRelationship] = useState(initialValues?.relationship || "");
  const [contactType, setContactType] = useState<string>(initialValues?.type || "personal");
  const [isFavorite, setIsFavorite] = useState(initialValues?.is_favorite || isEmergencyContact || false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !phone) {
      toast.error("Name and phone number are required");
      return;
    }
    
    // Basic phone validation
    const phoneRegex = /^[+\d\s()-]{7,20}$/;
    if (!phoneRegex.test(phone)) {
      toast.error("Please enter a valid phone number");
      return;
    }
    
    // Email validation (if provided)
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error("Please enter a valid email address");
        return;
      }
    }
    
    setIsSubmitting(true);
    
    try {
      const newContact = await createContactMutation.mutateAsync({
        name,
        phone,
        email,
        relationship,
        type: contactType,
        is_favorite: isFavorite,
        is_emergency_contact: isEmergencyContact,
      });
      
      toast.success("Contact added successfully");
      onAddContact(newContact);
      onClose();
    } catch (error) {
      toast.error("Failed to add contact", {
        description: error instanceof Error ? error.message : "An unexpected error occurred"
      });
      setIsSubmitting(false);
    }
  };
  
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{isEmergencyContact ? "Add Emergency Contact" : "Add New Contact"}</DialogTitle>
        <DialogDescription>
          {isEmergencyContact 
            ? "Add someone who should be contacted in case of emergency."
            : "Add a new contact to your address book."}
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-right">
            Full Name
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter contact name"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-right">
            Phone Number
          </Label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter phone number"
            type="tel"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email" className="text-right">
            Email Address
          </Label>
          <Input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            type="email"
          />
          <p className="text-xs text-muted-foreground">
            {isEmergencyContact 
              ? "Email is required for emergency notifications"
              : "Optional - Used for communication and alerts"}
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="relationship" className="text-right">
            Relationship
          </Label>
          <Select
            value={relationship}
            onValueChange={setRelationship}
          >
            <SelectTrigger id="relationship">
              <SelectValue placeholder="Select relationship" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="family">Family</SelectItem>
              <SelectItem value="friend">Friend</SelectItem>
              <SelectItem value="spouse">Spouse</SelectItem>
              <SelectItem value="colleague">Colleague</SelectItem>
              <SelectItem value="neighbor">Neighbor</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {!isEmergencyContact && (
          <div className="space-y-2">
            <Label className="text-right">Contact Type</Label>
            <RadioGroup
              value={contactType}
              onValueChange={setContactType}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="personal" id="personal" />
                <Label htmlFor="personal">Personal</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="emergency" id="emergency" />
                <Label htmlFor="emergency">Emergency</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="service" id="service" />
                <Label htmlFor="service">Service</Label>
              </div>
            </RadioGroup>
          </div>
        )}
        
        <div className="flex items-center space-x-2 pt-2">
          <Switch
            id="favorite"
            checked={isFavorite}
            onCheckedChange={setIsFavorite}
          />
          <Label htmlFor="favorite">
            {isEmergencyContact ? "Priority Contact" : "Add to Favorites"}
          </Label>
        </div>
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Contact"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default AddContactForm;
