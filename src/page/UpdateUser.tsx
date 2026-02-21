import { useState } from 'react';
import Button from '../components/ui/Button';
import { authRepository } from '../modules/auth/auth.repository';
import iconSeatTree from '../components/assets/icon_seat_tree.webp';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/useAuth';

const UpdateUser = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { isLoading } = useAuth();

  const updateUser = async () => {
    try {
      await authRepository.updateUser(email, password, name);
      alert(
        '本登録が完了しました。このあと届くメールの「登録を完了する」ボタンを押してから、ログインしてください。',
      );
      await authRepository.signout();
    } catch (error) {
      console.error('Error input form:', error);
      alert('入力欄に必須事項を入力して下さい。');
    }
  };

  const onLoadingSignin = async () => {
    await authRepository.signout();
    navigate('/signin', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-lime-50 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border-4 border-wood-200 text-center">
        <div className="w-70 h-70 mx-auto">
          <img src={iconSeatTree} alt="Seat Tree" />
        </div>
        <h1 className="text-3xl font-bold text-wood-800 font-serif mb-2">Seat Tree</h1>
        <p className="text-wood-500 mb-8 font-serif">-配慮できる席替えアプリ-</p>
        <p className="text-wood-500 mb-8">以下の情報を入力し、ユーザーを登録して下さい。</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateUser();
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
          <Button type="submit" disabled={isLoading || !name || !email || !password}>
            ユーザー登録
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          <button className="cursor-pointer w-full underline" onClick={onLoadingSignin}>
            すでにアカウントをお持ちの方
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateUser;
