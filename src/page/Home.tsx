import { useEffect, useState } from 'react';
import { useCurrentUserStore } from '../modules/auth/current-user.state';
import type { Seat, ViewMode } from '../type';
import { useStudentsStore } from '../modules/students/students.state';
import { useAuth } from '../contexts/useAuth';
import { studentsRepository } from '../modules/students/students.repository';
import { layoutsRepository } from '../modules/layouts/layouts.repository';
import { useLayoutsStore } from '../modules/layouts/layouts.state';
import Header from '../components/layout/Header';
import SideButton from '../components/ui/SideButton';
import MainContents from '../components/home/MainContents';

const Home = () => {
  // 画面表示の切り替え
  const [viewMode, setViewMode] = useState<ViewMode>('classroom');
  // 座席の状態
  const [seats, setSeats] = useState<Seat[]>([]); // 初期値に[]忘れがち
  // 総座席数
  const [totalSeats, setTotalSeats] = useState(30);
  // 教室の列
  const [cols, setCols] = useState(6);
  // supabaseとの通信状態
  const [, setIsLoadingData] = useState(false);
  const { isLoading } = useAuth();
  const { currentUser } = useCurrentUserStore();
  const { setStudents } = useStudentsStore();
  const { setLayouts } = useLayoutsStore();

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

  const handleCols = (col: number) => {
    setCols(col);
  };

  return (
    <div className="min-h-screen bg-wood-50 text-wood-900 pb-20 font-sans">
      <Header setViewMode={setViewMode} onResize={handleResize} totalSeats={totalSeats} />
      <MainContents
        seats={seats}
        setSeats={setSeats}
        totalSeats={totalSeats}
        setTotalSeats={setTotalSeats}
        cols={cols}
        setCols ={setCols}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
      {/* サイドボタン */}
      <SideButton onResize={handleResize} totalSeats={totalSeats} cols={cols} onCols={handleCols} />
    </div>
  );
};

export default Home;
