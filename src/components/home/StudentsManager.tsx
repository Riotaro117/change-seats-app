import {
  AlertTriangle,
  Check,
  CircleUserRound,
  Glasses,
  Pencil,
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
import { useNavigate } from 'react-router';
import AddStudentTabs from '../ui/AddStudentTabs';
import { useAuth } from '../../contexts/useAuth';

interface StudentManagerProps {
  frontRowLimit: number;
  setFrontRowLimit: React.Dispatch<React.SetStateAction<number>>;
}

const StudentsManager: React.FC<StudentManagerProps> = ({ frontRowLimit, setFrontRowLimit }) => {
  const { viewMode, setViewMode } = useViewModeStore();
  const { students, setStudents } = useStudentsStore();
  const { currentUser } = useCurrentUserStore();

  // DBとの通信の状態
  const { isLoading, setIsLoading } = useAuth();
  // 編集しているidの状態
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingNameId, setEditingNameId] = useState<string | null>(null);

  const [editingName, setEditingName] = useState('');

  const navigate = useNavigate();

  // 生徒の名前を更新する処理
  const handleUpdateName = async (student: Student, editingName: string) => {
    if (!editingName.trim()) return;
    try {
      const updateStudent = { ...student, name: editingName };
      const data = await studentsRepository.updateStudent(currentUser!.id, updateStudent);
      setStudents((prev) => prev.map((s) => (s.id === student.id ? data : s)));
    } catch (error) {
      console.error(error);
      alert('更新に失敗しました');
    } finally {
      setEditingNameId(null);
    }
  };

  // 生徒の性別を更新する処理
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

  // 視力のオンオフを更新する関数
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
    setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  // 仮登録の人は使えないようにする
  const handleAllRemove = async () => {
    if (!currentUser) return;
    if (currentUser.is_anonymous) {
      const ok = window.confirm('この機能はユーザー登録者限定です。ユーザー登録しますか？');
      if (ok) {
        navigate('/updateUser', { replace: true });
      }
      return;
    }
    if (!confirm('全ての生徒を本当に削除しますか？')) return;
    setIsLoading(true);
    try {
      await studentsRepository.deleteAllStudents(currentUser!.id);
      setStudents([]);
    } catch (error) {
      console.error(error);
      alert('削除に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    viewMode === 'students' && (
      <>
        <div className="bg-white rounded-3xl shadow-xl border-4 border-wood-200 p-6 h-full flex flex-col max-w-4xl mx-auto">
          <div className="mb-6">
            <div className="flex justify-between">
              <h2 className="text-2xl font-bold font-serif flex items-center gap-2">
                <Users className="w-6 h-6 text-wood-500" />
                生徒名簿
              </h2>
              <button
                onClick={() => setViewMode('classroom')}
                disabled={isLoading}
                className="cursor-pointer px-4 py-2 rounded-xl font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95 bg-white text-wood-800 border-2 border-wood-200 hover:border-wood-400 hover:bg-wood-50"
              >
                完了
              </button>
            </div>
            <div className="p-5 bg-wood-100 border border-wood-200 rounded-xl mt-2 text-wood-800">
              <h3 className="p-1 w-fit font-bold bg-wood-50 border border-wood-200 rounded-lg">
                席替えについて
              </h3>
              <ul className="flex flex-col gap-3 mt-2">
                <li className="text-sm">
                  1. 基本的に男女が交互に座ります。
                  <br />
                  <span className="text-red-400">
                    ( 比率が均等でない場合は同性で座ることもあります。 )
                  </span>
                </li>
                <li className="text-sm">
                  2. 前列希望は、前から
                  <select
                    value={frontRowLimit}
                    className="cursor-pointer p-2 w-27 text-sm border border-wood-200 bg-white rounded-lg"
                    onChange={(e) => setFrontRowLimit(Number(e.target.value))}
                  >
                    <option value={1}>1列目まで</option>
                    <option value={2}>2列目まで</option>
                    <option value={3}>3列目まで</option>
                  </select>
                  に座ります。
                  <br />
                  <span className="text-red-400">
                    ( 席数に対して希望者が超過するとできません。 )
                  </span>
                </li>
                <li className="text-sm">3. NG設定は、NG相手と前後左右を避けて座ります。</li>
              </ul>
            </div>
          </div>
          <AddStudentTabs />

          <div className="p-3 mt-3 mb-2 rounded-lg bg-wood-100 flex items-center justify-between">
            <p className="px-8 text-wood-800 font-bold text-md bg-white rounded-lg">
              現在の人数: 計 {students.length}名
            </p>
            <div className="flex gap-2 items-center">
              <span className="p-1 text-sm bg-blue-100 text-blue-800 rounded-lg">
                男子: {students.filter((s) => s.gender === 'boy').length}名
              </span>
              <span className="p-1 text-sm bg-red-100 text-red-800 rounded-lg">
                女子: {students.filter((s) => s.gender === 'girl').length}名
              </span>
            </div>
          </div>

          <div
            className={`flex-1 overflow-y-auto pr-2 space-y-3 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
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
                    <div className="flex items-center gap-2">
                      {editingNameId === student.id ? (
                        <input
                          value={editingName}
                          className="bg-white border border-wood-200"
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleUpdateName(student, editingName);
                            }
                          }}
                        />
                      ) : (
                        <span className="font-bold text-lg text-wood-900">{student.name}</span>
                      )}
                      <button
                        onClick={() => {
                          setEditingNameId(student.id);
                          setEditingName(student.name);
                        }}
                      >
                        <Pencil className="cursor-pointer w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex gap-2 sm:hidden mt-1">
                      <button
                        onClick={() => handleUpdateGender(student, 'boy')}
                        disabled={isLoading}
                        className={`cursor-pointer text-xs px-2 py-0.5 rounded border ${student.gender === 'boy' ? 'bg-blue-100 border-blue-300 text-blue-700' : 'border-gray-200 text-gray-400'}`}
                      >
                        男
                      </button>
                      <button
                        onClick={() => handleUpdateGender(student, 'girl')}
                        disabled={isLoading}
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
                      disabled={isLoading}
                      className={`cursor-pointer p-1.5 rounded-md transition-all ${student.gender === 'boy' ? 'bg-blue-100 text-blue-600 shadow-sm' : 'text-gray-300 hover:text-gray-500'}`}
                      title="男子"
                    >
                      <CircleUserRound className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleUpdateGender(student, 'girl')}
                      disabled={isLoading}
                      className={`cursor-pointer p-1.5 rounded-md transition-all ${student.gender === 'girl' ? 'bg-pink-100 text-pink-600 shadow-sm' : 'text-gray-300 hover:text-gray-500'}`}
                      title="女子"
                    >
                      <CircleUserRound className="w-5 h-5" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleToggleProperty(student, 'needsFrontRow')}
                    disabled={isLoading}
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
                      disabled={isLoading}
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
                    disabled={isLoading}
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
                              disabled={isLoading}
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
          <button
            className="flex cursor-pointer mt-3 items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95 bg-white text-red-800 border-2 border-red-200 hover:border-red-400 hover:bg-red-50"
            onClick={handleAllRemove}
            disabled={isLoading}
          >
            <AlertTriangle />
            全ての生徒を削除
          </button>
        </div>
      </>
    )
  );
};

export default StudentsManager;
