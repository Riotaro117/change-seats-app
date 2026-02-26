import { useState } from 'react';
import type { Tab } from '../../type';
import ImportExcelFile from './ImportExcelFile';
import InputStudent from './InputStudent';

const tabs: Tab[] = [
  { id: 1, label: '直接入力', content: <InputStudent/> },
  { id: 2, label: 'Excelで入力', content: <ImportExcelFile /> },
];

const AddStudentTabs = () => {
  const [activeTab, setActiveTab] = useState(1);
  return (
    <div className="relative w-full max-w-3xl mx-auto">
      {/* タブメニュー */}
      <ul className="flex relative z-20">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <li
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 px-6 py-4 text-center cursor-pointer relative
                font-medium tracking-wide
                border-[3px] rounded-t-xl mx-[2px]
                transition-all duration-300
                backdrop-blur-md
                ${
                  isActive
                    ? `
                      text-white font-semibold
                      bg-gradient-to-br from-indigo-500 to-purple-600
                      border-indigo-500
                      -translate-y-[2px]
                      shadow-[0_-4px_16px_rgba(102,126,234,0.3)]
                    `
                    : `
                      text-gray-500
                      border-transparent
                      bg-white/60
                      hover:text-indigo-500
                      hover:bg-white/90
                      hover:border-indigo-300
                      hover:-translate-y-[1px]
                      hover:shadow-md
                    `
                }
              `}
            >
              {tab.label}
            </li>
          );
        })}
      </ul>

      {/* コンテンツ */}
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <div
            key={tab.id}
            className={`
              p-8 min-h-[180px]
              text-gray-700 leading-relaxed
              border-[3px] border-indigo-500 border-t-0
              rounded-b-2xl
              bg-white
              relative z-20
              -mt-[3px] mx-[2px]
              transition-all duration-300
              ${isActive ? 'block animate-fadeIn' : 'hidden'}
            `}
          >
            {tab.content}
          </div>
        );
      })}
    </div>
  );
};

export default AddStudentTabs;
