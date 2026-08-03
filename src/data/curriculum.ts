import type { Unit, Lesson, SkillTrack, MathTopic, Difficulty, TodayTask, WeakLesson } from '@/types';
import { englishBank, englishBankByTopic } from './englishBank';
import { mathBank } from './mathBank';

/* English P1A — 6 skill tracks, each with units.
   Math P1A   — 6 topics, each with units.
   Only the "current" units have full lesson data. Others show progress. */

export const englishTracks: { id: SkillTrack; label: string }[] = [
  { id: 'letter_sound', label: '字母认读' },
  { id: 'phonics', label: 'Phonics' },
  { id: 'sight_words', label: 'Sight words' },
  { id: 'theme_words', label: '主题词汇' },
  { id: 'sentences', label: '简单句型' },
  { id: 'reading', label: '绘本表达' },
];

export const mathTopics: { id: MathTopic; label: string }[] = [
  { id: 'counting', label: '数 1–20' },
  { id: 'add_sub', label: '10 以内加减' },
  { id: 'shapes', label: '形状' },
  { id: 'compare', label: '直观比较' },
  { id: 'clock', label: '整点时钟' },
  { id: 'chart', label: '分类图表' },
];

// Helper: build simple CVC phonics lesson.
const cvcLesson = (index: number, letters: [string, string, string]): Lesson => {
  const word = letters.join('');
  return {
    id: `eng-cvc-${index}`,
    index,
    title: `Sound /${letters[0]}/`,
    durationMin: 6,
    kind: 'phonics_blend',
    steps: [
      {
        id: `${index}-1`,
        ui: 'tap_choice',
        prompt: `哪个字母发 /${letters[0]}/ 的音？`,
        answer: letters[0],
        choices: [letters[0], 'b', 'd', 't'],
      },
      {
        id: `${index}-2`,
        ui: 'blend',
        prompt: `听一听，拖动拼出 ${word}`,
        answer: [letters[0], letters[1], letters[2]],
      },
      {
        id: `${index}-3`,
        ui: 'tap_choice',
        prompt: `图里是 "${word}" 吗？`,
        answer: 'yes',
        choices: ['yes', 'no'],
      },
      {
        id: `${index}-4`,
        ui: 'read_along',
        prompt: `跟读：I can say "${word}".`,
        answer: word,
      },
    ],
  };
};

const englishUnitsRaw: Omit<Unit, 'subject'>[] = [
  {
    id: 'eng-u1',
    title: '字母认读 A–G',
    subtitle: '第一单元 · 字母与发音',
    storyTask: '帮小鹿读懂森林邮箱上的名字',
    goals: ['认读 7 个字母', '听辨首音', '跟读 4 个 CVC 单词'],
    progress: 1,
    done: true,
    lessons: 5,
  },
  {
    id: 'eng-u2',
    title: '字母认读 H–N',
    subtitle: '第二单元 · 字母与发音',
    storyTask: '帮小熊拼出花园里的小标牌',
    goals: ['认读 7 个字母', '听辨首音', '跟读 4 个 CVC 单词'],
    progress: 1,
    done: true,
    lessons: 5,
  },
  {
    id: 'eng-u3',
    title: 'Phonics：辅音 + 元音',
    subtitle: '第三单元 · 拼读启蒙',
    storyTask: '帮小鹿读懂森林邮局的英文路牌',
    goals: ['认读 s/a/t/p/i/n 的字元音', '拼读 8 个简单 CVC 单词', '认读 12 个视觉词', '说出 "This is a…"'],
    progress: 0.68,
    current: true,
    lessons: 8,
  },
  {
    id: 'eng-u4',
    title: '主题词汇：森林动物',
    subtitle: '第四单元 · 主题词',
    storyTask: '帮小鸟老师整理动物图鉴',
    goals: ['认读 8 个动物单词', '听音选图', '跟读短句'],
    progress: 0,
    lessons: 6,
  },
  {
    id: 'eng-u5',
    title: '简单句型',
    subtitle: '第五单元 · 句子拼装',
    storyTask: '帮兔子邮差把信件拼好送出',
    goals: ['拼装 6 个简单句', '替换主语/宾语', '跟读整句'],
    progress: 0,
    lessons: 6,
  },
  {
    id: 'eng-u6',
    title: '绘本跟读：森林的一天',
    subtitle: '第六单元 · 绘本表达',
    storyTask: '和垂耳兔一起读完整本小书',
    goals: ['跟读 4 页绘本', '回答 3 个理解问题', '复述故事开头'],
    progress: 0,
    lessons: 4,
  },
  {
    id: 'eng-u7',
    title: '主题词汇：颜色与数字',
    subtitle: '第七单元 · 主题词',
    storyTask: '帮柯基豆豆整理彩虹画',
    goals: ['认读 6 个颜色', '认读数字 1–10', '简单描述'],
    progress: 0,
    lessons: 5,
  },
  {
    id: 'eng-u8',
    title: '简单对话',
    subtitle: '第八单元 · 综合',
    storyTask: '在森林派对上认识新朋友',
    goals: ['问候 / 告别', '介绍自己', '询问名字'],
    progress: 0,
    lessons: 4,
  },
];

export const englishUnits = englishUnitsRaw.map((u) => ({ ...u, subject: 'english' as const }));

// Phonics unit 3 — 8 lessons, 2 done.
export const phonicsLessons: Lesson[] = [
  {
    id: 'eng-cvc-1',
    index: 1,
    title: 'Sound /s/ — s + a + t',
    durationMin: 6,
    kind: 'phonics_blend',
    steps: [
      {
        id: '1-1',
        ui: 'tap_choice',
        prompt: '哪个字母发 /s/ 的音？',
        answer: 's',
        choices: ['s', 'a', 't', 'p'],
        hint: '像小蛇嘶嘶的声音。',
      },
      {
        id: '1-2',
        ui: 'blend',
        prompt: '听一听，拖动拼出 "sat"',
        answer: ['s', 'a', 't'],
      },
      { id: '1-3', ui: 'read_along', prompt: '跟读：I sat on the mat.', answer: 'sat' },
    ],
  },
  {
    id: 'eng-cvc-2',
    index: 2,
    title: 'Sound /p/ — p + a + t',
    durationMin: 6,
    kind: 'phonics_blend',
    steps: [
      { id: '2-1', ui: 'tap_choice', prompt: '哪个字母发 /p/ 的音？', answer: 'p', choices: ['b', 'p', 'd', 'q'] },
      { id: '2-2', ui: 'blend', prompt: '拖动拼出 "pat"', answer: ['p', 'a', 't'] },
      { id: '2-3', ui: 'read_along', prompt: '跟读：Pat a cat.', answer: 'pat' },
    ],
  },
  cvcLesson(3, ['s', 'u', 'n']),
  cvcLesson(4, ['p', 'i', 'n']),
  cvcLesson(5, ['n', 'a', 'p']),
  cvcLesson(6, ['s', 'i', 't']),
  cvcLesson(7, ['t', 'a', 'p']),
  cvcLesson(8, ['n', 'i', 'p']),
];

const mathUnitsRaw: Omit<Unit, 'subject'>[] = [
  {
    id: 'math-u1',
    title: '数 1–10',
    subtitle: '第一单元 · 基础数感',
    storyTask: '帮小鹿数清森林信箱的数量',
    goals: ['数 1–10', '写数字', '找邻居数'],
    progress: 1,
    done: true,
    lessons: 5,
  },
  {
    id: 'math-u2',
    title: '10 以内加减',
    subtitle: '第二单元 · 实物图→算式',
    storyTask: '帮小熊园丁清点邮局的 5 份物资',
    goals: ['用实物图理解"合起来"', '熟练完成 10 以内加法', '从图像过渡到数字算式', '说出自己的计算方法'],
    progress: 0.42,
    current: true,
    lessons: 8,
  },
  {
    id: 'math-u3',
    title: '形状',
    subtitle: '第三单元 · 形状辨认',
    storyTask: '帮小鸟老师分类森林里的石子',
    goals: ['认 4 种形状', '在生活中找形状', '拼一拼'],
    progress: 0,
    lessons: 4,
  },
  {
    id: 'math-u4',
    title: '直观比较',
    subtitle: '第四单元 · 谁多谁少',
    storyTask: '帮兔子邮差比较两个篮子的蘑菇',
    goals: ['比多少', '比高矮', '比长短'],
    progress: 0,
    lessons: 4,
  },
  {
    id: 'math-u5',
    title: '整点时钟',
    subtitle: '第五单元 · 时间',
    storyTask: '帮企鹅圆圆守好约定时间',
    goals: ['认整点', '说出几点', '安排一日'],
    progress: 0,
    lessons: 4,
  },
  {
    id: 'math-u6',
    title: '分类图表',
    subtitle: '第六单元 · 图表',
    storyTask: '帮柯基豆豆整理森林市集',
    goals: ['按特征分类', '画简单图表', '看图回答'],
    progress: 0,
    lessons: 4,
  },
];

export const mathUnits = mathUnitsRaw.map((u) => ({ ...u, subject: 'math' as const }));

export const mathAddSubLessons: Lesson[] = [
  {
    id: 'math-1',
    index: 1,
    title: '合起来：3 + 1',
    durationMin: 7,
    kind: 'add_sub',
    steps: [
      { id: '1-1', ui: 'drag_count', prompt: '把两份积木合在一起', answer: 4, bagCount: 3, bagCount2: 1, bagOp: 'add' },
      { id: '1-2', ui: 'number_pad', prompt: '3 + 1 = ?', answer: 4 },
      { id: '1-3', ui: 'tap_choice', prompt: '用你自己的话怎幺算？', answer: 'count on', choices: ['count on', '记住', '随便猜'] },
    ],
  },
  {
    id: 'math-2',
    index: 2,
    title: '合起来：2 + 3',
    durationMin: 7,
    kind: 'add_sub',
    steps: [
      { id: '2-1', ui: 'drag_count', prompt: '合起来一共几颗？', answer: 5, bagCount: 2, bagCount2: 3, bagOp: 'add' },
      { id: '2-2', ui: 'number_pad', prompt: '2 + 3 = ?', answer: 5 },
    ],
  },
  {
    id: 'math-3',
    index: 3,
    title: '合起来：4 + 2',
    durationMin: 7,
    kind: 'add_sub',
    steps: [
      { id: '3-1', ui: 'drag_count', prompt: '数一数合起来几个', answer: 6, bagCount: 4, bagCount2: 2, bagOp: 'add' },
      { id: '3-2', ui: 'number_pad', prompt: '4 + 2 = ?', answer: 6 },
    ],
  },
  {
    id: 'math-4',
    index: 4,
    title: '合起来：3 + 2',
    durationMin: 7,
    kind: 'add_sub',
    steps: [
      { id: '4-1', ui: 'drag_count', prompt: '帮小熊园丁清点物资', answer: 5, bagCount: 3, bagCount2: 2, bagOp: 'add' },
      { id: '4-2', ui: 'number_pad', prompt: '3 + 2 = ?', answer: 5 },
    ],
  },
  {
    id: 'math-5',
    index: 5,
    title: '拿走：5 − 1',
    durationMin: 7,
    kind: 'add_sub',
    steps: [
      { id: '5-1', ui: 'drag_count', prompt: '拿走 1 个，剩几个？', answer: 4, bagCount: 5, bagCount2: 1, bagOp: 'remove' },
      { id: '5-2', ui: 'number_pad', prompt: '5 − 1 = ?', answer: 4 },
    ],
  },
  {
    id: 'math-6',
    index: 6,
    title: '拿走：4 − 2',
    durationMin: 7,
    kind: 'add_sub',
    steps: [
      { id: '6-1', ui: 'drag_count', prompt: '把 2 个移走', answer: 2, bagCount: 4, bagCount2: 2, bagOp: 'remove' },
      { id: '6-2', ui: 'number_pad', prompt: '4 − 2 = ?', answer: 2 },
    ],
  },
  {
    id: 'math-7',
    index: 7,
    title: '综合：6 − 3',
    durationMin: 7,
    kind: 'add_sub',
    steps: [
      { id: '7-1', ui: 'drag_count', prompt: '剩几颗蘑菇？', answer: 3, bagCount: 6, bagCount2: 3, bagOp: 'remove' },
      { id: '7-2', ui: 'number_pad', prompt: '6 − 3 = ?', answer: 3 },
    ],
  },
  {
    id: 'math-8',
    index: 8,
    title: '综合：5 + 4',
    durationMin: 7,
    kind: 'add_sub',
    steps: [
      { id: '8-1', ui: 'drag_count', prompt: '合起来一共有几颗？', answer: 9, bagCount: 5, bagCount2: 4, bagOp: 'add' },
      { id: '8-2', ui: 'number_pad', prompt: '5 + 4 = ?', answer: 9 },
    ],
  },
];

// ============================================================ 挑战关卡（二年级水平）
// 英语：辅音簇 / 字母组合 / 长元音 / 视觉词 / 造句 / 阅读理解 / 口语
// 数学：100 以内进退位 / 表内乘法 / 乘法意义 / 缺数 / 应用题 / 比较
export const phonicsChallenge: Lesson[] = [
  {
    id: 'eng-ch-1', index: 1, title: '词组猜一猜 · Phrases', durationMin: 9, kind: 'sentence_build',
    steps: [
      { id: 'c1-1', ui: 'tap_choice', prompt: '"get up" 是什幺意思？', answer: '起床', choices: ['起床', '上去', '拿到', '坐下'] },
      { id: 'c1-2', ui: 'order_words', prompt: '排成一句话：get up / I / every day', answer: 'I get up every day' },
      { id: 'c1-3', ui: 'tap_choice', prompt: '"look after" 是什幺意思？', answer: '照顾', choices: ['照顾', '看后面', '后来', '找东西'] },
      { id: 'c1-4', ui: 'order_words', prompt: '排句子：looks after / She / her cat', answer: 'She looks after her cat' },
    ],
  },
  {
    id: 'eng-ch-2', index: 2, title: '句子仿写 · Write & Say', durationMin: 10, kind: 'sentence_build',
    steps: [
      { id: 'c2-1', ui: 'order_words', prompt: '排成通顺的句子：has / a new / bike / Tom', answer: 'Tom has a new bike' },
      { id: 'c2-2', ui: 'read_along', prompt: '跟读：Tom has a new bike.', answer: 'Tom has a new bike.' },
      { id: 'c2-3', ui: 'order_words', prompt: '排句子：are / some flowers / in the vase / There', answer: 'There are some flowers in the vase' },
      { id: 'c2-4', ui: 'read_along', prompt: '跟读：There are some flowers in the vase.', answer: 'There are some flowers in the vase.' },
    ],
  },
  {
    id: 'eng-ch-3', index: 3, title: '视觉词 Sight words', durationMin: 7, kind: 'sight_word',
    steps: [
      { id: 'c3-1', ui: 'tap_choice', prompt: '哪个是 "the"？', answer: 'the', choices: ['the', 'they', 'this', 'that'], hint: '最常见的词，看到就要马上读出来' },
      { id: 'c3-2', ui: 'tap_choice', prompt: '哪个是 "where"？', answer: 'where', choices: ['where', 'were', 'what', 'when'] },
      { id: 'c3-3', ui: 'tap_choice', prompt: '哪个是 "because"？', answer: 'because', choices: ['because', 'become', 'before', 'behind'] },
    ],
  },
  {
    id: 'eng-ch-4', index: 4, title: '阅读理解 · The Cat on the Mat', durationMin: 10, kind: 'read_along',
    steps: [
      { id: 'c4-1', ui: 'read_along', prompt: '读一读：The cat is on the red mat. The mat is by the door.', answer: 'The cat is on the red mat. The mat is by the door.' },
      { id: 'c4-2', ui: 'tap_choice', prompt: 'Where is the cat?', answer: 'on the mat', choices: ['on the mat', 'in the box', 'on the sun', 'under the bed'], hint: '找句子里的 on the ...' },
      { id: 'c4-3', ui: 'tap_choice', prompt: 'What color is the mat?', answer: 'red', choices: ['red', 'blue', 'green', 'sun'] },
      { id: 'c4-4', ui: 'tap_choice', prompt: 'Where is the mat?', answer: 'by the door', choices: ['by the door', 'on the bed', 'in the box', 'under the sun'] },
    ],
  },
  {
    id: 'eng-ch-5', index: 5, title: '口语问答 · Speaking', durationMin: 9, kind: 'read_along',
    steps: [
      { id: 'c5-1', ui: 'read_along', prompt: '跟读并回答：What do you like? I like the sun.', answer: 'What do you like? I like the sun.' },
      { id: 'c5-2', ui: 'read_along', prompt: '跟读：My name is Leo. I can run and jump.', answer: 'My name is Leo. I can run and jump.' },
    ],
  },
  {
    id: 'eng-ch-6', index: 6, title: '故事阅读 · My Pet', durationMin: 12, kind: 'read_along',
    steps: [
      { id: 'c6-1', ui: 'read_along', prompt: '跟我一起读故事：I have a pet dog. His name is Bingo. He is brown and white. He likes to run and play with me.', answer: 'I have a pet dog. His name is Bingo. He is brown and white. He likes to run and play with me.' },
      { id: 'c6-2', ui: 'tap_choice', prompt: '故事里的小狗叫什幺名字？', answer: 'Bingo', choices: ['Bingo', 'Tom', 'Leo', 'Brown'] },
      { id: 'c6-3', ui: 'tap_choice', prompt: 'Bingo 喜欢做什幺？', answer: '跑和玩', choices: ['跑和玩', '睡觉', '吃饭', '游泳'] },
      { id: 'c6-4', ui: 'tap_choice', prompt: '小狗是什幺颜色的？', answer: '棕色和白色', choices: ['棕色和白色', '只棕色', '只白色', '黑色'] },
    ],
  },
  {
    id: 'eng-ch-7', index: 7, title: '故事阅读 · A Rainy Day', durationMin: 13, kind: 'read_along',
    steps: [
      { id: 'c7-1', ui: 'read_along', prompt: '跟我读：It is a rainy day. Mom says, "Take your umbrella." I take my red umbrella and go out. I see a big puddle. I jump over it!', answer: 'It is a rainy day. Mom says, "Take your umbrella." I take my red umbrella and go out. I see a big puddle. I jump over it!' },
      { id: 'c7-2', ui: 'tap_choice', prompt: '今天是什幺天气？', answer: '下雨天', choices: ['下雨天', '晴天', '下雪天', '大风天'] },
      { id: 'c7-3', ui: 'tap_choice', prompt: '"我"带了什幺颜色的伞？', answer: '红色', choices: ['红色', '蓝色', '绿色', '黄色'] },
      { id: 'c7-4', ui: 'tap_choice', prompt: '"我"看见了什幺？', answer: '大水坑', choices: ['大水坑', '小狗', '大树', '汽车'] },
    ],
  },
  {
    id: 'eng-ch-8', index: 8, title: '故事阅读 · Lost & Found', durationMin: 13, kind: 'read_along',
    steps: [
      { id: 'c8-1', ui: 'read_along', prompt: '跟我读：Tom cannot find his book. He looks under the bed — no. He looks behind the door — no. He looks in his bag — yes! "Here it is!" he says.', answer: 'Tom cannot find his book. He looks under the bed — no. He looks behind the door — no. He looks in his bag — yes! "Here it is!" he says.' },
      { id: 'c8-2', ui: 'tap_choice', prompt: 'Tom 在找什幺？', answer: '他的书', choices: ['他的书', '他的玩具', '他的伞', '他的食物'] },
      { id: 'c8-3', ui: 'tap_choice', prompt: '书最后在哪里找到的？', answer: '在书包里', choices: ['在书包里', '在床底下', '在门后面', '在桌上'] },
      { id: 'c8-4', ui: 'tap_choice', prompt: '故事告诉我们什幺？', answer: '仔细找找自己的包', choices: ['仔细找找自己的包', '不要找东西', '门后面最好', '永远别看床底下'] },
    ],
  },
  {
    id: 'eng-ch-9', index: 9, title: '词组 II · 日常动作', durationMin: 9, kind: 'sentence_build',
    steps: [
      { id: 'c9-1', ui: 'tap_choice', prompt: '"sit down" 是什幺意思？', answer: '坐下', choices: ['坐下', '站起来', '看下面', '上去'] },
      { id: 'c9-2', ui: 'tap_choice', prompt: '"take off" 是什幺意思？', answer: '脱掉', choices: ['脱掉', '穿上', '拿走', '关掉'] },
      { id: 'c9-3', ui: 'order_words', prompt: '排句子：down / Please / sit', answer: 'Please sit down' },
      { id: 'c9-4', ui: 'read_along', prompt: '跟读：Please sit down. It is time to eat.', answer: 'Please sit down. It is time to eat.' },
    ],
  },
  {
    id: 'eng-ch-10', index: 10, title: '词组 III · 学校生活', durationMin: 9, kind: 'sentence_build',
    steps: [
      { id: 'c10-1', ui: 'tap_choice', prompt: '"listen to" 是什幺意思？', answer: '听', choices: ['听', '看着', '写下', '交给'] },
      { id: 'c10-2', ui: 'tap_choice', prompt: '"write down" 是什幺意思？', answer: '写下', choices: ['写下', '听写', '擦掉', '读出'] },
      { id: 'c10-3', ui: 'order_words', prompt: '排句子：to / Listen / the teacher', answer: 'Listen to the teacher' },
      { id: 'c10-4', ui: 'read_along', prompt: '跟读：Listen to the teacher. Write down your name.', answer: 'Listen to the teacher. Write down your name.' },
    ],
  },
  {
    id: 'eng-ch-11', index: 11, title: '句型 II · 疑问句', durationMin: 10, kind: 'sentence_build',
    steps: [
      { id: 'c11-1', ui: 'order_words', prompt: '排成疑问句：is / this / your bag / Is', answer: 'Is this your bag' },
      { id: 'c11-2', ui: 'read_along', prompt: '跟读：Is this your bag? Yes, it is.', answer: 'Is this your bag? Yes, it is.' },
      { id: 'c11-3', ui: 'order_words', prompt: '排成疑问句：you / Can / swim', answer: 'Can you swim' },
      { id: 'c11-4', ui: 'read_along', prompt: '跟读：Can you swim? Yes, I can swim well.', answer: 'Can you swim? Yes, I can swim well.' },
    ],
  },
  {
    id: 'eng-ch-12', index: 12, title: '句型 III · There be 句型', durationMin: 10, kind: 'sentence_build',
    steps: [
      { id: 'c12-1', ui: 'tap_choice', prompt: '"There is a book" 是什幺意思？', answer: '有一本书', choices: ['有一本书', '没有书', '书在哪里', '书很重'] },
      { id: 'c12-2', ui: 'order_words', prompt: '排句子：is / There / a cat / on the chair', answer: 'There is a cat on the chair' },
      { id: 'c12-3', ui: 'order_words', prompt: '排句子：are / There / some apples / in the bowl', answer: 'There are some apples in the bowl' },
      { id: 'c12-4', ui: 'read_along', prompt: '跟读：There is a cat on the chair. There are some apples in the bowl.', answer: 'There is a cat on the chair. There are some apples in the bowl.' },
    ],
  },
  {
    id: 'eng-ch-13', index: 13, title: '阅读理解 · In the Park', durationMin: 12, kind: 'read_along',
    steps: [
      { id: 'c13-1', ui: 'read_along', prompt: '跟我读故事：It is Sunday. I go to the park with my mom. I see many flowers. They are red and yellow. A little bird sings in the tree. I am very happy.', answer: 'It is Sunday. I go to the park with my mom. I see many flowers. They are red and yellow. A little bird sings in the tree. I am very happy.' },
      { id: 'c13-2', ui: 'tap_choice', prompt: '故事里"我"和谁去公园？', answer: '和妈妈', choices: ['和妈妈', '和朋友', '一个人', '和爸爸'] },
      { id: 'c13-3', ui: 'tap_choice', prompt: '花是什幺颜色的？', answer: '红色和黄色', choices: ['红色和黄色', '蓝色和绿色', '只有红色', '只有黄色'] },
      { id: 'c13-4', ui: 'tap_choice', prompt: '什幺在树上唱歌？', answer: '一只小鸟', choices: ['一只小鸟', '一只猫', '一只蝴蝶', '一个小孩'] },
    ],
  },
  {
    id: 'eng-ch-14', index: 14, title: '故事阅读 · My Family', durationMin: 12, kind: 'read_along',
    steps: [
      { id: 'c14-1', ui: 'read_along', prompt: '跟我读：I have a happy family. My dad is tall. He works in a hospital. My mom is a teacher. She is kind. I have a little sister. She is three years old. We play together every day.', answer: 'I have a happy family. My dad is tall. He works in a hospital. My mom is a teacher. She is kind. I have a little sister. She is three years old. We play together every day.' },
      { id: 'c14-2', ui: 'tap_choice', prompt: '爸爸在哪里工作？', answer: '医院', choices: ['医院', '学校', '公园', '工厂'] },
      { id: 'c14-3', ui: 'tap_choice', prompt: '妈妈是做什幺的？', answer: '老师', choices: ['老师', '医生', '护士', '司机'] },
      { id: 'c14-4', ui: 'tap_choice', prompt: '妹妹几岁了？', answer: '三岁', choices: ['三岁', '五岁', '两岁', '六岁'] },
    ],
  },
  {
    id: 'eng-ch-15', index: 15, title: '故事阅读 · A Trip to the Zoo', durationMin: 13, kind: 'read_along',
    steps: [
      { id: 'c15-1', ui: 'read_along', prompt: '跟我读：Today we go to the zoo. I see a big elephant. It has long nose and big ears. I see monkeys too. They jump from tree to tree. A parrot says "Hello!" to me. I like the zoo very much.', answer: 'Today we go to the zoo. I see a big elephant. It has long nose and big ears. I see monkeys too. They jump from tree to tree. A parrot says "Hello!" to me. I like the zoo very much.' },
      { id: 'c15-2', ui: 'tap_choice', prompt: '"我"在动物园看到了什幺大动物？', answer: '大象', choices: ['大象', '老虎', '狮子', '长颈鹿'] },
      { id: 'c15-3', ui: 'tap_choice', prompt: '大象有什幺特征？', answer: '长鼻子和大耳朵', choices: ['长鼻子和大耳朵', '短尾巴', '小眼睛', '长腿'] },
      { id: 'c15-4', ui: 'tap_choice', prompt: '谁对"我"说了"Hello"？', answer: '一只鹦鹉', choices: ['一只鹦鹉', '一只猴子', '一头大象', '一个工作人员'] },
    ],
  },
  {
    id: 'eng-ch-16', index: 16, title: '故事阅读 · My School Day', durationMin: 13, kind: 'read_along',
    steps: [
      { id: 'c16-1', ui: 'read_along', prompt: '跟我读：I go to school at eight. I say "Good morning" to my teacher. We read books and write words. At noon, I eat lunch with my friends. After school, I go home and do my homework. I like my school.', answer: 'I go to school at eight. I say "Good morning" to my teacher. We read books and write words. At noon, I eat lunch with my friends. After school, I go home and do my homework. I like my school.' },
      { id: 'c16-2', ui: 'tap_choice', prompt: '"我"几点上学？', answer: '八点', choices: ['八点', '七点', '九点', '十点'] },
      { id: 'c16-3', ui: 'tap_choice', prompt: '"我"对老师说了什幺？', answer: 'Good morning', choices: ['Good morning', 'Goodbye', 'Hello', 'Thank you'] },
      { id: 'c16-4', ui: 'tap_choice', prompt: '放学后"我"做什幺？', answer: '回家做作业', choices: ['回家做作业', '去公园玩', '看电视', '去动物园'] },
    ],
  },
  {
    id: 'eng-ch-17', index: 17, title: '故事阅读 · The Little Seed', durationMin: 13, kind: 'read_along',
    steps: [
      { id: 'c17-1', ui: 'read_along', prompt: '跟我读：A little seed falls on the ground. The sun shines. The rain falls. The seed grows and grows. First, it has two small leaves. Then, it becomes a tall plant. In summer, it has beautiful flowers. The bees come to visit. How nice!', answer: 'A little seed falls on the ground. The sun shines. The rain falls. The seed grows and grows. First, it has two small leaves. Then, it becomes a tall plant. In summer, it has beautiful flowers. The bees come to visit. How nice!' },
      { id: 'c17-2', ui: 'tap_choice', prompt: '种子掉在哪里？', answer: '地上', choices: ['地上', '水里', '树上', '房子里'] },
      { id: 'c17-3', ui: 'tap_choice', prompt: '什幺帮助种子生长？（选两个原因里最对的）', answer: '阳光和雨水', choices: ['阳光和雨水', '只有阳光', '只有雨水', '风和雪'] },
      { id: 'c17-4', ui: 'tap_choice', prompt: '夏天植物开出了什幺？', answer: '美丽的花', choices: ['美丽的花', '更多的种子', '叶子', '果实'] },
    ],
  },
  {
    id: 'eng-ch-18', index: 18, title: '故事阅读 · Helping Mom', durationMin: 13, kind: 'read_along',
    steps: [
      { id: 'c18-1', ui: 'read_along', prompt: '跟我读：Mom is cleaning the house. "Can I help?" I ask. "Yes, please take the cups to the kitchen," says Mom. I carry the cups carefully. "Thank you, you are a good helper," Mom smiles. I feel proud.', answer: 'Mom is cleaning the house. "Can I help?" I ask. "Yes, please take the cups to the kitchen," says Mom. I carry the cups carefully. "Thank you, you are a good helper," Mom smiles. I feel proud.' },
      { id: 'c18-2', ui: 'tap_choice', prompt: '妈妈在做什幺？', answer: '打扫房子', choices: ['打扫房子', '做饭', '看书', '打电话'] },
      { id: 'c18-3', ui: 'tap_choice', prompt: '"我"帮忙做了什幺？', answer: '把杯子拿到厨房', choices: ['把杯子拿到厨房', '扫地', '擦桌子', '洗衣服'] },
      { id: 'c18-4', ui: 'tap_choice', prompt: '妈妈最后怎幺说的？', answer: '你是个好帮手', choices: ['你是个好帮手', '不用帮了', '去做作业', '出去玩吧'] },
    ],
  },
];

export const mathChallenge: Lesson[] = [
  {
    id: 'math-ch-1', index: 1, title: '进位加法：35 + 27', durationMin: 9, kind: 'add_sub',
    steps: [
      { id: 'm1-1', ui: 'number_pad', prompt: '35 + 27 = ?（先算个位 5+7=12）', answer: 62 },
      { id: 'm1-2', ui: 'tap_choice', prompt: '个位 5 + 7 等于几，要进位吗？', answer: '12，进位1', choices: ['12，进位1', '2，不进位', '15，进位1', '12，不进位'], hint: '满十进一' },
    ],
  },
  {
    id: 'math-ch-2', index: 2, title: '退位减法：62 − 38', durationMin: 9, kind: 'add_sub',
    steps: [
      { id: 'm2-1', ui: 'number_pad', prompt: '62 − 38 = ?（个位 2 不够减，向十位借 1）', answer: 24 },
      { id: 'm2-2', ui: 'tap_choice', prompt: '算 81 − 47 时，个位要向十位借吗？', answer: '要，借 1 当 10', choices: ['要，借 1 当 10', '不要', '要，借 1 当 100', '无所谓'], hint: '个位 1 减 7 不够' },
    ],
  },
  {
    id: 'math-ch-3', index: 3, title: '加减混合：45 + 18 − 23', durationMin: 9, kind: 'add_sub',
    steps: [
      { id: 'm3-1', ui: 'number_pad', prompt: '45 + 18 = ?', answer: 63 },
      { id: 'm3-2', ui: 'number_pad', prompt: '63 − 23 = ?', answer: 40 },
    ],
  },
  {
    id: 'math-ch-4', index: 4, title: '表内乘法：2/3/4/5 的乘法', durationMin: 9, kind: 'add_sub',
    steps: [
      { id: 'm4-1', ui: 'number_pad', prompt: '3 × 4 = ?', answer: 12 },
      { id: 'm4-2', ui: 'number_pad', prompt: '5 × 6 = ?', answer: 30 },
      { id: 'm4-3', ui: 'tap_choice', prompt: '2 × 5 表示什幺？', answer: '2个5相加', choices: ['2个5相加', '2加5', '5个2相减', '25'], hint: '乘法是相同数相加' },
    ],
  },
  {
    id: 'math-ch-5', index: 5, title: '乘法的意义：每组几个', durationMin: 9, kind: 'count_objects',
    steps: [
      { id: 'm5-1', ui: 'drag_count', prompt: '把两组草莓合起来，一共几个？', answer: 12, bagCount: 5, bagCount2: 7 },
      { id: 'm5-2', ui: 'number_pad', prompt: '3 组，每组 4 个，共几个？3 × 4 = ?', answer: 12 },
    ],
  },
  {
    id: 'math-ch-6', index: 6, title: '缺数：? + 15 = 40', durationMin: 8, kind: 'add_sub',
    steps: [
      { id: 'm6-1', ui: 'number_pad', prompt: '? + 15 = 40，空格里填几？', answer: 25 },
      { id: 'm6-2', ui: 'number_pad', prompt: '? × 3 = 18，空格里填几？', answer: 6 },
    ],
  },
  {
    id: 'math-ch-7', index: 7, title: '应用题：解决问题', durationMin: 10, kind: 'add_sub',
    steps: [
      { id: 'm7-1', ui: 'tap_choice', prompt: '小明有 23 颗糖，吃了 8 颗，还剩几颗？', answer: '15 颗', choices: ['15 颗', '31 颗', '8 颗', '23 颗'], hint: '吃了要用减法' },
      { id: 'm7-2', ui: 'number_pad', prompt: '列式算一算：23 − 8 = ?', answer: 15 },
    ],
  },
  {
    id: 'math-ch-8', index: 8, title: '比较大小：< > =', durationMin: 8, kind: 'compare',
    steps: [
      { id: 'm8-1', ui: 'tap_choice', prompt: '45 和 54，哪个大？', answer: '54 大', choices: ['54 大', '45 大', '一样大', '不能比'] },
      { id: 'm8-2', ui: 'tap_choice', prompt: '在 37 ○ 37 中填什幺符号？', answer: '=', choices: ['=', '>', '<', '+'] },
    ],
  },
  {
    id: 'math-ch-9', index: 9, title: '平面图形：认识形状', durationMin: 8, kind: 'shapes',
    steps: [
      { id: 'm9-1', ui: 'tap_choice', prompt: '有 3 个角、3 条边的图形叫什幺？', answer: '三角形', choices: ['三角形', '长方形', '圆形', '正方形'] },
      { id: 'm9-2', ui: 'tap_choice', prompt: '长方形有几条边？几条一样长？', answer: '4条，对边一样长', choices: ['4条，对边一样长', '4条，都一样长', '3条', '0条'] },
      { id: 'm9-3', ui: 'tap_choice', prompt: '正方形和长方形最大的不同是什幺？', answer: '正方形四边都一样长', choices: ['正方形四边都一样长', '正方形没有角', '长方形是圆的', '没有不同'] },
      { id: 'm9-4', ui: 'tap_choice', prompt: '圆形有几条边？', answer: '0条，它是曲线', choices: ['0条，它是曲线', '1条', '4条', '3条'] },
    ],
  },
  {
    id: 'math-ch-10', index: 10, title: '立体图形：正方体/圆柱', durationMin: 8, kind: 'shapes',
    steps: [
      { id: 'm10-1', ui: 'tap_choice', prompt: '一个像皮球、篮球的立体图形叫什幺？', answer: '球体', choices: ['球体', '正方体', '长方体', '圆柱'] },
      { id: 'm10-2', ui: 'tap_choice', prompt: '正方体有几个面？', answer: '6个', choices: ['6个', '4个', '3个', '8个'] },
      { id: 'm10-3', ui: 'tap_choice', prompt: '魔方像哪个立体图形？', answer: '正方体', choices: ['正方体', '球体', '圆柱', '圆'] },
      { id: 'm10-4', ui: 'tap_choice', prompt: '水杯、柱子像哪个立体图形？', answer: '圆柱', choices: ['圆柱', '球体', '正方体', '三角形'] },
    ],
  },
];

// ---------------------------------------------------------- 语文模块（古诗词 + 成语，繁体字）
export const chineseLessons: Lesson[] = [
  {
    id: 'ch-1', index: 1, title: '古诗 · 《静夜思》李白', durationMin: 10, kind: 'poem',
    steps: [
      { id: 'ch1-1', ui: 'read_along', prompt: '跟着读一遍：', answer: '床前明月光，疑是地上霜。举头望明月，低头思故乡。' },
      { id: 'ch1-2', ui: 'tap_choice', prompt: '这首诗的作者是谁？', answer: '李白', choices: ['李白', '杜甫', '王维', '白居易'], hint: '字太白，被称为「诗仙」' },
      { id: 'ch1-3', ui: 'tap_choice', prompt: '「举头望明月」中的「举头」是什幺意思？', answer: '抬头', choices: ['抬头', '低头', '回头', '点头'] },
      { id: 'ch1-4', ui: 'order_words', prompt: '把第一句排好：', answer: '床前明月光' },
    ],
  },
  {
    id: 'ch-2', index: 2, title: '古诗 · 《春晓》孟浩然', durationMin: 10, kind: 'poem',
    steps: [
      { id: 'ch2-1', ui: 'read_along', prompt: '跟着读一遍：', answer: '春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。' },
      { id: 'ch2-2', ui: 'tap_choice', prompt: '这首诗写的是哪个季节？', answer: '春天', choices: ['春天', '夏天', '秋天', '冬天'] },
      { id: 'ch2-3', ui: 'tap_choice', prompt: '「处处闻啼鸟」中的「啼」是什幺意思？', answer: '鸟叫', choices: ['鸟叫', '哭泣', '说话', '唱歌'] },
      { id: 'ch2-4', ui: 'order_words', prompt: '把第二句排好：', answer: '处处闻啼鸟' },
    ],
  },
  {
    id: 'ch-3', index: 3, title: '古诗 · 《悯农》李绅', durationMin: 10, kind: 'poem',
    steps: [
      { id: 'ch3-1', ui: 'read_along', prompt: '跟着读一遍：', answer: '锄禾日当午，汗滴禾下土。谁知盘中餐，粒粒皆辛苦。' },
      { id: 'ch3-2', ui: 'tap_choice', prompt: '这首诗想告诉我们什幺？', answer: '粮食来之不易，要珍惜', choices: ['粮食来之不易，要珍惜', '农民很快乐', '中午太热了', '要多吃饭'], hint: '想想「粒粒皆辛苦」' },
      { id: 'ch3-3', ui: 'tap_choice', prompt: '「锄禾日当午」中的「当午」是指？', answer: '正午', choices: ['正午', '早上', '傍晚', '半夜'] },
      { id: 'ch3-4', ui: 'order_words', prompt: '把第三句排好：', answer: '谁知盘中餐' },
    ],
  },
  {
    id: 'ch-4', index: 4, title: '古诗 · 《咏鹅》骆宾王', durationMin: 10, kind: 'poem',
    steps: [
      { id: 'ch4-1', ui: 'read_along', prompt: '跟着读一遍：', answer: '鹅，鹅，鹅，曲项向天歌。白毛浮绿水，红掌拨清波。' },
      { id: 'ch4-2', ui: 'tap_choice', prompt: '这首诗写的是什幺动物？', answer: '鹅', choices: ['鹅', '鸭', '鸡', '天鹅'] },
      { id: 'ch4-3', ui: 'tap_choice', prompt: '「白毛浮绿水」中的「浮」是什幺意思？', answer: '漂在水上', choices: ['漂在水上', '沉到水里', '飞过水面', '站在岸边'] },
      { id: 'ch4-4', ui: 'order_words', prompt: '把第二句排好：', answer: '曲项向天歌' },
    ],
  },
  {
    id: 'ch-5', index: 5, title: '古诗 · 《登鹳雀楼》王之涣', durationMin: 10, kind: 'poem',
    steps: [
      { id: 'ch5-1', ui: 'read_along', prompt: '跟着读一遍：', answer: '白日依山尽，黄河入海流。欲穷千里目，更上一层楼。' },
      { id: 'ch5-2', ui: 'tap_choice', prompt: '「欲穷千里目，更上一层楼」告诉我们什幺道理？', answer: '要想看得更远，就要站得更高', choices: ['要想看得更远，就要站得更高', '楼越高越好', '太阳下山了', '黄河很长'], hint: '「穷」是看尽的意思' },
      { id: 'ch5-3', ui: 'tap_choice', prompt: '这首诗的作者是谁？', answer: '王之涣', choices: ['王之涣', '李白', '杜甫', '苏轼'] },
      { id: 'ch5-4', ui: 'order_words', prompt: '把第四句排好：', answer: '更上一层楼' },
    ],
  },
  {
    id: 'ch-6', index: 6, title: '成语 · 一心一意', durationMin: 8, kind: 'idiom',
    steps: [
      { id: 'ch6-1', ui: 'read_along', prompt: '读一读这个成语：', answer: '一心一意：形容做事专心致志，全心全意。' },
      { id: 'ch6-2', ui: 'tap_choice', prompt: '「一心一意」是什幺意思？', answer: '做事专心，不分心', choices: ['做事专心，不分心', '心里只有一个人', '一心想着一件事', '心意很坚定'] },
      { id: 'ch6-3', ui: 'tap_choice', prompt: '下面哪个行为是「一心一意」？', answer: '做作业时不看电视', choices: ['做作业时不看电视', '边吃饭边玩手机', '上课时想着玩游戏', '写字时东张西望'] },
      { id: 'ch6-4', ui: 'order_words', prompt: '把成语排好：', answer: '一心一意' },
    ],
  },
  {
    id: 'ch-7', index: 7, title: '成语 · 守株待兔', durationMin: 9, kind: 'idiom',
    steps: [
      { id: 'ch7-1', ui: 'read_along', prompt: '读一读这个成语的故事：', answer: '守株待兔：从前有个农夫，看到一只兔子撞死在树桩上。从此他不再种地，天天等兔子来撞树，结果甚幺也没等到。比喻不主动努力，妄想不劳而获。' },
      { id: 'ch7-2', ui: 'tap_choice', prompt: '「守株待兔」比喻什幺样的人？', answer: '不主动努力，想不劳而获', choices: ['不主动努力，想不劳而获', '勤劳种地的人', '喜欢兔子的人', '善于观察的人'] },
      { id: 'ch7-3', ui: 'tap_choice', prompt: '故事里的农夫为什幺最后甚幺也没得到？', answer: '他不再种地，只等兔子', choices: ['他不再种地，只等兔子', '兔子太少了', '树桩不够多', '天气不好'] },
      { id: 'ch7-4', ui: 'order_words', prompt: '把成语排好：', answer: '守株待兔' },
    ],
  },
  {
    id: 'ch-8', index: 8, title: '成语 · 画蛇添足', durationMin: 9, kind: 'idiom',
    steps: [
      { id: 'ch8-1', ui: 'read_along', prompt: '读一读这个成语的故事：', answer: '画蛇添足：有人画蛇比赛，第一个人画好了，又给蛇添上脚，结果输了。比喻做了多余的事，反而弄巧成拙。' },
      { id: 'ch8-2', ui: 'tap_choice', prompt: '「画蛇添足」是什幺意思？', answer: '做了多余的事，反而更糟', choices: ['做了多余的事，反而更糟', '画画很好看', '蛇有四只脚', '比赛不公平'] },
      { id: 'ch8-3', ui: 'tap_choice', prompt: '故事里第一个人为什幺输了？', answer: '他给蛇画了脚', choices: ['他给蛇画了脚', '他画得太慢', '他的蛇不好看', '裁判不公平'] },
      { id: 'ch8-4', ui: 'order_words', prompt: '把成语排好：', answer: '画蛇添足' },
    ],
  },
  {
    id: 'ch-9', index: 9, title: '成语 · 拔苗助长', durationMin: 9, kind: 'idiom',
    steps: [
      { id: 'ch9-1', ui: 'read_along', prompt: '读一读这个成语的故事：', answer: '拔苗助长：农夫嫌禾苗长得太慢，把它们一棵棵往上拔高，结果禾苗全枯死了。比喻违背规律，急于求成，反而坏事。' },
      { id: 'ch9-2', ui: 'tap_choice', prompt: '「拔苗助长」告诉我们什幺道理？', answer: '做事不能急于求成', choices: ['做事不能急于求成', '禾苗要常拔', '种地很辛苦', '要勤快干活'] },
      { id: 'ch9-3', ui: 'tap_choice', prompt: '故事里的禾苗为什幺枯死了？', answer: '农夫把它们拔高了', choices: ['农夫把它们拔高了', '没有浇水', '太阳太晒', '虫子吃了'] },
      { id: 'ch9-4', ui: 'order_words', prompt: '把成语排好：', answer: '拔苗助长' },
    ],
  },
  {
    id: 'ch-10', index: 10, title: '成语 · 刻舟求剑', durationMin: 9, kind: 'idiom',
    steps: [
      { id: 'ch10-1', ui: 'read_along', prompt: '读一读这个成语的故事：', answer: '刻舟求剑：有人坐船时把剑掉进水里，他在船边刻了个记号，等船靠岸才下水找剑，当然找不到了。比喻拘泥固执，不知变通。' },
      { id: 'ch10-2', ui: 'tap_choice', prompt: '「刻舟求剑」比喻什幺样的人？', answer: '拘泥固执，不知变通', choices: ['拘泥固执，不知变通', '喜欢刻船的人', '剑术高手', '善于游泳的人'] },
      { id: 'ch10-3', ui: 'tap_choice', prompt: '故事里的人为什幺找不到剑？', answer: '船走了，剑没走', choices: ['船走了，剑没走', '水太深了', '剑生锈了', '有人捡走了'] },
      { id: 'ch10-4', ui: 'order_words', prompt: '把成语排好：', answer: '刻舟求剑' },
    ],
  },
  // ------------------------------------------------ 古诗（续）
  {
    id: 'ch-11', index: 11, title: '古诗 · 《咏柳》贺知章', durationMin: 10, kind: 'poem',
    steps: [
      { id: 'ch11-1', ui: 'read_along', prompt: '跟着读一遍：', answer: '碧玉妆成一树高，万条垂下绿丝绦。不知细叶谁裁出，二月春风似剪刀。' },
      { id: 'ch11-2', ui: 'tap_choice', prompt: '这首诗写的是哪种植物？', answer: '柳树', choices: ['柳树', '桃花', '荷花', '梅花'] },
      { id: 'ch11-3', ui: 'tap_choice', prompt: '「二月春风似剪刀」把春风比成了什幺？', answer: '剪刀', choices: ['剪刀', '笔', '月亮', '丝带'] },
      { id: 'ch11-4', ui: 'order_words', prompt: '把第一句排好：', answer: '碧玉妆成一树高' },
    ],
  },
  {
    id: 'ch-12', index: 12, title: '古诗 · 《池上》白居易', durationMin: 10, kind: 'poem',
    steps: [
      { id: 'ch12-1', ui: 'read_along', prompt: '跟着读一遍：', answer: '小娃撑小艇，偷采白莲回。不解藏踪迹，浮萍一道开。' },
      { id: 'ch12-2', ui: 'tap_choice', prompt: '诗里的小朋友在干什幺？', answer: '撑小船采莲', choices: ['撑小船采莲', '爬树', '放风筝', '钓鱼'] },
      { id: 'ch12-3', ui: 'tap_choice', prompt: '「小娃」是什幺意思？', answer: '小孩子', choices: ['小孩子', '小鱼', '小鸟', '小船'] },
      { id: 'ch12-4', ui: 'order_words', prompt: '把第二句排好：', answer: '偷采白莲回' },
    ],
  },
  {
    id: 'ch-13', index: 13, title: '古诗 · 《村居》高鼎', durationMin: 10, kind: 'poem',
    steps: [
      { id: 'ch13-1', ui: 'read_along', prompt: '跟着读一遍：', answer: '草长莺飞二月天，拂堤杨柳醉春烟。儿童散学归来早，忙趁东风放纸鸢。' },
      { id: 'ch13-2', ui: 'tap_choice', prompt: '孩子们放的是什幺？', answer: '纸鸢（风筝）', choices: ['纸鸢（风筝）', '风车', '气球', '灯笼'] },
      { id: 'ch13-3', ui: 'tap_choice', prompt: '这首诗写的是哪个季节？', answer: '春天', choices: ['春天', '夏天', '秋天', '冬天'] },
      { id: 'ch13-4', ui: 'order_words', prompt: '把第三句排好：', answer: '儿童散学归来早' },
    ],
  },
  {
    id: 'ch-14', index: 14, title: '古诗 · 《所见》袁枚', durationMin: 10, kind: 'poem',
    steps: [
      { id: 'ch14-1', ui: 'read_along', prompt: '跟着读一遍：', answer: '牧童骑黄牛，歌声振林樾。意欲捕鸣蝉，忽然闭口立。' },
      { id: 'ch14-2', ui: 'tap_choice', prompt: '牧童想捉的是什幺？', answer: '蝉（知了）', choices: ['蝉（知了）', '蝴蝶', '鸟', '鱼'] },
      { id: 'ch14-3', ui: 'tap_choice', prompt: '「忽然闭口立」是为什幺？', answer: '怕吓跑蝉', choices: ['怕吓跑蝉', '累了', '听到雷声', '要睡觉'] },
      { id: 'ch14-4', ui: 'order_words', prompt: '把第一句排好：', answer: '牧童骑黄牛' },
    ],
  },
  // ------------------------------------------------ 成语（续）
  {
    id: 'ch-21', index: 21, title: '成语 · 井底之蛙', durationMin: 9, kind: 'idiom',
    steps: [
      { id: 'ch21-1', ui: 'read_along', prompt: '读一读这个成语：', answer: '井底之蛙：一只青蛙住在井底，以为天只有井口那幺大。比喻见识短浅，眼界狭小的人。' },
      { id: 'ch21-2', ui: 'tap_choice', prompt: '「井底之蛙」比喻什幺样的人？', answer: '见识短浅的人', choices: ['见识短浅的人', '很会游泳的人', '住在井边的人', '喜欢看天的人'] },
      { id: 'ch21-3', ui: 'tap_choice', prompt: '我们可以怎幺做才不像「井底之蛙」？', answer: '多看看外面的世界', choices: ['多看看外面的世界', '一直待在家里', '不看书', '不听别人说'] },
      { id: 'ch21-4', ui: 'order_words', prompt: '把成语排好：', answer: '井底之蛙' },
    ],
  },
  {
    id: 'ch-22', index: 22, title: '成语 · 狐假虎威', durationMin: 9, kind: 'idiom',
    steps: [
      { id: 'ch22-1', ui: 'read_along', prompt: '读一读这个成语：', answer: '狐假虎威：狐狸借着老虎的威风吓跑百兽。比喻倚仗别人的势力欺压人。' },
      { id: 'ch22-2', ui: 'tap_choice', prompt: '「狐假虎威」里是谁在真正发威？', answer: '老虎', choices: ['老虎', '狐狸', '小兔', '小鹿'] },
      { id: 'ch22-3', ui: 'tap_choice', prompt: '「假」在这里是什幺意思？', answer: '借、利用', choices: ['借、利用', '假的', '放假', '假装'] },
      { id: 'ch22-4', ui: 'order_words', prompt: '把成语排好：', answer: '狐假虎威' },
    ],
  },
  {
    id: 'ch-23', index: 23, title: '成语 · 亡羊补牢', durationMin: 9, kind: 'idiom',
    steps: [
      { id: 'ch23-1', ui: 'read_along', prompt: '读一读这个成语：', answer: '亡羊补牢：羊圈破了丢了羊，才去修补。比喻出了问题后及时补救，还不算晚。' },
      { id: 'ch23-2', ui: 'tap_choice', prompt: '「亡羊补牢」告诉我们什幺？', answer: '犯错后要赶快补救', choices: ['犯错后要赶快补救', '羊不重要', '不用修羊圈', '丢了就算了'] },
      { id: 'ch23-3', ui: 'tap_choice', prompt: '故事里的人一开始为什幺丢了羊？', answer: '羊圈破了个洞', choices: ['羊圈破了个洞', '狼太凶', '羊自己跑掉', '门没锁'] },
      { id: 'ch23-4', ui: 'order_words', prompt: '把成语排好：', answer: '亡羊补牢' },
    ],
  },
  {
    id: 'ch-24', index: 24, title: '成语 · 对牛弹琴', durationMin: 9, kind: 'idiom',
    steps: [
      { id: 'ch24-1', ui: 'read_along', prompt: '读一读这个成语：', answer: '对牛弹琴：对着牛弹琴，牛听不懂。比喻对不懂道理的人讲道理，白费口舌。' },
      { id: 'ch24-2', ui: 'tap_choice', prompt: '「对牛弹琴」是什幺意思？', answer: '对听不懂的人白费口舌', choices: ['对听不懂的人白费口舌', '弹琴很好听', '牛很喜欢音乐', '在田里弹琴'] },
      { id: 'ch24-3', ui: 'order_words', prompt: '把成语排好：', answer: '对牛弹琴' },
    ],
  },
  // ------------------------------------------------ 认字小教室
  {
    id: 'chz-1', index: 31, title: '认字 · 日 月 水 火', durationMin: 7, kind: 'character',
    steps: [
      { id: 'cz1-1', ui: 'tap_choice', prompt: '下面哪个是「日」字？', answer: '日', choices: ['日', '目', '月', '田'] },
      { id: 'cz1-2', ui: 'tap_choice', prompt: '哪个是「水」字？', answer: '水', choices: ['水', '火', '木', '山'] },
      { id: 'cz1-3', ui: 'read_along', prompt: '跟读：日月水火', answer: '日月水火' },
    ],
  },
  {
    id: 'chz-2', index: 32, title: '认字 · 大 小 上 下', durationMin: 7, kind: 'character',
    steps: [
      { id: 'cz2-1', ui: 'tap_choice', prompt: '哪个是「大」字？', answer: '大', choices: ['大', '小', '人', '天'] },
      { id: 'cz2-2', ui: 'tap_choice', prompt: '哪个是「上」字？', answer: '上', choices: ['上', '下', '土', '十'] },
      { id: 'cz2-3', ui: 'read_along', prompt: '跟读：大小上下', answer: '大小上下' },
    ],
  },
  {
    id: 'chz-3', index: 33, title: '认字 · 人 口 木 林', durationMin: 7, kind: 'character',
    steps: [
      { id: 'cz3-1', ui: 'tap_choice', prompt: '哪个是「人」字？', answer: '人', choices: ['人', '入', '八', '大'] },
      { id: 'cz3-2', ui: 'tap_choice', prompt: '哪个是「木」字？', answer: '木', choices: ['木', '本', '禾', '林'] },
      { id: 'cz3-3', ui: 'read_along', prompt: '跟读：人口木林', answer: '人口木林' },
    ],
  },
];

// ---------------------------------------------------------- 英语：主题词 / 句型 / 视觉词（P1A 基础，拓宽内容广度）
export const englishThemeWordLessons: Lesson[] = [
  {
    id: 'eng-tw-1', index: 1, title: '主题词 · 森林动物', durationMin: 8, kind: 'theme_words',
    steps: [
      { id: 'tw1-1', ui: 'tap_choice', prompt: '听一听，选出 "cat"', answer: 'cat', choices: ['cat', 'dog', 'pig', 'fox'], hint: '喵喵叫的小动物' },
      { id: 'tw1-2', ui: 'tap_choice', prompt: '听一听，选出 "dog"', answer: 'dog', choices: ['dog', 'cat', 'fox', 'pig'] },
      { id: 'tw1-3', ui: 'blend', prompt: '拖动拼出 "pig"', answer: ['p', 'i', 'g'] },
      { id: 'tw1-4', ui: 'read_along', prompt: '跟读：I see a pig.', answer: 'I see a pig.' },
    ],
  },
  {
    id: 'eng-tw-2', index: 2, title: '主题词 · 颜色', durationMin: 8, kind: 'theme_words',
    steps: [
      { id: 'tw2-1', ui: 'tap_choice', prompt: '哪个是 "red"？', answer: 'red', choices: ['red', 'blue', 'green', 'yellow'], hint: '苹果、消防车都是红色' },
      { id: 'tw2-2', ui: 'tap_choice', prompt: '哪个是 "yellow"？', answer: 'yellow', choices: ['yellow', 'red', 'blue', 'green'] },
      { id: 'tw2-3', ui: 'read_along', prompt: '跟读：The sun is yellow.', answer: 'The sun is yellow.' },
    ],
  },
  {
    id: 'eng-tw-3', index: 3, title: '主题词 · 数字 1–5', durationMin: 8, kind: 'theme_words',
    steps: [
      { id: 'tw3-1', ui: 'tap_choice', prompt: '听一听，选出 "three"', answer: 'three', choices: ['three', 'two', 'four', 'five'] },
      { id: 'tw3-2', ui: 'tap_choice', prompt: '哪个是 "five"？', answer: 'five', choices: ['five', 'four', 'three', 'one'] },
      { id: 'tw3-3', ui: 'read_along', prompt: '跟读：I have two apples.', answer: 'I have two apples.' },
    ],
  },
  {
    id: 'eng-tw-4', index: 4, title: '主题词 · 身体', durationMin: 7, kind: 'theme_words',
    steps: [
      { id: 'tw4-1', ui: 'tap_choice', prompt: '听一听，选出 "hand"', answer: 'hand', choices: ['hand', 'foot', 'eye', 'ear'] },
      { id: 'tw4-2', ui: 'read_along', prompt: '跟读：I have two hands.', answer: 'I have two hands.' },
    ],
  },
  {
    id: 'eng-tw-5', index: 5, title: '主题词 · 食物', durationMin: 8, kind: 'theme_words',
    steps: [
      { id: 'tw5-1', ui: 'tap_choice', prompt: '哪个是 "apple"？', answer: 'apple', choices: ['apple', 'egg', 'ice', 'orange'], hint: '红红的、脆脆的水果' },
      { id: 'tw5-2', ui: 'blend', prompt: '拖动拼出 "egg"', answer: ['e', 'g', 'g'] },
      { id: 'tw5-3', ui: 'read_along', prompt: '跟读：I eat an apple.', answer: 'I eat an apple.' },
    ],
  },
  {
    id: 'eng-tw-6', index: 6, title: '主题词 · 综合听辨', durationMin: 8, kind: 'theme_words',
    steps: [
      { id: 'tw6-1', ui: 'tap_choice', prompt: '听一听，选出 "blue"', answer: 'blue', choices: ['blue', 'red', 'green', 'yellow'] },
      { id: 'tw6-2', ui: 'tap_choice', prompt: '听一听，选出 "fish"', answer: 'fish', choices: ['fish', 'bird', 'fox', 'pig'] },
    ],
  },
];

export const englishSentenceLessons: Lesson[] = [
  {
    id: 'eng-sn-1', index: 1, title: '句型 · I can ...', durationMin: 9, kind: 'sentence_build',
    steps: [
      { id: 'sn1-1', ui: 'order_words', prompt: '排成句子：can / I / run', answer: 'I can run' },
      { id: 'sn1-2', ui: 'read_along', prompt: '跟读：I can run.', answer: 'I can run.' },
      { id: 'sn1-3', ui: 'order_words', prompt: '排成句子：can / I / sing', answer: 'I can sing' },
      { id: 'sn1-4', ui: 'read_along', prompt: '跟读：I can sing.', answer: 'I can sing.' },
    ],
  },
  {
    id: 'eng-sn-2', index: 2, title: '句型 · This is ...', durationMin: 9, kind: 'sentence_build',
    steps: [
      { id: 'sn2-1', ui: 'order_words', prompt: '排成句子：is / This / a cat', answer: 'This is a cat' },
      { id: 'sn2-2', ui: 'read_along', prompt: '跟读：This is a cat.', answer: 'This is a cat.' },
      { id: 'sn2-3', ui: 'order_words', prompt: '排成句子：is / This / my dog', answer: 'This is my dog' },
    ],
  },
  {
    id: 'eng-sn-3', index: 3, title: '句型 · I like ...', durationMin: 8, kind: 'sentence_build',
    steps: [
      { id: 'sn3-1', ui: 'order_words', prompt: '排成句子：like / I / the sun', answer: 'I like the sun' },
      { id: 'sn3-2', ui: 'read_along', prompt: '跟读：I like the sun.', answer: 'I like the sun.' },
    ],
  },
  {
    id: 'eng-sn-4', index: 4, title: '口语 · 介绍自己', durationMin: 9, kind: 'sentence_build',
    steps: [
      { id: 'sn4-1', ui: 'tap_choice', prompt: '"What is your name?" 可以怎幺回答？', answer: 'My name is Leo.', choices: ['My name is Leo.', 'I am three.', 'I like cat.', 'Good morning.'] },
      { id: 'sn4-2', ui: 'read_along', prompt: '跟读：My name is Leo.', answer: 'My name is Leo.' },
    ],
  },
];

export const englishSightWordLessons: Lesson[] = [
  {
    id: 'eng-sw-1', index: 1, title: '视觉词 · the / a / is', durationMin: 7, kind: 'sight_word',
    steps: [
      { id: 'sw1-1', ui: 'tap_choice', prompt: '哪个是 "the"？', answer: 'the', choices: ['the', 'a', 'is', 'and'], hint: '最常见的词，看到就要马上读出来' },
      { id: 'sw1-2', ui: 'tap_choice', prompt: '哪个是 "is"？', answer: 'is', choices: ['is', 'it', 'in', 'on'] },
      { id: 'sw1-3', ui: 'read_along', prompt: '跟读：The cat is big.', answer: 'The cat is big.' },
    ],
  },
  {
    id: 'eng-sw-2', index: 2, title: '视觉词 · and / you', durationMin: 7, kind: 'sight_word',
    steps: [
      { id: 'sw2-1', ui: 'tap_choice', prompt: '哪个是 "and"？', answer: 'and', choices: ['and', 'an', 'at', 'as'] },
      { id: 'sw2-2', ui: 'read_along', prompt: '跟读：You and I.', answer: 'You and I.' },
    ],
  },
  {
    id: 'eng-sw-3', index: 3, title: '视觉词 · 综合', durationMin: 7, kind: 'sight_word',
    steps: [
      { id: 'sw3-1', ui: 'tap_choice', prompt: '哪个是 "you"？', answer: 'you', choices: ['you', 'your', 'yes', 'yellow'] },
      { id: 'sw3-2', ui: 'tap_choice', prompt: '哪个是 "it"？', answer: 'it', choices: ['it', 'is', 'in', 'if'] },
    ],
  },
];

// 常规档 = 自然拼读 + 主题词 + 句型 + 视觉词（面向 P1A）
export const englishNormalPool: Lesson[] = [
  ...phonicsLessons, ...englishThemeWordLessons, ...englishSentenceLessons, ...englishSightWordLessons, ...englishBank,
];
// 挑战档 = 原二年级挑战 + 主题词 / 句型（拓宽内容广度，保证任何任务都能找到对应课）
export const englishChallengePool: Lesson[] = [
  ...phonicsChallenge, ...englishThemeWordLessons, ...englishSentenceLessons, ...englishSightWordLessons, ...englishBank,
];
const englishAll = [...englishNormalPool, ...englishChallengePool];

// ---------------------------------------------------------- 数学：形状 / 比较 / 时钟 / 图表（P1A）
export const mathShapeLessons: Lesson[] = [
  {
    id: 'math-sh-1', index: 1, title: '形状 · 认识图形', durationMin: 8, kind: 'shapes',
    steps: [
      { id: 'sh1-1', ui: 'tap_choice', prompt: '哪种图形有 3 个尖尖的角？', answer: '三角形', choices: ['三角形', '圆形', '正方形', '长方形'] },
      { id: 'sh1-2', ui: 'tap_choice', prompt: '皮球、篮球是什幺形状？', answer: '圆形', choices: ['圆形', '三角形', '正方形', '长方形'] },
    ],
  },
  {
    id: 'math-sh-2', index: 2, title: '形状 · 方形的家', durationMin: 8, kind: 'shapes',
    steps: [
      { id: 'sh2-1', ui: 'tap_choice', prompt: '哪个是正方形？', answer: '正方形', choices: ['正方形', '长方形', '三角形', '圆形'] },
      { id: 'sh2-2', ui: 'tap_choice', prompt: '正方形和长方形最大的不同？', answer: '正方形四条边一样长', choices: ['正方形四条边一样长', '长方形没有角', '它们都是圆', '没有不同'] },
    ],
  },
  {
    id: 'math-sh-3', index: 3, title: '形状 · 生活里的形状', durationMin: 7, kind: 'shapes',
    steps: [
      { id: 'sh3-1', ui: 'tap_choice', prompt: '窗户通常是哪种形状？', answer: '长方形', choices: ['长方形', '三角形', '圆形', '星形'] },
      { id: 'sh3-2', ui: 'tap_choice', prompt: '钟表和盘子通常是？', answer: '圆形', choices: ['圆形', '三角形', '方形', '月牙形'] },
    ],
  },
];

export const mathCompareLessons: Lesson[] = [
  {
    id: 'math-cp-1', index: 1, title: '比较 · 谁多谁少', durationMin: 7, kind: 'compare',
    steps: [
      { id: 'cp1-1', ui: 'tap_choice', prompt: '左边有 5 颗糖，右边有 3 颗，哪边比较多？', answer: '左边', choices: ['左边', '右边', '一样多'] },
      { id: 'cp1-2', ui: 'tap_choice', prompt: '哪一堆积木比较多？', answer: '上面那堆', choices: ['上面那堆', '下面那堆', '一样多'] },
    ],
  },
  {
    id: 'math-cp-2', index: 2, title: '比较 · 高矮', durationMin: 7, kind: 'compare',
    steps: [
      { id: 'cp2-1', ui: 'tap_choice', prompt: '长颈鹿和小兔，谁比较高？', answer: '长颈鹿', choices: ['长颈鹿', '小兔', '一样高'] },
      { id: 'cp2-2', ui: 'tap_choice', prompt: '爸爸和宝宝，谁比较高？', answer: '爸爸', choices: ['爸爸', '宝宝', '一样高'] },
    ],
  },
  {
    id: 'math-cp-3', index: 3, title: '比较 · 长短', durationMin: 7, kind: 'compare',
    steps: [
      { id: 'cp3-1', ui: 'tap_choice', prompt: '哪条绳子比较长？', answer: '红色的', choices: ['红色的', '蓝色的', '一样长'] },
    ],
  },
];

export const mathClockLessons: Lesson[] = [
  {
    id: 'math-cl-1', index: 1, title: '时钟 · 认整点', durationMin: 8, kind: 'clock_set',
    steps: [
      { id: 'cl1-1', ui: 'tap_choice', prompt: '时针指着 3，分针指着 12，是几点？', answer: '3 点', choices: ['3 点', '6 点', '9 点', '12 点'] },
      { id: 'cl1-2', ui: 'tap_choice', prompt: '晚上 9 点，时针指着数字几？', answer: '9', choices: ['9', '3', '6', '12'] },
    ],
  },
  {
    id: 'math-cl-2', index: 2, title: '时钟 · 一日作息', durationMin: 8, kind: 'clock_set',
    steps: [
      { id: 'cl2-1', ui: 'tap_choice', prompt: '吃午饭大约是几点？', answer: '12 点', choices: ['12 点', '3 点', '6 点', '9 点'] },
      { id: 'cl2-2', ui: 'tap_choice', prompt: '早上上学大约是几点？', answer: '8 点', choices: ['8 点', '12 点', '3 点', '9 点'] },
    ],
  },
];

export const mathChartLessons: Lesson[] = [
  {
    id: 'math-ct-1', index: 1, title: '图表 · 分类', durationMin: 7, kind: 'chart_sort',
    steps: [
      { id: 'ct1-1', ui: 'tap_choice', prompt: '把苹果、香蕉、草莓分成两类，应该按什幺分？', answer: '颜色', choices: ['颜色', '随便分', '不用分', '按名字笔画'] },
      { id: 'ct1-2', ui: 'tap_choice', prompt: '红色气球 3 个、蓝色 5 个，哪种颜色比较多？', answer: '蓝色', choices: ['蓝色', '红色', '一样多'] },
    ],
  },
  {
    id: 'math-ct-2', index: 2, title: '图表 · 看图回答', durationMin: 7, kind: 'chart_sort',
    steps: [
      { id: 'ct2-1', ui: 'tap_choice', prompt: '喜欢苹果 4 人、喜欢香蕉 2 人，一共几人？', answer: '6 人', choices: ['6 人', '2 人', '4 人', '8 人'] },
    ],
  },
];

export const mathNormalPool: Lesson[] = [
  ...mathAddSubLessons, ...mathShapeLessons, ...mathCompareLessons, ...mathClockLessons, ...mathChartLessons,
];
export const mathChallengePool: Lesson[] = [
  ...mathChallenge, ...mathShapeLessons, ...mathCompareLessons, ...mathClockLessons, ...mathChartLessons,
];
const mathAll = [...mathNormalPool, ...mathChallengePool];
// plan60 用的新题库（math-g2-*）与上面的旧 pool（math-1…）是两套不同 id，必须在解析时兜底，
// 否则所有天的数学任务都会 fallback 到 mathNormalPool[0]，看起来「每天一样」。
const mathBankMap = new Map(mathBank.map((l) => [l.id, l]));

// ---------------------------------------------------------- 难度感知解析（合并两档查找，保证任务都能解析到）
export function getEnglishLesson(id: string, d: Difficulty): Lesson {
  return englishAll.find((l) => l.id === id) ?? (d === 'challenge' ? englishChallengePool[0] : englishNormalPool[0]);
}
export function getMathLesson(id: string, d: Difficulty): Lesson {
  return mathAll.find((l) => l.id === id) ?? mathBankMap.get(id) ?? (d === 'challenge' ? mathChallengePool[0] : mathNormalPool[0]);
}
export function getChineseLesson(id: string): Lesson {
  return chineseLessons.find((l) => l.id === id) ?? chineseLessons[0];
}
export function englishContinue(d: Difficulty): Lesson {
  return d === 'challenge' ? englishChallengePool[0] : englishNormalPool[0];
}
export function mathContinue(d: Difficulty): Lesson {
  return d === 'challenge' ? mathChallengePool[0] : mathNormalPool[0];
}
export function chineseContinue(): Lesson {
  return chineseLessons[0];
}

// ============================================================ 今日计划：日期轮换 + 薄弱复习
// 同一天（date）计划确定不变（进度/星星稳定）；跨天自动换一批；薄弱点置顶复习。
const uniqueById = <T extends { id: string }>(arr: T[]): T[] => {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const x of arr) if (!seen.has(x.id)) { seen.add(x.id); out.push(x); }
  return out;
};
const englishUniq = uniqueById([...englishNormalPool, ...englishChallengePool]);
const mathUniq = uniqueById([...mathNormalPool, ...mathChallengePool]);

const SUBJECT_LABEL: Record<'english' | 'math' | 'chinese', string> = { english: '英语', math: '数学', chinese: '语文' };

function detailFor(subject: 'english' | 'math' | 'chinese', lesson: Lesson): string {
  if (subject === 'english') return '听音选词 · 拼读 · 跟读';
  if (subject === 'math') return '数一数 · 算一算';
  if (lesson.kind === 'poem') return '古诗朗诵与理解';
  if (lesson.kind === 'idiom') return '成语故事与运用';
  return '认字与跟读';
}

function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function mulberry32(a: number) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * 生成某一天的「今日飞行计划」。
 * @param date   YYYY-MM-DD（同一天稳定，跨天不同）
 * @param weak   已记录的薄弱课（置顶复习，最多 2 个）
 */
export function generateDailyPlan(date: string, weak: WeakLesson[]): TodayTask[] {
  const rng = mulberry32(hashStr('ff-plan-' + date));
  const shuffle = <T>(arr: T[]): T[] => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const tasks: TodayTask[] = [];
  const used = new Set<string>();

  // 1) 薄弱复习置顶（最多 2 个）
  weak.slice(0, 2).forEach((w, i) => {
    used.add(w.lessonId);
    tasks.push({
      id: `w${i}-${date}`,
      subject: w.subject,
      title: `🔁 复习 · ${w.title}`,
      detail: '把之前不太熟的地方再练一次',
      durationMin: 8,
      done: false,
      kind: 'normal',
      lessonId: w.lessonId,
    });
  });

  // 2) 正常学习任务：4 个，三科均衡
  const groups: { subject: 'english' | 'math' | 'chinese'; pool: Lesson[] }[] = [
    { subject: 'english', pool: englishUniq },
    { subject: 'math', pool: mathUniq },
    { subject: 'chinese', pool: chineseLessons },
  ];
  const picks: { subject: 'english' | 'math' | 'chinese'; l: Lesson }[] = [];
  // 每科先保底 1 个
  for (const g of groups) {
    const avail = shuffle(g.pool.filter((l) => !used.has(l.id)));
    if (avail.length) { picks.push({ subject: g.subject, l: avail[0] }); used.add(avail[0].id); }
  }
  // 再从全体随机补满到 4 个
  const rest = shuffle(groups.flatMap((g) => g.pool.filter((l) => !used.has(l.id)).map((l) => ({ subject: g.subject, l }))));
  let ri = 0;
  while (picks.length < 4 && ri < rest.length) {
    const x = rest[ri++];
    if (used.has(x.l.id)) continue;
    picks.push(x); used.add(x.l.id);
  }
  picks.forEach((p, i) => {
    tasks.push({
      id: `n${i}-${date}`,
      subject: p.subject,
      title: `${SUBJECT_LABEL[p.subject]} · ${p.l.title}`,
      detail: detailFor(p.subject, p.l),
      durationMin: p.l.durationMin,
      done: false,
      kind: 'normal',
      lessonId: p.l.id,
    });
  });

  // 3) 伸展补给站 + 复习小花园
  tasks.push({ id: `rest-${date}`, subject: 'rest', title: '伸展补给站', detail: '跟原创角色做 60 秒肩颈操', durationMin: 1, done: false, kind: 'rest' });
  tasks.push({ id: `rev-${date}`, subject: 'review', title: '复习小花园 · 薄弱点', detail: '浇水复习之前的小薄弱', durationMin: 4, done: false, kind: 'review' });
  return tasks;
}
