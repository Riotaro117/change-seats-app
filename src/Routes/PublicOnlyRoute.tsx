import { Navigate, Outlet } from 'react-router';
import { useCurrentUserStore } from '../modules/auth/current-user.state';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/useAuth';

const PublicOnlyRoute = () => {
  const { currentUser } = useCurrentUserStore();
    const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-wood-50">
        <Loader2 className="w-10 h-10 animate-spin text-wood-500" />
      </div>
    );
  }
  if (currentUser) return <Navigate replace to="/" />;

  return <Outlet />;
};

export default PublicOnlyRoute;
