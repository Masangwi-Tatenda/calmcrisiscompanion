
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, MapPin, FileText, Phone, MessageCircle, Shield, AlertTriangle, Cloud, CloudRain, CloudLightning, Info } from "lucide-react";
import QuickAction from "@/components/common/QuickAction";
import AlertCard from "@/components/common/AlertCard";
import { toast } from "@/components/ui/use-toast";
import WeatherWidget from "@/components/weather/WeatherWidget";

const Home = () => {
  const [userName, setUserName] = useState("User");
  const [isLoading, setIsLoading] = useState(true);
  const [recentAlerts, setRecentAlerts] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API fetch for user data
    const timerUser = setTimeout(() => {
      // This would be replaced with actual auth data in a real app
      setUserName("Alex");
    }, 500);

    // Simulate API fetch for alerts
    const timerAlerts = setTimeout(() => {
      setRecentAlerts([
        {
          id: 1,
          title: "Flash Flood Warning",
          message: "Flash flood warning issued for your area. Avoid low-lying areas and stay indoors.",
          severity: "high",
          time: "10 minutes ago",
          icon: CloudRain,
          category: "weather"
        },
        {
          id: 2,
          title: "Weather Advisory",
          message: "Strong thunderstorms expected this afternoon with possible hail.",
          severity: "medium",
          time: "1 hour ago",
          icon: CloudLightning,
          category: "weather"
        },
        {
          id: 3,
          title: "Traffic Alert",
          message: "Major accident on Highway 101. Expect delays of 30+ minutes.",
          severity: "medium",
          time: "2 hours ago",
          icon: AlertTriangle,
          category: "traffic"
        },
        {
          id: 4,
          title: "Power Outage",
          message: "Scheduled maintenance outage in your area from 10pm-2am tonight.",
          severity: "low",
          time: "3 hours ago",
          icon: Info,
          category: "utility"
        },
      ]);
      setIsLoading(false);
    }, 1000);

    return () => {
      clearTimeout(timerUser);
      clearTimeout(timerAlerts);
    };
  }, []);

  const handleSafetyCheck = () => {
    toast({
      title: "Safety Check",
      description: "Your status has been marked as safe and shared with your emergency contacts.",
    });
  };

  const quickActions = [
    { icon: Shield, label: "Mark Safe", color: "text-crisis-green", onClick: handleSafetyCheck },
    { icon: MapPin, label: "Nearby", color: "text-crisis-blue", onClick: () => navigate("/app/resources") },
    { icon: AlertTriangle, label: "Report", color: "text-crisis-red", onClick: () => {} },
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
        <WeatherWidget />
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
          <button 
            className="text-xs text-primary font-medium"
            onClick={() => navigate("/app/alerts")}
          >
            View All
          </button>
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
    </div>
  );
};

export default Home;
