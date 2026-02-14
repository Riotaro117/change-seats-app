import { ChevronDown, ChevronUp } from 'lucide-react';

interface SideButtonProps {
  onResizeSeats: (size: number) => void;
  totalSeats: number;
  cols: number;
  setCols: React.Dispatch<React.SetStateAction<number>>;
}

const SideButton: React.FC<SideButtonProps> = ({ onResizeSeats, totalSeats, cols, setCols }) => {
  return (
    <div className="flex gap-[5px] fixed bottom-6 right-6 md:hidden">
      <div className="bg-white p-2 rounded-full shadow-xl border-2 border-wood-200 flex flex-col gap-2">
        <button
          onClick={() => onResizeSeats(Math.min(48, totalSeats + 1))}
          className="cursor-pointer p-2 bg-wood-100 rounded-full hover:bg-wood-200"
        >
          <ChevronUp />
        </button>
        <span className="text-center font-bold text-xs">{totalSeats} 席</span>
        <button
          onClick={() => onResizeSeats(Math.max(24, totalSeats - 1))}
          className="cursor-pointer p-2 bg-wood-100 rounded-full hover:bg-wood-200"
        >
          <ChevronDown />
        </button>
      </div>
      <div className="bg-white p-2 rounded-full shadow-xl border-2 border-wood-200 flex flex-col gap-2">
        <button
          onClick={() => setCols(Math.min(8, cols + 1))}
          className="cursor-pointer p-2 bg-wood-100 rounded-full hover:bg-wood-200"
        >
          <ChevronUp />
        </button>
        <span className="text-center font-bold text-xs">{cols}列</span>
        <button
          onClick={() => setCols(Math.max(4, cols - 1))}
          className="cursor-pointer p-2 bg-wood-100 rounded-full hover:bg-wood-200"
        >
          <ChevronDown />
        </button>
      </div>
    </div>
  );
};

export default SideButton;
