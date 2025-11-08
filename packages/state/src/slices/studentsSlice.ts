import type { StateCreator } from 'zustand';
import type { GlobalState, StudentProfile } from '../types';

export interface StudentsSlice {
  setStudents: (students: Record<string, StudentProfile>) => void;
  addStudent: (student: StudentProfile) => void;
  updateStudent: (id: string, updates: Partial<StudentProfile>) => void;
  setActiveStudent: (id: string | null) => void;
  removeStudent: (id: string) => void;
}

export const createStudentsSlice: StateCreator<
  GlobalState & StudentsSlice,
  [['zustand/immer', never]],
  [],
  StudentsSlice
> = (set, get) => ({
  setStudents: (students: Record<string, StudentProfile>) =>
    set((state: any) => {
      state.students.profiles = students;
    }),

  addStudent: (student: StudentProfile) =>
    set((state: any) => {
      state.students.profiles[student.id] = student;
    }),

  updateStudent: (id: string, updates: Partial<StudentProfile>) =>
    set((state: any) => {
      if (state.students.profiles[id]) {
        state.students.profiles[id] = {
          ...state.students.profiles[id],
          ...updates
        };
      }
    }),

  setActiveStudent: (id: string | null) =>
    set((state: any) => {
      state.students.activeStudentId = id;
    }),

  removeStudent: (id: string) =>
    set((state: any) => {
      delete state.students.profiles[id];
      if (state.students.activeStudentId === id) {
        state.students.activeStudentId = null;
      }
    })
});