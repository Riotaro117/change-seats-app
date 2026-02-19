import { ImageIcon, Printer, Save, Settings, Shuffle, Users } from 'lucide-react';
import { useViewModeStore } from '../../modules/viewMode/viewMode.state';
import type { UseReactToPrintFn } from 'react-to-print';
import { useAuth } from '../../contexts/useAuth';

interface ClassroomButtonsProps {
  onRandomize: () => void;
  onTransitionSetting: () => void;
  onSaveCurrentLayout: () => Promise<void>;
  onPrintCurrentLayout: UseReactToPrintFn;
}

const ClassroomButtons: React.FC<ClassroomButtonsProps> = ({
  onRandomize,
  onTransitionSetting,
  onSaveCurrentLayout,
  onPrintCurrentLayout,
}) => {
  const { setViewMode } = useViewModeStore();
  const { isLoading } = useAuth();
  return (
    <div className="flex flex-wrap gap-4 justify-center mb-8 sticky top-20 z-20 py-2 bg-wood-50/90 backdrop-blur-sm rounded-xl">
      <button
        className="cursor-pointer items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95 bg-wood-600 text-white hover:bg-wood-700 shadow-wood-800/20 shadow-md"
        onClick={onRandomize}
        disabled={isLoading}
      >
        <Shuffle className="w-5 h-5" />
        席替え実行
      </button>
      <button
        className="cursor-pointer items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95 bg-white text-wood-800 border-2 border-wood-200 hover:border-wood-400 hover:bg-wood-50 shadow-md"
        onClick={onTransitionSetting}
        disabled={isLoading}
      >
        <Settings className="w-5 h-5" />
        座席設定
      </button>
      <button
        className="cursor-pointer items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95 bg-white text-wood-800 border-2 border-wood-200 hover:border-wood-400 hover:bg-wood-50 shadow-md"
        onClick={() => setViewMode('students')}
      >
        <Users className="w-5 h-5" />
        生徒名簿
      </button>
      <button
        className="cursor-pointer items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95 bg-white text-wood-800 border-2 border-wood-200 hover:border-wood-400 hover:bg-wood-50 shadow-md"
        onClick={() => setViewMode('history')}
        disabled={isLoading}
      >
        <ImageIcon className="w-5 h-5" />
        履歴
      </button>
      <button
        className="cursor-pointer items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95 bg-white text-wood-800 border-2 border-wood-200 hover:border-wood-400 hover:bg-wood-50 shadow-md"
        onClick={onSaveCurrentLayout}
        disabled={isLoading}
      >
        <Save className="w-5 h-5" />
        保存
      </button>
      <button
        className="cursor-pointer items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95 bg-white text-wood-800 border-2 border-wood-200 hover:border-wood-400 hover:bg-wood-50 shadow-md"
        onClick={onPrintCurrentLayout}
        disabled={isLoading}
      >
        <Printer className="w-5 h-5" />
        印刷
      </button>
    </div>
  );
};

export default ClassroomButtons;
