import { supabase } from '../../lib/supabase';
import type { ClassroomLayout, Seat, Student } from '../../type';

export const layoutsRepository = {
  // 保存した座席を取得する
  async fetchLayouts(userId: string) {
    const { data, error } = await supabase
      .from('layouts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);
    if (data == null || error != null) throw new Error(error.message);
    // supabase形式をClassroomLayout[]の型になるように変換
    const formattedLayouts: ClassroomLayout[] = (data || []).map((layout) => ({
      ...layout,
      seats: layout.seats as Seat[],
      students: layout.students as Student[],
    }));
    return formattedLayouts;
  },
  // 座席を保存する
  // 座席を削除する
};
