
import { useState } from "react";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

type ContactType = "emergency" | "personal" | "service";

interface AddContactFormProps {
  onClose: () => void;
  onAddContact: (contact: {
    name: string;
    phone: string;
    type: ContactType;
    icon?: any;
    isFavorite: boolean;
  }) => void;
}

const AddContactForm = ({ onClose, onAddContact }: AddContactFormProps) => {
  const [contactInfo, setContactInfo] = useState({
    name: "",
    phone: "",
    type: "personal" as ContactType,
    isFavorite: false,
  });
  
  const [errors, setErrors] = useState({
    name: "",
    phone: "",
  });

  const validateForm = () => {
    const newErrors = {
      name: "",
      phone: "",
    };
    
    if (!contactInfo.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!contactInfo.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(contactInfo.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }
    
    setErrors(newErrors);
    return !newErrors.name && !newErrors.phone;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    onAddContact(contactInfo);
    toast({
      title: "Contact added",
      description: `${contactInfo.name} has been added to your contacts.`,
    });
    onClose();
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add New Contact</DialogTitle>
        <DialogDescription>
          Add a new contact to your emergency contacts list.
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name"
              value={contactInfo.name}
              onChange={(e) => setContactInfo({...contactInfo, name: e.target.value})}
              placeholder="Enter contact name"
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input 
              id="phone"
              value={contactInfo.phone}
              onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
              placeholder="(555) 123-4567"
            />
            {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Contact Type</Label>
            <Select 
              value={contactInfo.type}
              onValueChange={(value) => setContactInfo({...contactInfo, type: value as ContactType})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select contact type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="emergency">Emergency</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="service">Service</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter className="mt-5">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Add Contact
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default AddContactForm;
