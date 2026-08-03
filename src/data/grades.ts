// 七級難度定義：Level 1–7。
// 難度逐級提升，不再綁定實際年級，孩子可按能力自由選擇。

export type GradeKey = 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6' | 'L7';

export interface GradeDef {
  key: GradeKey;
  label: string;        // 小一
  fullLabel: string;    // 小一 (G1)
  ageRange: string;     // 6–7 歲
  tagline: string;      // 一句話定位（標準版核心科目）
  emoji: string;
}

export const GRADES: GradeDef[] = [
  { key: 'L1', label: '第 1 級', fullLabel: '第 1 級 · Level 1', ageRange: '難度 ★☆☆☆☆', tagline: '起步：認字卡、數數、唱遊', emoji: '🌱' },
  { key: 'L2', label: '第 2 級', fullLabel: '第 2 級 · Level 2', ageRange: '難度 ★★☆☆☆', tagline: '英語拼讀 + 10 以內加減', emoji: '🌿' },
  { key: 'L3', label: '第 3 級', fullLabel: '第 3 級 · Level 3', ageRange: '難度 ★★★☆☆', tagline: '100 以內進退位 + 簡單句型', emoji: '🍃' },
  { key: 'L4', label: '第 4 級', fullLabel: '第 4 級 · Level 4', ageRange: '難度 ★★★★☆', tagline: '乘除法 + 閱讀與口語表達', emoji: '🌳' },
  { key: 'L5', label: '第 5 級', fullLabel: '第 5 級 · Level 5', ageRange: '難度 ★★★★☆', tagline: '分數小數 + 應用題', emoji: '🌲' },
  { key: 'L6', label: '第 6 級', fullLabel: '第 6 級 · Level 6', ageRange: '難度 ★★★★★', tagline: '面積體積 + 段落寫作', emoji: '🌴' },
  { key: 'L7', label: '第 7 級', fullLabel: '第 7 級 · Level 7', ageRange: '難度 ★★★★★', tagline: '比例幾何 + 自主閱讀', emoji: '🏔️' },
];

export const DEFAULT_GRADE: GradeKey = 'L1';

export function gradeDef(key: GradeKey): GradeDef {
  return GRADES.find((g) => g.key === key) ?? GRADES[0];
}

export function isGradeKey(v: string): v is GradeKey {
  return GRADES.some((g) => g.key === v);
}
