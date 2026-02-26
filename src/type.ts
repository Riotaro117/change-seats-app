// 仮UIを作成する前にデータ設計をする

import type { ReactNode } from "react";

// 先に型を作成して、それを元にDB(Supabase)、API(CRUD)、UI(React)を作成する
export type Student = {
  id: string;
  name: string;
  gender: 'boy' | 'girl' | 'other';
  needsFrontRow: boolean; // 前列の配慮が必要か
  badChemistryWith: string[]; // 相性の悪い生徒がいるか
};

// 上記のstudentsでbadChemistryWithテーブルを作成する際は、jsonb形式で作成する（高性能、柔軟、実務定番）
// badChemistryWithの初期値は、[]::jsonbにする。空の配列を指定することでnullを防ぐことができる
// ::jsonbとは、jsonb型として指定してねということ

export type Seat = {
  id: string;
  row: number;
  col: number;
  studentId: string | null; // 座席に座っている生徒、空席ならnull
  isDisabled: boolean; // 座席が利用可能か
};

// 上記のlayoutsでrowsとcolsのtypeをint4にしているのは、整数型。int2は小さい、int8は大きすぎ

export type ClassroomLayout = {
  id: string;
  name: string; // 保存するときに名前をつける
  date: string; // 保存をした日
  rows: number;
  cols: number;
  // 以下二つはスナップショット設計で、今後教室のレイアウトなどが変わったとしても、履歴は変わらない
  seats: Seat[]; // 保存した座席情報
  students: Student[]; // 保存した生徒情報
};

export type ViewMode = 'classroom' | 'students' | 'history' | 'settings';

export type Tab = {
  id: number;
  label: string;
  content: ReactNode; // ReactNodeは文字列、JSX、コンポーネント、Fragment、okになる
};
