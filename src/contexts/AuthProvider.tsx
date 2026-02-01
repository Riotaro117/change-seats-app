import { useEffect, useState } from 'react';
import { useCurrentUserStore } from '../modules/auth/current-user.state';
import { authRepository } from '../modules/auth/auth.repository';

export type AuthContextType = {};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { set } = useCurrentUserStore();
  const [isLoading, setIsLoading] = useState(false);
  // 初回の信頼できるユーザーのみ読み込み
  useEffect(() => {
    const getUser = async () => {
      setIsLoading(true);
      const currentUser = await authRepository.getCurrentUser();
      set(currentUser);
      setIsLoading(false);
    };
    getUser();
  }, []);
};
