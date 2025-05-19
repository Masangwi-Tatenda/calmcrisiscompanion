
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
      
      return data as Alert[];
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
      
      return data as Alert[];
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
        callback(payload.new as Alert);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
