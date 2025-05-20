
import { Outlet, useLocation } from "react-router-dom";
import BottomNavigation from "../navigation/BottomNavigation";
import SOSButton from "../common/SOSButton";
import { ReactNode } from "react";
import { ScrollProvider } from "@/contexts/ScrollContext";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const isChatRoute = location.pathname.includes('/app/chat');
  const isMapRoute = location.pathname.includes('/app/map');

  return (
    <ScrollProvider>
      <div className="flex flex-col min-h-screen bg-background">
        <main className="flex-1 overflow-auto pb-20">
          {children}
        </main>
        <SOSButton hidden={isChatRoute || isMapRoute} />
        <BottomNavigation />
      </div>
    </ScrollProvider>
  );
};

export default MainLayout;
