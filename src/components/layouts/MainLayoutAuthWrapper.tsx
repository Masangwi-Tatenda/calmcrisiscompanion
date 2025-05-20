
import { Outlet } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import MainLayout from './MainLayout';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const MainLayoutAuthWrapper = () => {
  const [hasShownWelcomeToast, setHasShownWelcomeToast] = useState(false);
  
  // Check for auth session once and show welcome toast only on new login
  useEffect(() => {
    const handleAuthChange = async () => {
      const { data } = await supabase.auth.getSession();
      const sessionKey = 'auth-session-welcomed';
      
      // Get session ID and last welcomed session from localStorage
      const sessionId = data.session?.user?.id; // Use user.id instead of session.id
      const lastWelcomedSession = localStorage.getItem(sessionKey);
      
      if (sessionId && sessionId !== lastWelcomedSession && !hasShownWelcomeToast) {
        // Store that we've welcomed this session
        localStorage.setItem(sessionKey, sessionId);
        setHasShownWelcomeToast(true);
        
        // Show welcome toast
        toast.success('Successfully signed in', {
          description: 'Welcome to the Crisis Management App',
        });
      }
    };
    
    handleAuthChange();
  }, [hasShownWelcomeToast]);
  
  // Fix the ProtectedRoute children prop issue by using the children prop explicitly
  return (
    <ProtectedRoute redirectTo="/signin">
      {/* Explicitly add the children prop to MainLayout */}
      <MainLayout>
        <Outlet />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default MainLayoutAuthWrapper;
