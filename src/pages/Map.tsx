
import { useState, useEffect } from "react";
import { ArrowLeft, Building, Heart, MapPin, Navigation, Phone, Search, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import GoogleMap from "@/components/common/GoogleMap";

// Mock emergency locations for Chinhoyi, Zimbabwe
const emergencyLocations = [
  {
    id: 1,
    name: "Chinhoyi Provincial Hospital",
    category: "hospital",
    distance: "1.2 km",
    address: "Magamba Way, Chinhoyi, Zimbabwe",
    phone: "+263 67 2122275",
    icon: Heart,
    position: { lat: -17.3602, lng: 30.1991 }
  },
  {
    id: 2,
    name: "Chinhoyi Central Police Station",
    category: "police",
    distance: "0.8 km",
    address: "Magamba Way, Chinhoyi, Zimbabwe",
    phone: "+263 67 22356",
    icon: Shield,
    position: { lat: -17.3643, lng: 30.2015 }
  },
  {
    id: 3,
    name: "Chinhoyi Fire Station",
    category: "fire",
    distance: "1.5 km",
    address: "Main Street, Chinhoyi, Zimbabwe",
    phone: "+263 67 22170",
    icon: Building,
    position: { lat: -17.3691, lng: 30.2056 }
  },
  {
    id: 4,
    name: "Chaedza Clinic",
    category: "hospital",
    distance: "2.3 km",
    address: "Chaedza, Chinhoyi, Zimbabwe",
    phone: "+263 67 22478",
    icon: Heart,
    position: { lat: -17.3715, lng: 30.1888 }
  },
  {
    id: 5,
    name: "Chinhoyi Community Center",
    category: "shelter",
    distance: "1.1 km",
    address: "Independence Way, Chinhoyi, Zimbabwe",
    phone: "+263 67 23675",
    icon: Building,
    position: { lat: -17.3609, lng: 30.2102 }
  }
];

// Active alert zones (mock data)
const alertZones = [
  {
    id: 1,
    title: "Flooding Risk",
    description: "Potential flooding in low-lying areas",
    severity: "moderate",
    type: "weather",
    position: { lat: -17.3772, lng: 30.2033 },
    radius: 1200 // meters
  },
  {
    id: 2,
    title: "Road Closure",
    description: "Major road closed due to accident",
    severity: "high",
    type: "traffic",
    position: { lat: -17.3590, lng: 30.1931 },
    radius: 300 // meters
  }
];

const Map = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLocations, setFilteredLocations] = useState(emergencyLocations);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast("Could not access your location", {
            description: "Please enable location services or enter location manually"
          });
        }
      );
    }
  }, []);

  // Filter locations when tab changes
  useEffect(() => {
    let filtered = emergencyLocations;
    
    // Apply category filter
    if (activeTab !== "all") {
      filtered = filtered.filter(location => location.category === activeTab);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        location => 
          location.name.toLowerCase().includes(query) || 
          location.address.toLowerCase().includes(query)
      );
    }
    
    setFilteredLocations(filtered);
  }, [activeTab, searchQuery]);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSelectLocation = (location: any) => {
    setSelectedLocation(location);
  };

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone.replace(/\D/g, '')}`;
    toast("Calling " + phone);
  };

  const handleGetDirections = (address: string) => {
    toast.info(`Opening directions to: ${address}`);
    // This would navigate to a map app with directions in a real mobile app
    window.open(`https://maps.google.com/?q=${encodeURIComponent(address)}`, '_blank');
  };
  
  const prepareMarkersForMap = () => {
    if (selectedLocation) {
      return [{
        position: selectedLocation.position,
        title: selectedLocation.name,
        info: selectedLocation.address
      }];
    }
    
    return filteredLocations.map(location => ({
      position: location.position,
      title: location.name,
      info: location.address
    }));
  };

  return (
    <div className="h-full flex flex-col">
      <div className="page-header border-b border-border">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            <h1 className="text-xl font-bold">Emergency Map</h1>
          </div>
        </div>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search emergency services..."
            className="pl-9 pr-4 py-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="hospital">Hospitals</TabsTrigger>
            <TabsTrigger value="police">Police</TabsTrigger>
            <TabsTrigger value="shelter">Shelters</TabsTrigger>
            <TabsTrigger value="fire">Fire</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 grid md:grid-cols-2 gap-4 p-4">
        <div className="h-[400px] md:h-full rounded-lg overflow-hidden border border-border order-2 md:order-1">
          {isLoading ? (
            <div className="h-full flex items-center justify-center bg-muted">
              <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <GoogleMap 
              height="100%" 
              markers={prepareMarkersForMap()}
              center={selectedLocation ? selectedLocation.position : undefined}
            />
          )}
        </div>

        <div className="overflow-auto pb-24 md:pb-4 order-1 md:order-2">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(item => (
                <div key={item} className="bg-muted animate-pulse h-24 rounded-lg"></div>
              ))}
            </div>
          ) : filteredLocations.length > 0 ? (
            <div className="space-y-3">
              {filteredLocations.map(location => (
                <div
                  key={location.id}
                  className={`p-4 rounded-lg transition-shadow cursor-pointer ${
                    selectedLocation?.id === location.id 
                      ? 'bg-primary/10 shadow-card' 
                      : 'bg-white shadow-subtle hover:shadow-card'
                  }`}
                  onClick={() => handleSelectLocation(location)}
                >
                  <div className="flex">
                    <div className="p-2 rounded-full bg-primary/10 mr-3">
                      <location.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{location.name}</h3>
                      <p className="text-xs text-muted-foreground">{location.distance} away</p>
                      <p className="text-sm mt-1">{location.address}</p>
                    </div>
                  </div>
                  <div className="flex mt-3 space-x-2 justify-end">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCall(location.phone);
                      }}
                    >
                      <Phone className="h-3 w-3 mr-1" /> Call
                    </Button>
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      className="text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGetDirections(location.address);
                      }}
                    >
                      <Navigation className="h-3 w-3 mr-1" /> Directions
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-1">No Locations Found</h3>
              <p className="text-muted-foreground">
                {searchQuery 
                  ? `No results for "${searchQuery}"`
                  : "No locations available for this category"}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {selectedLocation && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background md:hidden border-t border-border z-40">
          <div className="flex items-center justify-between mb-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-0 h-8"
              onClick={() => setSelectedLocation(null)}
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <h3 className="font-medium text-sm">{selectedLocation.name}</h3>
          </div>
          <div className="flex space-x-2">
            <Button 
              className="flex-1" 
              variant="outline"
              onClick={() => handleCall(selectedLocation.phone)}
            >
              <Phone className="h-4 w-4 mr-2" /> Call
            </Button>
            <Button 
              className="flex-1" 
              onClick={() => handleGetDirections(selectedLocation.address)}
            >
              <Navigation className="h-4 w-4 mr-2" /> Directions
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;
