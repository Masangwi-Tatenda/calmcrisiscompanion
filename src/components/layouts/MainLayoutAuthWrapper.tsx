
import { Outlet } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import MainLayout from './MainLayout';
import { AuthProvider } from '@/contexts/AuthContext';

const MainLayoutAuthWrapper = () => {
  return (
    <AuthProvider>
      <ProtectedRoute redirectTo="/signin">
        <MainLayout>
          <Outlet />
        </MainLayout>
      </ProtectedRoute>
    </AuthProvider>
  );
};

export default MainLayoutAuthWrapper;
