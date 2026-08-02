import { getDayPlan, dayOfSummer } from '@/data/plan60';
import { englishBank, englishBankByTopic } from '@/data/englishBank';

console.log('=== 验证：phonics 已彻底删除 ===');
console.log('phonics key 存在?', 'phonics' in englishBankByTopic);
console.log('englishBank 中含 "拼讀" 的课数:', englishBank.filter((l) => l.title.includes('拼讀') || l.title.includes('Phonics')).length);
console.log('englishBank 中含 "phonics_blend" kind 的课数:', englishBank.filter((l) => l.kind === 'phonics_blend').length);

console.log('\n=== 验证：第 32 天(今天) 英语课内容 ===');
const today = dayOfSummer();
const t32 = getDayPlan(today).find((t) => t.subject === 'english');
if (t32) {
  console.log('课程:', t32.title, '| lessonId=', t32.lessonId);
  const lesson = englishBank.find((l) => l.id === t32.lessonId);
  if (lesson) {
    console.log('类型:', lesson.kind, '| 时长:', lesson.durationMin, '分钟');
    lesson.steps.forEach((s, i) => {
      console.log(`\n  关 ${i + 1} [${s.ui}]`);
      console.log(`    题目: ${s.prompt}`);
      console.log(`    答案: ${JSON.stringify(s.answer)}`);
      console.log(`    选项: ${JSON.stringify(s.choices)}`);
    });
  }
}

console.log('\n=== 验证：第 1~14 天英语(全部应该是翻译题) ===');
for (let d = 1; d <= 14; d++) {
  const e = getDayPlan(d).find((t) => t.subject === 'english');
  console.log(`  第 ${d} 天: ${e?.title}  (${e?.lessonId})`);
}

console.log('\n=== 验证：抽样检查——第 5 天英语详情(应该是 vocab) ===');
const d5 = getDayPlan(5).find((t) => t.subject === 'english');
console.log('课程:', d5?.title);
const l5 = englishBank.find((l) => l.id === d5?.lessonId);
if (l5) {
  l5.steps.slice(0, 2).forEach((s, i) => {
    console.log(`  关 ${i + 1}: ${s.prompt}`);
    console.log(`    答案=${JSON.stringify(s.answer)} 选项=${JSON.stringify(s.choices)}`);
  });
}

console.log('\n=== 验证：抽样检查——第 33 天句型课(应该是 sentences) ===');
const d33 = getDayPlan(33).find((t) => t.subject === 'english');
console.log('课程:', d33?.title);
const l33 = englishBank.find((l) => l.id === d33?.lessonId);
if (l33) {
  l33.steps.forEach((s, i) => {
    console.log(`  关 ${i + 1}: ${s.prompt}`);
  });
}