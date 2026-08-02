# 森林学习站 · Forest Study Station

香港 P1 男生 · 暑假英语 + 数学学习工作台（iPad 优先）

## 启动

```bash
cd forest-study-station
npm install
npm run dev
# → http://localhost:5173
```

## 技术栈

- **Vite 5** + **React 18** + **TypeScript 5**
- **Tailwind CSS 3** — 自定义 forest / cream / sun / sky / soil 色板
- **React Router 6** — 路由
- **Zustand 4** — 状态 + 跨 tab 实时同步
- **clsx** — className 工具

字体：Baloo 2（标题）+ Noto Sans SC（中文）。

## 目录结构

```
forest-study-station/
├── public/leaf.svg                # favicon
├── src/
│   ├── main.tsx                   # 入口
│   ├── App.tsx                    # 路由
│   ├── index.css                  # design tokens + 组件类
│   ├── types/                     # 全部领域类型
│   ├── data/
│   │   ├── curriculum.ts          # P1A 英数 8 单元 / 8 关
│   │   ├── board.ts               # 28 格棋盘
│   │   └── user.ts                # 模拟数据：孩子 / 家长 / 今日任务
│   ├── store/useAppStore.ts       # Zustand store
│   ├── lib/
│   │   ├── api.ts                 # 后端 API stub（MockApi）
│   │   └── sync.ts                # 实时同步 stub（BroadcastChannel）
│   ├── components/
│   │   ├── layout/                # AppShell / Sidebar / TopBar / MobileNav
│   │   ├── characters/Mascot.tsx  # 8 个原创 SVG 角色
│   │   └── widgets/
│   │       └── LessonPlayer.tsx   # 通用关卡播放器
│   └── pages/
│       ├── HomePage.tsx
│       ├── EnglishPage.tsx
│       ├── EnglishLessonPage.tsx
│       ├── MathPage.tsx
│       ├── MathLessonPage.tsx
│       ├── ForestBoardPage.tsx
│       ├── GrowthAlbumPage.tsx
│       ├── ParentPinPage.tsx
│       ├── ParentCenterPage.tsx
│       └── NotFoundPage.tsx
└── tailwind.config.js
```

## 路由

| 路径 | 角色 | 说明 |
| --- | --- | --- |
| `/` | 孩子 | 首页 · 今日飞行计划 |
| `/english` | 孩子 | 英语主页 · P1A 技能航线 |
| `/english/lesson/:lessonId` | 孩子 | 英语关卡（Phonics / 视觉词 / 绘本） |
| `/math` | 孩子 | 数学主页 · P1A 知识地图 |
| `/math/lesson/:lessonId` | 孩子 | 数学关卡（数 / 10 内加减） |
| `/board` | 孩子 | 森林棋盘 |
| `/album` | 孩子 | 成长图鉴（知识 / 贴纸 / 作品 / 里程碑） |
| `/parent` | 家长 | PIN 验证 |
| `/parent/center` | 家长 | 家长中心（8 个 tab） |

## 设计 Tokens

| Token | 值 | 用途 |
| --- | --- | --- |
| `forest-50..900` | 森林绿主色 | 导航、按钮、强调 |
| `cream-50..300` | 自然米色 | 背景、卡片 |
| `sun-400/500` | 阳光黄 | 当前 / 强调 / 提示 |
| `sky-400/500` | 天空蓝 | 辅色、链接 |
| `soil-400/500` | 泥土棕 | 角色、复古元素 |
| `rounded-leaf` | 28px 6px 28px 6px | 叶片形卡片 |
| `rounded-pebble` | 24px | 鹅卵石形 |
| `shadow-soft` | 双向阴影 | 卡片悬浮 |
| `shadow-lift` | 更深双向阴影 | 强调元素 |

## 后端接入

### API（`src/lib/api.ts`）

```ts
import { api } from '@/lib/api';
const kid = await api.getKid();
await api.completeTask(taskId, { correct: 9, total: 10, minutes: 6 });
```

替换为真实后端：把 `MockApi` 换成 `HttpApi('/api')`，业务代码不动。

### 实时同步（`src/lib/sync.ts`）

```ts
import { sync } from '@/lib/sync';
sync.publish({ type: 'task.completed', payload: { ... } });
const off = sync.subscribe((e) => { /* 多设备同步 */ });
```

替换为 WebSocket：在 `SyncClient` 构造里挂 `new WebSocket(env.SYNC_URL)`，publish / subscribe 内部改成 send / onmessage。

## 设计原则

1. 儿童端 5 个一级导航（首页 / 英语 / 数学 / 棋盘 / 图鉴），底部进入家长中心
2. 每个页面只突出一个最高强调按钮
3. 70/30 英数比例仅作用于时间预算，不强制每天机械分配
4. 步数仅由学习时长 × 完成度 × 正确率产生，不依赖随机骰子
5. 虚拟金币不连真实货币；现实奖励必须家长确认
6. tap target ≥ 44px；不依赖鼠标 Hover；`prefers-reduced-motion` 已尊重
7. 全部角色为原创 SVG，不引用任何商业 IP

## 家长 PIN

默认 `1234`，可在 `src/data/user.ts → initialParent.pin` 修改或接入家长中心修改（已支持 `patchParent`）。

## 下一步建议

- 接通真实后端（实现 `HttpApi` 与 `WebSocketSync`）
- 用 Lottie / 自制 SVG 动画增强 8 个角色表情
- 加入真实语音评测（Phonics 发音打分）
- 引入教师端后台（管理课程、查看班级数据）
