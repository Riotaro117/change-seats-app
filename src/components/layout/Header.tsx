import { LogOut } from 'lucide-react';
import { authRepository } from '../../modules/auth/auth.repository';
import { useCurrentUserStore } from '../../modules/auth/current-user.state';
import { useViewModeStore } from '../../modules/viewMode/viewMode.state';
import iconSeatTree from '../assets/icon_seat_tree.webp';
import { useNavigate } from 'react-router';

const Header: React.FC = () => {
  const { setViewMode } = useViewModeStore();
  const { currentUser, setUser } = useCurrentUserStore();
  const navigate = useNavigate();
  const signout = async () => {
    await authRepository.signout();
    setUser(null);
  };
  const updateUser = () => {
    if (window.confirm('お試し版からユーザー登録に切り替えますか？')) {
      navigate('/updateUser', { replace: true });
    }
    return;
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
              <span className="text-[15px] hidden sm:inline">-配慮できる席替えアプリ-</span>
            </h1>
            <div className="bg-orange-100 rounded-lg text-sm font-bold font-serif text-center">
              {!currentUser!.is_anonymous ? (
                <p className="bg-orange-100 rounded-lg text-sm font-bold font-serif text-center">
                  {currentUser!.user_metadata.name}先生
                </p>
              ) : (
                <p
                  onClick={updateUser}
                  className="px-1 bg-red-400 rounded-lg text-sm font-bold font-serif text-center hover:bg-red-600"
                >
                  ユーザー登録はこちらから！！
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={signout}
            className="cursor-pointer bg-transparent text-wood-600 hover:bg-wood-100 !shadow-none hidden sm:inline-flex"
          >
            {currentUser!.is_anonymous ? 'トップへ戻る' : 'ログアウト'}
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
