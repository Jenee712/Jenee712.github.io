import { useNavigate, useParams } from 'react-router-dom';
import { LessonPlayer } from '@/components/widgets/LessonPlayer';
import { getChineseLesson } from '@/data/curriculum';
import { useAppStore } from '@/store/useAppStore';

export function ChineseLessonPage() {
  const { lessonId } = useParams();
  const nav = useNavigate();
  const complete = useAppStore(s => s.completeTask);
  const award = useAppStore(s => s.awardSticker);
  const setLast = useAppStore(s => s.setLastResult);
  const streakDays = useAppStore(s => s.kid.streakDays);

  const lesson = getChineseLesson(lessonId ?? '');

  return (
    <LessonPlayer
      lesson={lesson}
      subject="english"
      storyLine={`語文學習 · ${lesson.title}`}
      onExit={() => nav('/chinese')}
      onComplete={async (payload) => {
        const t = useAppStore.getState().tasks.find(x => x.lessonId === lesson.id);
        const perfect = payload.correct === payload.total;
        const stickerId = streakDays >= 5 ? 'deer-shine' : perfect ? 'bear-wow' : 'rabbit-happy-cry';
        const reason = streakDays >= 5 ? '連續打卡' : perfect ? '掌握新的語文知識' : '連續答對，真棒';
        const res = t ? await complete(t.id, payload) : { coins: undefined, steps: undefined };
        await award(stickerId, reason, streakDays >= 5 ? 'streak' : 'unit_complete');
        setLast({
          taskId: t?.id ?? lesson.id,
          correct: payload.correct,
          total: payload.total,
          minutes: payload.minutes,
          coins: res.coins,
          steps: res.steps,
          stickerId,
          newKnowledge: perfect ? lesson.title : undefined,
          mode: streakDays >= 5 ? 'streak' : 'unit',
        });
        nav(`/lesson/result/${t?.id ?? lesson.id}`);
      }}
    />
  );
}
