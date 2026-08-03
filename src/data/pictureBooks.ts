/**
 * 英语原创绘本（绘本馆）。
 *
 * 设计原则：
 *   - 全部为原创森林故事，使用 App 内 8 只原创角色（corgi/cat/rabbit/bear/deer/penguin/lop/bird），
 *     不引用任何商业 IP / 卡通形象。
 *   - 每页一句简单英文 + 中文翻译，配合 BookScene 插画，可整句听读、点单词发音。
 *   - 难度循序：★ 起步（单词句）→ ★★ 进阶（简单句）。
 *
 * 接入：
 *   - 独立绘本馆：/english/books 自由选读
 *   - 每日计划：第 50–60 天（阅读段）由 plan60 编排为英语任务 kind:'book'
 */
import type { PictureBook } from '@/types';

const BOOKS: PictureBook[] = [
  // 1. 小鹿找朋友
  {
    id: 'pb-1',
    titleCn: '小鹿找朋友',
    titleEn: 'The Deer Finds Friends',
    level: '★ 起步',
    coverBg: 'from-sky-200 to-sun-100',
    coverChar: 'deer',
    durationMin: 6,
    pages: [
      { en: 'I am a little deer.', cn: '我是一只小鹿。', scene: { bg: 'from-sky-200 to-sun-100', sky: 'day', props: ['sun', 'cloud'], characters: [{ name: 'deer', x: 50, y: 62, size: 92 }] } },
      { en: 'I see a rabbit.', cn: '我看见一只兔子。', scene: { bg: 'from-sky-200 to-sun-100', sky: 'day', props: ['cloud', 'tree'], characters: [{ name: 'deer', x: 30, y: 62, size: 82 }, { name: 'rabbit', x: 70, y: 64, size: 78 }] } },
      { en: 'I see a small bird.', cn: '我看见一只小鸟。', scene: { bg: 'from-sky-200 to-sun-100', sky: 'day', props: ['cloud'], characters: [{ name: 'bird', x: 64, y: 40, size: 64 }, { name: 'deer', x: 34, y: 64, size: 82 }] } },
      { en: 'We are good friends.', cn: '我们是好朋友。', scene: { bg: 'from-sky-200 to-sun-100', sky: 'day', props: ['sun', 'flower'], characters: [{ name: 'deer', x: 34, y: 62, size: 82 }, { name: 'rabbit', x: 62, y: 64, size: 76 }] } },
      { en: 'We play in the forest.', cn: '我们在森林里玩。', scene: { bg: 'from-sky-200 to-sun-100', sky: 'day', props: ['tree', 'flower'], characters: [{ name: 'deer', x: 28, y: 62, size: 82 }, { name: 'rabbit', x: 54, y: 64, size: 76 }, { name: 'bird', x: 80, y: 44, size: 60 }] } },
      { en: 'I am happy.', cn: '我很开心。', scene: { bg: 'from-sky-300 to-sun-100', sky: 'day', props: ['sun'], characters: [{ name: 'deer', x: 50, y: 60, size: 96 }] } },
    ],
  },
  // 2. 小猫的雨伞
  {
    id: 'pb-2',
    titleCn: '小猫的雨伞',
    titleEn: "The Cat's Umbrella",
    level: '★ 起步',
    coverBg: 'from-slate-200 to-sky-200',
    coverChar: 'cat',
    durationMin: 6,
    pages: [
      { en: 'It is raining.', cn: '下雨了。', scene: { bg: 'from-slate-200 to-sky-200', sky: 'rain', characters: [{ name: 'cat', x: 50, y: 62, size: 88 }] } },
      { en: 'The cat has an umbrella.', cn: '小猫有一把雨伞。', scene: { bg: 'from-slate-200 to-sky-200', sky: 'rain', characters: [{ name: 'cat', x: 50, y: 60, size: 88 }] } },
      { en: 'The bear is cold.', cn: '小熊觉得冷。', scene: { bg: 'from-slate-200 to-sky-200', sky: 'rain', props: ['tree'], characters: [{ name: 'bear', x: 50, y: 60, size: 90 }] } },
      { en: 'The cat and the bear share.', cn: '小猫和小熊一起撑。', scene: { bg: 'from-slate-200 to-sky-200', sky: 'rain', characters: [{ name: 'cat', x: 38, y: 60, size: 80 }, { name: 'bear', x: 66, y: 60, size: 88 }] } },
      { en: 'We are not cold now.', cn: '我们现在不冷了。', scene: { bg: 'from-slate-300 to-sky-200', sky: 'rain', characters: [{ name: 'cat', x: 40, y: 60, size: 80 }, { name: 'bear', x: 64, y: 60, size: 88 }] } },
      { en: 'The rain stops.', cn: '雨停了。', scene: { bg: 'from-sky-200 to-sun-100', sky: 'day', props: ['cloud', 'sun'], characters: [{ name: 'cat', x: 50, y: 60, size: 86 }] } },
    ],
  },
  // 3. 小狗的球
  {
    id: 'pb-3',
    titleCn: '小狗的球',
    titleEn: "The Dog's Ball",
    level: '★ 起步',
    coverBg: 'from-sun-100 to-cream-200',
    coverChar: 'corgi',
    durationMin: 6,
    pages: [
      { en: 'I am a little dog.', cn: '我是一只小狗。', scene: { bg: 'from-sun-100 to-cream-200', sky: 'day', props: ['sun'], characters: [{ name: 'corgi', x: 50, y: 62, size: 90 }] } },
      { en: 'I have a red ball.', cn: '我有一个红色的球。', scene: { bg: 'from-sun-100 to-cream-200', sky: 'day', props: ['sun', 'flower'], characters: [{ name: 'corgi', x: 50, y: 60, size: 88 }] } },
      { en: 'The ball rolls away.', cn: '球滚走了。', scene: { bg: 'from-sun-100 to-cream-200', sky: 'day', props: ['flower'], characters: [{ name: 'corgi', x: 30, y: 62, size: 82 }, { name: 'cat', x: 72, y: 64, size: 76 }] } },
      { en: 'The cat helps me.', cn: '小猫帮了我。', scene: { bg: 'from-sun-100 to-cream-200', sky: 'day', props: ['tree'], characters: [{ name: 'corgi', x: 34, y: 62, size: 82 }, { name: 'cat', x: 66, y: 64, size: 76 }] } },
      { en: 'Thank you, cat!', cn: '谢谢你，小猫！', scene: { bg: 'from-sun-100 to-cream-200', sky: 'day', props: ['sun', 'flower'], characters: [{ name: 'corgi', x: 40, y: 62, size: 82 }, { name: 'cat', x: 66, y: 64, size: 76 }] } },
      { en: 'We play together.', cn: '我们一起玩。', scene: { bg: 'from-sun-100 to-cream-200', sky: 'day', props: ['tree', 'flower'], characters: [{ name: 'corgi', x: 36, y: 62, size: 82 }, { name: 'cat', x: 64, y: 64, size: 76 }] } },
    ],
  },
  // 4. 兔子的胡萝卜
  {
    id: 'pb-4',
    titleCn: '兔子的胡萝卜',
    titleEn: "Rabbit's Carrot",
    level: '★ 起步',
    coverBg: 'from-forest-200 to-sun-100',
    coverChar: 'rabbit',
    durationMin: 6,
    pages: [
      { en: 'I am a white rabbit.', cn: '我是一只白兔子。', scene: { bg: 'from-forest-200 to-sun-100', sky: 'day', props: ['sun'], characters: [{ name: 'rabbit', x: 50, y: 62, size: 88 }] } },
      { en: 'I see a carrot.', cn: '我看见一根胡萝卜。', scene: { bg: 'from-forest-200 to-sun-100', sky: 'day', props: ['tree'], characters: [{ name: 'rabbit', x: 42, y: 62, size: 82 }] } },
      { en: 'The penguin wants it too.', cn: '企鹅也想要。', scene: { bg: 'from-forest-200 to-sun-100', sky: 'day', props: ['cloud'], characters: [{ name: 'rabbit', x: 34, y: 62, size: 80 }, { name: 'penguin', x: 68, y: 60, size: 86 }] } },
      { en: 'We share the carrot.', cn: '我们一起分享胡萝卜。', scene: { bg: 'from-forest-200 to-sun-100', sky: 'day', props: ['flower'], characters: [{ name: 'rabbit', x: 38, y: 62, size: 80 }, { name: 'penguin', x: 64, y: 60, size: 86 }] } },
      { en: 'Yummy!', cn: '好好吃！', scene: { bg: 'from-sun-100 to-cream-200', sky: 'day', props: ['sun'], characters: [{ name: 'rabbit', x: 40, y: 62, size: 80 }, { name: 'penguin', x: 66, y: 60, size: 86 }] } },
    ],
  },
  // 5. 小鸟学飞
  {
    id: 'pb-5',
    titleCn: '小鸟学飞',
    titleEn: 'The Bird Learns to Fly',
    level: '★★ 进阶',
    coverBg: 'from-sky-300 to-forest-200',
    coverChar: 'bird',
    durationMin: 7,
    pages: [
      { en: 'I am a small bird.', cn: '我是一只小鸟。', scene: { bg: 'from-sky-300 to-forest-200', sky: 'day', props: ['cloud'], characters: [{ name: 'bird', x: 50, y: 56, size: 70 }] } },
      { en: 'I want to fly high.', cn: '我想飞得高高的。', scene: { bg: 'from-sky-300 to-forest-200', sky: 'day', props: ['cloud', 'sun'], characters: [{ name: 'bird', x: 50, y: 50, size: 70 }] } },
      { en: 'The deer says: try!', cn: '小鹿说：试试看！', scene: { bg: 'from-sky-300 to-forest-200', sky: 'day', props: ['tree'], characters: [{ name: 'bird', x: 32, y: 48, size: 64 }, { name: 'deer', x: 68, y: 62, size: 84 }] } },
      { en: 'I flap my wings.', cn: '我拍动翅膀。', scene: { bg: 'from-sky-300 to-forest-200', sky: 'day', props: ['cloud'], characters: [{ name: 'bird', x: 50, y: 46, size: 72 }] } },
      { en: 'I can fly now!', cn: '我现在会飞了！', scene: { bg: 'from-sky-200 to-sun-100', sky: 'day', props: ['sun', 'cloud'], characters: [{ name: 'bird', x: 50, y: 40, size: 74 }] } },
      { en: 'The deer is proud of me.', cn: '小鹿为我感到骄傲。', scene: { bg: 'from-sky-200 to-sun-100', sky: 'day', props: ['tree', 'flower'], characters: [{ name: 'bird', x: 34, y: 44, size: 66 }, { name: 'deer', x: 68, y: 62, size: 84 }] } },
    ],
  },
  // 6. 熊的蜂蜜
  {
    id: 'pb-6',
    titleCn: '熊的蜂蜜',
    titleEn: "Bear's Honey",
    level: '★★ 进阶',
    coverBg: 'from-amber-200 to-sun-100',
    coverChar: 'bear',
    durationMin: 7,
    pages: [
      { en: 'I am a big brown bear.', cn: '我是一只大棕熊。', scene: { bg: 'from-amber-200 to-sun-100', sky: 'day', props: ['sun'], characters: [{ name: 'bear', x: 50, y: 60, size: 94 }] } },
      { en: 'I love sweet honey.', cn: '我喜欢甜甜的蜂蜜。', scene: { bg: 'from-amber-200 to-sun-100', sky: 'day', props: ['flower'], characters: [{ name: 'bear', x: 50, y: 60, size: 92 }] } },
      { en: 'The rabbit gives me honey.', cn: '兔子送给我蜂蜜。', scene: { bg: 'from-amber-200 to-sun-100', sky: 'day', props: ['tree'], characters: [{ name: 'bear', x: 36, y: 60, size: 90 }, { name: 'rabbit', x: 68, y: 64, size: 74 }] } },
      { en: 'We eat together.', cn: '我们一起吃。', scene: { bg: 'from-amber-200 to-sun-100', sky: 'day', props: ['flower'], characters: [{ name: 'bear', x: 38, y: 60, size: 90 }, { name: 'rabbit', x: 66, y: 64, size: 74 }] } },
      { en: 'The honey is yummy.', cn: '蜂蜜好好吃。', scene: { bg: 'from-sun-100 to-cream-200', sky: 'day', props: ['sun'], characters: [{ name: 'bear', x: 50, y: 60, size: 92 }] } },
    ],
  },
  // 7. 企鹅的雪人
  {
    id: 'pb-7',
    titleCn: '企鹅的雪人',
    titleEn: "Penguin's Snowman",
    level: '★★ 进阶',
    coverBg: 'from-slate-200 to-sky-200',
    coverChar: 'penguin',
    durationMin: 7,
    pages: [
      { en: 'It is snowing.', cn: '下雪了。', scene: { bg: 'from-slate-200 to-sky-200', sky: 'snow', characters: [{ name: 'penguin', x: 50, y: 60, size: 88 }] } },
      { en: 'I am a little penguin.', cn: '我是一只小企鹅。', scene: { bg: 'from-slate-200 to-sky-200', sky: 'snow', characters: [{ name: 'penguin', x: 50, y: 60, size: 88 }] } },
      { en: 'I make a snowman.', cn: '我堆了一个雪人。', scene: { bg: 'from-slate-200 to-sky-200', sky: 'snow', characters: [{ name: 'penguin', x: 38, y: 60, size: 80 }, { name: 'bear', x: 70, y: 60, size: 88 }] } },
      { en: 'The bear helps me.', cn: '小熊来帮我。', scene: { bg: 'from-slate-200 to-sky-200', sky: 'snow', props: ['tree'], characters: [{ name: 'penguin', x: 36, y: 60, size: 80 }, { name: 'bear', x: 68, y: 60, size: 88 }] } },
      { en: 'We laugh in the snow.', cn: '我们在雪地里笑。', scene: { bg: 'from-slate-200 to-sky-200', sky: 'snow', props: ['tree'], characters: [{ name: 'penguin', x: 38, y: 60, size: 80 }, { name: 'bear', x: 66, y: 60, size: 88 }] } },
    ],
  },
  // 8. 夜晚的星星
  {
    id: 'pb-8',
    titleCn: '夜晚的星星',
    titleEn: 'The Stars at Night',
    level: '★★ 进阶',
    coverBg: 'from-indigo-300 to-sky-300',
    coverChar: 'deer',
    durationMin: 7,
    pages: [
      { en: 'Night comes.', cn: '夜晚来了。', scene: { bg: 'from-indigo-300 to-sky-300', sky: 'night', props: ['moon', 'star'], characters: [{ name: 'deer', x: 50, y: 60, size: 88 }] } },
      { en: 'The moon is bright.', cn: '月亮很亮。', scene: { bg: 'from-indigo-300 to-sky-300', sky: 'night', props: ['moon', 'star'], characters: [{ name: 'deer', x: 50, y: 60, size: 88 }] } },
      { en: 'I see many stars.', cn: '我看见很多星星。', scene: { bg: 'from-indigo-300 to-sky-300', sky: 'night', props: ['moon', 'star'], characters: [{ name: 'deer', x: 40, y: 60, size: 82 }] } },
      { en: 'A bird sings a song.', cn: '一只小鸟在唱歌。', scene: { bg: 'from-indigo-300 to-sky-300', sky: 'night', props: ['star'], characters: [{ name: 'bird', x: 64, y: 42, size: 62 }, { name: 'deer', x: 36, y: 62, size: 82 }] } },
      { en: 'I close my eyes.', cn: '我闭上眼睛。', scene: { bg: 'from-indigo-400 to-sky-400', sky: 'night', props: ['moon', 'star'], characters: [{ name: 'deer', x: 50, y: 60, size: 86 }] } },
      { en: 'Good night, forest.', cn: '晚安，森林。', scene: { bg: 'from-indigo-400 to-sky-400', sky: 'night', props: ['star', 'moon'], characters: [{ name: 'deer', x: 50, y: 60, size: 86 }] } },
    ],
  },
];

export const pictureBooks: PictureBook[] = BOOKS;
export const pictureBookIds: string[] = BOOKS.map((b) => b.id);
export const pictureBookMap: Map<string, PictureBook> = new Map(BOOKS.map((b) => [b.id, b]));

export function getPictureBook(id: string): PictureBook | undefined {
  return pictureBookMap.get(id);
}
