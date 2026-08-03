export interface AlphabetLetter {
  upper: string;
  lower: string;
  word: string;
  cn: string;
  emoji: string;
  image?: string;
}

export const ALPHABET_LETTERS: AlphabetLetter[] = [
  { upper: 'A', lower: 'a', word: 'apple', cn: '苹果', emoji: '🍎', image: 'a-apple.png' },
  { upper: 'B', lower: 'b', word: 'bear', cn: '小熊', emoji: '🐻', image: 'b-bear.png' },
  { upper: 'C', lower: 'c', word: 'cat', cn: '小猫', emoji: '🐱', image: 'c-cat.png' },
  { upper: 'D', lower: 'd', word: 'dog', cn: '小狗', emoji: '🐶' },
  { upper: 'E', lower: 'e', word: 'egg', cn: '鸡蛋', emoji: '🥚' },
  { upper: 'F', lower: 'f', word: 'fish', cn: '小鱼', emoji: '🐟' },
  { upper: 'G', lower: 'g', word: 'goat', cn: '山羊', emoji: '🐐' },
  { upper: 'H', lower: 'h', word: 'hat', cn: '帽子', emoji: '🎩' },
  { upper: 'I', lower: 'i', word: 'ice cream', cn: '冰淇淋', emoji: '🍦' },
  { upper: 'J', lower: 'j', word: 'juice', cn: '果汁', emoji: '🧃' },
  { upper: 'K', lower: 'k', word: 'kite', cn: '风筝', emoji: '🪁' },
  { upper: 'L', lower: 'l', word: 'lion', cn: '狮子', emoji: '🦁' },
  { upper: 'M', lower: 'm', word: 'moon', cn: '月亮', emoji: '🌙' },
  { upper: 'N', lower: 'n', word: 'nest', cn: '鸟巢', emoji: '🪺' },
  { upper: 'O', lower: 'o', word: 'orange', cn: '橙子', emoji: '🍊' },
  { upper: 'P', lower: 'p', word: 'panda', cn: '熊猫', emoji: '🐼' },
  { upper: 'Q', lower: 'q', word: 'queen', cn: '女王', emoji: '👸' },
  { upper: 'R', lower: 'r', word: 'rabbit', cn: '兔子', emoji: '🐰' },
  { upper: 'S', lower: 's', word: 'sun', cn: '太阳', emoji: '☀️' },
  { upper: 'T', lower: 't', word: 'train', cn: '火车', emoji: '🚂' },
  { upper: 'U', lower: 'u', word: 'umbrella', cn: '雨伞', emoji: '☂️' },
  { upper: 'V', lower: 'v', word: 'van', cn: '小货车', emoji: '🚐' },
  { upper: 'W', lower: 'w', word: 'whale', cn: '鲸鱼', emoji: '🐋' },
  { upper: 'X', lower: 'x', word: 'xylophone', cn: '木琴', emoji: '🎶' },
  { upper: 'Y', lower: 'y', word: 'yo-yo', cn: '溜溜球', emoji: '🪀' },
  { upper: 'Z', lower: 'z', word: 'zebra', cn: '斑马', emoji: '🦓' },
];

export const ALPHABET_DAYS = Array.from({ length: 9 }, (_, dayIndex) => ({
  day: dayIndex + 1,
  letters: ALPHABET_LETTERS.slice(dayIndex * 3, dayIndex * 3 + 3),
}));

export function alphabetLessonId(letter: string) {
  return `g-L1-eng-letter_sound-${letter.toLowerCase()}`;
}
