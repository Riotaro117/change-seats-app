import { supabase } from '../../lib/supabase';

export const authRepository = {
  // ユーザー作成機能
  async signup(email: string, password: string, name: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });
    if (data.user == null || error != null) throw new Error(error?.message);
    return {
      ...data.user,
      userName: data.user.user_metadata.name,
    };
  },

  // ログイン機能
  async signin(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (data.user == null || error != null) throw new Error(error?.message);
    return {
      ...data.user,
      userName: data.user.user_metadata.name,
    };
  },
  // ユーザー情報の取得
  async getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();
    if (data.user == null || error != null) throw new Error(error?.message);
    return {
      ...data.user,
      userName: data.user.user_metadata.name,
    };
  },
  // ログイン、ログアウト、トークン更新などのリアルタイム変化を追従
  // ログアウト機能
};
