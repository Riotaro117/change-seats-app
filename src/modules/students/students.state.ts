import { atom, useAtom } from 'jotai';
import type { Student } from '../../type';

const studentsAtom = atom<Student[]>([]); // 未取得だとnullだが今回は区別する

export const useStudentsStore = () => {
  const [students, setStudents] = useAtom(studentsAtom);
  return { students, setStudents };
};
