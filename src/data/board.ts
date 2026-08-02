import type { BoardCell, BoardCellKind, AnimalSticker } from '@/types';

/**
 * 森林田园主题棋盘 —— 椭圆环线 28 格。不采用四边方形地产式、无掷骰子、无租金破产。
 * 步数由学习时长/完成度/正确率/连续打卡/复习产生（见 store.completeTask）。
 */
export const boardCells: BoardCell[] = [
  { index: 0,  kind: 'start',     label: '起点',       emoji: '🏡', status: 'done',      stepReward: 0, title: '森林邮局出发', desc: '小鹿领航员从这里出发，开启一天的森林学习。', rewardText: '出发礼：1 枚树叶徽章' },
  { index: 1,  kind: 'english',   label: '英语叶片',   emoji: '🍃', status: 'done',      stepReward: 1, title: '英语叶片格', desc: '读一读路牌上的英文单词，收集一片绿叶。', rewardText: '前进 1 步' },
  { index: 2,  kind: 'treasure',  label: '知识宝箱',   emoji: '🧰', status: 'done',      stepReward: 2, title: '知识宝箱', desc: '打开宝箱，复习一个刚学会的知识。', rewardText: '前进 2 步 + 5 金币' },
  { index: 3,  kind: 'math',      label: '数学菜园',   emoji: '🥕', status: 'done',      stepReward: 1, title: '数学菜园格', desc: '帮小熊园丁数一数菜园里的胡萝卜。', rewardText: '前进 1 步' },
  { index: 4,  kind: 'sticker',   label: '动物贴纸',   emoji: '⭐', status: 'done',      stepReward: 0, title: '动物贴纸格', desc: '从还没拥有的动物贴纸里，选一张收进贴纸册。', rewardText: '获得 1 张动态动物贴纸' },
  { index: 5,  kind: 'story',     label: '故事任务',   emoji: '📖', status: 'done',      stepReward: 1, title: '故事任务格', desc: '森林邮局要重新开张，帮兔子邮差送一封信。', rewardText: '前进 1 步' },
  { index: 6,  kind: 'rest',      label: '补给站',     emoji: '🦌', status: 'current',   stepReward: 3, title: '伸展补给站', desc: '跟小鹿做 60 秒伸展操，放松一下眼睛和身体。', rewardText: '前进 3 步' },
  { index: 7,  kind: 'weekend',   label: '周末庆典',   emoji: '🎉', status: 'available', stepReward: 6, title: '周末森林庆典', desc: '完成本周亲子任务后，参加周末森林庆典，领取大奖。', rewardText: '周末大奖：步数 + 贴纸' },
  { index: 8,  kind: 'works',     label: '作品展台',   emoji: '🖼️', status: 'available', stepReward: 1, title: '作品展台', desc: '把今天的跟读录音或描红作品，展示在森林作品袋。', rewardText: '前进 1 步' },
  { index: 9,  kind: 'review',    label: '复习花园',   emoji: '🌱', status: 'available', stepReward: 1, title: '复习小花园', desc: '给昨天的薄弱点浇浇水，让小苗快快长大。', rewardText: '前进 1 步' },
  { index: 10, kind: 'coin',      label: '金币果园',   emoji: '🪙', status: 'available', stepReward: 2, title: '金币果园', desc: '摘一颗金苹果，果园会奖励你虚拟金币。', rewardText: '前进 2 步 + 8 金币' },
  { index: 11, kind: 'parent',    label: '亲子任务',   emoji: '🤝', status: 'available', stepReward: 2, title: '亲子任务格', desc: '和家长一起完成一个轻量线下小任务。', rewardText: '前进 2 步（需家长确认）' },
  { index: 12, kind: 'english',   label: '英语叶片',   emoji: '🍃', status: 'locked',    stepReward: 1, title: '英语叶片格', desc: '读一读路牌上的英文单词，收集一片绿叶。', rewardText: '前进 1 步' },
  { index: 13, kind: 'treasure',  label: '知识宝箱',   emoji: '🧰', status: 'locked',    stepReward: 2, title: '知识宝箱', desc: '打开宝箱，复习一个刚学会的知识。', rewardText: '前进 2 步 + 5 金币' },
  { index: 14, kind: 'math',      label: '数学菜园',   emoji: '🥕', status: 'locked',    stepReward: 1, title: '数学菜园格', desc: '帮小熊园丁数一数菜园里的胡萝卜。', rewardText: '前进 1 步' },
  { index: 15, kind: 'sticker',   label: '动物贴纸',   emoji: '⭐', status: 'locked',    stepReward: 0, title: '动物贴纸格', desc: '从还没拥有的动物贴纸里，选一张收进贴纸册。', rewardText: '获得 1 张动态动物贴纸' },
  { index: 16, kind: 'rest',      label: '补给站',     emoji: '🦌', status: 'locked',    stepReward: 3, title: '伸展补给站', desc: '跟小鹿做 60 秒伸展操，放松一下眼睛和身体。', rewardText: '前进 3 步' },
  { index: 17, kind: 'story',     label: '故事任务',   emoji: '📖', status: 'locked',    stepReward: 1, title: '故事任务格', desc: '森林邮局要重新开张，帮兔子邮差送一封信。', rewardText: '前进 1 步' },
  { index: 18, kind: 'works',     label: '作品展台',   emoji: '🖼️', status: 'locked',    stepReward: 1, title: '作品展台', desc: '把今天的跟读录音或描红作品，展示在森林作品袋。', rewardText: '前进 1 步' },
  { index: 19, kind: 'review',    label: '复习花园',   emoji: '🌱', status: 'locked',    stepReward: 1, title: '复习小花园', desc: '给昨天的薄弱点浇浇水，让小苗快快长大。', rewardText: '前进 1 步' },
  { index: 20, kind: 'coin',      label: '金币果园',   emoji: '🪙', status: 'locked',    stepReward: 2, title: '金币果园', desc: '摘一颗金苹果，果园会奖励你虚拟金币。', rewardText: '前进 2 步 + 8 金币' },
  { index: 21, kind: 'parent',    label: '亲子任务',   emoji: '🤝', status: 'locked',    stepReward: 2, title: '亲子任务格', desc: '和家长一起完成一个轻量线下小任务。', rewardText: '前进 2 步（需家长确认）' },
  { index: 22, kind: 'english',   label: '英语叶片',   emoji: '🍃', status: 'locked',    stepReward: 1, title: '英语叶片格', desc: '读一读路牌上的英文单词，收集一片绿叶。', rewardText: '前进 1 步' },
  { index: 23, kind: 'treasure',  label: '知识宝箱',   emoji: '🧰', status: 'locked',    stepReward: 2, title: '知识宝箱', desc: '打开宝箱，复习一个刚学会的知识。', rewardText: '前进 2 步 + 5 金币' },
  { index: 24, kind: 'math',      label: '数学菜园',   emoji: '🥕', status: 'locked',    stepReward: 1, title: '数学菜园格', desc: '帮小熊园丁数一数菜园里的胡萝卜。', rewardText: '前进 1 步' },
  { index: 25, kind: 'sticker',   label: '动物贴纸',   emoji: '⭐', status: 'locked',    stepReward: 0, title: '动物贴纸格', desc: '从还没拥有的动物贴纸里，选一张收进贴纸册。', rewardText: '获得 1 张动态动物贴纸' },
  { index: 26, kind: 'weekend',   label: '周末庆典',   emoji: '🎉', status: 'locked',    stepReward: 6, title: '周末森林庆典', desc: '完成本周亲子任务后，参加周末森林庆典，领取大奖。', rewardText: '周末大奖：步数 + 贴纸' },
  { index: 27, kind: 'weekend',   label: '终点',       emoji: '🏁', status: 'locked',    stepReward: 5, title: '森林终点', desc: '绕森林一圈，回到邮局，完成本周旅程！', rewardText: '终点大奖' },
];

export const cellKindExplanation: Record<BoardCellKind, { title: string; desc: string; emoji: string }> = {
  start:    { title: '起点',     desc: '小鹿领航员从这里出发', emoji: '🏡' },
  normal:   { title: '普通格',   desc: '前进 1 步',           emoji: '🌿' },
  english:  { title: '英语叶片格', desc: '读英文、收绿叶',     emoji: '🍃' },
  math:     { title: '数学菜园格', desc: '数一数、种菜园',     emoji: '🥕' },
  treasure: { title: '知识宝箱',  desc: '复习刚学的知识',     emoji: '🧰' },
  sticker:  { title: '动物贴纸格', desc: '收一张动态贴纸',     emoji: '⭐' },
  rest:     { title: '伸展补给站', desc: '60 秒伸展放松',      emoji: '🦌' },
  review:   { title: '复习小花园', desc: '浇水复习薄弱点',     emoji: '🌱' },
  story:    { title: '故事任务格', desc: '森林邮局故事线',     emoji: '📖' },
  works:    { title: '作品展台',  desc: '展示今日作品',       emoji: '🖼️' },
  parent:   { title: '亲子任务格', desc: '和家长一起完成',     emoji: '🤝' },
  coin:     { title: '金币果园',  desc: '摘金苹果得金币',     emoji: '🪙' },
  weekend:  { title: '周末森林庆典', desc: '本周大奖',         emoji: '🎉' },
};

// ============================================================ 动物表情包贴纸
// 严格遵循规格【十九】。animatedSrc/staticSrc 指向 /assets/stickers/ 下真实资源
// （用户后续放入 corgi-cheer.gif / corgi-cheer.png 即可生效；未放入时组件降级显示 SVG 角色）。
export const initialStickers: AnimalSticker[] = [
  {
    id: 'corgi-cheer', character: 'corgi', emotion: 'cheer', title: '太棒啦',
    description: '双爪举高，开心弹跳。完成绘本跟读时使用。',
    animatedSrc: '/assets/stickers/corgi-cheer.gif', staticSrc: '/assets/stickers/corgi-cheer.png',
    altText: '柯基豆豆双爪举高开心弹跳，表示太棒啦',
    unlockType: 'daily_task', unlockValue: 1,
    owned: true, unlockedAt: '2026-07-28', unlockReason: '完成绘本跟读 I like the sun.',
  },
  {
    id: 'cat-smug', character: 'cat', emotion: 'smug', title: '这题小意思',
    description: '闭眼微笑，得意摇摆。连续答对时使用。',
    animatedSrc: '/assets/stickers/cat-smug.gif', staticSrc: '/assets/stickers/cat-smug.png',
    altText: '橘猫橙橙闭眼微笑得意摇摆，表示这题小意思',
    unlockType: 'daily_task', unlockValue: 3, owned: false,
  },
  {
    id: 'rabbit-happy-cry', character: 'rabbit', emotion: 'happy-cry', title: '感动哭了',
    description: '流开心眼泪，双手捧脸。完成复习或描红作品时使用。',
    animatedSrc: '/assets/stickers/rabbit-happy-cry.gif', staticSrc: '/assets/stickers/rabbit-happy-cry.png',
    altText: '垂耳兔点点流着开心眼泪双手捧脸，表示感动哭了',
    unlockType: 'review', owned: false,
  },
  {
    id: 'bear-wow', character: 'bear', emotion: 'wow', title: '哇哦',
    description: '捧脸，惊喜张嘴。掌握新数学知识时使用。',
    animatedSrc: '/assets/stickers/bear-wow.gif', staticSrc: '/assets/stickers/bear-wow.png',
    altText: '小熊麦麦捧脸惊喜张嘴，表示哇哦',
    unlockType: 'unit_complete', owned: false,
  },
  {
    id: 'deer-shine', character: 'deer', emotion: 'shine', title: '闪亮登场',
    description: '眼睛闪亮，举手庆祝。连续打卡时使用。',
    animatedSrc: '/assets/stickers/deer-shine.gif', staticSrc: '/assets/stickers/deer-shine.png',
    altText: '小鹿森森眼睛闪亮举手庆祝，表示闪亮登场',
    unlockType: 'streak', unlockValue: 6,
    owned: true, unlockedAt: '2026-07-30', unlockReason: '连续打卡 6 天',
  },
  {
    id: 'penguin-dizzy', character: 'penguin', emotion: 'dizzy', title: '开心转圈',
    description: '眼冒星星，左右摇摆。完成英语主题单元时使用。',
    animatedSrc: '/assets/stickers/penguin-dizzy.gif', staticSrc: '/assets/stickers/penguin-dizzy.png',
    altText: '企鹅圆圆眼冒星星左右摇摆，表示开心转圈',
    unlockType: 'unit_complete', owned: false,
  },
  // --- 金币兑换类（演示「学习金币兑换」入口，无真实货币） ---
  {
    id: 'corgi-wink', character: 'corgi', emotion: 'wink', title: '悄悄话',
    description: '眨眨眼，凑近说悄悄话。用森林金币兑换。',
    // 动图资产待补：暂留空，组件自动降级为原创 SVG 角色（规格十九）
    animatedSrc: '', staticSrc: '',
    altText: '柯基豆豆眨眨眼凑近说悄悄话',
    unlockType: 'coins', coinCost: 20, owned: false,
  },
  {
    id: 'cat-yum', character: 'cat', emotion: 'yum', title: '好味道',
    description: '舔舔嘴，满足眯眼。用森林金币兑换。',
    // 动图资产待补：暂留空，组件自动降级为原创 SVG 角色（规格十九）
    animatedSrc: '', staticSrc: '',
    altText: '橘猫橙橙舔舔嘴满足眯眼，表示好味道',
    unlockType: 'coins', coinCost: 20, owned: false,
  },
  {
    id: 'penguin-hug', character: 'penguin', emotion: 'hug', title: '抱抱',
    description: '张开小翅膀要抱抱。用森林金币兑换。',
    // 动图资产待补：暂留空，组件自动降级为原创 SVG 角色（规格十九）
    animatedSrc: '', staticSrc: '',
    altText: '企鹅圆圆张开小翅膀要抱抱',
    unlockType: 'coins', coinCost: 30, owned: false,
  },
];
