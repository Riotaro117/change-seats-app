import * as XLSX from 'xlsx';
import { useCurrentUserStore } from '../../modules/auth/current-user.state';
import { useNavigate } from 'react-router';

const ImportExcelFile = () => {
  const { currentUser } = useCurrentUserStore();
  const navigate = useNavigate();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentUser) return;
    if (currentUser.is_anonymous) {
      const ok = window.confirm('この機能はユーザー登録者限定です。ユーザー登録しますか？');
      if (ok) {
        navigate('/updateUser', { replace: true });
      }
      return;
    }

    const file = e.target.files?.[0]; //[0]とすることで選択したファイルを取得できる
    if (!file) return;

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const jsonData = XLSX.utils.sheet_to_json<{ name: string }>(worksheet);

    console.log(jsonData);
  };
  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-6 bg-wood-50 p-4 rounded-xl border border-wood-100">
      <p>Excelファイルをインポートして追加する</p>
      <a href="/students_name_template.xlsx" download>
        Excelテンプレートをダウンロード
      </a>
      <input type="file" accept=".xlsx" onChange={handleFile} />
    </div>
  );
};

export default ImportExcelFile;
