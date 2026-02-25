import * as XLSX from 'xlsx';

const ImportExcelFile = () => {
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; //[0]とすることで選択したファイルを取得できる
    if (!file) return;

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const jsonData = XLSX.utils.sheet_to_json(worksheet);

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
