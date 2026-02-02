import { useContext } from 'react';
import { AuthContext } from './AuthContext';

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthはAuthProviderの中で使用して下さい');
  return ctx;
};
