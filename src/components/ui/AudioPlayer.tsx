import { useState } from 'react';

/**
 * 听音播放器（Web Audio 合成轻柔提示音）。
 * 语音内容一定同时提供文字提示（无障碍要求）。
 */
export function AudioPlayer({ text, label }: { text: string; label?: string }) {
  const [playing, setPlaying] = useState(false);

  const play = () => {
    try {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctx();
      [523.25, 659.25].forEach((f, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.value = f;
        o.connect(g); g.connect(ctx.destination);
        const t = ctx.currentTime + i * 0.18;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.18, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
        o.start(t); o.stop(t + 0.18);
      });
      setTimeout(() => ctx.close(), 900);
    } catch { /* 静默降级 */ }
    setPlaying(true);
    setTimeout(() => setPlaying(false), 600);
  };

  return (
    <button type="button" onClick={play} className="btn-secondary tap" aria-label={`播放 ${text}`}>
      <span className={playing ? 'animate-wiggle' : ''} aria-hidden>🔊</span>
      <span>{label ?? `听一听：${text}`}</span>
    </button>
  );
}
