import { useEffect, useState } from 'react';
import type { AvatarKey } from '@/types';
import { Mascot } from '@/components/characters/Mascot';

/**
 * 伸展补给站弹窗（连续学习达设定时长时触发）。
 * - 倒计时 6 秒（动画+口号用），期间两个按钮随时可点
 * - 「完成啦」= 真的做完了伸展
 * - 「跳过一次」= 想继续学习；点了以后按钮消失，「完成啦」变蓝提示
 */
const STRETCH_SECONDS = 6;

export function StretchReminder({
  open,
  onClose,
  mascot = 'deer',
}: {
  open: boolean;
  onClose: () => void;
  mascot?: AvatarKey;
}) {
  const [sec, setSec] = useState(STRETCH_SECONDS);
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    if (!open) {
      setSec(STRETCH_SECONDS);
      setSkipped(false);
      return;
    }
    if (sec <= 0) return;
    const t = setTimeout(() => setSec((s) => Math.max(0, s - 1)), 1000);
    return () => clearTimeout(t);
  }, [open, sec]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-forest-900/40 p-4"
      role="dialog"
      aria-label="伸展补给站"
    >
      <div className="card-barn max-w-sm w-full p-6 text-center animate-pop">
        <Mascot name={mascot} size={120} animated className="animate-wiggle" />
        <h2 className="type-h3 mt-2">伸展补给站</h2>
        <p className="type-body text-forest-600 mt-1">
          跟小鹿一起，伸伸胳膊、转转头，让眼睛休息一下吧～
        </p>
        <div
          className="my-4 text-4xl font-display font-bold text-forest-700"
          aria-live="polite"
        >
          {sec > 0 ? sec : '🌿'}
        </div>
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className={`tap ${skipped ? 'btn-primary-lg' : 'btn-primary'}`}
          >
            {skipped ? '继续学习 🚀' : '完成啦 ✅'}
          </button>
          {!skipped && (
            <button
              type="button"
              onClick={() => {
                setSkipped(true);
              }}
              className="btn-ghost tap"
            >
              跳过一次
            </button>
          )}
        </div>
        <p className="mt-3 text-[11px] text-forest-400">
          家长可在「家长中心 · 提醒与屏幕时间」调整提醒间隔。
        </p>
      </div>
    </div>
  );
}