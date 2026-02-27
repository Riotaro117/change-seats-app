import * as XLSX from 'xlsx';
import { useCurrentUserStore } from '../../modules/auth/current-user.state';
import { useNavigate } from 'react-router';
import { studentsRepository } from '../../modules/students/students.repository';
import { useAuth } from '../../contexts/useAuth';
import { AlertTriangle, Download, Loader2, Plus } from 'lucide-react';

const ImportExcelFile = () => {
  const { currentUser } = useCurrentUserStore();
  const navigate = useNavigate();
  const { isLoading, setIsLoading } = useAuth();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // 連打禁止
    if (isLoading) return;
    if (!currentUser) return;
    if (currentUser.is_anonymous) {
      const ok = window.confirm('この機能はユーザー登録者限定です。ユーザー登録しますか？');
      if (ok) {
        navigate('/updateUser', { replace: true });
      }
      return;
    }
    setIsLoading(true);

    // input type="file"で選ばれたファイルを取得
    const file = e.target.files?.[0]; //[0]とすることで選択したファイルを取得できる
    if (!file) return;

    // excelファイルをバイナリデータに変換
    const data = await file.arrayBuffer();
    // XLSXがexcelデータを解析
    const workbook = XLSX.read(data);

    // 1番目のシート名を取得→データ取得
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Excel→Json配列へ変換
    const jsonData = XLSX.utils.sheet_to_json<{ name: string }>(worksheet);

    try {
      await studentsRepository.insertExcelFile(currentUser.id, jsonData);
      alert('生徒名簿に登録が成功しました');
    } catch (error) {
      console.error(error);
      alert('登録に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 bg-wood-50 p-4 rounded-xl border border-wood-100">
      <a
        href="/students_name_template.xlsx"
        download
        className="max-w-md rounded-xl border-2 border-wood-200 p-3 flex items-center gap-3 bg-white hover:bg-wood-50 rounded-lg"
      >
        Excelテンプレートをダウンロード
        <Download className="w-5 h-5" />
      </a>
      <div className="flex flex-col items-center gap-3">
        {/* 実際のinput（隠す） */}
        <input id='file-upload' type="file" accept=".xlsx" className="hidden" onChange={handleFile} />

        {/* カスタムボタン */}
        <label
          htmlFor="file-upload"
          className="
          px-6 py-3 flex items-center gap-2
          cursor-pointer
          rounded-xl font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95 bg-wood-600 text-white hover:bg-wood-700 shadow-wood-800/20
        "
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
          ファイルを選択し、生徒を追加
        </label>
      </div>
      <div className='mt-2 flex gap-2 justify-center items-center text-red-500 text-sm'><AlertTriangle/>必ずテンプレートファイルを編集し、選択して下さい。</div>
    </div>
  );
};

export default ImportExcelFile;
