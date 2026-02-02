import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../contexts/useAuth';
import { Loader2 } from 'lucide-react';
import { useCurrentUserStore } from '../modules/auth/current-user.state';

export const ProtectedRoute = () => {
  const { isLoading } = useAuth();
  const { currentUser } = useCurrentUserStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-wood-50">
        <Loader2 className="w-10 h-10 animate-spin text-wood-500" />
      </div>
    );
  }
  if (!currentUser) {
    return <Navigate replace to="/signin" />;
  }
  return <Outlet />;
};
