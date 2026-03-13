import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { authRepository } from '../modules/auth/auth.repository';
import { useCurrentUserStore } from '../modules/auth/current-user.state';

const AuthCallback = () => {
  const { setUser } = useCurrentUserStore();
  useEffect(() => {
    authRepository.stateChange((user) => {
      setUser(user);
    });
  }, []);
  return <Loader2 className="w-10 h-10 animate-spin text-wood-500" />;
};

export default AuthCallback;
