import { ChevronDown, ChevronUp } from 'lucide-react';

interface SideButtonProps {
  onResize: (size: number) => void;
  totalSeats: number;
  cols: number;
  onCols: (col: number) => void
}

const SideButton: React.FC<SideButtonProps> = ({ onResize, totalSeats,cols,onCols }) => {
  return (
    <div className="flex gap-5 fixed bottom-6 right-6 md:hidden">
      <div className="bg-white p-2 rounded-full shadow-xl border-2 border-wood-200 flex flex-col gap-2">
        <button
          onClick={() => onResize(Math.min(45, totalSeats + 1))}
          className="cursor-pointer p-2 bg-wood-100 rounded-full hover:bg-wood-200"
        >
          <ChevronUp />
        </button>
        <span className="text-center font-bold text-xs">計 {totalSeats} 席</span>
        <button
          onClick={() => onResize(Math.max(20, totalSeats - 1))}
          className="cursor-pointer p-2 bg-wood-100 rounded-full hover:bg-wood-200"
        >
          <ChevronDown />
        </button>
      
      </div>
      <div className="bg-white p-2 rounded-full shadow-xl border-2 border-wood-200 flex flex-col gap-2">
        <button
          onClick={() => onCols(Math.min(8, cols + 1))}
          className="cursor-pointer p-2 bg-wood-100 rounded-full hover:bg-wood-200"
        >
          <ChevronUp />
        </button>
        <span className="text-center font-bold text-xs">{cols}列</span>
        <button
          onClick={() => onCols(Math.max(6, cols - 1))}
          className="cursor-pointer p-2 bg-wood-100 rounded-full hover:bg-wood-200"
        >
          <ChevronDown />
        </button>
      
      </div>
    </div>
  );
};

export default SideButton;
