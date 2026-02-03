import { atom, useAtom } from 'jotai';
import type { ClassroomLayout } from '../../type';

const LayoutsAtom = atom<ClassroomLayout[] | null>([]);
export const useLayoutsStore = () => {
  const [layouts, setLayouts] = useAtom(LayoutsAtom);
  return { layouts, setLayouts };
};
