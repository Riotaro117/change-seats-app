import { ADJACENT_OFFSETS } from '../constants';
import type { Seat, Student } from '../type';

/**
 * フィッシャーイェーツのアルゴリズム
 */
function shuffle<T>(array: T[]): T[] {
  // 配列をコピーする
  const arr = [...array];
  // 一番後ろから順番に前に進む
  for (let i = arr.length - 1; i > 0; i--) {
    // 0~1つ手前の中から選ぶ
    const j = Math.floor(Math.random() * (i + 1));
    // 一番後ろの数字と選ばれた数字を交換する
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  // 配列を出力する
  return arr;
}

/**
 * 絶対にしてほしくない違反のチェック→後に高得点にする（前列配慮、相性が悪い同士）
 */
function countHardConflicts(
  assignments: Map<number, string | null>, // 全体の座席配置のこと
  studentsMap: Map<string, Student>, // Mapを使うとfindせず高速アクセス可能
  rows: number,
  cols: number,
): number {
  // スコアの設定
  let conflicts = 0;
  // 全席を一つずつチェック
  for (let i = 0; i < assignments.size; i++) {
    // 空席はスキップして続行
    const studentId = assignments.get(i);
    if (!studentId) continue;
    const student = studentsMap.get(studentId); // 座席のidから生徒情報を取得
    if (!student) continue;

    // 現在座っている座席の位置情報
    const r = Math.floor(i / cols);
    const c = i % cols;

    // 1. 視力チェック、違反なら加点
    if (student.needsFrontRow && r > 1) {
      conflicts++;
    }
    // 2. 相性が悪いチェック
    // 左右上下の座席をforで順番に一つずつ定義する
    for (const offset of ADJACENT_OFFSETS) {
      // 隣の席の座標
      const nr = r + offset.r;
      const nc = c + offset.c;
      // 教室の外に出ていないかチェック、行、列が０以上かつ最大値未満
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        // 2次元→1次元に変換、１行にcols個並んでいるなら、何行分スキップしたか*cols＋その行の何番目か
        const neighborIndex = nr * cols + nc;
        // 隣の人のidを取得
        const neighborId = assignments.get(neighborIndex);
        if (neighborId) {
          if (student.badChemistryWith.includes(neighborId)) conflicts++;
          // お互いに相性が悪いなら二重チェックになるけど、加点したままで良い
        }
      }
    }
  }
  // 点数を出力
  return conflicts;
}

/**
 * 隣同士が同じ性別か確認するゆるいチェック→得点は低めで良い
 */
function countGenderConflicts(
  assignments: Map<number, string | null>, // ()で囲むこと忘れがち
  studentsMap: Map<string, Student>,
  rows: number,
  cols: number,
): number {
  // スコアの設定
  let conflicts = 0;
  // 二重のforは外側実行→内側全部実行→外側→内側全部実行の繰り返し
  for (let r = 0; r < rows; r++) {
    // 水平方向のチェック
    for (let c = 0; c < cols; c++) {
      // 座席のindexと右隣の座席のindexを定義
      const idx = r * cols + c;
      const nextidx = r * cols + (c + 1);
      // 座席に現在の生徒idと隣の生徒情idを定義
      const studentId = assignments.get(idx);
      const nextStudentId = assignments.get(nextidx);
      // 隣同士生徒がいるのであれば
      if (studentId && nextStudentId) {
        // 現在と隣の生徒を取得
        const student = studentsMap.get(studentId);
        const nextStudent = studentsMap.get(nextStudentId);
        // 隣同士の生徒がいて、性別が同じ、otherを含まないのであれば
        if (
          student &&
          nextStudent &&
          student.gender != 'other' &&
          student.gender === nextStudent.gender
        )
          conflicts++;
      }
    }
  }
  // 点数を出力
  return conflicts;
}

/**
制約をもとに席替えをし、点数をつける。
その点数が一番低いものをベストな席替えとして出力する
 */
export const generateSeatingChart = (
  seats: Seat[],
  rows: number,
  cols: number,
  students: Student[],
): Seat[] => {
  // 総座席数
  // const totalSeats = rows * cols;
  // 席替えで利用できる座席を定義する
  const enabledSeats = seats.filter((seat) => !seat.isDisabled);
  // 1次元配列に戻す
  const enabledIndices = enabledSeats.map((seat) => seat.row * cols + seat.col);

  // if (availableSeatCount < students.length) throw new Error('使用可能座席数が生徒数より少ないです');
  if (enabledIndices.length < students.length) throw new Error();

  // 生徒のidと情報をキーとバリューで持つ（高速アクセス用）
  const studentMap = new Map(students.map((s) => [s.id, s]));
  // 前列優先と通常生徒を分ける
  const frontRowStudents = students.filter((student) => student.needsFrontRow);
  const regularStudents = students.filter((student) => !student.needsFrontRow);

  // 前列優先座席のインデックスと後部座席のインデックスが入る空配列を用意
  const frontRowIndices: number[] = [];
  const backRowIndices: number[] = [];
  // 座席一つ一つに一次元配列のインデックスを与えて、どこからどこまでが優先座席なのか明確にする
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // 1次元配列を指定
      const idx = r * cols + c;

      // 使用不可の座席であればスキップする
      // if (disabledSeatIndices.includes(idx)) continue;
      // const disabledSet = new Set(enabledIndices);
      // if (disabledSet.has(idx)) continue;

      if (r < 2) {
        // 0,1列目に優先座席を入れて、あとは通常席を入れる
        frontRowIndices.push(idx);
      } else {
        backRowIndices.push(idx);
      }
    }
  }

  // 席替え後に一番スコアの良かった席配列を入れる
  let bestAssignments = new Map<number, string | null>();
  // 無限大にしておくことで、後にスコアが存在するかどうかで使える
  let minScore = Infinity;

  // 500回ランダムに席替えをして、スコアが最小のものを見つける
  const ATTEMPTS = 500;
  // 500回繰り返す
  for (let attempt = 0; attempt < ATTEMPTS; attempt++) {
    // これからの処理で座らせていく座席のこと。
    const assignments = new Map<number, string | null>();

    // 使用不可の座席をマークしておく
    // for (const idx of disabledSeatIndices) {
    //   assignments[idx] = null;
    // }

    // 前列の座席のインデックスのみシャッフル
    const shuffleFrontRowIndices = shuffle(frontRowIndices);
    // 前列の生徒のみシャッフル
    const shuffleFrontRowStudents = shuffle(frontRowStudents);
    // 前列へ行く生徒を指定する
    const frontToPlace = [...shuffleFrontRowStudents];
    // 前列の席のインデックスを順番に教室配置に振っていく
    shuffleFrontRowIndices.forEach((idx) => {
      // 前列へ行く生徒がいるなら、その生徒のidを取り出して、配置する
      if (frontToPlace.length > 0) {
        assignments.set(idx, frontToPlace.pop()!.id);
      }
    });

    // 通常の生徒と前列で座れなかった生徒で後列へ行く生徒を指定する
    const backToPlace = [...regularStudents, ...frontToPlace];
    // 前列の生徒がいないnullの座席のインデックスと後ろの座席のインデックスを残っている座席のインデックスとする
    const remainingIndices = [
      ...shuffleFrontRowIndices.filter((idx) => assignments.get(idx) === null),
      ...backRowIndices,
    ];
    // 残っている座席のインデックスをシャッフルする
    const shuffleRemainingIndices = shuffle(remainingIndices);
    // 後ろの生徒をシャッフルする
    const shuffleBackStudents = shuffle(backToPlace);
    // シャッフルした残りの座席に一人ずつ残っている生徒のidを振っていく
    shuffleRemainingIndices.forEach((idx) => {
      if (shuffleBackStudents.length > 0) {
        assignments.set(idx, shuffleBackStudents.pop()!.id);
      }
    });

    // 制約の重さをそれぞれ定義する
    const hardConflicts = countHardConflicts(assignments, studentMap, rows, cols);
    const genderConflicts = countGenderConflicts(assignments, studentMap, rows, cols);
    // 厳しい制約には1000倍の採点をする
    const score = hardConflicts * 1000 + genderConflicts;
    // 最小のスコアより良いスコアかどうか
    if (score < minScore) {
      // 現在のスコアを最小のスコアにして考える
      minScore = score;
      // 現在の座席配置をベスト配置にコピーする
      bestAssignments = new Map(assignments);
      // 0点が出たら500回せずその時点で席替えを終える
      if (minScore === 0) break;
    }
  }

  // ベスト配置をMap型からSeat型（配列）に変換
  const finalSeats: Seat[] = Array.from(bestAssignments).map(([idx, studentId]) => ({
    id: `seat-${Math.floor(idx / cols)}-${idx % cols}`,
    row: Math.floor(idx / cols),
    col: idx % cols,
    studentId,
    isDisabled: true,
  }));
  console.log(finalSeats.map((s) => s.studentId));

  //ベストな席を出力する
  return finalSeats;
};
