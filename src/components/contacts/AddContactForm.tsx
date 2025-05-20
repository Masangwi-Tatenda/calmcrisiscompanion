
import { useState } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useCreateContact, Contact } from "@/services/contactsService";

interface AddContactFormProps {
  onClose: () => void;
  onAddContact: (contact: Contact) => void;
}

const AddContactForm = ({ onClose, onAddContact }: AddContactFormProps) => {
  const createContactMutation = useCreateContact();
  
  const [formValues, setFormValues] = useState({
    name: "",
    phone: "",
    email: "",
    relationship: "",
    type: "personal",
    is_favorite: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormValues(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormValues(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formValues.name || !formValues.phone) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Validate phone number format
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    if (!phoneRegex.test(formValues.phone)) {
      toast.error("Please enter a valid phone number");
      return;
    }
    
    // Validate email format if provided
    if (formValues.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formValues.email)) {
        toast.error("Please enter a valid email address");
        return;
      }
    }
    
    try {
      setIsSubmitting(true);
      
      const newContact = await createContactMutation.mutateAsync({
        name: formValues.name,
        phone: formValues.phone,
        email: formValues.email,
        relationship: formValues.relationship || undefined,
        type: formValues.type,
        is_favorite: formValues.is_favorite,
      });
      
      toast.success("Contact added successfully");
      onAddContact(newContact);
      onClose();
    } catch (error: any) {
      console.error("Error adding contact:", error);
      toast.error("Failed to add contact", {
        description: error.message || "Please try again later",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add New Contact</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input 
            id="name"
            name="name"
            value={formValues.name}
            onChange={handleChange}
            placeholder="Enter contact name"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input 
            id="phone"
            name="phone"
            value={formValues.phone}
            onChange={handleChange}
            placeholder="e.g. +263 67 123456"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email"
            name="email"
            type="email"
            value={formValues.email}
            onChange={handleChange}
            placeholder="email@example.com"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="relationship">Relationship</Label>
          <Input 
            id="relationship"
            name="relationship"
            value={formValues.relationship}
            onChange={handleChange}
            placeholder="e.g. Family, Friend, Colleague"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select 
            value={formValues.type} 
            onValueChange={(value) => handleSelectChange("type", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select contact type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="emergency">Emergency</SelectItem>
              <SelectItem value="service">Service</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="is_favorite">Mark as favorite</Label>
          <Switch 
            id="is_favorite"
            checked={formValues.is_favorite}
            onCheckedChange={(checked) => handleSwitchChange("is_favorite", checked)}
          />
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Contact"}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default AddContactForm;
