import Link from 'next/link';
import { ArrowRight, Flame, LayoutTemplate, Users } from 'lucide-react';
import Header from '@/components/Header';
import UserMenu from '@/components/UserMenu';
import { CATEGORIES, heatColorFor, listPublicCharts } from '@/lib/data';

export const metadata = { title: 'เทมเพลต — Mandala AI' };

// Accent per category: top strip + chip colours on the cards.
const CATEGORY_STYLE = {
  การเงิน: { accent: '#F5A623', bg: '#FFF4E0', text: '#A86A00' },
  สุขภาพ: { accent: '#22B07D', bg: '#D9F2E7', text: '#137552' },
  การเรียนรู้: { accent: '#1E9BE8', bg: '#E7F3FD', text: '#1478C8' },
  อาชีพการงาน: { accent: '#0B5CB8', bg: '#E3EDF9', text: '#0A3D91' },
  ความสัมพันธ์: { accent: '#E8578A', bg: '#FDE8F0', text: '#B23063' },
};
const DEFAULT_STYLE = { accent: '#6B7A99', bg: '#EDF2F9', text: '#6B7A99' };

function MiniMandala({ chart }) {
  const cells = [...chart.subgoals.slice(0, 4), 'core', ...chart.subgoals.slice(4)];
  return (
    <div className="grid grid-cols-3 gap-[3px] w-[62px] flex-shrink-0" aria-hidden="true">
      {cells.map((s, i) => (
        <span
          key={i}
          className="aspect-square rounded-[5px]"
          style={{ background: s === 'core' ? 'linear-gradient(135deg, #0A3D91, #0B5CB8)' : heatColorFor(s.percent) }}
        />
      ))}
    </div>
  );
}

export default function TemplatesPage({ searchParams }) {
  const all = listPublicCharts();
  const category = CATEGORIES.includes(searchParams?.cat) ? searchParams.cat : null;
  const charts = category ? all.filter((c) => c.category === category) : all;
  const topId = all[0]?.id;
  const totalCopies = all.reduce((sum, c) => sum + c.copyCount, 0);
  const usedCategories = CATEGORIES.filter((c) => all.some((t) => t.category === c));

  return (
    <main className="min-h-dvh flex flex-col bg-cream">
      <Header
        logoHref="/gallery"
        navLinks={[{ href: '/gallery', label: 'Chart ของฉัน' }, { href: '/templates', label: 'เทมเพลต' }]}
        activeNav="/templates"
        right={<UserMenu />}
      />

      <div className="flex-1 overflow-y-auto px-4 md:px-10 py-5 md:py-8">
        <div className="max-w-5xl mx-auto flex flex-col gap-6">
          <section className="relative overflow-hidden rounded-[24px] bg-brand text-white p-6 md:p-8">
            <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full bg-white/10" />
            <div className="absolute right-16 -bottom-14 w-32 h-32 rounded-full bg-lavender/30" />
            <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-5">
              <div className="max-w-lg">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold bg-white/15 px-3 py-1 rounded-full">
                  <LayoutTemplate size={12} /> เทมเพลตจากผู้ใช้
                </span>
                <h1 className="font-display font-semibold text-2xl md:text-[30px] leading-tight mt-3">
                  ไม่ต้องเริ่มจากศูนย์
                </h1>
                <p className="text-[13px] md:text-sm text-white/80 mt-2 leading-relaxed">
                  เลือก Mandala Chart ที่คนอื่นทำสำเร็จมาแล้ว กด &ldquo;ใช้ Chart นี้&rdquo; แล้วปรับให้เป็นแผนของคุณเอง
                </p>
              </div>
              <div className="flex gap-3">
                <Stat value={all.length} label="เทมเพลต" />
                <Stat value={totalCopies.toLocaleString('th-TH')} label="ครั้งที่ถูกนำไปใช้" />
              </div>
            </div>
          </section>

          <nav className="flex gap-2 overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 pb-1" aria-label="กรองตามหมวดหมู่">
            <FilterPill href="/templates" active={!category} label="ทั้งหมด" count={all.length} />
            {usedCategories.map((c) => (
              <FilterPill
                key={c}
                href={`/templates?cat=${encodeURIComponent(c)}`}
                active={category === c}
                label={c}
                count={all.filter((t) => t.category === c).length}
              />
            ))}
          </nav>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {charts.map((c) => {
              const style = CATEGORY_STYLE[c.category] || DEFAULT_STYLE;
              return (
                <Link
                  key={c.id}
                  href={`/p/${c.id}`}
                  className="group tap-hover tap relative flex flex-col rounded-[20px] bg-white shadow-soft hover:shadow-softLg overflow-hidden transition-shadow"
                >
                  <span className="h-1.5" style={{ background: style.accent }} />
                  <div className="flex flex-col gap-3 p-4 md:p-5 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {c.category && (
                        <span
                          className="whitespace-nowrap text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                          style={{ background: style.bg, color: style.text }}
                        >
                          {c.category}
                        </span>
                      )}
                      {c.id === topId && (
                        <span className="flex items-center gap-1 whitespace-nowrap text-[10px] font-bold text-white bg-[#F5A623] px-2.5 py-0.5 rounded-full">
                          <Flame size={10} /> ยอดนิยม
                        </span>
                      )}
                      {c.isMine && (
                        <span className="whitespace-nowrap text-[10px] font-bold text-lavender-text bg-lavender-bg px-2.5 py-0.5 rounded-full">
                          ของคุณ
                        </span>
                      )}
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="flex-1 font-display font-semibold text-[15px] md:text-base leading-snug">{c.title}</span>
                      <MiniMandala chart={c} />
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {c.subgoals.slice(0, 3).map((s) => (
                        <span key={s.id} className="text-[10.5px] text-muted bg-cream px-2 py-0.5 rounded-full truncate max-w-[140px]">
                          {s.title}
                        </span>
                      ))}
                      <span className="text-[10.5px] text-faint px-1 py-0.5">+{c.subgoals.length - 3} หัวข้อ</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-chip overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${c.percent}%`, background: style.accent }} />
                      </div>
                      <span className="text-[10.5px] font-bold text-muted whitespace-nowrap">เจ้าของทำไป {c.percent}%</span>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-3 mt-auto border-t border-line">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                          style={{ background: style.accent }}
                        >
                          {c.ownerName.charAt(0)}
                        </span>
                        <div className="min-w-0">
                          <div className="text-[12px] font-bold truncate">{c.ownerName}</div>
                          <div className="flex items-center gap-1 text-[10.5px] text-muted">
                            <Users size={10} /> ใช้แล้ว {c.copyCount} ครั้ง
                          </div>
                        </div>
                      </div>
                      <span className="flex items-center gap-1 text-[12px] font-bold text-coral whitespace-nowrap group-hover:gap-2 transition-all">
                        ดู Chart <ArrowRight size={13} />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {charts.length === 0 && (
            <p className="text-[13px] text-muted text-center py-10 rounded-[20px] bg-white shadow-soft">ยังไม่มีเทมเพลตในหมวดนี้</p>
          )}
        </div>
      </div>
    </main>
  );
}

function Stat({ value, label }) {
  return (
    <div className="bg-white/15 rounded-2xl px-4 py-3 min-w-[104px]">
      <div className="font-display font-semibold text-xl md:text-2xl leading-none">{value}</div>
      <div className="text-[11px] text-white/80 mt-1.5">{label}</div>
    </div>
  );
}

function FilterPill({ href, active, label, count }) {
  return (
    <Link
      href={href}
      className={
        'flex items-center gap-1.5 whitespace-nowrap text-xs font-bold px-4 py-2 rounded-full transition-colors ' +
        (active ? 'bg-coral text-white shadow-coral' : 'bg-white text-muted shadow-soft hover:text-ink')
      }
    >
      {label}
      <span className={'text-[10px] px-1.5 rounded-full ' + (active ? 'bg-white/25' : 'bg-chip')}>{count}</span>
    </Link>
  );
}
