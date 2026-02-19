import type { User } from '@supabase/supabase-js';
import { atom, useAtom } from 'jotai';

const currentUserAtom = atom<User | null>(null);

export const useCurrentUserStore = () => {
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  return { currentUser, setUser: setCurrentUser };
};
