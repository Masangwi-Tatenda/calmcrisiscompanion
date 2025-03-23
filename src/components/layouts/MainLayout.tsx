
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import BottomNavigation from "../navigation/BottomNavigation";
import SOSButton from "../common/SOSButton";
import { useEffect } from "react";

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Simulate authentication check
  useEffect(() => {
    // For demo purposes - check if user is coming from auth pages
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (!isAuthenticated && !location.pathname.includes('/signin') && !location.pathname.includes('/signup')) {
      navigate("/signin");
    }
  }, [navigate, location]);

  return (
    <div className="flex flex-col h-full bg-background">
      <main className="flex-1 overflow-hidden relative">
        <Outlet />
      </main>
      <SOSButton />
      <BottomNavigation />
    </div>
  );
};

export default MainLayout;
