
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";

// Pages
import SplashScreen from "./pages/SplashScreen";
import Onboarding from "./pages/Onboarding";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import FillProfile from "./pages/FillProfile";
import MainLayoutAuthWrapper from "./components/layouts/MainLayoutAuthWrapper";
import Home from "./pages/Home";
import Alerts from "./pages/Alerts";
import AlertDetail from "./pages/AlertDetail";
import Resources from "./pages/Resources";
import ResourceDetail from "./pages/ResourceDetail";
import Contacts from "./pages/Contacts";
import Profile from "./pages/Profile";
import PersonalInfo from "./pages/profile/PersonalInfo"; 
import EmergencyContacts from "./pages/profile/EmergencyContacts";
import MedicalInfo from "./pages/profile/MedicalInfo";
import SavedResources from "./pages/profile/SavedResources";
import Settings from "./pages/Settings";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";
import EnhancedProfile from "./pages/EnhancedProfile";
import Nearby from "./pages/Nearby";
import ReportIncident from "./pages/ReportIncident";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner 
              position="top-right"
              expand={false}
              richColors
              closeButton
              duration={3000}
            />
            <Routes>
              <Route path="/" element={<SplashScreen />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/fill-profile" element={<FillProfile />} />
              
              <Route path="/app" element={<MainLayoutAuthWrapper />}>
                <Route index element={<Home />} />
                <Route path="alerts" element={<Alerts />} />
                <Route path="alerts/:id" element={<AlertDetail />} />
                <Route path="resources" element={<Resources />} />
                <Route path="resources/:id" element={<ResourceDetail />} />
                <Route path="resources/saved" element={<SavedResources />} />
                <Route path="contacts" element={<Contacts />} />
                <Route path="profile" element={<Profile />} />
                <Route path="profile/personal" element={<PersonalInfo />} />
                <Route path="profile/emergency" element={<EmergencyContacts />} />
                <Route path="profile/medical" element={<MedicalInfo />} />
                <Route path="settings" element={<Settings />} />
                <Route path="chat" element={<Chat />} />
                <Route path="nearby" element={<Nearby />} />
                <Route path="report" element={<ReportIncident />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
