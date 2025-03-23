
import { useState, useEffect } from "react";
import { FileText, MapPin, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ResourceCard from "@/components/common/ResourceCard";

const mockResources = [
  {
    id: 1,
    title: "Earthquake Preparedness Guide",
    description: "Learn how to prepare for, survive during, and recover after an earthquake.",
    category: "guides",
    isBookmarked: true,
  },
  {
    id: 2,
    title: "First Aid Basics",
    description: "Essential first aid procedures for common emergency situations.",
    category: "guides",
    isBookmarked: false,
  },
  {
    id: 3,
    title: "Emergency Shelter - City Hall",
    description: "Official emergency shelter with capacity for 200 people. Facilities include food, water, and medical aid.",
    category: "locations",
    isBookmarked: false,
  },
  {
    id: 4,
    title: "Memorial Hospital",
    description: "24/7 emergency room services. Located at 1200 North Main Street.",
    category: "locations",
    isBookmarked: true,
  },
  {
    id: 5,
    title: "Flood Safety",
    description: "What to do before, during, and after a flood to stay safe and minimize damage.",
    category: "guides",
    isBookmarked: false,
  },
  {
    id: 6,
    title: "Fire Station #3",
    description: "Emergency services and temporary shelter. Located at 450 West Oak Drive.",
    category: "locations",
    isBookmarked: false,
  },
];

const Resources = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [resources, setResources] = useState<any[]>([]);
  const [filteredResources, setFilteredResources] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      setResources(mockResources);
      setFilteredResources(mockResources);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let result = [...resources];
    
    // Apply category filter
    if (activeTab !== "all") {
      result = result.filter(resource => resource.category === activeTab);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        resource => 
          resource.title.toLowerCase().includes(query) || 
          resource.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredResources(result);
  }, [resources, activeTab, searchQuery]);

  const handleViewResource = (resourceId: number) => {
    console.log("Viewing resource details for ID:", resourceId);
    // Would navigate to resource details or show modal
  };

  return (
    <div className="flex flex-col h-full">
      <div className="page-header border-b border-border">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            <h1 className="text-xl font-bold">Resources</h1>
          </div>
        </div>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            className="pl-9 pr-4 py-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="guides">Guides</TabsTrigger>
            <TabsTrigger value="locations">Locations</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="page-container">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div 
                key={item} 
                className="bg-muted animate-pulse h-32 rounded-lg"
              ></div>
            ))}
          </div>
        ) : filteredResources.length > 0 ? (
          <div>
            {filteredResources.map((resource) => (
              <ResourceCard
                key={resource.id}
                title={resource.title}
                description={resource.description}
                category={resource.category === "guides" ? "Emergency Guide" : "Emergency Location"}
                isBookmarked={resource.isBookmarked}
                onClick={() => handleViewResource(resource.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-1">No Resources Found</h3>
            <p className="text-muted-foreground">
              {searchQuery 
                ? `No results for "${searchQuery}"`
                : "No resources available for this category"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Resources;
