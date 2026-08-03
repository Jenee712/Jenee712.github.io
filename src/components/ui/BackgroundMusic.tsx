import { useCallback, useEffect, useRef, useState } from 'react';

const MUSIC_KEY = 'forest_music_enabled_v1';

function loadMusicPreference() {
  try { return localStorage.getItem(MUSIC_KEY) === 'true'; } catch { return false; }
}

/** Licensed background music. Playback starts only after a user gesture. */
export function BackgroundMusic() {
  const [enabled, setEnabled] = useState(loadMusicPreference);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startMusic = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !audio.paused) return;
    try {
      audio.volume = 0.14;
      await audio.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  }, []);

  const stopMusic = useCallback(() => {
    audioRef.current?.pause();
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

  useEffect(() => () => { audioRef.current?.pause(); }, []);

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
    <div className="music-widget">
      <audio
        ref={audioRef}
        src={`${import.meta.env.BASE_URL}audio/carefree-kevin-macleod.mp3`}
        preload="none"
        loop
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <button
        type="button"
        className={`music-toggle ${playing ? 'music-toggle-playing' : ''}`}
        onClick={toggleMusic}
        aria-pressed={playing}
        title={playing ? '关闭阳光轻音乐' : '开启阳光轻音乐'}
      >
        <span className="music-note" aria-hidden>{playing ? '♫' : '♪'}</span>
        <span><strong>{playing ? '阳光音乐中' : enabled ? '轻点继续音乐' : '开启阳光音乐'}</strong><small>Carefree · 轻快尤克里里</small></span>
      </button>
      <span className="music-credit">
        <a href="https://incompetech.com/music/royalty-free/index.html?Search=Search&isrc=USUAN1400037" target="_blank" rel="noreferrer">Kevin MacLeod</a>
        {' · '}
        <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>
      </span>
    </div>
  );
}
