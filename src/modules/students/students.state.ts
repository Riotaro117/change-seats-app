import { atom, useAtom } from 'jotai';
import type { Student } from '../../type';

const studentsAtom = atom<Student[] | null>([]);

export const useStudentsStore = () => {
  const [students, setStudents] = useAtom(studentsAtom);
  return { students, setStudents };
};
