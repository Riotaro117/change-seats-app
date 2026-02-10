import { ChevronDown, ChevronUp, LogOut } from 'lucide-react';
import { authRepository } from '../../modules/auth/auth.repository';
import { useCurrentUserStore } from '../../modules/auth/current-user.state';
import { useViewModeStore } from '../../modules/viewMode/viewMode.state';

interface HeaderProps {
  onResize: (size: number) => void;
  totalSeats: number;
}

const Header: React.FC<HeaderProps> = ({ onResize, totalSeats }) => {
  const { setViewMode } = useViewModeStore();
  const { setUser } = useCurrentUserStore();
  const signout = async () => {
    await authRepository.signout();
    setUser(undefined);
  };
  return (
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
              onClick={() => onResize(Math.max(20, totalSeats - 1))}
              className="p-1 hover:bg-wood-200 rounded"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-mono">{totalSeats}</span>
            <button
              onClick={() => onResize(Math.min(40, totalSeats + 1))}
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
  );
};

export default Header;
