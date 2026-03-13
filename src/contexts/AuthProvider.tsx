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
  const [isLoading, setIsLoading] = useState(true);
  // 初回の信頼できるユーザーのみ読み込み
  useEffect(() => {
    // 初期認証が確定したかどうか
    let initialized = false;
    authRepository.getSession().then((user) => {
      setUser(user);
      setIsLoading(false);
      initialized = true;
    });

    const unSubscribe = authRepository.stateChange((user) => {
      if (!initialized) return;
      setUser(user);
    });

    // クリーンアップ useEffectの後処理 監視イベントの解除
    return () => {
      unSubscribe?.();
    };
  }, [setUser]);

  return (
    <AuthContext.Provider value={{ isLoading, setIsLoading }}>{children}</AuthContext.Provider>
  );
};
