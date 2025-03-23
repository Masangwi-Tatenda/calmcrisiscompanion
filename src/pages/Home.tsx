
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, MapPin, FileText, Phone, MessageCircle, Shield, AlertTriangle, Sparkles } from "lucide-react";
import QuickAction from "@/components/common/QuickAction";
import AlertCard from "@/components/common/AlertCard";
import { toast } from "@/components/ui/use-toast";

const Home = () => {
  const [userName, setUserName] = useState("User");
  const [isLoading, setIsLoading] = useState(true);
  const [recentAlerts, setRecentAlerts] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      setRecentAlerts([
        {
          id: 1,
          title: "Flash Flood Warning",
          message: "Flash flood warning issued for your area. Avoid low-lying areas and stay indoors.",
          severity: "high",
          time: "10 minutes ago",
        },
        {
          id: 2,
          title: "Weather Advisory",
          message: "Strong thunderstorms expected this afternoon with possible hail.",
          severity: "medium",
          time: "1 hour ago",
        },
      ]);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
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
    <div className="page-container">
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
        <div className="card-crisis bg-primary p-4 rounded-xl text-white">
          <div className="flex items-center">
            <Sparkles className="h-8 w-8 mr-3" />
            <div>
              <h2 className="font-semibold">Stay Prepared</h2>
              <p className="text-sm opacity-90">Complete your emergency plan</p>
            </div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 mt-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-10 h-1.5 bg-white/30 rounded-full overflow-hidden">
                  <div className="w-4 h-full bg-white rounded-full"></div>
                </div>
                <span className="text-xs ml-3">2/5 steps</span>
              </div>
              <button className="text-xs bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition-colors">
                Continue
              </button>
            </div>
          </div>
        </div>
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

      <div>
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
                onClick={() => navigate("/app/alerts")}
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
