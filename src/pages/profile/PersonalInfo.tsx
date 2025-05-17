
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";

const PersonalInfo = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
    address: "123 Main St, New York, NY",
    dob: "1985-06-15"
  });

  useEffect(() => {
    // Load user profile from localStorage
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        setUserInfo({
          ...userInfo,
          name: profile.name || userInfo.name,
          email: profile.email || userInfo.email,
          phone: profile.phone || userInfo.phone,
          address: profile.location || userInfo.address
        });
      } catch (e) {
        console.error("Failed to load user profile:", e);
      }
    }
  }, []);

  const handleSave = () => {
    // Update localStorage with new user info
    try {
      const savedProfile = localStorage.getItem("userProfile") || "{}";
      const profile = JSON.parse(savedProfile);
      const updatedProfile = {
        ...profile,
        name: userInfo.name,
        email: userInfo.email,
        phone: userInfo.phone,
        location: userInfo.address
      };
      localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
      
      toast({
        title: "Profile updated",
        description: "Your personal information has been updated successfully"
      });
      
      setIsEditing(false);
    } catch (e) {
      console.error("Failed to update profile:", e);
      toast({
        title: "Update failed",
        description: "There was an error updating your profile",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Personal Information</h1>
        <Button 
          variant={isEditing ? "outline" : "default"} 
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </div>

      <div className="bg-card rounded-lg p-4 shadow-subtle space-y-4">
        <div className="space-y-2">
          <div className="flex items-center">
            <User className="h-5 w-5 text-primary mr-2" />
            <label className="text-sm font-medium">Full Name</label>
          </div>
          {isEditing ? (
            <Input 
              value={userInfo.name}
              onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
            />
          ) : (
            <p className="text-foreground pl-7">{userInfo.name}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center">
            <Mail className="h-5 w-5 text-primary mr-2" />
            <label className="text-sm font-medium">Email</label>
          </div>
          {isEditing ? (
            <Input 
              type="email"
              value={userInfo.email}
              onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
            />
          ) : (
            <p className="text-foreground pl-7">{userInfo.email}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center">
            <Phone className="h-5 w-5 text-primary mr-2" />
            <label className="text-sm font-medium">Phone</label>
          </div>
          {isEditing ? (
            <Input 
              type="tel"
              value={userInfo.phone}
              onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
            />
          ) : (
            <p className="text-foreground pl-7">{userInfo.phone}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-primary mr-2" />
            <label className="text-sm font-medium">Address</label>
          </div>
          {isEditing ? (
            <Textarea 
              value={userInfo.address}
              onChange={(e) => setUserInfo({...userInfo, address: e.target.value})}
            />
          ) : (
            <p className="text-foreground pl-7">{userInfo.address}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-primary mr-2" />
            <label className="text-sm font-medium">Date of Birth</label>
          </div>
          {isEditing ? (
            <Input 
              type="date"
              value={userInfo.dob}
              onChange={(e) => setUserInfo({...userInfo, dob: e.target.value})}
            />
          ) : (
            <p className="text-foreground pl-7">{new Date(userInfo.dob).toLocaleDateString()}</p>
          )}
        </div>

        {isEditing && (
          <div className="pt-4">
            <Button className="w-full" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <div className="mt-8">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => navigate("/app/profile")}
        >
          Back to Profile
        </Button>
      </div>
    </div>
  );
};

export default PersonalInfo;
