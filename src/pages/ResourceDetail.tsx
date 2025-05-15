
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle, HelpCircle, Book, Compass, FileText, Share2, Bookmark, MapPin, ExternalLink, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface Resource {
  id: number;
  title: string;
  description: string;
  category: string;
  icon: any;
  isBookmarked: boolean;
  content?: {
    sections: {
      title: string;
      text: string;
    }[];
  };
  location?: {
    address: string;
    coordinates: { lat: number; lng: number };
    hours: string;
    phone: string;
  };
  links?: { title: string; url: string }[];
  lastUpdated?: string;
}

// Mock data
const mockResourceDetails: Record<string, Resource> = {
  "1": {
    id: 1,
    title: "Earthquake Preparedness Guide",
    description: "Learn how to prepare for, survive during, and recover after an earthquake.",
    category: "guides",
    icon: AlertCircle,
    isBookmarked: true,
    content: {
      sections: [
        {
          title: "Before an Earthquake",
          text: "Secure heavy furniture to walls. Create an emergency kit with water, non-perishable food, medication, and first aid supplies. Establish a family emergency plan including communication and meeting locations. Identify safe spots in each room such as under sturdy tables or against interior walls."
        },
        {
          title: "During an Earthquake",
          text: "Drop to the ground, take Cover under a sturdy table or desk, and Hold On until the shaking stops. Stay away from windows, outside doors, and walls. If outdoors, stay in open areas away from buildings, streetlights, and utility wires. If driving, pull over to a clear location, stop, and stay in the vehicle with seatbelt fastened."
        },
        {
          title: "After an Earthquake",
          text: "Check for injuries and provide first aid if needed. Check for damage to utilities, and shut off services if unsafe conditions exist. Monitor local news for emergency information and instructions. Be prepared for aftershocks which can cause additional damage."
        }
      ]
    },
    lastUpdated: "3 months ago"
  },
  "2": {
    id: 2,
    title: "First Aid Basics",
    description: "Essential first aid procedures for common emergency situations.",
    category: "guides",
    icon: HelpCircle,
    isBookmarked: false,
    content: {
      sections: [
        {
          title: "Treating Cuts and Scrapes",
          text: "Clean wound with soap and water. Apply gentle pressure to stop bleeding. Apply antibiotic ointment and cover with a sterile bandage. Change dressing daily and watch for signs of infection."
        },
        {
          title: "CPR Basics",
          text: "Ensure the scene is safe. Check for responsiveness. Call emergency services. Push hard and fast on the center of chest (100-120 compressions per minute). Continue until help arrives."
        },
        {
          title: "Treating Burns",
          text: "For minor burns, cool the area with cool running water for 10-15 minutes. Do not use ice. Cover with a clean, dry bandage. For severe burns, call emergency services immediately."
        }
      ]
    },
    lastUpdated: "6 months ago"
  },
  "3": {
    id: 3,
    title: "Emergency Shelter - City Hall",
    description: "Official emergency shelter with capacity for 200 people. Facilities include food, water, and medical aid.",
    category: "locations",
    icon: MapPin,
    isBookmarked: false,
    location: {
      address: "123 Main Street, Downtown",
      coordinates: { lat: 34.0522, lng: -118.2437 },
      hours: "24/7 during emergencies",
      phone: "(555) 123-4567"
    },
    links: [
      { title: "Shelter Website", url: "#" },
      { title: "Current Capacity Status", url: "#" }
    ],
    lastUpdated: "2 weeks ago"
  },
  "4": {
    id: 4,
    title: "Memorial Hospital",
    description: "24/7 emergency room services. Located at 1200 North Main Street.",
    category: "locations",
    icon: MapPin,
    isBookmarked: true,
    location: {
      address: "1200 North Main Street, Easton",
      coordinates: { lat: 34.0522, lng: -118.2437 },
      hours: "Emergency services: 24/7, Visitor hours: 8am-8pm",
      phone: "(555) 987-6543"
    },
    links: [
      { title: "Hospital Website", url: "#" },
      { title: "Emergency Room Wait Times", url: "#" }
    ],
    lastUpdated: "1 week ago"
  }
};

const ResourceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [resource, setResource] = useState<Resource | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      if (id && mockResourceDetails[id]) {
        setResource(mockResourceDetails[id]);
        setIsBookmarked(mockResourceDetails[id].isBookmarked);
      }
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [id]);

  const handleShareResource = () => {
    // Share functionality would go here
    console.log("Sharing resource:", resource?.title);
  };

  const handleToggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // API call would go here in a real app
  };

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="flex items-center mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Skeleton className="h-8 w-32" />
        </div>
        <Skeleton className="h-40 w-full mb-4" />
        <Skeleton className="h-6 w-2/3 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-3/4 mb-6" />
        <div className="space-y-4 mb-6">
          <div>
            <Skeleton className="h-6 w-1/3 mb-2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
          <div>
            <Skeleton className="h-6 w-1/3 mb-2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/5" />
          </div>
        </div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="page-container">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
        </div>
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-1">Resource Not Found</h3>
          <p className="text-muted-foreground">
            The resource you're looking for could not be found.
          </p>
          <Button 
            className="mt-6"
            onClick={() => navigate("/app/resources")}
          >
            View All Resources
          </Button>
        </div>
      </div>
    );
  }

  const Icon = resource.icon || FileText;

  return (
    <div className="page-container pb-24">
      <div className="flex items-center justify-between mb-4">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate(-1)}
          className="p-1"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleToggleBookmark}
            className="p-2"
          >
            <Bookmark 
              className={`h-5 w-5 ${isBookmarked ? "fill-primary text-primary" : ""}`} 
            />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleShareResource}
            className="p-2"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center mb-3">
          <div className={`p-3 rounded-full ${resource.category === 'guides' ? 'bg-primary/10' : 'bg-crisis-blue/10'} mr-3`}>
            <Icon className={`h-6 w-6 ${resource.category === 'guides' ? 'text-primary' : 'text-crisis-blue'}`} />
          </div>
          <div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-muted uppercase">
              {resource.category === "guides" ? "Guide" : "Location"}
            </span>
            <h1 className="text-xl font-bold">{resource.title}</h1>
          </div>
        </div>
        <p className="text-base mb-3">{resource.description}</p>
        <div className="flex items-center text-xs text-muted-foreground mb-6">
          <Clock className="h-3 w-3 mr-1" /> 
          <span>Last updated: {resource.lastUpdated}</span>
        </div>

        {resource.category === "guides" && resource.content && (
          <div className="space-y-6">
            {resource.content.sections.map((section, index) => (
              <div key={index} className="resource-section">
                <h2 className="text-lg font-semibold mb-2">{section.title}</h2>
                <p className="text-sm">{section.text}</p>
              </div>
            ))}
          </div>
        )}

        {resource.category === "locations" && resource.location && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">Location Information</h2>
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-start mb-3">
                  <MapPin className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-sm">{resource.location.address}</p>
                </div>
                <div className="flex items-start mb-3">
                  <Clock className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-sm">{resource.location.hours}</p>
                </div>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="w-full mt-2"
                  onClick={() => {
                    // This would use a maps API in a real app
                    console.log("Opening directions to:", resource.location?.address);
                  }}
                >
                  Get Directions
                </Button>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Contact</h2>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => {
                  // This would initiate a call in a real app
                  console.log("Calling:", resource.location?.phone);
                }}
              >
                {resource.location.phone}
              </Button>
            </div>
          </div>
        )}

        {resource.links && resource.links.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Related Links</h2>
            <div className="space-y-2">
              {resource.links.map((link, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-between"
                >
                  <span>{link.title}</span>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceDetail;
