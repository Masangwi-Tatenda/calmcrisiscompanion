
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import SplashScreen from "./pages/SplashScreen";
import Onboarding from "./pages/Onboarding";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import FillProfile from "./pages/FillProfile";
import MainLayout from "./components/layouts/MainLayout";
import Home from "./pages/Home";
import Alerts from "./pages/Alerts";
import AlertDetail from "./pages/AlertDetail";
import Resources from "./pages/Resources";
import ResourceDetail from "./pages/ResourceDetail";
import Contacts from "./pages/Contacts";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";
import EnhancedProfile from "./pages/EnhancedProfile";

const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/fill-profile" element={<FillProfile />} />
          
          <Route path="/app" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="alerts/:id" element={<AlertDetail />} />
            <Route path="resources" element={<Resources />} />
            <Route path="resources/:id" element={<ResourceDetail />} />
            <Route path="contacts" element={<Contacts />} />
            <Route path="profile" element={<EnhancedProfile />} />
            <Route path="chat" element={<Chat />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
