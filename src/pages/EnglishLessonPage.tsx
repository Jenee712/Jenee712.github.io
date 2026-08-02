import { useNavigate, useParams } from 'react-router-dom';
import { LessonPlayer } from '@/components/widgets/LessonPlayer';
import { getEnglishLesson, englishUnits } from '@/data/curriculum';
import { useAppStore } from '@/store/useAppStore';

export function EnglishLessonPage() {
  const { lessonId } = useParams();
  const nav = useNavigate();
  const complete = useAppStore(s => s.completeTask);
  const award = useAppStore(s => s.awardSticker);
  const setLast = useAppStore(s => s.setLastResult);
  const difficulty = useAppStore(s => s.parent.difficulty);

  const lesson = getEnglishLesson(lessonId ?? '', difficulty);
  const unit = englishUnits.find(u => u.current)!;

  return (
    <LessonPlayer
      lesson={lesson}
      subject="english"
      storyLine={`故事任务 · ${unit.storyTask}`}
      onExit={() => nav('/english')}
      onComplete={async (payload) => {
        const t = useAppStore.getState().tasks.find(x => x.lessonId === lessonId);
        const perfect = payload.correct === payload.total;
        const stickerId = perfect ? 'corgi-cheer' : 'cat-smug';
        const reason = perfect ? '正常完成英语关卡' : '连续答对，真棒';
        const res = t ? await complete(t.id, payload) : { coins: undefined, steps: undefined };
        await award(stickerId, reason, 'daily_task');
        setLast({
          taskId: t?.id ?? lessonId ?? lesson.id,
          correct: payload.correct,
          total: payload.total,
          minutes: payload.minutes,
          coins: res.coins,
          steps: res.steps,
          stickerId,
          newKnowledge: perfect ? 'CVC 拼读' : undefined,
          mode: 'normal',
        });
        nav(`/lesson/result/${t?.id ?? lesson.id}`);
      }}
    />
  );
}
