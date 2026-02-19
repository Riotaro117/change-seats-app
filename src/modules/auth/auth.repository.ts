import type { User } from '@supabase/supabase-js';
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

  // ゲストログイン機能
  async anonymouslySignin() {
    const { data, error } = await supabase.auth.signInAnonymously();
    console.log('anonymous user id:', data.user?.id);
    if (data.user == null || error != null) throw new Error(error?.message);
    return data;
  },

  //ゲストユーザーをメールユーザーにアップデート
  async updateUser(email: string, password: string, name: string) {
    const { data, error } = await supabase.auth.updateUser({
      email,
      password,
      data: {
        name,
      },
    });
    if (data.user == null || error != null) throw new Error(error?.message);
    return data;
  },

  // ログイン、ログアウト、トークン更新などのリアルタイム変化を追従
  stateChange(onChange: (user: User | null) => void) {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      onChange(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  },

  // 現在ログインしているかの確認
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw new Error(error.message);
    return data.session?.user ?? null;
  },

  // ログアウト機能
  async signout() {
    const { error } = await supabase.auth.signOut();
    if (error != null) throw new Error(error.message);
    return true;
  },
};
