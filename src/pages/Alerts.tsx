
import { useState, useEffect } from "react";
import { Bell, Filter } from "lucide-react";
import AlertCard from "@/components/common/AlertCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

const mockAlertsBase = [
  {
    id: 1,
    title: "Flash Flood Warning",
    message: "Flash flood warning issued for your area. Avoid low-lying areas and stay indoors if possible.",
    severity: "critical",
    category: "weather",
    time: "10 minutes ago",
    location: "Downtown area, Riverside",
  },
  {
    id: 2,
    title: "High Wind Advisory",
    message: "Strong winds expected with gusts up to 50mph. Secure outdoor items and be cautious when driving.",
    severity: "medium",
    category: "weather",
    time: "1 hour ago",
    location: "Entire county",
  },
  {
    id: 3,
    title: "Road Closure Alert",
    message: "Highway 101 closed between exits 25-30 due to accident. Seek alternative routes.",
    severity: "high",
    category: "traffic",
    time: "2 hours ago",
    location: "Highway 101, exits 25-30",
  },
];

const mockAlertsDynamic = [
  {
    id: 4,
    title: "Power Outage",
    message: "Power outage reported in downtown area. Crews working to restore service. Estimated restoration: 5PM.",
    severity: "medium",
    category: "utility",
    time: "3 hours ago",
    location: "Downtown district",
  },
  {
    id: 5,
    title: "Air Quality Alert",
    message: "Unhealthy air quality levels detected. Sensitive groups should limit outdoor activities.",
    severity: "low",
    category: "health",
    time: "Yesterday",
    location: "City-wide",
  },
  {
    id: 6,
    title: "Water Main Break",
    message: "Water service interrupted in eastern suburbs due to main break. Repairs underway.",
    severity: "medium",
    category: "utility",
    time: "4 hours ago",
    location: "Eastern suburbs",
  },
  {
    id: 7,
    title: "Gas Leak",
    message: "Reported gas leak in northern district. Authorities responding. Avoid the area.",
    severity: "high",
    category: "utility",
    time: "30 minutes ago",
    location: "Northern district",
  },
  {
    id: 8,
    title: "Wildfire Warning",
    message: "Wildfire reported in western hills. Evacuation notices may follow. Stay alert.",
    severity: "critical",
    category: "weather",
    time: "15 minutes ago",
    location: "Western hills region",
  },
  {
    id: 9,
    title: "School Closure",
    message: "All public schools closed tomorrow due to severe weather forecast.",
    severity: "medium",
    category: "health",
    time: "2 hours ago",
    location: "All districts",
  },
];

const Alerts = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<any[]>([]);
  const [severityFilter, setSeverityFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();
  
  const fetchAlerts = () => {
    // In a real app, this would be an API call
    // We'll simulate dynamic alerts by selecting some random alerts to show
    
    const randomCount = Math.floor(Math.random() * 3) + 2; // 2-4 alerts
    const selectedDynamicAlerts = [...mockAlertsDynamic]
      .sort(() => 0.5 - Math.random())
      .slice(0, randomCount);
    
    // Update time for one random alert to "Just now" to simulate real-time updates
    if (selectedDynamicAlerts.length > 0) {
      const randomIndex = Math.floor(Math.random() * selectedDynamicAlerts.length);
      selectedDynamicAlerts[randomIndex].time = "Just now";
    }
    
    const allAlerts = [...mockAlertsBase, ...selectedDynamicAlerts];
    setAlerts(allAlerts);
    setIsLoading(false);
  };

  useEffect(() => {
    // Initial fetch
    fetchAlerts();
    
    // Set up interval for real-time updates (every 25 seconds)
    const interval = setInterval(() => {
      fetchAlerts();
    }, 25000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let result = [...alerts];
    
    // Apply category filter
    if (activeTab !== "all") {
      result = result.filter(alert => alert.category === activeTab);
    }
    
    // Apply severity filter
    if (severityFilter !== "all") {
      result = result.filter(alert => alert.severity === severityFilter);
    }
    
    setFilteredAlerts(result);
  }, [alerts, activeTab, severityFilter]);

  const handleViewAlert = (alertId: number) => {
    navigate(`/app/alerts/${alertId}`);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="page-header border-b border-border">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            <h1 className="text-xl font-bold">Alerts</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-green-100 text-green-800 py-1 px-2 rounded-full flex items-center">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse"></span>
              Live
            </span>
            <Select 
              value={severityFilter}
              onValueChange={setSeverityFilter}
            >
              <SelectTrigger className="w-[130px] h-8 text-xs">
                <Filter className="h-3 w-3 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="mt-4"
          defaultValue="all"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="weather">Weather</TabsTrigger>
            <TabsTrigger value="traffic">Traffic</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="page-container">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div 
                key={item} 
                className="bg-muted animate-pulse h-24 rounded-lg"
              ></div>
            ))}
          </div>
        ) : filteredAlerts.length > 0 ? (
          <div>
            {filteredAlerts.map((alert) => (
              <AlertCard
                key={alert.id}
                id={alert.id}
                title={alert.title}
                message={alert.message}
                severity={alert.severity}
                time={alert.time}
                category={alert.category}
                location={alert.location}
                onClick={() => handleViewAlert(alert.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-1">No Alerts Found</h3>
            <p className="text-muted-foreground">
              {activeTab !== "all" || severityFilter !== "all"
                ? "Try changing your filters to see more alerts"
                : "There are no active alerts at this time"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;
