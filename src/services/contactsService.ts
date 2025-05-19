
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Contact {
  id: string;
  name: string;
  phone: string;
  relationship?: string;
  type: string;
  is_favorite: boolean;
  created_at: string;
  user_id?: string;
}

// Type for what we get from the database
interface ContactFromDB {
  id: string;
  name: string;
  phone: string;
  relationship?: string;
  type: string;
  is_favorite: boolean;
  created_at: string;
  user_id: string;
}

export const useGetContacts = () => {
  return useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      // Type assertion to work with the database schema
      const { data, error } = await supabase
        .from('contacts' as any)
        .select('*')
        .order('is_favorite', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Cast the data to our Contact interface
      return (data || []) as unknown as Contact[];
    },
  });
};

export const useCreateContact = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (contact: Omit<Contact, 'id' | 'created_at'>) => {
      // Get current user ID
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error("User not authenticated");
      
      // Create the contact with the user_id
      const newContact = {
        ...contact,
        user_id: session.user.id,
      };
      
      const { data, error } = await supabase
        .from('contacts' as any)
        .insert(newContact as any)
        .select()
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data as unknown as Contact;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['contacts'],
      });
    },
  });
};

export const useUpdateContact = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (contact: Partial<Contact> & { id: string }) => {
      const { data, error } = await supabase
        .from('contacts' as any)
        .update(contact as any)
        .eq('id', contact.id)
        .select()
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data as unknown as Contact;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['contacts'],
      });
    },
  });
};

export const useDeleteContact = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('contacts' as any)
        .delete()
        .eq('id', id);
      
      if (error) {
        throw new Error(error.message);
      }
      
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['contacts'],
      });
    },
  });
};
