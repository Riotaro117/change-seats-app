import { atom, useAtom } from 'jotai';
import type { ViewMode } from '../../type';

const viewModeAtom = atom<ViewMode>('classroom');
export const useViewMode = () => {
  const [viewMode, setViewMode] = useAtom(viewModeAtom);
  return { viewMode, setViewMode };
};
