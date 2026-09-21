import Link from 'next/link';

export default function ChartTabs({ chartId, active }) {
  const tabs = [
    { id: 'home', label: 'ภาพรวม', href: `/chart/${chartId}` },
    { id: 'progress', label: 'ความคืบหน้า', href: `/chart/${chartId}/progress` },
  ];
  return (
    <div className="flex gap-2">
      {tabs.map((t) => (
        <Link
          key={t.id}
          href={t.href}
          className={
            'text-xs font-bold px-4 py-2 rounded-full ' +
            (t.id === active ? 'bg-coral text-white' : 'bg-chip text-muted')
          }
        >
          {t.label}
        </Link>
      ))}
    </div>
  );
}
