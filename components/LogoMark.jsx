// Brand mark: a tiny 3×3 mandala with the core cell highlighted.
export default function LogoMark({ size = 40 }) {
  const cell = Math.round(size / 4.2);
  const gap = Math.max(2, Math.round(size / 18));
  return (
    <span
      className="inline-grid grid-cols-3 place-content-center rounded-[28%] bg-white/15 ring-1 ring-white/25 flex-shrink-0"
      style={{ width: size, height: size, gap }}
      aria-hidden="true"
    >
      {Array.from({ length: 9 }, (_, i) => (
        <span
          key={i}
          className="rounded-[3px]"
          style={{ width: cell, height: cell, background: i === 4 ? '#FFFFFF' : 'rgba(255,255,255,0.45)' }}
        />
      ))}
    </span>
  );
}
