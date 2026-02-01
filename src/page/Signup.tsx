import { useState } from 'react';
import { Link } from 'react-router';
import Button from '../components/ui/Button';
import { authRepository } from '../modules/auth/auth.repository';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signup = async () => {
    try {
      const data = await authRepository.signup(email, password, name);
      console.log(data.userName);
      alert(
        `${data.userName}先生、登録確認メールを送信しました!メール内のリンクをクリックしてログインして下さい!`,
      );
    } catch (error) {
      console.error('Error input form:', error);
      alert('入力欄に必須事項を入力して下さい。');
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-wood-50 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border-4 border-wood-200 text-center">
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
          🏫
        </div>
        <h1 className="text-3xl font-bold text-wood-800 font-serif mb-2">席替えしようよ</h1>
        <p className="text-wood-500 mb-8">毎月の席替えを保存できる教室席替えアプリ</p>
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
