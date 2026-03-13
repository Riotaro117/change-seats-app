import { History } from 'lucide-react';

interface UpdateProps {
  setIsModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const updatedHistory = [
  { version: '1.0.1', date: '2026.2.23', content: 'スマホブラウザで表示できないバグ修正' },
  {
    version: '1.0.2',
    date: '2026.2.26',
    content: 'テストユーザーの生徒で明智光秀が二人おり、片方を石川五右衛門に修正',
  },
  { version: '1.0.3', date: '2026.2.27', content: '今すぐ試す！を今すぐ始める！ボタンに修正' },
  { version: '1.1.0', date: '2026.2.28', content: 'Excelファイルのアップロードに対応' },
  {
    version: '1.2.0',
    date: '2026.3.1',
    content: '前列希望者が何列目までに座るのかを設定できるように対応',
  },
  { version: '1.2.1', date: '2026.3.2', content: '生徒名簿のUIを改善' },
  { version: '1.3.0', date: '2026.3.3', content: '生徒名簿で名前の変更に対応' },
  { version: '1.4.0', date: '2026.3.5', content: 'アプリの更新履歴を表示できるように対応' },
  { version: '1.5.0', date: '2026.3.13', content: 'メールで認証ボタンを押した後の挙動を修正' },
  { version: '1.5.1', date: '2026.3.13', content: '更新履歴のUIを修正' },
];

const Update: React.FC<UpdateProps> = ({ setIsModal }) => {
  return (
    <div className="min-h-screen flex items-center justify-center  p-4 text-wood-800">
      <div className="  bg-white rounded-3xl p-6 shadow-xl  flex flex-col">
        <div className="flex justify-between items-center mb-6 shrink-0">
          <div>
            <h2 className="text-2xl font-bold font-serif flex items-center gap-2">
              <History className="w-6 h-6 text-wood-500" />
              更新履歴
            </h2>
          </div>
          <button
            className="cursor-pointer items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95 bg-white text-wood-800 border-2 border-wood-200 hover:border-wood-400 hover:bg-wood-50"
            onClick={() => setIsModal(false)}
          >
            戻る
          </button>
        </div>
        <div className="text-center text-wood-500">
          <p>いつもアプリをご愛好いただき、ありがとうございます。</p>
          <p>
            作成者にアプリのフィードバックをいただけますと、さらなる励みになりますので、よろしくお願いします。
          </p>
        </div>
        {updatedHistory.map((h) => {
          return (
            <div key={h.version} className="mt-5 text-wood-500 flex flex-col items-start gap-2">
              <span className="p-3 bg-lime-600 rounded-lg text-wood-100 text-left">
                v{h.version} <span className="text-sm">[{h.date}更新]</span>
              </span>
              <p className="text-wood-800 bg-wood-50 p-3 rounded-lg w-full text-left">
                {h.content}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Update;
