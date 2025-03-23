
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Shield, Settings, ChevronRight, LogOut, MapPin, Phone, Droplet, Heart, Bell } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const Profile = () => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [notificationSettings, setNotificationSettings] = useState({
    emergencyAlerts: true,
    weatherAlerts: true,
    healthAlerts: false,
    locationBasedAlerts: true,
  });

  const handleSignOut = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("hasSeenOnboarding");
    toast({
      title: "Signed out",
      description: "You have been successfully signed out",
    });
    navigate("/signin");
  };

  const handleToggleNotification = (key: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof notificationSettings],
    }));
  };

  const profileSettings = [
    {
      icon: User,
      label: "Personal Information",
      description: "Name, address, and contact details",
      onClick: () => {},
    },
    {
      icon: Shield,
      label: "Emergency Contacts",
      description: "Manage your emergency contacts",
      onClick: () => {},
    },
    {
      icon: Droplet,
      label: "Medical Information",
      description: "Blood type, allergies, and conditions",
      onClick: () => {},
    },
    {
      icon: Heart,
      label: "Saved Resources",
      description: "View your bookmarked resources",
      onClick: () => {},
    },
    {
      icon: Bell,
      label: "Notification Settings",
      description: "Manage alert preferences",
      onClick: () => setIsDialogOpen(true),
    },
    {
      icon: Settings,
      label: "App Settings",
      description: "Language, theme, and accessibility",
      onClick: () => {},
    },
  ];

  return (
    <div className="page-container">
      <div className="flex flex-col items-center mb-8">
        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <User className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-xl font-bold">John Doe</h1>
        <div className="flex items-center mt-1 text-sm text-muted-foreground">
          <MapPin className="h-3 w-3 mr-1" />
          <span>New York, NY</span>
        </div>
        <div className="flex items-center mt-1 text-sm text-muted-foreground">
          <Phone className="h-3 w-3 mr-1" />
          <span>(555) 123-4567</span>
        </div>
      </div>

      <div className="space-y-4">
        {profileSettings.map((setting, index) => (
          <button
            key={index}
            className="w-full flex items-center justify-between p-4 bg-white rounded-lg shadow-subtle hover:shadow-card transition-shadow"
            onClick={setting.onClick}
          >
            <div className="flex items-center">
              <div className="bg-primary/10 p-2 rounded-full mr-3">
                <setting.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="font-medium">{setting.label}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {setting.description}
                </p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
        ))}

        <button
          className="w-full flex items-center p-4 bg-white rounded-lg shadow-subtle hover:shadow-card transition-shadow text-crisis-red mt-8"
          onClick={() => handleSignOut()}
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notification Settings</DialogTitle>
            <DialogDescription>
              Customize which alerts and notifications you receive
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="font-medium">Emergency Alerts</h4>
                <p className="text-sm text-muted-foreground">
                  Critical emergency notifications
                </p>
              </div>
              <Switch 
                checked={notificationSettings.emergencyAlerts}
                onCheckedChange={() => handleToggleNotification('emergencyAlerts')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="font-medium">Weather Alerts</h4>
                <p className="text-sm text-muted-foreground">
                  Severe weather warnings
                </p>
              </div>
              <Switch 
                checked={notificationSettings.weatherAlerts}
                onCheckedChange={() => handleToggleNotification('weatherAlerts')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="font-medium">Health Alerts</h4>
                <p className="text-sm text-muted-foreground">
                  Public health notifications
                </p>
              </div>
              <Switch 
                checked={notificationSettings.healthAlerts}
                onCheckedChange={() => handleToggleNotification('healthAlerts')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="font-medium">Location-based Alerts</h4>
                <p className="text-sm text-muted-foreground">
                  Alerts based on your current location
                </p>
              </div>
              <Switch 
                checked={notificationSettings.locationBasedAlerts}
                onCheckedChange={() => handleToggleNotification('locationBasedAlerts')}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
