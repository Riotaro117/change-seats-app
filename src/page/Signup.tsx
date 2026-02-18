import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router';
import Button from '../components/ui/Button';
import { authRepository } from '../modules/auth/auth.repository';
import { useAuth } from '../contexts/useAuth';
import { useCurrentUserStore } from '../modules/auth/current-user.state';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { isLoading, setIsLoading } = useAuth();
  const { currentUser } = useCurrentUserStore();
  const navigate = useNavigate();

  const signup = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await authRepository.signup(email, password, name);
    } catch (error) {
      console.error(error);
      alert('入力欄に必須事項を入力して下さい。');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      navigate('/', { replace: true });
    }
  }, [currentUser]);

  if (currentUser) return <Navigate replace to="/" />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-wood-50 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border-4 border-wood-200 text-center">
        <h1 className="text-3xl font-bold text-wood-800 font-serif mb-2">Seat Tree</h1>
        <p className="text-wood-500 mb-8">-配慮できる席替えアプリ-</p>
        <p className="text-wood-500 mb-8">以下の情報を入力し、ユーザーを登録して下さい。</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            signup();
          }}
          className="space-y-4"
        >
          <input
            type="text"
            placeholder="ユーザー名"
            className="w-full px-4 py-3 rounded-xl border-2 border-wood-100 focus:border-wood-400 outline-none bg-wood-50"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
          <Button type="submit">ユーザー登録</Button>
        </form>
        <div className="mt-4 text-center text-sm">
          <Link className="w-full underline" to={'/signin'}>
            すでにアカウントをお持ちの方
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
