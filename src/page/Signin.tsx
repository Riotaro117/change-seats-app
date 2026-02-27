import { useState } from 'react';
import Button from '../components/ui/Button';
import { authRepository } from '../modules/auth/auth.repository';
import iconSeatTree from '../components/assets/icon_seat_tree.webp';
import { useAuth } from '../contexts/useAuth';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { isLoading, setIsLoading } = useAuth();

  const signin = async () => {
    try {
      await authRepository.signin(email, password);
    } catch (error) {
      console.error(error);
      alert('メールアドレスかパスワードが間違っています。');
    }
  };

  const anonymouslySignin = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await authRepository.anonymouslySignin();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-wood-50 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border-4 border-wood-200 text-center">
        <div className="w-70 h-70 mx-auto">
          <img src={iconSeatTree} alt="Seat Tree" />
        </div>
        <h1 className="text-3xl font-bold text-wood-800 font-serif mb-2">Seat Tree</h1>
        <p className="text-wood-500 mb-2 font-serif">-配慮できる席替えアプリ-</p>
        <p className="text-wood-500 mb-8 font-serif">v1.1.0</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            signin();
          }}
          className="space-y-4"
        >
          <input
            type="email"
            placeholder="メールアドレス"
            className="w-full px-4 py-3 rounded-xl border-2 border-wood-100 focus:border-wood-400 outline-none bg-wood-50"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="パスワード"
            className="w-full px-4 py-3 rounded-xl border-2 border-wood-100 focus:border-wood-400 outline-none bg-wood-50"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" disabled={!email || !password || isLoading}>
            ログイン
          </Button>
        </form>
        <button
          disabled={isLoading}
          onClick={anonymouslySignin}
          className="cursor-pointer items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95 bg-lime-600 text-white hover:bg-lime-700 shadow-lime-800/20 w-full py-3 text-lg mt-3"
        >
          今すぐ始める！
        </button>
        <p className="text-wood-500 mt-8 text-sm">
          個人情報は、通信の暗号化とアクセス制御により
          <br />
          安全に保護されています。
        </p>
      </div>
    </div>
  );
};

export default Signin;
