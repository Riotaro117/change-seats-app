import { LogOut } from 'lucide-react';
import { authRepository } from '../../modules/auth/auth.repository';
import { useCurrentUserStore } from '../../modules/auth/current-user.state';
import { useViewModeStore } from '../../modules/viewMode/viewMode.state';
import iconSeatTree from '../assets/icon_seat_tree.png';

const Header: React.FC = () => {
  const { setViewMode } = useViewModeStore();
  const { currentUser, setUser } = useCurrentUserStore();
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
          <div className="w-15 h-15">
            <img src={iconSeatTree} alt="Seat Tree" />
          </div>
          <div className="">
            <h1 className="text-xl font-bold font-serif">
              Seat Tree
              <span className="text-[15px]">-配慮できる席替えアプリ-</span>
            </h1>
            <p className="bg-orange-100 rounded-lg text-sm font-bold font-serif text-center">
              {currentUser!.user_metadata.name ? (
                <p className="bg-orange-100 rounded-lg text-sm font-bold font-serif text-center">
                  `${currentUser!.user_metadata.name}先生`
                </p>
              ) : (
                <p className="bg-red-400 rounded-lg text-sm font-bold font-serif text-center">
                  本登録をしていません
                </p>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={signout}
            className="cursor-pointer bg-transparent text-wood-600 hover:bg-wood-100 !shadow-none hidden sm:inline-flex"
          >
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
