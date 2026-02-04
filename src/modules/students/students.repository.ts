import { supabase } from '../../lib/supabase';
import type { Student } from '../../type';

export const studentsRepository = {
  // 保存したstudentsの名前を取得する
  async fetchStudents(userId: string) {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('user_id', userId)
      .order('create_at', { ascending: true });
    if (data == null || error != null) throw new Error(error.message);

    // genderがどの性別かチェックする関数を作成する
    isGender = (gender:string)=>{}
    // DBの項目のsnake_case→appの項目のcamelcaseへ変換
    const formattedStudents: Student[] = data.map((s) => ({
      id: s.id,
      name: s.name,
      gender: 'boy' | 'girl' | 'other',
      needsFrontRow: s.needs_front_row ?? false,
      // DBの項目が配列かどうかチェックする。falseなら空配列
      badChemistryWith: Array.isArray(s.bad_chemistry_with)
        ? (s.bad_chemistry_with as string[])
        : [],
    }));
  },
  // 生徒の追加
  // 生徒の更新
  // 生徒の削除
};
