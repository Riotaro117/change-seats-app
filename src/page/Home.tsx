import { useState } from 'react';
import Header from '../components/layout/Header';

const Home = () => {
  // 画面表示の切り替え
  const [viewMode, setViewMode] = useState('classroom');

  const handleResize = () => {};
  const signout = () => {};
  return (
    <div className="min-h-screen bg-wood-50 text-wood-900 pb-20 font-sans">
    <Header/>
    </div>
  );
};

export default Home;
