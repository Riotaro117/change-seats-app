import { useState } from 'react';
import Classroom from './Classroom';
import type { Seat, Student } from '../../type';
import { useStudentsStore } from '../../modules/students/students.state';
import { generateSeatingChart } from '../../utils/seatingLogic';
import StudentsManager from './StudentsManager';
import History from './History';
import Settings from './Settings';

interface MainContentsProps {
  seats: Seat[];
  setSeats: React.Dispatch<React.SetStateAction<Seat[]>>;
  totalSeats: number;
  setTotalSeats: React.Dispatch<React.SetStateAction<number>>;
  cols: number;
  setCols: React.Dispatch<React.SetStateAction<number>>;
  setIsLoadingData: React.Dispatch<React.SetStateAction<boolean>>;
}

const MainContents: React.FC<MainContentsProps> = ({
  seats,
  setSeats,
  totalSeats,
  setTotalSeats,
  cols,
  setCols,
}) => {
  const { students } = useStudentsStore();
  // 現在選択している座席のid
  const [isSelectedSeatId, setIsSelectedSeatId] = useState<string | null>(null);
  // 生徒に高速アクセスするために、mapの作成
  const studentMap = new Map<string, Student>(students.map((student) => [student.id, student]));

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
  const handleSeatClick = (seat: Seat) => {
    if (seat.isDisabled) {
      alert('使用できない座席は選択できません');
      return;
    }
    // 選択済みの座席がない場合
    if (!isSelectedSeatId) {
      setIsSelectedSeatId(seat.id);
    } else {
      // 選択済みがある場合、選んでいない座席なら入れ替え
      if (isSelectedSeatId !== seat.id) {
        handleSwap(isSelectedSeatId, seat.id);
      }
      // 既に選択済みなら外す
      setIsSelectedSeatId(null);
    }
  };

  // 席替えをする
  const handleRandomize = () => {
    // rowsを定義する
    const rows = Math.ceil(totalSeats / cols);
    try {
      // 新しい座席を制約を元にして定義する
      const newSeats = generateSeatingChart(seats, rows, cols, students);
      // 総座席数より、生徒が座っている座席が少ない場合
      if (newSeats.length < totalSeats) {
        // 生徒が座っていない座席に繰り返し処理でseatのstudentIdにnullを入れていく
        for (let i = newSeats.length; i < totalSeats; i++) {
          newSeats.push({
            id: `seat-${Math.floor(i / cols)}-${i % cols}`,
            row: Math.floor(i / cols),
            col: i % cols,
            studentId: null,
            isDisabled: false,
          });
        }
      }
      // 座席を更新する
      setSeats(newSeats);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };
  return (
    <main className="max-w-7xl mx-auto px-4 pt-6">
      {/* 教室モード */}
      <Classroom
        onRandomize={handleRandomize}
        cols={cols}
        seats={seats}
        setSeats={setSeats}
        totalSeats={totalSeats}
        studentMap={studentMap}
        isSelectedSeatId={isSelectedSeatId}
        onSeatClick={handleSeatClick}
      />
      {/* 座席設定モード */}
      <Settings cols={cols} seats={seats} setSeats={setSeats} />
      {/* 生徒名簿モード */}
      <StudentsManager />
      {/* 履歴モード */}
      <History setSeats={setSeats} setCols={setCols} setTotalSeats={setTotalSeats} />
    </main>
  );
};

export default MainContents;
