import { ImageIcon, Save, Shuffle, Users } from 'lucide-react';

const ClassroomButton = () => {
  return (
    <div className="flex flex-wrap gap-4 justify-center mb-8 sticky top-20 z-20 py-2 bg-wood-50/90 backdrop-blur-sm rounded-xl">
      {/* <Button
              onClick={handleRandomize}
              icon={<Shuffle className="w-5 h-5" />}
              className="shadow-md"
            >
              席替え実行
            </Button> */}
      <button className="shadow-md">
        <Shuffle className="w-5 h-5" />
        席替え実行
      </button>
      {/* <Button
              variant="secondary"
              onClick={() => setViewMode('students')}
              icon={<Users className="w-5 h-5" />}
            >
              名簿・条件
            </Button> */}
      <button>
        <Users className="w-5 h-5" />
        名簿・条件
      </button>
      {/* <Button
              variant="secondary"
              onClick={() => setViewMode('history')}
              icon={<ImageIcon className="w-5 h-5" />}
            >
              アルバム
            </Button> */}
      <button>
        <ImageIcon className="w-5 h-5" />
        アルバム
      </button>
      {/* <Button
              variant="secondary"
              onClick={saveCurrentLayout}
              icon={<Save className="w-5 h-5" />}
            >
              保存
            </Button> */}
      <button>
        <Save className="w-5 h-5" />
        保存
      </button>
    </div>
  );
};

export default ClassroomButton;
