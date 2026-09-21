export default function ProgressRing({ percent, size = 44, stroke = 5, color = '#FF7A59', track = '#F3EEE6', showLabel = true, labelClass = 'text-[11px] font-display font-semibold fill-ink' }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (percent / 100) * c;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={`${dash} ${c}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      {showLabel && (
        <text x={size / 2} y={size / 2 + 4} textAnchor="middle" className={labelClass}>
          {percent}%
        </text>
      )}
    </svg>
  );
}
