
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export interface Alert {
  id: string;
  type: string;
  title: string;
  description: string;
  location?: string;
  severity: string;
  icon?: string;
  created_at: string;
}

export const useGetAlerts = () => {
  return useQuery({
    queryKey: ['alerts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Map the database fields to our Alert interface
      return (data || []).map(alert => ({
        id: alert.id,
        type: alert.type || alert.alert_type, // Handle both field names
        title: alert.title,
        description: alert.description,
        location: alert.location,
        severity: alert.severity,
        icon: alert.icon,
        created_at: alert.created_at
      })) as Alert[];
    },
  });
};

export const useGetRecentAlerts = (limit = 5) => {
  return useQuery({
    queryKey: ['recent-alerts', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Map the database fields to our Alert interface
      return (data || []).map(alert => ({
        id: alert.id,
        type: alert.type || alert.alert_type, // Handle both field names
        title: alert.title,
        description: alert.description,
        location: alert.location,
        severity: alert.severity,
        icon: alert.icon,
        created_at: alert.created_at
      })) as Alert[];
    },
  });
};

export const useSubscribeToAlerts = (callback: (alert: Alert) => void) => {
  const channel = supabase
    .channel('public:alerts')
    .on('postgres_changes', 
      { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'alerts'
      },
      (payload) => {
        // Convert payload to match Alert interface
        const newAlert = {
          id: payload.new.id,
          type: payload.new.type || payload.new.alert_type,
          title: payload.new.title,
          description: payload.new.description,
          location: payload.new.location,
          severity: payload.new.severity,
          icon: payload.new.icon,
          created_at: payload.new.created_at
        } as Alert;
        
        callback(newAlert);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
