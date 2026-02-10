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
  async createLayout(userId: string, layout: Omit<ClassroomLayout, 'id'>) {
    const { data, error } = await supabase
      .from('layouts')
      .insert({
        user_id: userId, // 作成者
        name: layout.name,
        date: new Date().toLocaleDateString(),
        rows: layout.rows,
        cols: layout.cols,
        seats: layout.seats,
        students: layout.students,
      })
      .select()
      .single();
    if (data == null || error != null) throw new Error(error.message);
    return data;
  },
  // 座席を削除する
  async deleteLayout(userId: string, id:string) {
    const { error } = await supabase
      .from('layouts')
      .delete()
      .eq('user_id', userId)
      .eq('id', id);
    if (error != null) throw new Error(error.message);
  },
};
