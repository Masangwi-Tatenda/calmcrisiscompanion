
import { useState, useEffect } from "react";
import { Phone, Plus, Search, Star, Users, Mail, Shield, Building, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContactCard from "@/components/common/ContactCard";
import { toast } from "@/components/ui/use-toast";
import { Dialog } from "@/components/ui/dialog";
import AddContactForm from "@/components/contacts/AddContactForm";
import { useNavigate } from "react-router-dom";

const mockContacts = [
  {
    id: 1,
    name: "Emergency Services",
    phone: "911",
    type: "emergency",
    icon: Shield,
    isFavorite: true,
  },
  {
    id: 2,
    name: "Poison Control",
    phone: "1-800-222-1222",
    type: "emergency",
    icon: Shield,
    isFavorite: false,
  },
  {
    id: 3,
    name: "John Smith",
    phone: "(555) 123-4567",
    type: "personal",
    icon: Users,
    isFavorite: true,
  },
  {
    id: 4,
    name: "Sarah Johnson",
    phone: "(555) 987-6543",
    type: "personal",
    icon: Users,
    isFavorite: false,
  },
  {
    id: 5,
    name: "Local Fire Department",
    phone: "(555) 789-4561",
    type: "service",
    icon: Building,
    isFavorite: false,
  },
  {
    id: 6,
    name: "Medical Clinic",
    phone: "(555) 234-5678",
    type: "service",
    icon: Heart,
    isFavorite: true,
  },
];

const Contacts = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [contacts, setContacts] = useState<any[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      // Try to get contacts from localStorage first
      const savedContacts = localStorage.getItem("contacts");
      if (savedContacts) {
        try {
          const parsedContacts = JSON.parse(savedContacts);
          setContacts(parsedContacts);
          setFilteredContacts(parsedContacts);
        } catch (e) {
          console.error("Error parsing saved contacts:", e);
          setContacts(mockContacts);
          setFilteredContacts(mockContacts);
        }
      } else {
        setContacts(mockContacts);
        setFilteredContacts(mockContacts);
      }
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let result = [...contacts];
    
    // Apply category filter
    if (activeTab !== "all") {
      result = result.filter(contact => contact.type === activeTab);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        contact => 
          contact.name.toLowerCase().includes(query) || 
          contact.phone.includes(query)
      );
    }
    
    setFilteredContacts(result);
  }, [contacts, activeTab, searchQuery]);

  const handleCall = (contact: any) => {
    toast({
      title: `Calling ${contact.name}`,
      description: `Dialing ${contact.phone}...`,
    });
    
    // In a real mobile app, this would use a native API to initiate a call
    // For web, we'll use tel: protocol
    window.location.href = `tel:${contact.phone.replace(/\D/g, '')}`;
  };

  const handleMessage = (contact: any) => {
    toast({
      title: `Message ${contact.name}`,
      description: `Opening messaging for ${contact.phone}...`,
    });
    
    // For personal contacts, navigate to chat
    if (contact.type === "personal") {
      navigate(`/app/chat?contact=${contact.name}&phone=${contact.phone}`);
    } else {
      // For emergency/service contacts, use sms: protocol
      window.location.href = `sms:${contact.phone.replace(/\D/g, '')}`;
    }
  };

  const handleAddContact = () => {
    setIsAddContactOpen(true);
  };

  const addNewContact = (newContact: any) => {
    const iconMap: Record<string, any> = {
      emergency: Shield,
      personal: Users,
      service: Building,
    };
    
    const contact = {
      ...newContact,
      id: contacts.length + 1,
      icon: iconMap[newContact.type] || Users,
    };
    
    const updatedContacts = [...contacts, contact];
    setContacts(updatedContacts);
    
    // Save to localStorage
    try {
      localStorage.setItem("contacts", JSON.stringify(updatedContacts));
    } catch (e) {
      console.error("Error saving contacts to localStorage:", e);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="page-header border-b border-border">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            <h1 className="text-xl font-bold">Contacts</h1>
          </div>
          <Button size="sm" onClick={handleAddContact}>
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            className="pl-9 pr-4 py-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="emergency">Emergency</TabsTrigger>
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="service">Services</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="page-container pb-24">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div 
                key={item} 
                className="bg-muted animate-pulse h-28 rounded-lg"
              ></div>
            ))}
          </div>
        ) : filteredContacts.length > 0 ? (
          <div>
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className="mb-3 p-4 bg-white rounded-lg shadow-subtle hover:shadow-card transition-shadow"
              >
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-primary/10 mr-3">
                    {contact.icon && <contact.icon className="h-5 w-5 text-primary" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h3 className="font-medium">{contact.name}</h3>
                      {contact.isFavorite && (
                        <Star className="h-3.5 w-3.5 text-yellow-500 ml-2 fill-current" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{contact.phone}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className="p-2 rounded-full bg-green-100 text-green-600"
                      onClick={() => handleCall(contact)}
                      aria-label={`Call ${contact.name}`}
                    >
                      <Phone className="h-4 w-4" />
                    </button>
                    <button
                      className="p-2 rounded-full bg-blue-100 text-blue-600"
                      onClick={() => handleMessage(contact)}
                      aria-label={`Message ${contact.name}`}
                    >
                      <Mail className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Phone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-1">No Contacts Found</h3>
            <p className="text-muted-foreground">
              {searchQuery 
                ? `No results for "${searchQuery}"`
                : "No contacts available for this category"}
            </p>
          </div>
        )}
      </div>

      <Dialog open={isAddContactOpen} onOpenChange={setIsAddContactOpen}>
        <AddContactForm 
          onClose={() => setIsAddContactOpen(false)} 
          onAddContact={addNewContact} 
        />
      </Dialog>
    </div>
  );
};

export default Contacts;
