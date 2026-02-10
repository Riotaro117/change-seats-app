import { ImageIcon, Trash2 } from 'lucide-react';
import { useLayoutsStore } from '../../modules/layouts/layouts.state';
import type { ClassroomLayout, Seat } from '../../type';
import { layoutsRepository } from '../../modules/layouts/layouts.repository';
import { useCurrentUserStore } from '../../modules/auth/current-user.state';
import { useViewMode } from '../../modules/viewMode/viewMode.state';

interface HistoryProps {
  setSeats: React.Dispatch<React.SetStateAction<Seat[]>>;
  setCols: React.Dispatch<React.SetStateAction<number>>;
  setTotalSeats: React.Dispatch<React.SetStateAction<number>>;
}

const History: React.FC<HistoryProps> = ({ setSeats, setCols, setTotalSeats }) => {
  const { viewMode, setViewMode } = useViewMode();
  const { layouts, setLayouts } = useLayoutsStore();
  const { currentUser } = useCurrentUserStore();
  const loadLayout = async (layout: ClassroomLayout) => {
    if (!window.confirm('現在の配置は失われます。保存した配置を読み込みますか？')) return;
    // 選択した座席をセットする
    setSeats(layout.seats);
    // 選択した座席の列をセットする
    setCols(layout.cols);
    // 選択した座席の総数をセットする
    setTotalSeats(layout.seats.length);
    // 教室モードを読み込む
    setViewMode('classroom');
  };

  const deleteLayout = async (id: string) => {
    if (!window.confirm('この履歴を削除しますか？')) return;
    await layoutsRepository.deleteLayout(currentUser!.id, id);
    // 削除していない配置だけを残して更新する
    setLayouts(layouts.filter((l) => l.id != id));
  };
  return (
    viewMode === 'history' && (
      <div className="max-w-6xl mx-auto bg-white rounded-3xl p-6 shadow-xl border-4 border-wood-200 min-h-[500px] flex flex-col">
        <div className="flex justify-between items-center mb-6 shrink-0">
          <div>
            <h2 className="text-2xl font-bold font-serif flex items-center gap-2">
              <ImageIcon className="w-6 h-6 text-wood-500" />
              アルバム（履歴）
            </h2>
            <p className="text-wood-500 text-sm mt-1">保存した座席表（最大20件）</p>
          </div>
          <button
            className="cursor-pointer items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95 bg-white text-wood-800 border-2 border-wood-200 hover:border-wood-400 hover:bg-wood-50"
            onClick={() => setViewMode('classroom')}
          >
            戻る
          </button>
        </div>

        {layouts.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-wood-300 gap-4 py-20">
            <ImageIcon className="w-24 h-24 opacity-20" />
            <p className="text-lg">保存された座席表はありません</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 overflow-y-auto p-1">
            {layouts.map((layout) => (
              <div
                key={layout.id}
                onClick={() => loadLayout(layout)}
                className="group relative bg-white rounded-xl border-2 border-wood-100 hover:border-wood-400 shadow-sm hover:shadow-lg transition-all cursor-pointer flex flex-col overflow-hidden aspect-[3/4]"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteLayout(layout.id);
                  }}
                  className="cursor-pointer absolute top-2 right-2 z-10 bg-white/90 p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 shadow-sm opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                  title="削除"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="flex-1 bg-wood-50 p-4 flex items-center justify-center overflow-hidden relative">
                  <div className="absolute inset-0 bg-wood-50 opacity-50 bg-[radial-gradient(#d2a472_1px,transparent_1px)] [background-size:16px_16px]"></div>

                  <div
                    className="grid gap-[2px] w-full max-w-[80%] z-0"
                    style={{
                      gridTemplateColumns: `repeat(${layout.cols}, minmax(0, 1fr))`,
                    }}
                  >
                    {layout.seats.map((seat) => {
                      const student = layout.students.find((s) => s.id === seat.studentId);
                      let colorClass = 'bg-wood-200/50';
                      if (student) {
                        if (student.gender === 'boy') colorClass = 'bg-blue-400';
                        else if (student.gender === 'girl') colorClass = 'bg-pink-400';
                        else colorClass = 'bg-wood-400';
                      }
                      return (
                        <div
                          key={seat.id}
                          className={`aspect-square rounded-[1px] ${colorClass} shadow-sm`}
                        />
                      );
                    })}
                  </div>
                </div>

                <div className="p-3 bg-white border-t border-wood-100">
                  <h3 className="font-bold text-wood-800 text-sm truncate">{layout.name}</h3>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-wood-400">{layout.date}</span>
                    <span className="text-[10px] bg-wood-100 text-wood-600 px-1.5 py-0.5 rounded-full">
                      {layout.seats.length}席
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  );
};

export default History;
