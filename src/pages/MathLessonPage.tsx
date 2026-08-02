import { useNavigate, useParams } from 'react-router-dom';
import { LessonPlayer } from '@/components/widgets/LessonPlayer';
import { getMathLesson, mathUnits } from '@/data/curriculum';
import { useAppStore } from '@/store/useAppStore';

export function MathLessonPage() {
  const { lessonId } = useParams();
  const nav = useNavigate();
  const complete = useAppStore(s => s.completeTask);
  const award = useAppStore(s => s.awardSticker);
  const setLast = useAppStore(s => s.setLastResult);
  const streakDays = useAppStore(s => s.kid.streakDays);
  const difficulty = useAppStore(s => s.parent.difficulty);

  const lesson = getMathLesson(lessonId ?? '', difficulty);
  const unit = mathUnits.find(u => u.current)!;

  return (
    <LessonPlayer
      lesson={lesson}
      subject="math"
      storyLine={`故事任务 · ${unit.storyTask}`}
      onExit={() => nav('/math')}
      onComplete={async (payload) => {
        const t = useAppStore.getState().tasks.find(x => x.lessonId === lessonId);
        const perfect = payload.correct === payload.total;
        // 掌握新数学知识 → 小熊「哇哦」；连续打卡 → 小鹿；否则正常/连续答对
        const stickerId = streakDays >= 5 ? 'deer-shine' : perfect ? 'bear-wow' : 'cat-smug';
        const reason = streakDays >= 5 ? '连续打卡' : perfect ? '掌握新的数学知识' : '连续答对，真棒';
        const res = t ? await complete(t.id, payload) : { coins: undefined, steps: undefined };
        await award(stickerId, reason, streakDays >= 5 ? 'streak' : 'unit_complete');
        setLast({
          taskId: t?.id ?? lessonId ?? lesson.id,
          correct: payload.correct,
          total: payload.total,
          minutes: payload.minutes,
          coins: res.coins,
          steps: res.steps,
          stickerId,
          newKnowledge: perfect ? '10 以内加法' : undefined,
          mode: streakDays >= 5 ? 'streak' : 'unit',
        });
        nav(`/lesson/result/${t?.id ?? lesson.id}`);
      }}
    />
  );
}
