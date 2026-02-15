import { ChevronDown, ChevronUp, SettingsIcon, X } from 'lucide-react';
import { useViewModeStore } from '../../modules/viewMode/viewMode.state';
import type { Seat } from '../../type';
import { useStudentsStore } from '../../modules/students/students.state';

interface SettingProps {
  onResizeSeats: (size: number) => void;
  onResizeCols: (size: number, totalSeats: number) => void;
  totalSeats: number;
  cols: number;
  seats: Seat[];
  setSeats: React.Dispatch<React.SetStateAction<Seat[]>>;
}

const Settings: React.FC<SettingProps> = ({
  onResizeSeats,
  onResizeCols,
  totalSeats,
  cols,
  seats,
  setSeats,
}) => {
  const { viewMode, setViewMode } = useViewModeStore();
  const {students}= useStudentsStore()
  const onToggleDisable = (id: string) => {
    setSeats((prev) =>
      prev.map((seat) => (seat.id === id ? { ...seat, isDisabled: !seat.isDisabled } : seat)),
    );
  };
  return (
    viewMode === 'settings' && (
      <div className="bg-white rounded-3xl shadow-xl border-4 border-wood-200 p-6 h-full flex flex-col max-w-4xl mx-auto">
        <div className="mb-6 ">
          <div>
            <div className="flex justify-between">
              <h2 className="text-2xl font-bold font-serif flex items-center gap-2">
                <SettingsIcon className="w-6 h-6 text-wood-500" />
                座席設定
              </h2>
              <button
                onClick={() => setViewMode('classroom')}
                className="cursor-pointer items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95 bg-white text-wood-800 border-2 border-wood-200 hover:border-wood-400 hover:bg-wood-50"
              >
                完了
              </button>
            </div>
            <p className="text-wood-500 text-sm mt-5">教室の座席数と列数を指定して下さい。</p>
            <div className="flex mt-2 justify-between sm:justify-start sm:gap-5 ">
              <div className="flex items-center gap-2  bg-wood-50 px-3 py-1 rounded-lg border border-wood-100">
                <span className="text-sm font-bold text-wood-600">座席数:</span>
                <button
                  onClick={() => onResizeSeats(Math.max(24, totalSeats - 1))}
                  className="cursor-pointer  hover:bg-wood-200 rounded"
                >
                  <ChevronDown className="w-6 h-6" />
                </button>
                <span className="w-8 text-center font-mono">{totalSeats}</span>
                <button
                  onClick={() => onResizeSeats(Math.min(48, totalSeats + 1))}
                  className="cursor-pointer  hover:bg-wood-200 rounded"
                >
                  <ChevronUp className="w-6 h-6" />
                </button>
              </div>
              <div className="flex items-center gap-2  bg-wood-50 px-3 py-1 rounded-lg border border-wood-100">
                <span className="text-sm font-bold text-wood-600">列数:</span>
                <button
                  onClick={() => onResizeCols(Math.max(4, cols - 1), totalSeats)}
                  className="cursor-pointer  hover:bg-wood-200 rounded"
                >
                  <ChevronDown className="w-6 h-6" />
                </button>
                <span className="w-8 text-center font-mono">{cols}</span>
                <button
                  onClick={() => onResizeCols(Math.min(8, cols + 1), totalSeats)}
                  className="cursor-pointer  hover:bg-wood-200 rounded"
                >
                  <ChevronUp className="w-6 h-6" />
                </button>
              </div>
            </div>
            <p className="text-wood-500 text-sm mt-5">
              座席をクリックすると、席替えの時に生徒が座らない座席を設定できます。
            </p>
            <span className="text-wood-500 text-sm mt-1">
              座席がコの字などのクラスで利用して下さい。
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center w-full">
          <div className="bg-wood-700 text-white px-12 py-2 rounded-b-xl shadow-md mb-8 w-2/3 text-center border-b-4 border-wood-900">
            <h3 className="font-serif tracking-widest text-lg opacity-90">黒板</h3>
          </div>

          {/* 座席をグリッドレイアウトで配置していく styleは動的にクラスを得る書き方 */}
          <div
            className="grid gap-4 w-full max-w-5xl mx-auto p-4 justify-center"
            style={{
              gridTemplateColumns: `repeat(${cols},minmax(0,1fr))`,
            }}
          >
            {/* 座席の配列を展開して並べていく */}
            {seats.map((seat) => {
              // 出力する
              return (
                <div
                  key={seat.id}
                  onClick={() => onToggleDisable(seat.id)}
                  className={`relative aspect-[4/3] rounded-xl flex flex-col items-center justify-center p-2 cursor-pointer
                      transition-all duration-300 transform border-b-4 hover:-translate-y-1 hover:shadow-lg   border-dashed
                      ${seat.isDisabled ? 'bg-emerald-100 border-emerald-200' : 'bg-wood-100 border-wood-200'}`}
                >
                  {seat.isDisabled ? (
                    <span className="text-emerald-300 text-xs font-medium">
                      <X className="w-3 h-3 sm:w-6 h-6" />
                    </span>
                  ) : (
                    <span className="text-wood-300 text-xs font-medium">空席</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className=" bg-wood-50 px-3 py-1 rounded-lg border border-wood-100">
          <span className="text-sm font-bold text-wood-600">利用できる席数:</span>
          <span className="w-8 text-center font-mono">{seats.length}席</span>
          <span className="text-sm font-bold text-wood-600">生徒の数:</span>
          <span className="w-8 text-center font-mono">{students.length}人</span>
        </div>
      </div>
    )
  );
};

export default Settings;
