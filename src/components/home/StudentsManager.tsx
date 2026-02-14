import {
  Check,
  CircleUserRound,
  Glasses,
  Loader2,
  Plus,
  Trash2,
  User,
  Users,
  X,
} from 'lucide-react';
import { useStudentsStore } from '../../modules/students/students.state';
import type { Student } from '../../type';
import { useState } from 'react';
import { studentsRepository } from '../../modules/students/students.repository';
import { useCurrentUserStore } from '../../modules/auth/current-user.state';
import { useViewModeStore } from '../../modules/viewMode/viewMode.state';

const StudentsManager: React.FC = () => {
  const { viewMode, setViewMode } = useViewModeStore();
  const { students, setStudents } = useStudentsStore();
  const { currentUser } = useCurrentUserStore();
  // 生徒名簿の名前入力欄の値
  const [newStudentName, setNewStudentName] = useState('');
  // 生徒の性別
  const [newStudentGender, setNewStudentGender] = useState<'boy' | 'girl' | 'other'>('boy');
  // DBとの通信の状態
  const [isDataLoading, setIsDataLoading] = useState(false);
  // 編集しているidの状態
  const [editingId, setEditingId] = useState<string | null>(null);

  // 生徒を追加する処理
  const handleAddStudent = async () => {
    // 入力欄の両端の空白はカットして、空白なら処理を止める→文字列をbooleanにすると、''はfalse
    if (!newStudentName.trim()) return;
    setIsDataLoading(true);
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
      setIsDataLoading(false);
    }
  };

  // 生徒の情報を更新する処理
  const handleUpdateGender = async (student: Student, gender: Student['gender']) => {
    try {
      // genderのみ書き換えた生徒を定義する
      const updateStudent = { ...student, gender };
      await studentsRepository.updateStudent(currentUser!.id, updateStudent);
      // DB操作→stateの更新 更新された生徒と同じidの生徒だけを新しいstudentに置き換える
      setStudents((prev) => prev.map((s) => (s.id === updateStudent.id ? updateStudent : s)));
    } catch (error) {
      console.error(error);
      alert('更新に失敗しました');
    }
  };

  // propのオンオフを更新する関数
  const handleToggleProperty = async (student: Student, props: 'needsFrontRow') => {
    try {
      // キーのみ更新する生徒を定義する→ブラケット方式で動的にキーを取得する
      const updateStudent = { ...student, [props]: !student[props] };
      await studentsRepository.updateStudent(currentUser!.id, updateStudent);
      setStudents((prev) => prev.map((s) => (s.id === updateStudent.id ? updateStudent : s)));
    } catch (error) {
      console.error(error);
      alert('更新に失敗しました');
    }
  };

  const toggleBadChemistry = async (student: Student, targetId: string) => {
    try {
      // 元々相性が悪い子を持っているか定義
      const hasConflict = student.badChemistryWith.includes(targetId);
      // 元々持っていたらその子をfilterで除外し、そうでないならそのまま追加する
      const updateChemistry = hasConflict
        ? student.badChemistryWith.filter((id) => id !== targetId)
        : [...student.badChemistryWith, targetId];

      //更新した生徒を定義する
      const updateStudent = { ...student, badChemistryWith: updateChemistry };
      await studentsRepository.updateStudent(currentUser!.id, updateStudent);

      setStudents((prev) => prev.map((s) => (s.id === updateStudent.id ? updateStudent : s)));
    } catch (error) {
      console.error(error);
      alert('更新に失敗しました');
    }
  };

  const handleRemove = async (targetId: string) => {
    if (!confirm('本当に削除しますか？')) return;
    setIsDataLoading(true);
    try {
      // 選択されたidと一致する生徒を削除する生徒として定義する
      const deleteStudent = students.find((s) => s.id === targetId);
      if (!deleteStudent) return;
      await studentsRepository.deleteStudent(currentUser!.id, deleteStudent);
      setStudents((prev) => prev.filter((s) => s.id !== targetId));
    } catch (error) {
      console.error(error);
      alert('削除に失敗しました');
    } finally {
      setIsDataLoading(false);
    }
  };

  return (
    viewMode === 'students' && (
      <>
        <div className="bg-white rounded-3xl shadow-xl border-4 border-wood-200 p-6 h-full flex flex-col max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold font-serif flex items-center gap-2">
                <Users className="w-6 h-6 text-wood-500" />
                生徒名簿
              </h2>
              <p className="text-wood-500 text-sm mt-1">
                現在の人数: 合計 {students.length}人（男子{' '}
                {students.filter((s) => s.gender === 'boy').length}人、女子{' '}
                {students.filter((s) => s.gender === 'girl').length}人）
              </p>
            </div>
            <button
              onClick={() => setViewMode('classroom')}
              className="cursor-pointer items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95 bg-white text-wood-800 border-2 border-wood-200 hover:border-wood-400 hover:bg-wood-50"
            >
              完了
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mb-6 bg-wood-50 p-4 rounded-xl border border-wood-100">
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
                className={`cursor-pointer px-4 py-2 rounded-xl border-2 font-bold transition-all ${newStudentGender === 'boy' ? 'bg-blue-100 border-blue-400 text-blue-700' : 'bg-white border-wood-200 text-gray-400'}`}
              >
                男子
              </button>
              <button
                onClick={() => setNewStudentGender('girl')}
                className={`cursor-pointer px-4 py-2 rounded-xl border-2 font-bold transition-all ${newStudentGender === 'girl' ? 'bg-pink-100 border-pink-400 text-pink-700' : 'bg-white border-wood-200 text-gray-400'}`}
              >
                女子
              </button>
              <button
                className="cursor-pointer items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95 bg-wood-600 text-white hover:bg-wood-700 shadow-wood-800/20"
                onClick={handleAddStudent}
              >
                {isDataLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Plus className="w-5 h-5" />
                )}
                追加
              </button>
            </div>
          </div>

          <div
            className={`flex-1 overflow-y-auto pr-2 space-y-3 ${isDataLoading ? 'opacity-50 pointer-events-none' : ''}`}
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
                        onClick={() => handleUpdateGender(student, 'boy')}
                        className={`cursor-pointer text-xs px-2 py-0.5 rounded border ${student.gender === 'boy' ? 'bg-blue-100 border-blue-300 text-blue-700' : 'border-gray-200 text-gray-400'}`}
                      >
                        男
                      </button>
                      <button
                        onClick={() => handleUpdateGender(student, 'girl')}
                        className={`cursor-pointer text-xs px-2 py-0.5 rounded border ${student.gender === 'girl' ? 'bg-pink-100 border-pink-300 text-pink-700' : 'border-gray-200 text-gray-400'}`}
                      >
                        女
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="hidden sm:flex bg-white rounded-lg p-1 border border-wood-200">
                    <button
                      onClick={() => handleUpdateGender(student, 'boy')}
                      className={`cursor-pointer p-1.5 rounded-md transition-all ${student.gender === 'boy' ? 'bg-blue-100 text-blue-600 shadow-sm' : 'text-gray-300 hover:text-gray-500'}`}
                      title="男子"
                    >
                      <CircleUserRound className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleUpdateGender(student, 'girl')}
                      className={`cursor-pointer p-1.5 rounded-md transition-all ${student.gender === 'girl' ? 'bg-pink-100 text-pink-600 shadow-sm' : 'text-gray-300 hover:text-gray-500'}`}
                      title="女子"
                    >
                      <CircleUserRound className="w-5 h-5" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleToggleProperty(student, 'needsFrontRow')}
                    className={`cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      student.needsFrontRow
                        ? 'bg-yellow-100 text-blue-700 border border-blue-200'
                        : 'bg-white text-gray-400 border border-transparent hover:bg-gray-100'
                    }`}
                  >
                    <Glasses className="w-4 h-4" />
                    {student.needsFrontRow ? '前席希望' : '視力OK'}
                  </button>

                  <div className="relative">
                    <button
                      onClick={() => setEditingId(editingId === student.id ? null : student.id)}
                      className={`cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
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
                    onClick={() => handleRemove(student.id)}
                    className="cursor-pointer p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                {/* 隣の席にしたくない生徒を選択画面 */}
                {editingId === student.id && (
                  <div className="w-full mt-3 p-3 bg-white rounded-xl border-2 border-red-100">
                    <p className="text-xs font-bold text-red-500 mb-2 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      隣の席にしたくない生徒を選択:
                    </p>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                      {students
                        .filter((s) => s.id !== student.id) // 選択されている生徒自身は除外する
                        .map((other) => {
                          // 相性が悪い生徒に選択されているか状態を定義
                          const isSelected = student.badChemistryWith.includes(other.id);
                          return (
                            <button
                              key={other.id}
                              onClick={() => toggleBadChemistry(student, other.id)}
                              className={`cursor-pointer px-2 py-1 text-xs rounded-md border transition-all ${
                                isSelected
                                  ? 'bg-red-500 text-white border-red-600 shadow-sm'
                                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              {other.name}
                              {isSelected && <Check className="w-3 h-3 inline ml-1" />}
                            </button>
                          );
                        })}
                    </div>
                  </div>
                )}
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
    )
  );
};

export default StudentsManager;
