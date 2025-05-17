
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, MapPin, FileText, Phone, MessageCircle, Shield, AlertTriangle, Cloud, CloudRain, CloudLightning, Info } from "lucide-react";
import QuickAction from "@/components/common/QuickAction";
import AlertCard from "@/components/common/AlertCard";
import { toast } from "sonner";
import LiveWeatherWidget from "@/components/weather/LiveWeatherWidget";
import ShareDialog from "@/components/common/ShareDialog";

const Home = () => {
  const [userName, setUserName] = useState("User");
  const [isLoading, setIsLoading] = useState(true);
  const [recentAlerts, setRecentAlerts] = useState<any[]>([]);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const navigate = useNavigate();

  // Mock user location for sharing
  const userLocation = "37.7749,-122.4194"; // San Francisco coordinates
  const shareUrl = `https://maps.google.com/?q=${userLocation}`;

  useEffect(() => {
    // Simulate API fetch for user data
    const timerUser = setTimeout(() => {
      // This would be replaced with actual auth data in a real app
      setUserName("Alex");
    }, 500);

    // Initial alert load
    fetchAlerts();

    // Set up interval for real-time updates (every 30 seconds)
    const alertInterval = setInterval(() => {
      fetchAlerts();
    }, 30000);

    return () => {
      clearTimeout(timerUser);
      clearInterval(alertInterval);
    };
  }, []);

  const fetchAlerts = () => {
    // In a real app, this would be an API call
    // For this demo, we'll simulate alert data with some randomization

    // Base alerts that always show
    const baseAlerts = [
      {
        id: 1,
        title: "Flash Flood Warning",
        message: "Flash flood warning issued for your area. Avoid low-lying areas and stay indoors.",
        severity: "high",
        time: "10 minutes ago",
        icon: CloudRain,
        category: "weather",
        location: "Downtown area, Riverside"
      },
      {
        id: 2,
        title: "Weather Advisory",
        message: "Strong thunderstorms expected this afternoon with possible hail.",
        severity: "medium",
        time: "1 hour ago",
        icon: CloudLightning,
        category: "weather",
        location: "Entire county"
      }
    ];
    
    // Randomly show different alerts to simulate real-time changes
    const possibleAlerts = [
      {
        id: 3,
        title: "Traffic Alert",
        message: "Major accident on Highway 101. Expect delays of 30+ minutes.",
        severity: "medium",
        time: "Just now",
        icon: AlertTriangle,
        category: "traffic",
        location: "Highway 101, mile marker 25"
      },
      {
        id: 4,
        title: "Power Outage",
        message: "Scheduled maintenance outage in your area from 10pm-2am tonight.",
        severity: "low",
        time: "5 minutes ago",
        icon: Info,
        category: "utility",
        location: "North County districts"
      },
      {
        id: 5,
        title: "Water Main Break",
        message: "Water service interrupted in downtown area. Repairs underway.",
        severity: "medium",
        time: "25 minutes ago",
        icon: AlertTriangle,
        category: "utility",
        location: "Downtown business district"
      },
      {
        id: 6,
        title: "Air Quality Alert",
        message: "Unhealthy air quality detected. Sensitive groups should limit outdoor activity.",
        severity: "high",
        time: "15 minutes ago",
        icon: AlertTriangle,
        category: "health",
        location: "City-wide"
      }
    ];

    // Randomly select 2-3 alerts from possible alerts
    const numAdditionalAlerts = Math.floor(Math.random() * 2) + 2; // 2-3 alerts
    const randomAlerts = [...possibleAlerts]
      .sort(() => 0.5 - Math.random())
      .slice(0, numAdditionalAlerts);
    
    const allAlerts = [...baseAlerts, ...randomAlerts]
      .sort((a, b) => {
        // Sort by severity (high > medium > low) and then by recency
        const severityOrder = { high: 0, medium: 1, low: 2 };
        if (a.severity !== b.severity) {
          return severityOrder[a.severity as keyof typeof severityOrder] - 
                 severityOrder[b.severity as keyof typeof severityOrder];
        }
        
        // If same severity, sort by recency (just now > X minutes ago > X hours ago)
        if (a.time.includes("Just now")) return -1;
        if (b.time.includes("Just now")) return 1;
        
        // Extract minutes or hours
        const aTime = parseInt(a.time) || 100;
        const bTime = parseInt(b.time) || 100;
        
        if (a.time.includes("minute") && b.time.includes("hour")) return -1;
        if (a.time.includes("hour") && b.time.includes("minute")) return 1;
        
        return aTime - bTime;
      });

    setRecentAlerts(allAlerts);
    setIsLoading(false);
  };

  const handleSafetyCheck = () => {
    setShareDialogOpen(true);
  };

  const quickActions = [
    { icon: Shield, label: "Mark Safe", color: "text-crisis-green", onClick: handleSafetyCheck },
    { icon: MapPin, label: "Nearby", color: "text-crisis-blue", onClick: () => navigate("/app/nearby") },
    { icon: AlertTriangle, label: "Report", color: "text-crisis-red", onClick: () => navigate("/app/report") },
    { icon: FileText, label: "Guides", color: "text-primary", onClick: () => navigate("/app/resources") },
    { icon: Phone, label: "Contacts", color: "text-crisis-purple", onClick: () => navigate("/app/contacts") },
    { icon: MessageCircle, label: "Chat", color: "text-crisis-darkBlue", onClick: () => navigate("/app/chat") },
  ];

  return (
    <div className="page-container pb-24">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Hello, {userName}</h1>
          <p className="text-sm text-muted-foreground">How can we help you today?</p>
        </div>
        <button 
          className="p-2 bg-secondary rounded-full" 
          onClick={() => navigate("/app/alerts")}
          aria-label="View all alerts"
        >
          <Bell size={20} />
        </button>
      </div>

      <div className="mb-8">
        <LiveWeatherWidget />
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {quickActions.map((action, index) => (
            <QuickAction
              key={index}
              icon={action.icon}
              label={action.label}
              color={action.color}
              onClick={action.onClick}
            />
          ))}
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold">Recent Alerts</h2>
          <div className="flex items-center">
            <span className="mr-2 text-xs bg-green-100 text-green-800 py-1 px-2 rounded-full flex items-center">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse"></span>
              Live
            </span>
            <button 
              className="text-xs text-primary font-medium"
              onClick={() => navigate("/app/alerts")}
            >
              View All
            </button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((item) => (
              <div 
                key={item} 
                className="bg-muted animate-pulse h-24 rounded-lg"
              ></div>
            ))}
          </div>
        ) : recentAlerts.length > 0 ? (
          <div>
            {recentAlerts.map((alert) => (
              <AlertCard
                key={alert.id}
                title={alert.title}
                message={alert.message}
                severity={alert.severity}
                time={alert.time}
                icon={alert.icon}
                location={alert.location}
                category={alert.category}
                onClick={() => navigate(`/app/alerts/${alert.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No recent alerts</p>
          </div>
        )}
      </div>
      
      <ShareDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        title="I'm Safe"
        description="I want to let you know that I'm safe and well."
        url={shareUrl}
      />
    </div>
  );
};

export default Home;
