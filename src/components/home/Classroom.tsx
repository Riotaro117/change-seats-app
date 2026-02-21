import { AlertTriangle, ArrowRightLeft, Glasses, GripHorizontal, X } from 'lucide-react';
import type { ClassroomLayout, Seat, Student } from '../../type';
import { ADJACENT_OFFSETS } from '../../constants';
import { useViewModeStore } from '../../modules/viewMode/viewMode.state';
import { layoutsRepository } from '../../modules/layouts/layouts.repository';
import { useCurrentUserStore } from '../../modules/auth/current-user.state';
import { useLayoutsStore } from '../../modules/layouts/layouts.state';
import { useStudentsStore } from '../../modules/students/students.state';
import { useReactToPrint } from 'react-to-print';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import ClassroomButtons from '../ui/ClassroomButtons';

interface ClassroomProps {
  onRandomize: () => void;
  cols: number;
  seats: Seat[];
  setSeats: React.Dispatch<React.SetStateAction<Seat[]>>;
  totalSeats: number;
  studentMap: Map<string, Student>;
  isSelectedSeatId: string | null;
  onSeatClick: (seat: Seat) => void;
}

const Classroom: React.FC<ClassroomProps> = ({
  onRandomize,
  cols,
  seats,
  setSeats,
  totalSeats,
  studentMap,
  isSelectedSeatId,
  onSeatClick,
}) => {
  const { viewMode, setViewMode } = useViewModeStore();
  const { students } = useStudentsStore();
  const { currentUser } = useCurrentUserStore();
  const { setLayouts } = useLayoutsStore();
  const navigate = useNavigate();

  // この席に座っている生徒はルール違反をしているかどうかをbooleanで返す
  const getConflictWarning = (seat: Seat): boolean => {
    // 座席に生徒がいないならfalseで終了
    if (!seat.studentId) return false;
    // 生徒を定義する
    const student = studentMap.get(seat.studentId);
    // 生徒がいないならfalseで終了
    if (!student) return false;

    // 1.相性が悪いチェック
    // for-ofで上下左右一つずつループさせて確かめる
    for (const offset of ADJACENT_OFFSETS) {
      // 隣の行と列を定義する
      const neighborRow = seat.row + offset.r;
      const neighborCol = seat.col + offset.c;
      // ADJACENT_OFFSETSに基づいた隣の席を見つける
      const neighborSeat = seats.find((s) => s.row === neighborRow && s.col === neighborCol);
      // 隣の席があり、隣の席に生徒が座っているなら
      if (neighborSeat && neighborSeat.studentId) {
        // 隣の席の生徒が相性悪い配列の中にあるなら違反報告
        if (student.badChemistryWith.includes(neighborSeat.studentId)) return true;
        // 隣の生徒を定義し、反対も同様に二重チェックする→片思いの苦手でもNGにする
        const neighborStudent = studentMap.get(neighborSeat.studentId);
        if (neighborStudent && neighborStudent.badChemistryWith.includes(seat.studentId))
          return true;
      }
    }

    // 2. 視力が悪い人のチェック
    if (student.needsFrontRow && seat.row > 1) return true;

    // 何も違反がない場合はfalse
    return false;
  };
  const saveCurrentLayout = async () => {
    if (!currentUser) return;
    if (currentUser.is_anonymous) {
      const ok = window.confirm('座席の保存をするには、ユーザー登録をして下さい。');
      if (ok) {
        navigate('/updateUser', { replace: true });
      }
      return;
    }
    // promptで保存する名前を定義する
    const nameLayout = prompt(
      '保存する名前を入力してください（例: 4月の席替え）',
      `${new Date().getMonth() + 1}月の席替え`,
    );
    if (!nameLayout) return;

    try {
      const layout: Omit<ClassroomLayout, 'id'> = {
        name: nameLayout,
        date: new Date().toLocaleDateString(),
        rows: Math.ceil(totalSeats / cols),
        cols,
        seats,
        students,
      };
      const createdLayout = await layoutsRepository.createLayout(currentUser.id, layout);
      setLayouts((prev) => [...prev, createdLayout]);
    } catch (error) {
      console.error(error);
      alert('保存に失敗しました');
    }
  };

  // 設定画面へ遷移
  const transitionSetting = () => {
    if (window.confirm('現在の配置は失われます。座席設定画面に遷移しますか？')) {
      setSeats([]);
      setViewMode('settings');
    }
  };

  // 印刷ボタン
  const contentRef = useRef<HTMLDivElement>(null);
  const [isPrinted, setIsPrinted] = useState(false);
  const printCurrentLayout = useReactToPrint({
    contentRef,
    onBeforePrint: async () => {
      setIsPrinted(true);
      // DOMの更新が完了後に印刷画面へ進む
      await new Promise((resolve) => setTimeout(resolve, 0));
    },
    onAfterPrint: () => {
      setIsPrinted(false);
    },
  });

  return (
    viewMode === 'classroom' && (
      <>
        <ClassroomButtons
          onRandomize={onRandomize}
          onTransitionSetting={transitionSetting}
          onSaveCurrentLayout={saveCurrentLayout}
          onPrintCurrentLayout={printCurrentLayout}
          />
        {/* 教室 */}
        <div ref={contentRef} className="flex flex-col items-center w-full">
          <div className="bg-lime-600 text-white px-12 py-2 rounded-b-xl shadow-md mb-8 w-2/3 text-center border-b-4 border-lime-800">
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
              // 生徒を定義
              const student = seat.studentId ? studentMap.get(seat.studentId) : null;
              // 選択している座席のidとseatのidが一致している状態を定義
              const isSelected = isSelectedSeatId === seat.id;
              // seatingLogicを元に制約違反があるかどうか
              const hasConflict = getConflictWarning(seat);

              // 文字の色を定義
              let textColor = 'text-wood-900';
              // 生徒が存在するかどうかで文字の色を変化させる
              if (student) {
                // 制約違反があるなら赤色で警告
                if (hasConflict) textColor = 'text-red-700';
                // 制約違反がなければ、男女で色を変化させる
                else if (student.gender === 'boy') textColor = 'text-blue-900';
                else if (student.gender === 'girl') textColor = 'text-pink-900';
              }

              // 出力する
              return (
                <div
                  key={seat.id}
                  onClick={() => onSeatClick(seat)}
                  className={`
                relative aspect-[4/3] rounded-xl flex flex-col items-center justify-center p-2 cursor-pointer
                transition-all duration-300 transform border-b-4
                ${
                  // 選択されているかでスタイルの変化
                  isSelected
                    ? 'bg-blue-100 border-blue-400 -translate-y-2 shadow-xl ring-4 ring-blue-200 z-10'
                    : 'hover:-translate-y-1 hover:shadow-lg'
                }
                ${
                  seat.isDisabled
                    ? 'bg-emerald-100 border-emerald-200 border-dashed'
                    : !student
                      ? 'bg-wood-100 border-wood-200 border-dashed'
                      : hasConflict
                        ? 'bg-red-50 border-red-300'
                        : 'bg-orange-200 border-wood-400'
                }
              `}
                >
                  {/* 生徒がいて制約違反もなく、選択もされていないなら */}
                  {student && !isSelected && !hasConflict && (
                    <div className="absolute inset-2 border border-orange-300/50 rounded-lg pointer-events-none"></div>
                  )}

                  {/* 生徒の有無でスタイル変更 */}
                  {seat.isDisabled ? (
                    <span className="text-emerald-300 text-xs font-medium">
                      <X className="w-3 h-3 sm:w-6 h-6" />
                    </span>
                  ) : student ? (
                    <>
                      <div className="flex items-center gap-1 mb-1">
                        {/* 前列配慮のある生徒の場合のスタイル */}
                        {student.needsFrontRow && !isPrinted && (
                          <Glasses
                            className={`w-3 h-3 ${hasConflict ? 'text-red-500' : 'text-wood-700'}`}
                          />
                        )}
                        {/* もし制約違反があったら */}
                        {hasConflict && (
                          <AlertTriangle className="w-3 h-3 text-red-500 animate-pulse" />
                        )}
                      </div>
                      {/* 生徒の名前を表示する */}
                      <span
                        className={`text-center font-bold leading-tight select-none line-clamp-2 ${textColor}`}
                        style={{ fontSize: 'clamp(0.7rem, 1vw, 1rem)' }}
                      >
                        {student.name}
                      </span>
                      {/* ホバーした時だけ入れ替えマークが出現 */}
                      <div className="mt-2 opacity-0 hover:opacity-100 absolute inset-0 bg-black/5 rounded-xl flex items-center justify-center transition-opacity">
                        <ArrowRightLeft className="text-wood-800 w-6 h-6" />
                      </div>
                    </>
                  ) : (
                    <span className="text-wood-300 text-xs font-medium">空席</span>
                  )}

                  {/* 座席が選択された時の表示変更 */}
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1 shadow-md">
                      <GripHorizontal className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </>
    )
  );
};

export default Classroom;
