import { useCallback, useEffect, useRef, useState } from 'react';

const MUSIC_KEY = 'forest_music_enabled_v1';
const MELODY = [261.63, 329.63, 392, 523.25, 440, 392, 329.63, 293.66];

function loadMusicPreference() {
  try { return localStorage.getItem(MUSIC_KEY) === 'true'; } catch { return false; }
}

/** A tiny original pentatonic soundscape. It starts only after a user gesture. */
export function BackgroundMusic() {
  const [enabled, setEnabled] = useState(loadMusicPreference);
  const [playing, setPlaying] = useState(false);
  const contextRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);
  const stepRef = useRef(0);

  const playNextNote = useCallback((context: AudioContext) => {
    const now = context.currentTime;
    const frequency = MELODY[stepRef.current % MELODY.length];
    stepRef.current += 1;

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = stepRef.current % 4 === 0 ? 'triangle' : 'sine';
    oscillator.frequency.setValueAtTime(frequency, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.032, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.95);
  }, []);

  const startMusic = useCallback(async () => {
    if (contextRef.current?.state === 'running') return;
    try {
      const context = contextRef.current ?? new AudioContext();
      contextRef.current = context;
      await context.resume();
      playNextNote(context);
      if (timerRef.current === null) {
        timerRef.current = window.setInterval(() => playNextNote(context), 1150);
      }
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  }, [playNextNote]);

  const stopMusic = useCallback(() => {
    if (timerRef.current !== null) window.clearInterval(timerRef.current);
    timerRef.current = null;
    const context = contextRef.current;
    contextRef.current = null;
    if (context && context.state !== 'closed') void context.close();
    setPlaying(false);
  }, []);

  useEffect(() => {
    if (!enabled || playing) return;
    const continueAfterGesture = () => { void startMusic(); };
    window.addEventListener('pointerdown', continueAfterGesture, { once: true });
    window.addEventListener('keydown', continueAfterGesture, { once: true });
    return () => {
      window.removeEventListener('pointerdown', continueAfterGesture);
      window.removeEventListener('keydown', continueAfterGesture);
    };
  }, [enabled, playing, startMusic]);

  useEffect(() => () => {
    if (timerRef.current !== null) window.clearInterval(timerRef.current);
    const context = contextRef.current;
    if (context && context.state !== 'closed') void context.close();
  }, []);

  const toggleMusic = () => {
    if (playing) {
      setEnabled(false);
      try { localStorage.setItem(MUSIC_KEY, 'false'); } catch { /* ignore */ }
      stopMusic();
      return;
    }
    setEnabled(true);
    try { localStorage.setItem(MUSIC_KEY, 'true'); } catch { /* ignore */ }
    void startMusic();
  };

  return (
    <button
      type="button"
      className={`music-toggle ${playing ? 'music-toggle-playing' : ''}`}
      onClick={toggleMusic}
      aria-pressed={playing}
      title={playing ? '关闭森林轻音乐' : '开启森林轻音乐'}
    >
      <span className="music-note" aria-hidden>{playing ? '♫' : '♪'}</span>
      <span><strong>{playing ? '森林音乐中' : enabled ? '轻点继续音乐' : '开启森林音乐'}</strong><small>{playing ? '点击可关闭' : '轻柔背景音乐'}</small></span>
    </button>
  );
}
