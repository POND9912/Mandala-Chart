import { HEAT_RAMP } from '@/lib/data';

export default function MiniHeatmap({ seed = 0, size = 16, gap = 3, rounded = 'rounded' }) {
  const cells = Array.from({ length: 9 }, (_, i) => HEAT_RAMP[(seed + i * 3) % 4]);
  return (
    <div
      className="grid grid-cols-3 flex-shrink-0"
      style={{ gap, width: size * 3 + gap * 2 }}
    >
      {cells.map((color, i) => (
        <div
          key={i}
          className={rounded}
          style={{ width: size, height: size, background: color }}
        />
      ))}
    </div>
  );
}
