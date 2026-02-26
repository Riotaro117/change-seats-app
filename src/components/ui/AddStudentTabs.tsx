import { useState } from 'react';
import type { Tab } from '../../type';
import ImportExcelFile from './ImportExcelFile';
import InputStudent from './InputStudent';

const tabs: Tab[] = [
  { id: 1, label: '直接入力', content: <InputStudent /> },
  { id: 2, label: 'Excelで取り込み', content: <ImportExcelFile /> },
];

const AddStudentTabs = () => {
  const [activeTab, setActiveTab] = useState(1);
  return (
    <div className="relative w-full max-w-3xl mx-auto mb-2">
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
                font-bold
                border-4 rounded-t-xl mx-1
                transition-all duration-300
                backdrop-blur-md
                ${
                  isActive
                    ? `
                      text-wood-900 font-bold
                      border-transparent
                      bg-wood-100
                    `
                    : `
                      text-gray-400
                      border-transparent
                      bg-gray-100
                      hover:bg-wood-100
                      hover:text-wood-900
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
              p-2
              leading-relaxed
              rounded-t-sm
              rounded-b-2xl
              bg-wood-100
              relative z-20
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
