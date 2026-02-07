import { useEffect, useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  CircleUserRound,
  Glasses,
  LogOut,
  Plus,
  Trash2,
  User,
  X,
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
import Classroom from '../components/home/Classroom';

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
  const studentMap = new Map<string, Student>(students.map((student) => [student.id, student]));

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
        if (neighborStudent && neighborStudent.badChemistryWith.includes(seat.studentId))
          return true;
      }
    }

    // 2. 視力が悪い人のチェック
    if (student.needsFrontRow && seat.row > 1) return true;

    // 何も違反がない場合はfalse
    return false;
  };

  // 席替えをする
  const handleRandomize = () => {
    // rowsを定義する
    const rows = Math.ceil(totalSeats / cols);
    // 新しい座席を制約を元にして定義する
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
        {/* 教室モード */}
        <Classroom
          viewMode={viewMode}
          setViewMode={setViewMode}
          handleRandomize={handleRandomize}
          cols={cols}
          seats={seats}
          studentMap={studentMap}
          isSelectedSeatId={isSelectedSeatId}
          getConflictWarning={getConflictWarning}
          handleSeatClick={handleSeatClick}
        />
        {/* 生徒名簿モード */}
        {viewMode === 'students' && (
          <>
            <div className="bg-white rounded-3xl shadow-xl border-4 border-wood-200 p-6 h-full flex flex-col max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-wood-800 font-serif">生徒名簿</h2>
                  <p className="text-wood-500 text-sm">現在の人数: {students.length}人</p>
                </div>
                <button
                  // onClick={}
                  className="items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95 bg-white text-wood-800 border-2 border-wood-200 hover:border-wood-400 hover:bg-wood-50"
                >
                  完了
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 mb-6 bg-wood-50 p-4 rounded-xl border border-wood-100">
                <input
                  type="text"
                  // value={newStudentName}
                  // onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="新しい生徒の名前"
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-wood-200 focus:border-wood-400 focus:outline-none bg-white"
                  // onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                />
                <div className="flex gap-2">
                  <button
                  // onClick={() => setNewStudentGender('boy')}
                  // className={`px-4 py-2 rounded-xl border-2 font-bold transition-all ${newStudentGender === 'boy' ? 'bg-blue-100 border-blue-400 text-blue-700' : 'bg-white border-wood-200 text-gray-400'}`}
                  >
                    男子
                  </button>
                  <button
                  // onClick={() => setNewStudentGender('girl')}
                  // className={`px-4 py-2 rounded-xl border-2 font-bold transition-all ${newStudentGender === 'girl' ? 'bg-pink-100 border-pink-400 text-pink-700' : 'bg-white border-wood-200 text-gray-400'}`}
                  >
                    女子
                  </button>
                  {/* <Button
                    onClick={handleAdd}
                    isDataLoading={isDataLoading}
                    icon={<Plus className="w-5 h-5" />}
                  >
                    追加
                  </Button> */}
                  <button
                  // onClick={}
                  >
                    追加
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div
              // className={`flex-1 overflow-y-auto pr-2 space-y-3 ${isDataLoading ? 'opacity-50 pointer-events-none' : ''}`}
              >
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="bg-wood-50 p-4 rounded-2xl border border-wood-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center transition-all hover:border-wood-300 group"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                          student.gender === 'boy'
                            ? 'bg-blue-50 border-blue-200 text-blue-600'
                            : student.gender === 'girl'
                              ? 'bg-pink-50 border-pink-200 text-pink-600'
                              : 'bg-wood-200 border-wood-300 text-wood-700'
                        }`}
                      >
                        <User className="w-6 h-6" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-lg text-wood-900">{student.name}</span>
                        <div className="flex gap-2 sm:hidden mt-1">
                          <button
                            // onClick={() => updateGender(student, 'boy')}
                            className={`text-xs px-2 py-0.5 rounded border ${student.gender === 'boy' ? 'bg-blue-100 border-blue-300 text-blue-700' : 'border-gray-200 text-gray-400'}`}
                          >
                            男
                          </button>
                          <button
                            // onClick={() => updateGender(student, 'girl')}
                            className={`text-xs px-2 py-0.5 rounded border ${student.gender === 'girl' ? 'bg-pink-100 border-pink-300 text-pink-700' : 'border-gray-200 text-gray-400'}`}
                          >
                            女
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <div className="hidden sm:flex bg-white rounded-lg p-1 border border-wood-200">
                        <button
                          // onClick={() => updateGender(student, 'boy')}
                          className={`p-1.5 rounded-md transition-all ${student.gender === 'boy' ? 'bg-blue-100 text-blue-600 shadow-sm' : 'text-gray-300 hover:text-gray-500'}`}
                          title="男子"
                        >
                          <CircleUserRound className="w-5 h-5" />
                        </button>
                        <button
                          // onClick={() => updateGender(student, 'girl')}
                          className={`p-1.5 rounded-md transition-all ${student.gender === 'girl' ? 'bg-pink-100 text-pink-600 shadow-sm' : 'text-gray-300 hover:text-gray-500'}`}
                          title="女子"
                        >
                          <CircleUserRound className="w-5 h-5" />
                        </button>
                      </div>

                      <button
                        // onClick={() => toggleProperty(student, 'needsFrontRow')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          student.needsFrontRow
                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                            : 'bg-white text-gray-400 border border-transparent hover:bg-gray-100'
                        }`}
                      >
                        <Glasses className="w-4 h-4" />
                        {student.needsFrontRow ? '前席希望' : '視力OK'}
                      </button>

                      <div className="relative">
                        <button
                          // onClick={() => setEditingId(editingId === student.id ? null : student.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            student.badChemistryWith.length > 0
                              ? 'bg-red-100 text-red-700 border border-red-200'
                              : 'bg-white text-gray-400 border border-transparent hover:bg-gray-100'
                          }`}
                        >
                          <X className="w-4 h-4" />
                          NG: {student.badChemistryWith.length}人
                        </button>
                      </div>

                      <button
                        // onClick={() => handleRemove(student.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    {/* 隣の席にしたくない生徒を選択画面 */}
                    {/* {editingId === student.id && (
                      <div className="w-full mt-3 p-3 bg-white rounded-xl border-2 border-red-100">
                        <p className="text-xs font-bold text-red-500 mb-2 flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          隣の席にしたくない生徒を選択:
                        </p>
                        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                          {students
                            .filter((s) => s.id !== student.id)
                            .map((other) => {
                              const isSelected = student.badChemistryWith.includes(other.id);
                              return (
                                <button
                                  key={other.id}
                                  onClick={() => toggleBadChemistry(student, other.id)}
                                  className={`px-2 py-1 text-xs rounded-md border transition-all ${
                                    isSelected
                                      ? 'bg-red-500 text-white border-red-600 shadow-sm'
                                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'
                                  }`}
                                >
                                  {other.name}{' '}
                                  {isSelected && <Check className="w-3 h-3 inline ml-1" />}
                                </button>
                              );
                            })}
                        </div>
                      </div>
                    )} */}
                  </div>
                ))}

                {students.length === 0 && (
                  <div className="text-center py-12 text-wood-400">
                    <p className="text-lg">生徒が登録されていません</p>
                    <p className="text-sm">「追加」ボタンから登録してください</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
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
