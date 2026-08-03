import type { MonopolyCell, MonoCard } from '@/types';

/* ============================================================
 * 森林大富翁 —— 8×8 网格外圈共 28 格（逆时针，从右下角 GO 出发）
 * 保留完整森林皮肤：GO=森林邮局、监狱=树洞休息、机会=森林奇遇、命运=森林考验。
 * 单人领地经营：玩家用大富翁金币买彩色产权地，拥有后经过自己地收租；
 * 动物领地属于小熊/小兔/小猫，路过付租（双向收租成立）。
 * ============================================================ */

export const MONO_GRID = 8; // 8×8 外圈 = 4*8-4 = 28 格

/** 颜色组（森林色系） */
export const MONO_COLOR_GROUPS: Record<string, { name: string; hex: string; ownerHex: string }> = {
  forest: { name: '森林绿', hex: '#5B9742', ownerHex: '#3C7A2C' },
  sky:    { name: '天空蓝', hex: '#5194BF', ownerHex: '#3C7A9E' },
  sun:    { name: '阳光黄', hex: '#F2C94C', ownerHex: '#E0A92E' },
  soil:   { name: '土壤棕', hex: '#855E33', ownerHex: '#6B4A29' },
  berry:  { name: '莓果粉', hex: '#E9A0C4', ownerHex: '#C76FA0' },
  moss:   { name: '苔藓绿', hex: '#A6CC8B', ownerHex: '#7CB260' },
};

function prop(i: number, label: string, emoji: string, colorGroup: string, price: number, rent: number, desc: string): MonopolyCell {
  return { index: i, kind: 'property', label, emoji, colorGroup, price, rent, owner: null, desc };
}

export const monoCells: MonopolyCell[] = [
  // 0 —— GO（右下角）
  { index: 0, kind: 'go', label: '森林邮局', emoji: '🏡', desc: '经过或停留在森林邮局，领取 20 枚大富翁金币！' },
  // 底行（1–6）
  prop(1, '橡果林', '🌰', 'forest', 6, 1, '森林里的小橡果树，松鼠最爱在这里藏宝。'),
  prop(2, '溪边芦苇', '🌾', 'sky', 6, 1, '小溪边的芦苇随风摇摆，有小鱼游过。'),
  prop(3, '向日葵田', '🌻', 'sun', 8, 2, '一片金灿灿的向日葵，朝着太阳笑。'),
  { index: 4, kind: 'animal', label: "兔子的胡萝卜园", emoji: '🥕', npc: 'rabbit', owner: 'rabbit', rent: 2, desc: '这是小兔的胡萝卜园，路过要付 2 金币萝卜税～' },
  prop(5, '泥巴坑', '🟤', 'soil', 8, 2, '雨后松软的泥巴坑，小熊最爱在这里打滚。'),
  prop(6, '莓果园', '🫐', 'berry', 10, 2, '蓝莓和树莓挂满枝头，酸甜多汁。'),
  // 7 —— 树洞休息（左下角，监狱）
  { index: 7, kind: 'jail', label: '树洞休息', emoji: '🌳', desc: '在树洞里休息 1 回合，喝杯热茶再出发。' },
  // 左列（8–13）
  prop(8, '苔藓石', '🪨', 'moss', 10, 2, '长满青苔的圆石头，坐上去凉凉的。'),
  { index: 9, kind: 'chance', label: '森林奇遇', emoji: '🍀', card: 'chance', desc: '抽一张「森林奇遇」卡，看看今天的好运气！' },
  prop(10, '松果坡', '🌲', 'forest', 12, 3, '坡上全是松果，小鹿用它们数数玩。'),
  prop(11, '云朵峰', '☁️', 'sky', 12, 3, '山顶挨着云朵，能看见很远很远的地方。'),
  prop(12, '蜂蜜洞', '🍯', 'sun', 14, 3, '树洞里藏着小熊的蜂蜜，香喷喷的。'),
  { index: 13, kind: 'fortune', label: '森林考验', emoji: '🔮', card: 'fortune', desc: '抽一张「森林考验」卡，勇敢面对小挑战！' },
  // 14 —— 森林湖（左上角，免费停车）
  { index: 14, kind: 'park', label: '森林湖', emoji: '🏞️', desc: '安全的森林湖，什幺都不会发生，安心歇脚。' },
  // 顶行（15–20）
  prop(15, '蘑菇圈', '🍄', 'soil', 14, 3, '一圈小蘑菇像小雨伞，是精灵的舞池。'),
  prop(16, '草莓谷', '🍓', 'berry', 16, 4, '红彤彤的草莓铺满山谷，香甜味飘满林间。'),
  prop(17, '蕨类丛', '🌿', 'moss', 16, 4, '高高的蕨叶像绿色羽毛扇。'),
  { index: 18, kind: 'animal', label: "小熊的蜂蜜林", emoji: '🐻', npc: 'bear', owner: 'bear', rent: 3, desc: '这是小熊的蜂蜜林，路过要付 3 金币蜂蜜费～' },
  prop(19, '橡树屋', '🏠', 'forest', 18, 4, '大橡树上的小木屋，是小鹿的家。'),
  { index: 20, kind: 'chance', label: '森林奇遇', emoji: '🍀', card: 'chance', desc: '又一处森林奇遇，好事情也许来了！' },
  // 21 —— 命运之泉（右上角）
  { index: 21, kind: 'fountain', label: '命运之泉', emoji: '⛲', desc: '来到命运之泉，抽一张卡决定接下来的旅程。' },
  // 右列（22–27）
  prop(22, '彩虹桥', '🌈', 'sky', 18, 4, '雨后出现的彩虹桥，踩上去软软的。'),
  prop(23, '阳光草坪', '🌞', 'sun', 20, 5, '晒着太阳的暖暖草坪，最适合野餐。'),
  { index: 24, kind: 'animal', label: "小猫的鱼塘", emoji: '🐱', npc: 'cat', owner: 'cat', rent: 3, desc: '这是小猫的鱼塘，路过要付 3 金币鱼食费～' },
  prop(25, '板栗林', '🌰', 'soil', 20, 5, '板栗裹着小刺球，掉下来咚咚响。'),
  { index: 26, kind: 'fortune', label: '森林考验', emoji: '🔮', card: 'fortune', desc: '最后一处森林考验，鼓起勇气！' },
  prop(27, '月光莓园', '🌙', 'berry', 22, 5, '夜里会发光的莓子，是小兔的珍藏。'),
];

/* ============================================================
 * 卡牌库
 * ============================================================ */
export interface MonoCardDef {
  id: string;
  type: MonoCard;
  text: string;
  effect: 'coins' | 'move' | 'toGo' | 'treeHole' | 'extraRoll' | 'none';
  value?: number; // coins / move 时使用
}

export const monoChanceCards: MonoCardDef[] = [
  { id: 'c1', type: 'chance', text: '🍃 蝴蝶指引你飞向森林邮局，领取 20 金币！', effect: 'toGo' },
  { id: 'c2', type: 'chance', text: '🌰 拾到松鼠掉的松果，获得 10 金币！', effect: 'coins', value: 10 },
  { id: 'c3', type: 'chance', text: '🐦 帮迷路小鸟回家，获得 8 金币谢礼。', effect: 'coins', value: 8 },
  { id: 'c4', type: 'chance', text: '🌬️ 一阵清风把你往前吹了 2 格。', effect: 'move', value: 2 },
  { id: 'c5', type: 'chance', text: '✨ 森林精灵说：再掷一次骰子吧！', effect: 'extraRoll' },
  { id: 'c6', type: 'chance', text: '🫐 发现一篮野莓，获得 6 金币。', effect: 'coins', value: 6 },
];

export const monoFortuneCards: MonoCardDef[] = [
  { id: 'f1', type: 'fortune', text: '🌧️ 下雨了，你躲进树洞休息 1 回合。', effect: 'treeHole' },
  { id: 'f2', type: 'fortune', text: '🟤 踩到泥坑，付 6 金币给森林修路。', effect: 'coins', value: -6 },
  { id: 'f3', type: 'fortune', text: '🧭 迷路了，后退 3 格重新找路。', effect: 'move', value: -3 },
  { id: 'f4', type: 'fortune', text: '🐜 帮忙蚂蚁搬家，付 4 金币买糖水分给它们。', effect: 'coins', value: -4 },
  { id: 'f5', type: 'fortune', text: '🐺 一阵冷风，付 5 金币买热可可保暖。', effect: 'coins', value: -5 },
  { id: 'f6', type: 'fortune', text: '❄️ 暴风雪来了，直接去树洞休息 1 回合。', effect: 'treeHole' },
];

/** 抽卡（随机）。caller 负责去重/洗牌，这里简单随机返回一张。 */
export function drawMonoCard(type: MonoCard): MonoCardDef {
  const pool = type === 'chance' ? monoChanceCards : monoFortuneCards;
  return pool[Math.floor(Math.random() * pool.length)];
}

/** 8×8 网格外圈第 i 格的 (row, col) 坐标（row 0=顶，col 0=左），逆时针从底右角开始。 */
export function monoGridPos(i: number): { row: number; col: number } {
  const N = MONO_GRID;
  if (i <= N - 1) return { row: N - 1, col: N - 1 - i };          // 底行右→左
  if (i <= 2 * N - 2) return { row: (2 * N - 2) - i, col: 0 };      // 左列下→上
  if (i <= 3 * N - 3) return { row: 0, col: i - (2 * N - 2) };      // 顶行左→右
  return { row: i - (3 * N - 3), col: N - 1 };                      // 右列上→下
}
