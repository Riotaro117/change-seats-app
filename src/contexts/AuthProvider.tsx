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
    let mounted = true
    authRepository.getSession().then((user)=>{
      if(!mounted)return
      setUser(user)
      setIsLoading(false)
    })

    const unSubscribe = authRepository.stateChange((user) => {
      setUser(user);
    });
    return ()=>{
      mounted = false
      unSubscribe()
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isLoading, setIsLoading }}>{children}</AuthContext.Provider>
  );
};
