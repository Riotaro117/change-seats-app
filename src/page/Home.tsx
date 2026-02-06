import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowRightLeft,
  ChevronDown,
  ChevronUp,
  Glasses,
  GripHorizontal,
  ImageIcon,
  LogOut,
  Save,
  Shuffle,
  Users,
} from 'lucide-react';
import { authRepository } from '../modules/auth/auth.repository';
import { useCurrentUserStore } from '../modules/auth/current-user.state';
import type { Seat, Student, ViewMode } from '../type';
import { useStudentsStore } from '../modules/students/students.state';
import { generateSeatingChart } from '../utils/seatingLogic';
import { useAuth } from '../contexts/useAuth';
import { studentsRepository } from '../modules/students/students.repository';
import { layoutsRepository } from '../modules/layouts/layouts.repository';
import { useLayoutsStore } from '../modules/layouts/layouts.state';
import { ADJACENT_OFFSETS } from '../constants';

const Home = () => {
  // 画面表示の切り替え
  const [viewMode, setViewMode] = useState<ViewMode>('classroom');
  // 総座席数
  const [totalSeats, setTotalSeats] = useState(30);
  // 座席の状態
  const [seats, setSeats] = useState<Seat[]>([]); // 初期値に[]忘れがち
  // 教室の列
  const [cols, setCols] = useState(6);
  // supabaseとの通信状態
  const [isLoadingData, setIsLoadingData] = useState(false);

  const { isLoading } = useAuth();
  const { currentUser, setUser } = useCurrentUserStore();
  const { students, setStudents } = useStudentsStore();
  const { layouts, setLayouts } = useLayoutsStore();
  // 現在選択している座席のid
  const [isSelectedSeatId, setIsSelectedSeatId] = useState<string | null>(null);
  // 生徒に高速アクセスするために、mapの作成
  const studentMap = new Map<string, Student>(students?.map((student) => [student.id, student]));

  useEffect(() => {
    if (!isLoading) {
      fetchData();
    }
  }, []);

  // supabaseのデータ取得
  const fetchData = async () => {
    // データ取得中
    setIsLoadingData(true);
    // 成功した時
    try {
      // 生徒情報を取得
      const formattedStudents = await studentsRepository.fetchStudents(currentUser!.id);
      // 取得した生徒情報をグローバルステートに格納
      setStudents(formattedStudents);
      // 教室のレイアウトを取得
      const formattedLayouts = await layoutsRepository.fetchLayouts(currentUser!.id);
      // 教室のレイアウトをグローバルステートに格納
      setLayouts(formattedLayouts);
    } catch (error) {
      // 失敗した時
      console.error('Error fetching data:', error);
      alert('データの読み込みに失敗しました');
    } finally {
      // 最後の締め
      if (seats.length === 0) {
        handleResize(30);
      }
      setIsLoadingData(false);
    }
  };

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

  // 指定した生徒同士の座席を入れ替える
  const handleSwap = (id1: string, id2: string) => {
    // 元の座席順をコピーして入れ替える準備をする
    const newSeats = [...seats];
    // コピーした配列の中から選択しているid1とid2に一致するインデックスをそれぞれ取得する
    const seat1Idx = newSeats.findIndex((s) => s.id === id1);
    const seat2Idx = newSeats.findIndex((s) => s.id === id2);
    // 見つからなかったらそのまま返す
    if (seat1Idx === -1 || seat2Idx === -1) return;
    // 生徒のidを交換する処理
    // 一時的にid1を格納する
    const temp = newSeats[seat1Idx].studentId;
    // id2をid1に格納
    newSeats[seat1Idx].studentId = newSeats[seat2Idx].studentId;
    // tempをid2に格納
    newSeats[seat2Idx].studentId = temp;
    // 現在の座席を更新
    setSeats(newSeats);
  };

  // 座席をクリックしたら選択済みにする
  const handleSeatClick = (seatId: string) => {
    // 選択済みの座席がない場合
    if (!isSelectedSeatId) {
      setIsSelectedSeatId(seatId);
    } else {
      // 選択済みがある場合、選んでいない座席なら入れ替え
      if (isSelectedSeatId !== seatId) {
        handleSwap(isSelectedSeatId, seatId);
      }
      // 既に選択済みなら外す
      setIsSelectedSeatId(null);
    }
  };

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
        if (neighborStudent && neighborStudent.badChemistryWith.includes(student.id)) return true;
      }
    }

    // 2. 視力が悪い人のチェック
    if (student.needsFrontRow && seat.row > 1) return true;

    console.log({
      seatRow: seat.row,
      needsFrontRow: student.needsFrontRow,
      result: student.needsFrontRow && seat.row > 1,
    });

    // 何も違反がない場合はfalse
    return false;
  };

  // 席替えをする
  const handleRandomize = () => {
    // rowsを定義する
    const rows = Math.ceil(totalSeats / cols);
    // 新しい座席を制約を元にして定義する
    if (students) {
      const newSeats = generateSeatingChart(rows, cols, students);
      // 総座席数より、生徒が座っている座席が少ない場合
      if (newSeats.length < totalSeats) {
        // 生徒が座っていない座席に繰り返し処理でseatのstudentIdにnullを入れていく
        for (let i = newSeats.length; i < totalSeats; i++) {
          newSeats.push({
            id: `seat-${Math.floor(i / cols)}-${i % cols}`,
            row: Math.floor(i / cols),
            col: i % cols,
            studentId: null,
          });
        }
      }
      // 座席を更新する
      setSeats(newSeats);
    }
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

            <button className="cursor-pointer bg-transparent text-wood-600 hover:bg-wood-100 !shadow-none hidden sm:inline-flex">
              ログアウト
            </button>
            {/* レスポンシブで表示切り替え */}
            <button
              className="cursor-pointer bg-transparent text-wood-600 hover:bg-wood-100 !shadow-none sm:hidden"
              onClick={signout}
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 pt-6">
        <div className="flex flex-wrap gap-4 justify-center mb-8 sticky top-20 z-20 py-2 bg-wood-50/90 backdrop-blur-sm rounded-xl">
          <button
            className="cursor-pointer items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95 bg-wood-600 text-white hover:bg-wood-700 shadow-wood-800/20 shadow-md"
            onClick={handleRandomize}
          >
            <Shuffle className="w-5 h-5" />
            席替え実行
          </button>
          <button className="cursor-pointer items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95 bg-white text-wood-800 border-2 border-wood-200 hover:border-wood-400 hover:bg-wood-50 shadow-md">
            <Users className="w-5 h-5" />
            名簿・条件
          </button>
          <button className="cursor-pointer items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95 bg-white text-wood-800 border-2 border-wood-200 hover:border-wood-400 hover:bg-wood-50 shadow-md">
            <ImageIcon className="w-5 h-5" />
            アルバム
          </button>
          <button className="cursor-pointer items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95 bg-white text-wood-800 border-2 border-wood-200 hover:border-wood-400 hover:bg-wood-50 shadow-md">
            <Save className="w-5 h-5" />
            保存
          </button>
        </div>
        {/* 教室 */}
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
                  onClick={() => handleSeatClick(seat.id)}
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
                  // 生徒が存在しない時のスタイル、制約違反があったらスタイルを変える(後で)！！！！！
                  !student
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
                  {student ? (
                    <>
                      <div className="flex items-center gap-1 mb-1">
                        {/* 前列配慮のある生徒の場合のスタイル */}
                        {student.needsFrontRow && (
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
