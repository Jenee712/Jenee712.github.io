import type { StickerSheet } from '@/components/ui/StickerCrop';

export type DesignStickerCategory = 'animals' | 'nature' | 'treats' | 'cheer';

export interface DesignStickerItem {
  id: string;
  title: string;
  category: DesignStickerCategory;
  sheet: StickerSheet;
  position: string;
  zoom: number;
  cost: number;
}

export const DESIGN_STICKERS: DesignStickerItem[] = [
  { id: 'cozy-cat', title: '秋日小猫', category: 'animals', sheet: 'autumnCozy', position: '31% 10%', zoom: 430, cost: 8 },
  { id: 'cozy-hedgehog', title: '散步刺猬', category: 'animals', sheet: 'autumnCozy', position: '68% 88%', zoom: 430, cost: 10 },
  { id: 'spring-rabbit', title: '粉色小兔', category: 'animals', sheet: 'spring', position: '8% 12%', zoom: 430, cost: 10 },
  { id: 'spring-bear', title: '春日小熊', category: 'animals', sheet: 'spring', position: '86% 10%', zoom: 440, cost: 8 },
  { id: 'cap-cat', title: '帽子小猫', category: 'animals', sheet: 'breakfast', position: '29% 32%', zoom: 450, cost: 10 },
  { id: 'cool-bear', title: '墨镜小熊', category: 'animals', sheet: 'breakfast', position: '45% 62%', zoom: 450, cost: 12 },
  { id: 'happy-bear', title: '抱抱小熊', category: 'animals', sheet: 'happyDay', position: '31% 82%', zoom: 430, cost: 10 },

  { id: 'smile-pumpkin', title: '微笑南瓜', category: 'nature', sheet: 'autumnCozy', position: '45% 38%', zoom: 430, cost: 8 },
  { id: 'yellow-pear', title: '快乐鸭梨', category: 'nature', sheet: 'autumnCozy', position: '64% 12%', zoom: 470, cost: 6 },
  { id: 'red-mushroom', title: '红帽蘑菇', category: 'nature', sheet: 'autumnBotany', position: '66% 79%', zoom: 450, cost: 8 },
  { id: 'double-acorn', title: '橡果兄弟', category: 'nature', sheet: 'autumnBotany', position: '27% 72%', zoom: 430, cost: 8 },
  { id: 'white-daisy', title: '白色雏菊', category: 'nature', sheet: 'autumnBotany', position: '48% 25%', zoom: 440, cost: 6 },
  { id: 'blue-butterfly', title: '蓝色蝴蝶', category: 'nature', sheet: 'spring', position: '63% 50%', zoom: 440, cost: 8 },
  { id: 'moon-star', title: '月亮星星', category: 'nature', sheet: 'happyDay', position: '79% 23%', zoom: 450, cost: 8 },

  { id: 'choco-cupcake', title: '巧克力杯糕', category: 'treats', sheet: 'chocolate', position: '35% 32%', zoom: 450, cost: 8 },
  { id: 'birthday-cake', title: '小熊生日糕', category: 'treats', sheet: 'chocolate', position: '62% 48%', zoom: 430, cost: 12 },
  { id: 'cookie-smile', title: '笑脸曲奇', category: 'treats', sheet: 'chocolate', position: '31% 88%', zoom: 450, cost: 6 },
  { id: 'choco-bar', title: '真实巧克力', category: 'treats', sheet: 'chocolate', position: '73% 83%', zoom: 460, cost: 8 },
  { id: 'happy-burger', title: '双层汉堡', category: 'treats', sheet: 'breakfast', position: '52% 7%', zoom: 450, cost: 10 },
  { id: 'bear-cereal', title: '小熊麦片', category: 'treats', sheet: 'breakfast', position: '64% 35%', zoom: 450, cost: 8 },
  { id: 'sunny-breakfast', title: '阳光早餐', category: 'treats', sheet: 'breakfast', position: '77% 69%', zoom: 440, cost: 10 },

  { id: 'be-kind', title: 'Be Kind', category: 'cheer', sheet: 'kindWords', position: '29% 2%', zoom: 400, cost: 6 },
  { id: 'love-you', title: 'Love You', category: 'cheer', sheet: 'kindWords', position: '72% 5%', zoom: 430, cost: 8 },
  { id: 'good-job', title: 'Good Job', category: 'cheer', sheet: 'kindWords', position: '31% 35%', zoom: 430, cost: 6 },
  { id: 'smile-heart', title: '微笑爱心', category: 'cheer', sheet: 'kindWords', position: '67% 40%', zoom: 460, cost: 8 },
  { id: 'happy-word', title: 'Happy', category: 'cheer', sheet: 'happyDay', position: '60% 58%', zoom: 430, cost: 6 },
  { id: 'rainbow-heart', title: '彩虹抱抱', category: 'cheer', sheet: 'happyDay', position: '84% 80%', zoom: 430, cost: 10 },
];
