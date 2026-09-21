import Link from 'next/link';
import { Pencil, ChevronRight } from 'lucide-react';
import Header from '@/components/Header';
import ChartTabs from '@/components/ChartTabs';
import ProgressRing from '@/components/ProgressRing';
import { getChart } from '@/lib/data';

export default function ChartHomePage({ params }) {
  const chart = getChart(params.id);
  const core = { title: 'เป้าหมายหลัก', percent: chart.percent };

  return (
    <main className="min-h-dvh flex flex-col bg-cream">
      <Header backHref="/gallery" right={<span className="w-8 h-8 rounded-full bg-mint" />} />

      <div className="flex-1 overflow-y-auto px-4 md:px-10 py-5 md:py-8">
        <div className="max-w-5xl mx-auto flex flex-col gap-5">
          <ChartTabs chartId={chart.id} active="home" />

          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <ProgressRing percent={chart.percent} />
              <div className="min-w-0">
                <div className="text-[11px] font-semibold text-muted">เป้าหมายหลัก</div>
                <h1 className="font-display font-semibold text-base md:text-xl leading-snug">{chart.title}</h1>
              </div>
            </div>
            <button type="button" aria-label="แก้ไขเป้าหมาย" className="w-8 h-8 rounded-full bg-chip flex items-center justify-center flex-shrink-0">
              <Pencil size={13} className="text-muted" />
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <div className="flex-1 w-full grid grid-cols-3 gap-2.5 md:gap-5">
              {[...chart.subgoals.slice(0, 4), 'core', ...chart.subgoals.slice(4)].map((s, i) =>
                s === 'core' ? (
                  <div
                    key="core"
                    className="aspect-square rounded-2xl bg-lavender-bg2 border-2 border-lavender flex flex-col items-center justify-center gap-1 p-2 text-center"
                  >
                    <span className="text-[11px] md:text-xs font-bold text-lavender-dark">เป้าหมายหลัก</span>
                    <span className="text-[10px] md:text-[11px] text-lavender-text">{core.percent}%</span>
                  </div>
                ) : (
                  <Link
                    key={s.id}
                    href={`/chart/${chart.id}/subgoal/${s.id}`}
                    className="tap-hover tap aspect-square rounded-2xl bg-white shadow-soft p-2.5 md:p-3 flex flex-col justify-between"
                  >
                    <span className="text-[11px] md:text-[13px] font-semibold leading-tight">{s.title}</span>
                    <span className="text-[10px] md:text-[11px] font-bold text-muted">{s.percent}%</span>
                  </Link>
                )
              )}
            </div>

            <aside className="hidden lg:flex w-80 flex-shrink-0 flex-col gap-4">
              <div className="bg-lavender-bg rounded-[20px] p-5 flex flex-col gap-3.5">
                <span className="text-[11px] font-bold tracking-wide text-lavender-text uppercase">AI Insight</span>
                <RadarDecor />
                <p className="text-[13px] leading-relaxed">
                  แผนของคุณเน้น Hard Skills มากกว่า Well-being ลองเพิ่ม action ด้านสุขภาพจิต
                </p>
                <span className="text-[13px] font-bold text-lavender-text flex items-center gap-1">
                  ดูคำแนะนำทั้งหมด <ChevronRight size={13} />
                </span>
              </div>

              <div className="bg-white rounded-[20px] p-5 shadow-soft flex flex-col gap-3">
                <span className="text-xs font-bold text-muted">เช็กอินวันนี้</span>
                <p className="text-sm leading-relaxed">วันนี้คุณได้ฝึกเขียน React component ตามเป้าหมายแล้วหรือยัง?</p>
                <div className="flex gap-2">
                  <button type="button" className="tap flex-1 py-2.5 rounded-xl bg-coral text-white text-[13px] font-bold">ทำแล้ว</button>
                  <button type="button" className="tap flex-1 py-2.5 rounded-xl bg-chip text-muted text-[13px] font-bold">ยังไม่ได้ทำ</button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}

function RadarDecor() {
  return (
    <svg width="100%" viewBox="0 0 180 180" aria-hidden="true" className="max-w-[160px] self-center">
      <polygon points="90,10 147,33 170,90 147,147 90,170 33,147 10,90 33,33" fill="none" stroke="#DCD2F7" strokeWidth="1" />
      {[[90, 10], [147, 33], [170, 90], [147, 147], [90, 170], [33, 147], [10, 90], [33, 33]].map(([x, y], i) => (
        <line key={i} x1="90" y1="90" x2={x} y2={y} stroke="#E4DAFA" strokeWidth="1" />
      ))}
      <polygon points="90,35 143,37 130,90 136,136 90,140 33,147 45,90 41,41" fill="#B8A9FF" fillOpacity="0.35" stroke="#B8A9FF" strokeWidth="1.5" />
    </svg>
  );
}
