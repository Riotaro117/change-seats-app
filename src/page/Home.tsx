import { useState } from 'react';
import Header from '../components/layout/Header';
import MainContents from '../components/home/MainContents';
import SideButton from '../components/ui/SideButton';
import { ChevronDown, ChevronUp } from 'lucide-react';

const Home = () => {
  // 画面表示の切り替え
  const [viewMode, setViewMode] = useState('classroom');
  const [totalSeats, setTotalSeats] = useState(30);

  const handleResize = () => {};
  const signout = () => {};
  return (
    <div className="min-h-screen bg-wood-50 text-wood-900 pb-20 font-sans">
      <Header setViewMode={setViewMode} />
      <MainContents />
      <div className="fixed bottom-6 right-6 md:hidden">
        <div className="bg-white p-2 rounded-full shadow-xl border-2 border-wood-200 flex flex-col gap-2">
          <button
            // onClick={() => handleResize(Math.min(40, totalSeats + 1))}
            className="p-2 bg-wood-100 rounded-full hover:bg-wood-200"
          >
            <ChevronUp />
          </button>
          <span className="text-center font-bold text-xs">{totalSeats}</span>
          {/* <span className="text-center font-bold text-xs">{30}</span> */}
          <button
            // onClick={() => handleResize(Math.max(20, totalSeats - 1))}
            className="p-2 bg-wood-100 rounded-full hover:bg-wood-200"
          >
            <ChevronDown />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
