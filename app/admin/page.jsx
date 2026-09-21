import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { ADMIN } from '@/lib/data';

const NAV = ['ภาพรวม', 'หมวดหมู่ยอดนิยม', 'Expert Leaderboard', 'ผู้ใช้งาน', 'ตั้งค่า'];

export default function AdminPage() {
  const maxPct = Math.max(...ADMIN.categories.map((c) => c.percent));

  return (
    <main className="min-h-dvh flex flex-col md:flex-row bg-cream">
      <aside className="hidden md:flex w-60 flex-shrink-0 bg-white flex-col justify-between p-4">
        <div className="flex flex-col gap-7">
          <div className="flex items-center gap-2.5 px-2">
            <span className="w-7 h-7 rounded-full bg-coral" />
            <span className="font-display font-semibold text-[15px]">Mandala AI</span>
            <span className="text-[10px] font-bold text-muted bg-chip px-2 py-0.5 rounded-full">ADMIN</span>
          </div>
          <nav className="flex flex-col gap-1">
            {NAV.map((label, i) => (
              <span
                key={label}
                className={
                  'flex items-center gap-2.5 px-3 py-2.5 rounded-[14px] text-[13px] ' +
                  (i === 0 ? 'bg-[#FFF0EA] text-coral font-bold' : 'text-[#4A4636] font-semibold')
                }
              >
                <span className={'w-2 h-2 rounded-sm ' + (i === 0 ? 'bg-coral' : 'bg-line')} />
                {label}
              </span>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2.5 px-2">
          <span className="w-8 h-8 rounded-full bg-mint" />
          <div>
            <div className="text-xs font-bold">ผู้ดูแลระบบ</div>
            <div className="text-[11px] text-muted">admin@mandala.ai</div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col gap-6 p-5 md:p-10 min-w-0">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-display font-semibold text-xl md:text-2xl">แดชบอร์ดสถิติ</h1>
            <p className="text-[13px] text-muted mt-1.5">ข้อมูลสรุปแบบไม่ระบุตัวตน • อัปเดตทุกคืน</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-bold px-4 py-2.5 rounded-2xl bg-white shadow-soft text-muted">30 วันล่าสุด ▾</span>
            <Link href="/gallery" className="text-[13px] font-bold px-4 py-2.5 rounded-2xl bg-white shadow-soft text-muted md:hidden">
              กลับแอป
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {ADMIN.kpis.map((k) => (
            <div key={k.label} className="bg-white rounded-[18px] p-4 shadow-soft flex flex-col gap-1.5">
              <span className="text-xs text-muted font-semibold">{k.label}</span>
              <span className="font-display font-semibold text-2xl">{k.value}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2.5 px-4 py-3.5 rounded-2xl bg-lavender-bg">
          <span className="flex-shrink-0 text-[10px] font-bold bg-lavender text-white px-2.5 py-1 rounded-full flex items-center gap-1">
            <Sparkles size={10} /> AI
          </span>
          <span className="text-[13px]">AI พบว่า 68% ของผู้ใช้ที่ตั้งเป้าหมายด้านการเงินยังไม่มี action เรื่องการออมเงิน</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-5">
          <div className="bg-white rounded-[20px] p-5 shadow-soft flex flex-col gap-3.5">
            <span className="font-display font-semibold text-sm">หมวดยอดนิยม</span>
            <div className="flex flex-col gap-3">
              {ADMIN.categories.map((c) => (
                <div key={c.label} className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold">{c.label}</span>
                    <span className="font-bold text-muted">{c.percent}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-chip overflow-hidden">
                    <div className="h-full bg-coral rounded-full" style={{ width: `${(c.percent / maxPct) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[20px] p-5 shadow-soft flex flex-col gap-1">
            <span className="font-display font-semibold text-sm mb-2">Action ที่คนทำซ้ำบ่อย</span>
            {ADMIN.topActions.map((a) => (
              <div key={a.label} className="flex justify-between items-center py-2.5 border-b border-line last:border-0">
                <span className="text-xs">{a.label}</span>
                <span className="text-xs font-bold text-muted flex-shrink-0 pl-3">{a.count} ครั้ง</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[20px] p-5 shadow-soft flex flex-col gap-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="font-display font-semibold text-sm">Expert Leaderboard</span>
            <span className="text-[11px] text-faint">เฉพาะผู้ใช้ที่ opt-in แสดงตัวเป็นผู้เชี่ยวชาญ</span>
          </div>
          <div className="hidden sm:flex text-[11px] font-semibold text-faint border-b border-line pb-2">
            <span className="w-12">อันดับ</span>
            <span className="flex-1">ผู้ใช้</span>
            <span className="w-44">หมวดที่เชี่ยวชาญ</span>
            <span className="w-24 text-right">Score</span>
          </div>
          {ADMIN.experts.map((e, i) => {
            const top3 = i < 3;
            return (
              <div key={e.name} className="flex items-center py-2.5 border-b border-line last:border-0">
                <span className="w-12">
                  <span
                    className={
                      'inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold ' +
                      (top3 ? 'bg-coral text-white' : 'bg-chip text-muted')
                    }
                  >
                    {i + 1}
                  </span>
                </span>
                <span className="flex-1 text-sm font-semibold">{e.name}</span>
                <span className="w-44 text-xs text-muted hidden sm:block">{e.category}</span>
                <span className="w-24 text-sm font-bold text-right">{e.score}</span>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
