
import { useEffect, useState } from "react";
import { MapPin, Navigation, Phone, Info, Shield, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tab, Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import LocationMap from "@/components/common/LocationMap";

interface NearbyLocation {
  id: number;
  name: string;
  type: string;
  address: string;
  distance: string;
  phone?: string;
  status: "open" | "closed" | "busy" | "emergency-only";
}

const Nearby = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [locations, setLocations] = useState<NearbyLocation[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<NearbyLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<NearbyLocation | null>(null);
  const navigate = useNavigate();

  // Mock locations data
  const mockLocations: NearbyLocation[] = [
    {
      id: 1,
      name: "City General Hospital",
      type: "hospital",
      address: "123 Main Street, Downtown",
      distance: "0.8 miles",
      phone: "(555) 123-4567",
      status: "open"
    },
    {
      id: 2,
      name: "North County Medical Center",
      type: "hospital",
      address: "456 Health Avenue, North County",
      distance: "2.3 miles",
      phone: "(555) 234-5678",
      status: "busy"
    },
    {
      id: 3,
      name: "East Side Fire Station",
      type: "fire",
      address: "789 Rescue Road, East Valley",
      distance: "1.5 miles",
      phone: "(555) 345-6789",
      status: "open"
    },
    {
      id: 4,
      name: "Central Police Department",
      type: "police",
      address: "321 Safety Blvd, Downtown",
      distance: "0.9 miles",
      phone: "(555) 456-7890",
      status: "open"
    },
    {
      id: 5,
      name: "West Community Shelter",
      type: "shelter",
      address: "654 Haven Street, West Side",
      distance: "3.2 miles",
      phone: "(555) 567-8901",
      status: "open"
    },
    {
      id: 6,
      name: "South Emergency Center",
      type: "emergency",
      address: "987 Response Lane, South District",
      distance: "4.1 miles",
      phone: "(555) 678-9012",
      status: "emergency-only"
    },
    {
      id: 7,
      name: "Riverside Urgent Care",
      type: "hospital",
      address: "135 Care Way, Riverside",
      distance: "2.7 miles",
      phone: "(555) 789-0123",
      status: "closed"
    },
    {
      id: 8,
      name: "Mountain View Police Station",
      type: "police",
      address: "246 Law Avenue, Mountain District",
      distance: "5.3 miles",
      phone: "(555) 890-1234",
      status: "open"
    }
  ];

  useEffect(() => {
    // Simulate fetching location data
    setTimeout(() => {
      setLocations(mockLocations);
      setFilteredLocations(mockLocations);
    }, 500);
  }, []);

  useEffect(() => {
    // Filter locations based on search term and selected tab
    let filtered = [...locations];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(location => 
        location.name.toLowerCase().includes(term) || 
        location.address.toLowerCase().includes(term)
      );
    }
    
    if (selectedTab !== "all") {
      filtered = filtered.filter(location => location.type === selectedTab);
    }
    
    // Sort by distance (nearest first)
    filtered = filtered.sort((a, b) => {
      const distA = parseFloat(a.distance.split(" ")[0]);
      const distB = parseFloat(b.distance.split(" ")[0]);
      return distA - distB;
    });
    
    setFilteredLocations(filtered);
  }, [locations, searchTerm, selectedTab]);

  const handleLocationSelect = (location: NearbyLocation) => {
    setSelectedLocation(location);
  };

  const handleCall = (phone: string) => {
    console.log(`Calling: ${phone}`);
    // In a real app, this would use the tel: protocol to initiate a call
    window.open(`tel:${phone}`);
  };

  const handleGetDirections = (address: string) => {
    console.log(`Opening directions to: ${address}`);
    // In a real app, this would open directions in a maps app
    window.open(`https://maps.google.com/?q=${encodeURIComponent(address)}`);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="page-header border-b border-border">
        <div className="flex items-center mb-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Nearby Services</h1>
        </div>
        
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search locations..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="hospital">Medical</TabsTrigger>
            <TabsTrigger value="police">Police</TabsTrigger>
            <TabsTrigger value="fire">Fire</TabsTrigger>
            <TabsTrigger value="shelter">Shelter</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0"></TabsContent>
          <TabsContent value="hospital" className="mt-0"></TabsContent>
          <TabsContent value="police" className="mt-0"></TabsContent>
          <TabsContent value="fire" className="mt-0"></TabsContent>
          <TabsContent value="shelter" className="mt-0"></TabsContent>
        </Tabs>
      </div>
      
      <div className="page-container pb-24">
        {selectedLocation ? (
          <div>
            <div className="mb-4">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center text-muted-foreground"
                onClick={() => setSelectedLocation(null)}
              >
                <ArrowLeft className="h-3 w-3 mr-1" />
                Back to list
              </Button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-1">{selectedLocation.name}</h2>
                <p className="text-sm text-muted-foreground mb-2">{selectedLocation.address}</p>
                <div className="flex items-center space-x-2">
                  <Badge status={selectedLocation.status} />
                  <span className="text-xs text-muted-foreground">{selectedLocation.distance} away</span>
                </div>
              </div>
              
              <LocationMap location={selectedLocation.address} className="h-48" />
              
              <div className="grid grid-cols-2 gap-3">
                {selectedLocation.phone && (
                  <Button
                    variant="outline"
                    className="flex items-center justify-center"
                    onClick={() => handleCall(selectedLocation.phone!)}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                )}
                <Button
                  variant="default"
                  className="flex items-center justify-center"
                  onClick={() => handleGetDirections(selectedLocation.address)}
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Directions
                </Button>
              </div>
              
              <div className="rounded-lg border border-border p-4">
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <Info className="h-4 w-4 mr-1" /> About
                </h3>
                <p className="text-sm text-muted-foreground">
                  {selectedLocation.type === "hospital" && 
                    "This facility provides medical services to patients with varying levels of emergency needs."}
                  {selectedLocation.type === "police" && 
                    "This police station serves the local community and responds to emergency calls."}
                  {selectedLocation.type === "fire" && 
                    "This fire station provides emergency response services for fires and other emergencies."}
                  {selectedLocation.type === "shelter" && 
                    "This shelter provides temporary housing and assistance during emergencies."}
                  {selectedLocation.type === "emergency" && 
                    "This emergency center coordinates response efforts during major incidents."}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <LocationMap location="Downtown area, Riverside, and East Valley" className="h-40" />
            </div>
            
            <div className="space-y-2">
              {filteredLocations.length > 0 ? (
                filteredLocations.map(location => (
                  <div 
                    key={location.id}
                    className="border border-border rounded-lg p-3 flex justify-between items-center hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => handleLocationSelect(location)}
                  >
                    <div>
                      <div className="flex items-center">
                        <LocationTypeIcon type={location.type} />
                        <h3 className="font-medium ml-2">{location.name}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{location.address}</p>
                      <div className="flex items-center mt-1">
                        <Badge status={location.status} />
                        <span className="text-xs text-muted-foreground ml-2">{location.distance} away</span>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="shrink-0" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGetDirections(location.address);
                      }}
                    >
                      <Navigation className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-semibold">No locations found</h3>
                  <p className="text-muted-foreground mt-1">
                    Try changing your search or filter criteria
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Helper components
const Badge = ({ status }: { status: string }) => {
  let color = "";
  let label = "";
  
  switch (status) {
    case "open":
      color = "bg-green-100 text-green-800";
      label = "Open";
      break;
    case "closed":
      color = "bg-red-100 text-red-800";
      label = "Closed";
      break;
    case "busy":
      color = "bg-yellow-100 text-yellow-800";
      label = "Busy";
      break;
    case "emergency-only":
      color = "bg-orange-100 text-orange-800";
      label = "Emergency Only";
      break;
  }
  
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${color}`}>
      {label}
    </span>
  );
};

const LocationTypeIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "hospital":
      return <div className="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center">+</div>;
    case "police":
      return <div className="w-8 h-8 bg-indigo-100 text-indigo-800 rounded-full flex items-center justify-center"><Shield className="h-4 w-4" /></div>;
    case "fire":
      return <div className="w-8 h-8 bg-red-100 text-red-800 rounded-full flex items-center justify-center">🔥</div>;
    case "shelter":
      return <div className="w-8 h-8 bg-green-100 text-green-800 rounded-full flex items-center justify-center">🏠</div>;
    case "emergency":
      return <div className="w-8 h-8 bg-orange-100 text-orange-800 rounded-full flex items-center justify-center">!</div>;
    default:
      return <div className="w-8 h-8 bg-gray-100 text-gray-800 rounded-full flex items-center justify-center"><MapPin className="h-4 w-4" /></div>;
  }
};

export default Nearby;
