import type { Database } from '../../../database.types';
import { supabase } from '../../lib/supabase';
import type { Student } from '../../type';

// 型ガード
const isGender = (value: string): value is Student['gender'] =>
  value === 'boy' || value === 'girl' || value === 'other';

// Json[]をstring[]に変換
const toStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === 'string');
};

// データベースのstudentsテーブルの型を持ってくる
type StudentRow = Database['public']['Tables']['students']['Row'];
const formatStudent = (data: StudentRow): Student => {
  return {
    id: data.id,
    name: data.name,
    gender: isGender(data.gender) ? data.gender : 'other',
    needsFrontRow: data.needs_front_row ?? false,
    badChemistryWith: toStringArray(data.bad_chemistry_with),
  };
};

export const studentsRepository = {
  // 保存したstudentsの名前を取得する
  async fetchStudents(userId: string) {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });
    if (!data || error) throw new Error(error.message);

    const formattedStudents = data.map(formatStudent);
    return formattedStudents;
  },

  // 生徒の追加 idについてはDBが自動作成するものなので省略している
  async addStudent(userId: string, student: Omit<Student, 'id'>) {
    const { data, error } = await supabase
      .from('students')
      .insert({
        user_id: userId, // 作成者のid
        name: student.name,
        gender: student.gender,
        needs_front_row: student.needsFrontRow, // キーはDBの表記に合わせること
        bad_chemistry_with: student.badChemistryWith,
      })
      .select()
      .single();
    if (!data || error) throw new Error(error.message);
    return formatStudent(data);
  },

  // 生徒の更新
  async updateStudent(userId: string, student: Student) {
    const { data, error } = await supabase
      .from('students')
      .update({
        name: student.name,
        gender: student.gender,
        needs_front_row: student.needsFrontRow,
        bad_chemistry_with: student.badChemistryWith,
      })
      .eq('id', student.id)
      .eq('user_id', userId)
      .select()
      .single();
    if (!data || error) throw new Error(error.message);

    return formatStudent(data);
  },
  
  // 生徒の削除
  async deleteStudent(userId: string, student: Student) {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', student.id)
      .eq('user_id', userId);
    if (error) throw new Error(error.message);
  },

  // 全ての生徒の削除
  async deleteAllStudents(userId: string) {
    const { error } = await supabase.from('students').delete().eq('user_id', userId);
    if (error) throw new Error(error.message);
  },

  // テンプレ生徒の追加
  async insertTemplateStudents(userId: string) {
    const templateStudents = [
      {
        user_id: userId,
        name: '織田信長',
        gender: 'boy',
        needs_front_row: false,
        bad_chemistry_with: [],
      },
      {
        user_id: userId,
        name: '徳川家康',
        gender: 'boy',
        needs_front_row: true,
        bad_chemistry_with: [],
      },
      {
        user_id: userId,
        name: '北条政子',
        gender: 'girl',
        needs_front_row: false,
        bad_chemistry_with: [],
      },
      {
        user_id: userId,
        name: 'お市',
        gender: 'girl',
        needs_front_row: false,
        bad_chemistry_with: [],
      },
      {
        user_id: userId,
        name: '与謝野晶子',
        gender: 'girl',
        needs_front_row: true,
        bad_chemistry_with: [],
      },
      {
        user_id: userId,
        name: '推古天皇',
        gender: 'girl',
        needs_front_row: false,
        bad_chemistry_with: [],
      },
      {
        user_id: userId,
        name: 'ジャンヌダルク',
        gender: 'girl',
        needs_front_row: false,
        bad_chemistry_with: [],
      },
      {
        user_id: userId,
        name: '中臣鎌足',
        gender: 'boy',
        needs_front_row: true,
        bad_chemistry_with: [],
      },
      {
        user_id: userId,
        name: '行基',
        gender: 'boy',
        needs_front_row: true,
        bad_chemistry_with: [],
      },
      {
        user_id: userId,
        name: '卑弥呼',
        gender: 'girl',
        needs_front_row: false,
        bad_chemistry_with: [],
      },
      {
        user_id: userId,
        name: '坂本龍馬',
        gender: 'boy',
        needs_front_row: false,
        bad_chemistry_with: [],
      },
      {
        user_id: userId,
        name: '豊臣秀吉',
        gender: 'boy',
        needs_front_row: false,
        bad_chemistry_with: [],
      },
      {
        user_id: userId,
        name: 'ザビエル',
        gender: 'boy',
        needs_front_row: false,
        bad_chemistry_with: [],
      },
      {
        user_id: userId,
        name: 'マリーアントワネット',
        gender: 'girl',
        needs_front_row: false,
        bad_chemistry_with: [],
      },
      {
        user_id: userId,
        name: '紫式部',
        gender: 'girl',
        needs_front_row: false,
        bad_chemistry_with: [],
      },
      {
        user_id: userId,
        name: '石川五右衛門',
        gender: 'boy',
        needs_front_row: false,
        bad_chemistry_with: [],
      },
      {
        user_id: userId,
        name: '武田信玄',
        gender: 'boy',
        needs_front_row: false,
        bad_chemistry_with: [],
      },
      {
        user_id: userId,
        name: '上杉謙信',
        gender: 'boy',
        needs_front_row: true,
        bad_chemistry_with: [],
      },
      {
        user_id: userId,
        name: '北条氏康',
        gender: 'boy',
        needs_front_row: true,
        bad_chemistry_with: [],
      },
      {
        user_id: userId,
        name: '今川義元',
        gender: 'boy',
        needs_front_row: false,
        bad_chemistry_with: [],
      },
      {
        user_id: userId,
        name: '明智光秀',
        gender: 'boy',
        needs_front_row: true,
        bad_chemistry_with: [],
      },
      {
        user_id: userId,
        name: '黒田官兵衛',
        gender: 'boy',
        needs_front_row: false,
        bad_chemistry_with: [],
      },
      {
        user_id: userId,
        name: '清少納言',
        gender: 'girl',
        needs_front_row: true,
        bad_chemistry_with: [],
      },
      {
        user_id: userId,
        name: 'ねね',
        gender: 'girl',
        needs_front_row: false,
        bad_chemistry_with: [],
      },
      {
        user_id: userId,
        name: '細川ガラシャ',
        gender: 'girl',
        needs_front_row: true,
        bad_chemistry_with: [],
      },
      {
        user_id: userId,
        name: '巴御前',
        gender: 'girl',
        needs_front_row: false,
        bad_chemistry_with: [],
      },
      {
        user_id: userId,
        name: 'マザーテレサ',
        gender: 'girl',
        needs_front_row: false,
        bad_chemistry_with: [],
      },
      {
        user_id: userId,
        name: '野口英世',
        gender: 'boy',
        needs_front_row: false,
        bad_chemistry_with: [],
      },
      {
        user_id: userId,
        name: '福沢諭吉',
        gender: 'boy',
        needs_front_row: false,
        bad_chemistry_with: [],
      },
      {
        user_id: userId,
        name: '真田幸村',
        gender: 'boy',
        needs_front_row: false,
        bad_chemistry_with: [],
      },
    ];
    const { error } = await supabase.from('students').insert(templateStudents);
    if (error) throw new Error(error.message);
  },

  // Excelでデータを取り込んだ時のデータ登録
  async insertExcelFile(
    userId: string,
    studentToInsert: {
      name: string;
    }[],
  ) {
    const formattedStudents = studentToInsert
      .filter((s) => s.name && s.name.trim() !== '')
      .map((s) => ({
        user_id: userId,
        name: s.name.trim(),
        gender: 'boy',
        needs_front_row: false,
        bad_chemistry_with: [],
      }));
    const { error } = await supabase.from('students').insert(formattedStudents);
    if (error) throw new Error(error.message);
  },
};
