
import { useState, useEffect } from "react";
import { Phone, Plus, Search, Star, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContactCard from "@/components/common/ContactCard";
import { toast } from "@/components/ui/use-toast";

const mockContacts = [
  {
    id: 1,
    name: "Emergency Services",
    phone: "911",
    type: "emergency",
    isFavorite: true,
  },
  {
    id: 2,
    name: "Poison Control",
    phone: "1-800-222-1222",
    type: "emergency",
    isFavorite: false,
  },
  {
    id: 3,
    name: "John Smith",
    phone: "(555) 123-4567",
    type: "personal",
    isFavorite: true,
  },
  {
    id: 4,
    name: "Sarah Johnson",
    phone: "(555) 987-6543",
    type: "personal",
    isFavorite: false,
  },
  {
    id: 5,
    name: "Local Fire Department",
    phone: "(555) 789-4561",
    type: "service",
    isFavorite: false,
  },
  {
    id: 6,
    name: "Medical Clinic",
    phone: "(555) 234-5678",
    type: "service",
    isFavorite: true,
  },
];

const Contacts = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [contacts, setContacts] = useState<any[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      setContacts(mockContacts);
      setFilteredContacts(mockContacts);
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
    // Would initiate phone call here
  };

  const handleMessage = (contact: any) => {
    toast({
      title: `Message ${contact.name}`,
      description: `Opening messaging for ${contact.phone}...`,
    });
    // Would open messaging here
  };

  const handleAddContact = () => {
    toast({
      title: "Add Contact",
      description: "This feature will be available soon.",
    });
    // Would open add contact modal
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
      
      <div className="page-container">
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
              <ContactCard
                key={contact.id}
                name={contact.name}
                phone={contact.phone}
                type={contact.type}
                isFavorite={contact.isFavorite}
                onCall={() => handleCall(contact)}
                onMessage={() => handleMessage(contact)}
              />
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
    </div>
  );
};

export default Contacts;
