
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Import pages
import Index from '@/pages/Index';
import SignIn from '@/pages/SignIn';
import SignUp from '@/pages/SignUp';
import ForgotPassword from '@/pages/ForgotPassword';
import Onboarding from '@/pages/Onboarding';
import Home from '@/pages/Home';
import Alerts from '@/pages/Alerts';
import AlertDetail from '@/pages/AlertDetail';
import Resources from '@/pages/Resources';
import ResourceDetail from '@/pages/ResourceDetail';
import Nearby from '@/pages/Nearby';
import EnhancedProfile from '@/pages/Profile';
import Contacts from '@/pages/Contacts';
import Settings from '@/pages/Settings';
import Chat from '@/pages/Chat';
import ReportIncident from '@/pages/ReportIncident';
import FillProfile from '@/pages/FillProfile';
import NotFound from '@/pages/NotFound';
import Map from '@/pages/Map';

// Import layouts
import MainLayoutAuthWrapper from '@/components/layouts/MainLayoutAuthWrapper';

// Import contexts
import { AuthProvider } from '@/contexts/AuthContext';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="crisis-app-theme">
        <Toaster 
          position="top-right" 
          expand={false} 
          visibleToasts={2} 
          richColors 
          closeButton
        />
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/onboarding" element={<Onboarding />} />
              
            {/* Protected routes */}
            <Route path="/app" element={<MainLayoutAuthWrapper />}>
              <Route index element={<Home />} />
              <Route path="alerts" element={<Alerts />} />
              <Route path="alerts/:id" element={<AlertDetail />} />
              <Route path="resources" element={<Resources />} />
              <Route path="resources/:id" element={<ResourceDetail />} />
              <Route path="map" element={<Map />} />
              <Route path="nearby" element={<Nearby />} />
              <Route path="profile" element={<EnhancedProfile />} />
              <Route path="contacts" element={<Contacts />} />
              <Route path="settings" element={<Settings />} />
              <Route path="chat" element={<Chat />} />
              <Route path="report" element={<ReportIncident />} />
            </Route>
            
            {/* Fill profile */}
            <Route path="/fill-profile" element={<FillProfile />} />
            
            {/* Not found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
