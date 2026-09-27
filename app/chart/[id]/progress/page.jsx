import Link from 'next/link';
import Header from '@/components/Header';
import ChartTabs from '@/components/ChartTabs';
import { getChart, heatColorFor } from '@/lib/data';

const BADGES = [
  { initial: 'A', label: 'เริ่มต้นดี', bg: 'bg-lavender-bg2', text: 'text-lavender-dark' },
  { initial: 'B', label: '7 วันติด', bg: 'bg-peach', text: 'text-coral-dark' },
  { initial: 'C', label: 'ครบ 9 หมวด', bg: 'bg-chip', text: 'text-muted' },
  { initial: 'D', label: '30 วันติด', bg: 'bg-chip', text: 'text-muted' },
];

// Font grows linearly with progress: 12px at 0% → min(9vw, 44px) at 100%
function percentFontSize(percent) {
  const t = Math.min(Math.max(percent, 0), 100) / 100;
  return `calc(12px + ${t} * (min(9vw, 44px) - 12px))`;
}

export default function ProgressPage({ params }) {
  const chart = getChart(params.id);

  return (
    <main className="min-h-dvh flex flex-col bg-cream">
      <Header backHref={`/chart/${chart.id}`} title="ความคืบหน้า" />

      <div className="flex-1 overflow-y-auto px-4 md:px-10 py-5 md:py-8">
        <div className="max-w-3xl mx-auto flex flex-col gap-6">
          <ChartTabs chartId={chart.id} active="progress" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-[18px] bg-coral p-4 flex flex-col gap-1 md:col-span-1">
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulseGlow" />
              <span className="font-display font-semibold text-xl text-white">12 วัน</span>
              <span className="text-[11px] font-semibold text-white/90">ต่อเนื่อง</span>
            </div>
            <div className="rounded-[18px] bg-white shadow-soft p-4 flex flex-col gap-2 md:col-span-1">
              <div className="flex items-center justify-between">
                <span className="font-display font-semibold text-[13px]">Level 4</span>
                <span className="text-[11px] text-muted">620/1000 XP</span>
              </div>
              <div className="h-2 rounded-full bg-chip overflow-hidden">
                <div className="h-full w-[62%] bg-mint" />
              </div>
            </div>
          </div>

          <div>
            <div className="font-display font-semibold text-sm mb-2.5">แผนที่ความคืบหน้า</div>
            <div className="grid grid-cols-3 gap-2">
              {[...chart.subgoals.slice(0, 4), 'core', ...chart.subgoals.slice(4)].map((s) =>
                s === 'core' ? (
                  <div
                    key="core"
                    className="aspect-square rounded-2xl bg-lavender-bg2 border-2 border-coral flex items-center justify-center"
                  >
                    <span className="font-display font-semibold text-lavender-dark leading-none" style={{ fontSize: percentFontSize(chart.percent) }}>
                      {chart.percent}%
                    </span>
                  </div>
                ) : (
                  <Link
                    key={s.id}
                    href={`/chart/${chart.id}/subgoal/${s.id}`}
                    className="tap aspect-square rounded-2xl flex items-center justify-center"
                    style={{ background: heatColorFor(s.percent) }}
                  >
                    <span
                      className={'font-display font-semibold leading-none ' + (s.percent >= 75 ? 'text-white' : 'text-ink')}
                      style={{ fontSize: percentFontSize(s.percent) }}
                    >
                      {s.percent}%
                    </span>
                  </Link>
                )
              )}
            </div>
          </div>

          <div>
            <div className="font-display font-semibold text-sm mb-2.5">เหรียญตรา</div>
            <div className="flex gap-4">
              {BADGES.map((b) => (
                <div key={b.label} className="flex flex-col items-center gap-1.5 w-16">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-display font-semibold text-base ${b.bg} ${b.text}`}>
                    {b.initial}
                  </div>
                  <span className="text-[10px] text-center text-muted leading-tight">{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[18px] p-4 shadow-soft flex flex-col gap-2.5 max-w-md">
            <span className="text-xs font-bold text-muted">เช็กอินวันนี้</span>
            <p className="text-[13px] leading-relaxed">วันนี้คุณได้ฝึกเขียน React component ตามเป้าหมายแล้วหรือยัง?</p>
            <div className="flex gap-2">
              <button type="button" className="tap flex-1 py-2.5 rounded-xl bg-coral text-white text-[13px] font-bold">ทำแล้ว</button>
              <button type="button" className="tap flex-1 py-2.5 rounded-xl bg-chip text-muted text-[13px] font-bold">ยังไม่ได้ทำ</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
