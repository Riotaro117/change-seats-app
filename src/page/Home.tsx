import { useState } from 'react';
import { ChevronDown, ChevronUp, ImageIcon, LogOut, Save, Shuffle, Users } from 'lucide-react';
import { authRepository } from '../modules/auth/auth.repository';
import { useCurrentUserStore } from '../modules/auth/current-user.state';
import type { Seat, ViewMode } from '../type';

const Home = () => {
  // 画面表示の切り替え
  const [viewMode, setViewMode] = useState<ViewMode>('classroom');
  // 総座席数
  const [totalSeats, setTotalSeats] = useState(30);
  // 座席の状態
  const [seats, setSeats] = useState<Seat[]>([]); // 初期値に[]忘れがち
  // 教室の列
  const [cols, setCols] = useState(6);
  const { setUser } = useCurrentUserStore();

  // 総座席数が変わったときに教室の座席配置を作り直す関数
  const handleResize = (size: number) => {
    // 総座席数の更新
    setTotalSeats(size);
    // 引数のsizeを元に新しい座席データを作成する
    // 引数のsizeを配列のようなオブジェクトlength:sizeとして配列にしている
    // 使わないvalueは_で示している elementはundefinedなので存在しない
    const newSeats: Seat[] = Array.from({ length: size }, (_, i) => ({
      id: `seat-${Math.floor(i / cols)}-${i % cols}`,
      row: Math.floor(i / cols),
      col: i % cols,
      studentId: null, // 初めは誰も座っていない
    }));
    // 座席情報の更新
    setSeats(newSeats);
  };
  const signout = async () => {
    await authRepository.signout();
    setUser(undefined);
  };
  return (
    <div className="min-h-screen bg-wood-50 text-wood-900 pb-20 font-sans">
      <header className="bg-white border-b border-wood-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setViewMode('classroom')}
          >
            <div className="bg-orange-100 p-2 rounded-lg">🏫</div>
            <h1 className="text-xl font-bold font-serif hidden sm:block">席替えしようよ</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 mr-4 bg-wood-50 px-3 py-1 rounded-lg border border-wood-100">
              <span className="text-sm font-bold text-wood-600">座席数:</span>
              <button
                onClick={() => handleResize(Math.max(20, totalSeats - 1))}
                className="p-1 hover:bg-wood-200 rounded"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-mono">{totalSeats}</span>
              <button
                onClick={() => handleResize(Math.min(40, totalSeats + 1))}
                className="p-1 hover:bg-wood-200 rounded"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
            </div>

            {/* <Button variant="ghost" onClick={signout} className="hidden sm:inline-flex">
              ログアウト
            </Button> */}
            <button className="hidden sm:inline-flex">ログアウト</button>
            {/* <Button
              variant="ghost"
              className="sm:hidden"
              icon={<LogOut className="w-5 h-5" />}
              onClick={signout}
            ></Button> */}
            {/* レスポンシブで表示切り替え */}
            <button className="sm:hidden" onClick={signout}>
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 pt-6">
        <div className="flex flex-wrap gap-4 justify-center mb-8 sticky top-20 z-20 py-2 bg-wood-50/90 backdrop-blur-sm rounded-xl">
          {/* <Button
              onClick={handleRandomize}
              icon={<Shuffle className="w-5 h-5" />}
              className="shadow-md"
            >
              席替え実行
            </Button> */}
          <button className="shadow-md">
            <Shuffle className="w-5 h-5" />
            席替え実行
          </button>
          {/* <Button
              variant="secondary"
              onClick={() => setViewMode('students')}
              icon={<Users className="w-5 h-5" />}
            >
              名簿・条件
            </Button> */}
          <button>
            <Users className="w-5 h-5" />
            名簿・条件
          </button>
          {/* <Button
              variant="secondary"
              onClick={() => setViewMode('history')}
              icon={<ImageIcon className="w-5 h-5" />}
            >
              アルバム
            </Button> */}
          <button>
            <ImageIcon className="w-5 h-5" />
            アルバム
          </button>
          {/* <Button
              variant="secondary"
              onClick={saveCurrentLayout}
              icon={<Save className="w-5 h-5" />}
            >
              保存
            </Button> */}
          <button>
            <Save className="w-5 h-5" />
            保存
          </button>
        </div>
        
      </main>
      {/* サイドボタン */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <div className="bg-white p-2 rounded-full shadow-xl border-2 border-wood-200 flex flex-col gap-2">
          <button
            onClick={() => handleResize(Math.min(40, totalSeats + 1))}
            className="p-2 bg-wood-100 rounded-full hover:bg-wood-200"
          >
            <ChevronUp />
          </button>
          <span className="text-center font-bold text-xs">{totalSeats}</span>
          <button
            onClick={() => handleResize(Math.max(20, totalSeats - 1))}
            className="p-2 bg-wood-100 rounded-full hover:bg-wood-200"
          >
            <ChevronDown />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
