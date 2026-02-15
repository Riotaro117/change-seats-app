import { supabase } from '../../lib/supabase';
import type { Student } from '../../type';

export const studentsRepository = {
  // 保存したstudentsの名前を取得する
  async fetchStudents(userId: string) {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true }); // 作成順で並び替え→名前順の方がいい？
    if (!data || error) throw new Error(error.message);

    // genderがどの性別かチェックする関数を作成する
    const isGender = (value: string): value is Student['gender'] =>
      value === 'boy' || value === 'girl' || value === 'other';

    // DBの項目のsnake_case→appの項目のcamelcaseへ変換
    const formattedStudents: Student[] = (data || []).map((s) => ({
      id: s.id,
      name: s.name,
      gender: isGender(s.gender) ? s.gender : 'other',
      needsFrontRow: s.needs_front_row ?? false,
      // DBの項目が配列かどうかチェックする。falseなら空配列
      badChemistryWith: Array.isArray(s.bad_chemistry_with)
        ? (s.bad_chemistry_with as string[])
        : [],
    }));

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
    return data;
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
    return data;
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
};
