import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { authRepository } from '../modules/auth/auth.repository';
import { useCurrentUserStore } from '../modules/auth/current-user.state';
import { useNavigate } from 'react-router';

const AuthCallback = () => {
  const { setUser } = useCurrentUserStore();
  const navigate = useNavigate();
  useEffect(() => {
    // 画面遷移時にログイン状態を確認
    const init = async () => {
      const user = await authRepository.getCurrentUser();
      if (user) {
        setUser(user);
        navigate('/', { replace: true });
      }
    };
    init();

    // ログイン状態が変化したときの処理
    const unsubscribe = authRepository.stateChange((user) => {
      setUser(user);
      if (user) {
        navigate('/', { replace: true });
      }
    });

    // クリーンアップ useEffectの後処理 監視イベントの解除
    return () => {
      unsubscribe?.();
    };
  }, [setUser, navigate]);
  return <Loader2 className="w-10 h-10 animate-spin text-wood-500" />;
};

export default AuthCallback;
