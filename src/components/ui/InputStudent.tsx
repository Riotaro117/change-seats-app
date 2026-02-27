import { Loader2, Plus } from 'lucide-react';
import { useState } from 'react';
import { studentsRepository } from '../../modules/students/students.repository';
import { useCurrentUserStore } from '../../modules/auth/current-user.state';
import type { Student } from '../../type';
import { useStudentsStore } from '../../modules/students/students.state';
import { useAuth } from '../../contexts/useAuth';

const InputStudent: React.FC = () => {
  // 生徒名簿の名前入力欄の値
  const [newStudentName, setNewStudentName] = useState('');
  // 生徒の性別
  const [newStudentGender, setNewStudentGender] = useState<'boy' | 'girl' | 'other'>('boy');

  const { currentUser } = useCurrentUserStore();
  const { setStudents } = useStudentsStore();
  const { isLoading, setIsLoading } = useAuth();

  // 生徒を追加する処理
  const handleAddStudent = async () => {
    // 入力欄の両端の空白はカットして、空白なら処理を止める→文字列をbooleanにすると、''はfalse
    if (!newStudentName.trim()) return;
    setIsLoading(true);
    try {
      const student: Omit<Student, 'id'> = {
        name: newStudentName,
        gender: newStudentGender,
        needsFrontRow: false, // 初期値はfalse
        badChemistryWith: [], // 初期値は[]
      };
      const addStudent = await studentsRepository.addStudent(currentUser!.id, student);
      // idはDBが作成したものなので、既存の生徒の配列をコピーして、idを追加して生徒を追加する
      setStudents((prev) => [...prev, { ...student, id: addStudent.id }]);
      setNewStudentName('');
    } catch (error) {
      console.error(error);
      alert('保存に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col sm:flex-row gap-2 bg-wood-50 p-4 rounded-xl border border-wood-100">
      <input
        type="text"
        value={newStudentName}
        onChange={(e) => setNewStudentName(e.target.value)}
        placeholder="新しい生徒の名前"
        className="flex-1 px-4 py-3 rounded-xl border-2 border-wood-200 focus:border-wood-400 focus:outline-none bg-white"
        onKeyDown={(e) => e.key === 'Enter' && handleAddStudent()}
      />
      <div className="flex gap-2">
        <button
          onClick={() => setNewStudentGender('boy')}
          disabled={isLoading}
          className={`cursor-pointer px-4 py-2 rounded-xl border-2 font-bold transition-all ${newStudentGender === 'boy' ? 'bg-blue-100 border-blue-400 text-blue-700' : 'bg-white border-wood-200 text-gray-400'}`}
        >
          男子
        </button>
        <button
          onClick={() => setNewStudentGender('girl')}
          disabled={isLoading}
          className={`cursor-pointer px-4 py-2 rounded-xl border-2 font-bold transition-all ${newStudentGender === 'girl' ? 'bg-pink-100 border-pink-400 text-pink-700' : 'bg-white border-wood-200 text-gray-400'}`}
        >
          女子
        </button>
        <button
          className="cursor-pointer items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95 bg-wood-600 text-white hover:bg-wood-700 shadow-wood-800/20"
          onClick={handleAddStudent}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
          追加
        </button>
      </div>
    </div>
  );
};

export default InputStudent;
