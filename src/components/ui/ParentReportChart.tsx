interface BarDatum { label: string; value: number; color?: string; }
interface DonutSegment { label: string; value: number; color: string; }

/** 通用条形图（家长报告用）。 */
export function BarChart({ data, unit }: { data: BarDatum[]; unit?: string }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="space-y-2">
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-2">
          <span className="w-20 text-xs text-forest-600 truncate">{d.label}</span>
          <div className="progress-track flex-1">
            <div className="progress-fill" style={{ width: `${(d.value / max) * 100}%`, background: d.color ?? '#5B9742' }} />
          </div>
          <span className="w-12 text-right text-xs font-semibold text-forest-700">{d.value}{unit}</span>
        </div>
      ))}
    </div>
  );
}

/** 通用环形图（学科比例用）。 */
export function Donut({ segments }: { segments: DonutSegment[] }) {
  const total = Math.max(1, segments.reduce((s, x) => s + x.value, 0));
  const r = 54, c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 140 140" width={140} height={140} role="img" aria-label="学科比例">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#E4EFDB" strokeWidth="18" />
        {segments.map((s) => {
          const len = (s.value / total) * c;
          const el = (
            <circle key={s.label} cx="70" cy="70" r={r} fill="none"
              stroke={s.color} strokeWidth="18" strokeDasharray={`${len} ${c - len}`}
              strokeDashoffset={-offset} transform="rotate(-90 70 70)" />
          );
          offset += len;
          return el;
        })}
        <text x="70" y="74" textAnchor="middle" className="fill-forest-800" fontSize="16" fontWeight="700">
          {Math.round((segments[0]?.value / total) * 100)}%
        </text>
      </svg>
      <ul className="space-y-1 text-sm">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ background: s.color }} />
            <span className="text-forest-700">{s.label}</span>
            <span className="text-forest-400">{Math.round((s.value / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface Props {
  title: string;
  variant: 'bar' | 'donut';
  data: BarDatum[] | DonutSegment[];
  unit?: string;
}

export function ParentReportChart({ title, variant, data, unit }: Props) {
  return (
    <div className="card p-4">
      <h4 className="type-h3 mb-3">{title}</h4>
      {variant === 'bar' && <BarChart data={data as BarDatum[]} unit={unit} />}
      {variant === 'donut' && <Donut segments={data as DonutSegment[]} />}
    </div>
  );
}
