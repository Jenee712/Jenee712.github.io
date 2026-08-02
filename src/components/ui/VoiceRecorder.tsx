import { useRef, useState } from 'react';

/**
 * 跟读录音（MediaRecorder）。
 * - 无麦克风权限时优雅降级：把按钮文字换成「我读完了」，点一下就视为完成。
 *   这样不会让孩子卡在跟读题里，影响继续学习。
 * - 录音产物可进入「我的作品袋」。
 */
export function VoiceRecorder({ onRecorded }: { onRecorded?: (url: string) => void }) {
  const [state, setState] = useState<'idle' | 'rec' | 'done' | 'na'>('idle');
  const [url, setUrl] = useState<string | undefined>();
  const recRef = useRef<MediaRecorder | null>(null);

  const start = async () => {
    // 不支持 MediaRecorder（如部分 iOS 内嵌浏览器）直接走「无权限」分支
    if (typeof window === 'undefined' || !window.MediaRecorder || !navigator.mediaDevices?.getUserMedia) {
      setState('na');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];
      mr.ondataavailable = (e) => chunks.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const u = URL.createObjectURL(blob);
        setUrl(u); setState('done'); onRecorded?.(u);
        stream.getTracks().forEach((t) => t.stop());
      };
      mr.start(); recRef.current = mr; setState('rec');
    } catch {
      setState('na');
    }
  };

  const stop = () => recRef.current?.stop();
  // 「无权限 / 不支持」时给一个明确的「我读完了」按钮，避免孩子卡在中间
  const finishAnyway = () => { setState('done'); onRecorded?.(''); };

  return (
    <div className="flex flex-col items-center gap-2">
      {state !== 'rec' && state !== 'done' && (
        <button type="button" onClick={start} className="btn-primary tap" aria-label="开始录音">
          🎤 开始跟读录音
        </button>
      )}
      {state === 'rec' && (
        <button type="button" onClick={stop} className="btn-secondary tap animate-pulse" aria-label="停止录音">
          ⏹ 停止录音
        </button>
      )}
      {state === 'done' && url && (
        <audio controls src={url} className="w-full max-w-xs" aria-label="你的录音回放" />
      )}
      {state === 'na' && (
        <>
          <p className="text-xs text-forest-500 text-center">没拿到麦克风也能继续，点下面按钮就视为完成。</p>
          <button type="button" onClick={finishAnyway} className="btn-primary tap" aria-label="我读完了">
            ✅ 我读完了
          </button>
        </>
      )}
    </div>
  );
}
