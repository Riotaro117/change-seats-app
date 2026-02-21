import { Link } from 'react-router';

const Registered = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-wood-50 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border-4 border-wood-200 text-center">
        <h1 className="text-3xl font-bold text-wood-800 font-serif mb-2">Seat Tree</h1>
        <p className="text-wood-500 mb-8 font-serif">-配慮できる席替えアプリ-</p>
        <p className="text-wood-500 mb-8 text-xl font-bold">登録が完了しました。</p>
        <p className="text-wood-500 mb-8">
          登録したアドレス宛に確認メールが届くので、
          <br />
          メール内の確認ボタンを押してから
          <br />
          ログインして下さい。
        </p>
        <div className="mt-4 text-center text-sm">
          <Link className="w-full underline" to={'/signin'}>
            ログインページへ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Registered;
