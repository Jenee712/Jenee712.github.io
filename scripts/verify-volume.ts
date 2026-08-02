import { getDayPlan, dayOfSummer } from '@/data/plan60';

const today = dayOfSummer(new Date('2026-08-01'));
console.log(`今天(2026-08-01)=暑期第 ${today} 天`);
const tasks = getDayPlan(today, []);
console.log('=== 今日飞行计划顺序（体量 ×2 后）===');
tasks.forEach((t, i) => {
  const pad = String(i + 1).padStart(2, '0');
  console.log(`${pad}. [${t.subject.padEnd(8)}] ${t.title} (${t.durationMin}分)`);
});
const total = tasks.reduce((a, b) => a + b.durationMin, 0);
const eng = tasks.filter((t) => t.subject === 'english').length;
const math = tasks.filter((t) => t.subject === 'math').length;
const chi = tasks.filter((t) => t.subject === 'chinese').length;
console.log(`\n英语 ${eng} 个 · 数学 ${math} 个 · 语文 ${chi} 个 · 总时长 ${total} 分钟`);

// 抽样检查前几天
console.log('\n=== 抽样前 3 天 ===');
for (const d of [1, 2, 3]) {
  const tt = getDayPlan(d, []);
  console.log(`第 ${d} 天: 英语 ${tt.filter(t => t.subject === 'english').length} / 数学 ${tt.filter(t => t.subject === 'math').length} / 语文 ${tt.filter(t => t.subject === 'chinese').length} | 总 ${tt.reduce((a, b) => a + b.durationMin, 0)} 分钟`);
}
