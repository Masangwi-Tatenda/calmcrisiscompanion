
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CloudRain, CloudLightning, AlertTriangle, Info, MapPin, Clock, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface Alert {
  id: number;
  title: string;
  message: string;
  severity: "critical" | "high" | "medium" | "low";
  time: string;
  icon: any;
  category: string;
  location?: string;
  source?: string;
  instructions?: string[];
  updates?: { time: string; content: string }[];
}

// Mock data - in a real app this would come from an API
const mockAlertDetails: Record<string, Alert> = {
  "1": {
    id: 1,
    title: "Flash Flood Warning",
    message: "Flash flood warning issued for your area. Avoid low-lying areas and stay indoors.",
    severity: "high",
    time: "10 minutes ago",
    icon: CloudRain,
    category: "weather",
    location: "Downtown area, Riverside, and East Valley",
    source: "National Weather Service",
    instructions: [
      "Move to higher ground immediately if near streams or rivers",
      "Do not drive through flooded roads - turn around, don't drown",
      "Keep emergency supplies ready",
      "Monitor local news and weather updates"
    ],
    updates: [
      { time: "9:45 AM", content: "Flash flood warning issued for the county" },
      { time: "10:15 AM", content: "First responders deployed to downtown area" },
      { time: "10:30 AM", content: "Evacuation orders issued for Riverside district" }
    ]
  },
  "2": {
    id: 2,
    title: "Weather Advisory",
    message: "Strong thunderstorms expected this afternoon with possible hail.",
    severity: "medium",
    time: "1 hour ago",
    icon: CloudLightning,
    category: "weather",
    location: "Entire county",
    source: "National Weather Service",
    instructions: [
      "Secure outdoor items",
      "Avoid unnecessary travel",
      "Stay indoors during the storm",
      "Keep phones charged and emergency contacts accessible"
    ],
    updates: [
      { time: "8:00 AM", content: "Weather advisory issued for afternoon storms" },
      { time: "9:30 AM", content: "Advisory updated to include potential for hail" }
    ]
  },
  "3": {
    id: 3,
    title: "Traffic Alert",
    message: "Major accident on Highway 101. Expect delays of 30+ minutes.",
    severity: "medium",
    time: "2 hours ago",
    icon: AlertTriangle,
    category: "traffic",
    location: "Highway 101 between exits 25-30",
    source: "Department of Transportation",
    instructions: [
      "Seek alternative routes",
      "Expect significant delays",
      "Follow police instructions in the area",
      "Drive with caution near the accident site"
    ],
    updates: [
      { time: "7:15 AM", content: "Multi-vehicle accident reported on Highway 101" },
      { time: "7:45 AM", content: "Two lanes blocked, emergency services on scene" },
      { time: "8:30 AM", content: "Tow trucks arrived, expect 30+ minute delays" }
    ]
  },
  "4": {
    id: 4,
    title: "Power Outage",
    message: "Scheduled maintenance outage in your area from 10pm-2am tonight.",
    severity: "low",
    time: "3 hours ago",
    icon: Info,
    category: "utility",
    location: "North County districts",
    source: "Power & Electric Company",
    instructions: [
      "Charge essential devices before 10pm",
      "Have emergency lighting ready",
      "Unplug sensitive electronics",
      "Keep refrigerator doors closed to maintain temperature"
    ],
    updates: [
      { time: "9:00 AM", content: "Scheduled maintenance confirmed for tonight" },
      { time: "11:00 AM", content: "Reminder notification sent to affected households" }
    ]
  },
};

const AlertDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [alert, setAlert] = useState<Alert | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      if (id && mockAlertDetails[id]) {
        setAlert(mockAlertDetails[id]);
      }
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [id]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-600";
      case "high": return "bg-red-500";
      case "medium": return "bg-orange-500";
      case "low": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  const handleShareAlert = () => {
    // Share functionality would go here
    console.log("Sharing alert:", alert?.title);
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
        <Skeleton className="h-6 w-1/3 mb-3" />
        <div className="space-y-2 mb-6">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    );
  }

  if (!alert) {
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
          <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-1">Alert Not Found</h3>
          <p className="text-muted-foreground">
            The alert you're looking for could not be found.
          </p>
          <Button 
            className="mt-6"
            onClick={() => navigate("/app/alerts")}
          >
            View All Alerts
          </Button>
        </div>
      </div>
    );
  }

  const Icon = alert.icon || Info;

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
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleShareAlert}
          className="p-2"
        >
          <Share2 className="h-5 w-5" />
        </Button>
      </div>

      <div className={`p-4 rounded-lg mb-6 ${getSeverityColor(alert.severity)} bg-opacity-10 border border-opacity-30 ${getSeverityColor(alert.severity).replace('bg-', 'border-')}`}>
        <div className="flex items-center mb-2">
          <div className={`p-2 rounded-full ${getSeverityColor(alert.severity)} bg-opacity-20 mr-3`}>
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">{alert.title}</h1>
            <div className="flex items-center mt-1">
              <span className={`w-2 h-2 rounded-full ${getSeverityColor(alert.severity)} mr-2`}></span>
              <span className="text-xs capitalize">{alert.severity} Priority</span>
            </div>
          </div>
        </div>
        <p className="text-base mb-3">{alert.message}</p>
        <div className="flex items-center justify-between text-xs opacity-70">
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" /> 
            <span>Issued: {alert.time}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-3 w-3 mr-1" /> 
            <span>{alert.location}</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="font-semibold mb-3">Safety Instructions</h2>
        <ul className="space-y-2">
          {alert.instructions?.map((instruction, index) => (
            <li key={index} className="flex items-start">
              <span className="inline-block bg-primary rounded-full w-1.5 h-1.5 mt-2 mr-2"></span>
              <span>{instruction}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h2 className="font-semibold mb-3">Latest Updates</h2>
        <div className="space-y-3">
          {alert.updates?.map((update, index) => (
            <div key={index} className="border-l-2 border-primary pl-3 py-1">
              <p className="text-sm">{update.content}</p>
              <span className="text-xs text-muted-foreground">{update.time}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="text-sm text-muted-foreground italic">
        Source: {alert.source}
      </div>
    </div>
  );
};

export default AlertDetail;
