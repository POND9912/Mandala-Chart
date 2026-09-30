'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Plus, LayoutGrid, Rows3, ChevronRight, ChevronDown, Sparkles, Globe, Lock, Users } from 'lucide-react';
import Header from '@/components/Header';
import MiniHeatmap from '@/components/MiniHeatmap';
import ProgressRing from '@/components/ProgressRing';
import NotifyBell from '@/components/NotifyBell';
import UserMenu from '@/components/UserMenu';
import InstallPrompt from '@/components/InstallPrompt';
import { CHARTS } from '@/lib/data';

const FILTERS = [
  { id: 'active', label: 'กำลังทำ' },
  { id: 'all', label: 'ทั้งหมด' },
  { id: 'done', label: 'เสร็จแล้ว' },
];

// Public/private status: a small pill next to the category for shared charts,
// and a quiet footer note on every card (copies for public, a lock for private).
function PublicPill() {
  return (
    <span className="flex items-center gap-1 whitespace-nowrap text-[10px] font-bold text-white bg-lavender px-2 py-0.5 rounded-full">
      <Globe size={10} strokeWidth={2.5} /> สาธารณะ
    </span>
  );
}

function VisibilityNote({ chart }) {
  return chart.isPublic ? (
    <span className="flex items-center gap-1 whitespace-nowrap text-[10px] font-semibold text-lavender-text">
      <Users size={10} /> ใช้แล้ว {chart.copyCount || 0} ครั้ง
    </span>
  ) : (
    <span className="flex items-center gap-1 whitespace-nowrap text-[10px] font-semibold text-faint">
      <Lock size={10} /> ส่วนตัว
    </span>
  );
}

function ChartCard({ chart, view, seed }) {
  if (view === 'compact') {
    return (
      <Link
        href={`/chart/${chart.id}`}
        className="tap flex items-center gap-3 py-3 border-b border-line"
      >
        <ProgressRing percent={chart.percent} size={34} stroke={4} showLabel={false} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 min-w-0">
            {chart.isPublic ? (
              <Globe size={12} className="text-lavender flex-shrink-0" aria-label="สาธารณะ" />
            ) : (
              <Lock size={12} className="text-faint flex-shrink-0" aria-label="ส่วนตัว" />
            )}
            <span className="text-[13px] font-semibold truncate">{chart.title}</span>
          </div>
          <div className="text-[10.5px] text-muted">{chart.category} • อัปเดต {chart.updated}</div>
        </div>
        <span className="flex-shrink-0 text-[13px] font-bold text-muted">{chart.percent}%</span>
      </Link>
    );
  }
  return (
    <Link
      href={`/chart/${chart.id}`}
      className="tap-hover tap flex items-center gap-4 md:gap-5 p-4 md:p-5 rounded-[20px] bg-white shadow-soft"
    >
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="whitespace-nowrap text-[10px] font-bold text-muted bg-chip px-2.5 py-0.5 rounded-full">{chart.category}</span>
          {chart.isPublic && <PublicPill />}
        </div>
        <span className="font-display font-semibold text-sm md:text-[15px] leading-snug">{chart.title}</span>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full bg-chip overflow-hidden">
            <div className="h-full bg-coral rounded-full" style={{ width: `${chart.percent}%` }} />
          </div>
          <span className="text-[11px] font-bold text-muted">{chart.percent}%</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] text-faint truncate">อัปเดต {chart.updated}</span>
          <VisibilityNote chart={chart} />
        </div>
      </div>
      <MiniHeatmap seed={seed} />
    </Link>
  );
}

export default function GalleryPage() {
  const [filter, setFilter] = useState('active');
  const [view, setView] = useState('card');
  const [doneOpen, setDoneOpen] = useState(false);

  const active = useMemo(() => CHARTS.filter((c) => c.status === 'active'), []);
  const done = useMemo(() => CHARTS.filter((c) => c.status === 'done'), []);

  const shown = filter === 'active' ? active : filter === 'done' ? done : CHARTS;

  return (
    <main className="min-h-dvh flex flex-col bg-cream">
      <Header
        logoHref="/gallery"
        navLinks={[{ href: '/gallery', label: 'Chart ของฉัน' }, { href: '/templates', label: 'เทมเพลต' }, { href: '#', label: 'การตั้งค่า' }]}
        activeNav="/gallery"
        right={
          <>
            <NotifyBell />
            <button
              type="button"
              aria-label="สลับมุมมอง"
              onClick={() => setView((v) => (v === 'card' ? 'compact' : 'card'))}
              className="w-9 h-9 rounded-full bg-chip flex items-center justify-center"
            >
              {view === 'card' ? <Rows3 size={16} className="text-muted" /> : <LayoutGrid size={16} className="text-muted" />}
            </button>
            <Link
              href="/new"
              aria-label="สร้างเป้าหมายใหม่"
              className="w-9 h-9 rounded-full bg-coral text-white flex items-center justify-center shadow-coral"
            >
              <Plus size={18} strokeWidth={2.5} />
            </Link>
            <UserMenu />
          </>
        }
      />

      <div className="flex-1 overflow-y-auto px-4 md:px-10 py-5 md:py-8">
        <div className="max-w-5xl mx-auto flex flex-col gap-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="font-display font-semibold text-xl md:text-2xl">Mandala Chart ของฉัน</h1>
              <p className="text-[13px] text-muted mt-1">คุณมีทั้งหมด {CHARTS.length} เป้าหมาย</p>
            </div>
            <div className="flex gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  className={
                    'text-xs font-bold px-4 py-2 rounded-full ' +
                    (filter === f.id ? 'bg-coral text-white' : 'bg-chip text-muted')
                  }
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <InstallPrompt />

          <Link
            href="/new"
            className="tap flex items-center gap-3 p-4 rounded-[20px] bg-lavender-bg"
          >
            <span className="w-10 h-10 rounded-full bg-lavender text-white flex items-center justify-center flex-shrink-0">
              <Sparkles size={18} />
            </span>
            <div>
              <div className="font-display font-semibold text-sm text-lavender-dark">สร้างเป้าหมายใหม่</div>
              <div className="text-xs text-lavender-text">ให้ AI ช่วยวางแผนตั้งแต่ต้น</div>
            </div>
          </Link>

          <div className={view === 'card' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4' : 'flex flex-col'}>
            {shown.map((c, i) => (
              <ChartCard key={c.id} chart={c} view={view} seed={i * 3} />
            ))}
          </div>

          {filter === 'active' && done.length > 0 && (
            <div className="rounded-2xl bg-chip overflow-hidden">
              <button
                type="button"
                onClick={() => setDoneOpen((v) => !v)}
                className="w-full flex items-center justify-between px-4 py-3.5"
              >
                <span className="text-[13px] font-bold text-muted">เสร็จแล้ว ({done.length})</span>
                {doneOpen ? <ChevronDown size={16} className="text-muted" /> : <ChevronRight size={16} className="text-muted" />}
              </button>
              {doneOpen && (
                <div className={'px-4 pb-4 ' + (view === 'card' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4' : 'flex flex-col')}>
                  {done.map((c, i) => (
                    <ChartCard key={c.id} chart={c} view={view} seed={i * 3 + 9} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
