import { useViewModeStore } from '../../modules/viewMode/viewMode.state';

const Settings = () => {
  const { viewMode, setViewMode } = useViewModeStore();
  return (
    viewMode === 'settings' && (
      <>
        <div className="bg-white rounded-3xl shadow-xl border-4 border-wood-200 p-6 h-full flex flex-col max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-wood-800 font-serif">座席設定</h2>
              <p className="text-wood-500 text-sm">
                この画面では、席替えをしたときに使用しない座席を設定することができます。
              </p>
            </div>
            <button
              onClick={() => setViewMode('classroom')}
              className="cursor-pointer items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95 bg-white text-wood-800 border-2 border-wood-200 hover:border-wood-400 hover:bg-wood-50"
            >
              完了
            </button>
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

export default Settings;
