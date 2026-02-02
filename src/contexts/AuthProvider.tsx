import { useEffect, useState } from 'react';
import { useCurrentUserStore } from '../modules/auth/current-user.state';
import { authRepository } from '../modules/auth/auth.repository';
import { AuthContext } from './AuthContext';

export type AuthContextType = {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { setUser } = useCurrentUserStore();
  const [isLoading, setIsLoading] = useState(false);
  // 初回の信頼できるユーザーのみ読み込み
  useEffect(() => {
    const getUser = async () => {
      setIsLoading(true);
      const currentUser = await authRepository.getCurrentUser();
      setUser(currentUser);
      setIsLoading(false);
    };
    getUser();

    const unSubscribe = authRepository.stateChange((user) => {
      setUser(user ?? undefined);
    });
    return unSubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ isLoading, setIsLoading }}>{children}</AuthContext.Provider>
  );
};
