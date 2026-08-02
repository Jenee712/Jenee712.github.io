import { useEffect, useRef, useState } from 'react';

/**
 * 描红画布：显示浅色引导字母，孩子用手指/鼠标描摹。
 * 累计笔画达到一定量即视为完成（不强制完美）。
 */
export function TracingCanvas({ letter, onDone }: { letter: string; onDone?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const strokes = useRef(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    c.width = 280 * dpr; c.height = 280 * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, 280, 280);
    // 引导字母（浅色）
    ctx.fillStyle = '#C9DFB7';
    ctx.font = 'bold 200px "Baloo 2", system-ui, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(letter.toUpperCase(), 140, 150);
    // 描线样式
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.strokeStyle = '#427831'; ctx.lineWidth = 14;
  }, [letter]);

  const toLocal = (e: React.PointerEvent) => {
    const c = canvasRef.current!;
    const r = c.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * 280, y: ((e.clientY - r.top) / r.height) * 280 };
  };

  const down = (e: React.PointerEvent) => {
    drawing.current = true;
    last.current = toLocal(e);
    (e.target as Element).setPointerCapture(e.pointerId);
  };
  const move = (e: React.PointerEvent) => {
    if (!drawing.current || !last.current) return;
    const ctx = canvasRef.current!.getContext('2d')!;
    const p = toLocal(e);
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
  };
  const up = () => {
    if (!drawing.current) return;
    drawing.current = false;
    last.current = null;
    strokes.current += 1;
    if (strokes.current >= 3 && !done) { setDone(true); onDone?.(); }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <canvas
        ref={canvasRef}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerLeave={up}
        className="rounded-barn bg-cream-50 ring-1 ring-forest-200 touch-none"
        style={{ width: 280, height: 280, maxWidth: '100%' }}
        aria-label={`描红字母 ${letter}`}
      />
      <p className="text-xs text-forest-500">{done ? '描得真棒！' : '沿着浅色字母描一描 ✏️'}</p>
    </div>
  );
}
