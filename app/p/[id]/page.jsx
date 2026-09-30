import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronDown, CopyPlus, Flag, Users } from 'lucide-react';
import Header, { APP_NAV } from '@/components/Header';
import ProgressRing from '@/components/ProgressRing';
import UserMenu from '@/components/UserMenu';
import CopyChartButton from '@/components/CopyChartButton';
import { getPublicChart, heatColorFor } from '@/lib/data';
import { getSession } from '@/lib/auth';

export function generateMetadata({ params }) {
  const chart = getPublicChart(params.id);
  if (!chart) return { title: 'ไม่พบ Chart — Mandala AI' };
  return {
    title: `${chart.title} — Mandala AI`,
    description: `Mandala Chart ของ ${chart.ownerName}: ${chart.subgoals.map((s) => s.title).join(', ')}`,
  };
}

// Public, read-only view of a shared chart. Viewable without signing in;
// copying needs an account. Shows structure + the owner's % only.
export default async function PublicChartPage({ params }) {
  const chart = getPublicChart(params.id);
  if (!chart) notFound();

  const session = await getSession();
  const signedIn = Boolean(session?.user);
  // In the mock, the "mine" charts belong to whoever is signed in — never to an anonymous visitor.
  const isMine = chart.isMine && signedIn;
  const ownerName = isMine ? 'คุณ' : chart.isMine ? 'ผู้ใช้ Mandala AI' : chart.ownerName;
  const loginHref = `/login?callbackUrl=${encodeURIComponent(`/p/${chart.id}`)}`;

  const cta = isMine ? (
    <Link href={`/chart/${chart.id}`} className="tap flex items-center justify-center px-5 py-3.5 rounded-2xl bg-chip text-sm font-bold">
      นี่คือ Chart ของคุณ — ไปหน้าจัดการ
    </Link>
  ) : signedIn ? (
    <CopyChartButton chartTitle={chart.title} />
  ) : (
    <Link href={loginHref} className="tap flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-coral shadow-coral text-white">
      <CopyPlus size={16} />
      <span className="font-display font-semibold text-sm">เข้าสู่ระบบเพื่อใช้ Chart นี้</span>
    </Link>
  );

  return (
    <main className="min-h-dvh flex flex-col bg-cream">
      <Header
        logoHref={signedIn ? '/gallery' : '/login'}
        navLinks={signedIn ? APP_NAV : null}
        activeNav="/templates"
        right={
          signedIn ? (
            <UserMenu />
          ) : (
            <Link href={loginHref} className="text-[13px] font-bold px-4 py-2 rounded-full bg-white text-coral-dark">
              เข้าสู่ระบบ
            </Link>
          )
        }
      />

      <div className="flex-1 overflow-y-auto px-4 md:px-10 py-5 md:py-8">
        <div className="max-w-5xl mx-auto flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <ProgressRing percent={chart.percent} />
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap text-[11px] font-semibold text-muted">
                  <span>Chart สาธารณะของ {ownerName}</span>
                  {chart.category && <span className="bg-chip px-2 py-0.5 rounded-full">{chart.category}</span>}
                </div>
                <h1 className="font-display font-semibold text-lg md:text-2xl leading-snug">{chart.title}</h1>
                <div className="flex items-center gap-3 mt-1 text-[11px] text-muted">
                  <span>เจ้าของทำไปแล้ว {chart.percent}%</span>
                  <span className="flex items-center gap-1">
                    <Users size={11} /> นำไปใช้แล้ว {chart.copyCount} ครั้ง
                  </span>
                </div>
              </div>
            </div>
            <div className="hidden md:block md:w-72 flex-shrink-0">{cta}</div>
          </div>

          <div className="grid grid-cols-3 gap-2.5 md:gap-4">
            {[...chart.subgoals.slice(0, 4), 'core', ...chart.subgoals.slice(4)].map((s) =>
              s === 'core' ? (
                <div
                  key="core"
                  className="aspect-square rounded-2xl bg-lavender-bg2 border-2 border-lavender flex flex-col items-center justify-center gap-1 p-2 text-center"
                >
                  <span className="text-[11px] md:text-[13px] font-bold text-lavender-dark leading-tight line-clamp-4">{chart.title}</span>
                  <span className="text-[10px] md:text-[11px] text-lavender-text">{chart.percent}%</span>
                </div>
              ) : (
                <a
                  key={s.id}
                  href={`#sg-${s.id}`}
                  className="tap aspect-square rounded-2xl p-2.5 md:p-3 flex flex-col justify-between"
                  style={{ background: heatColorFor(s.percent) }}
                >
                  <span className={'text-[11px] md:text-[13px] font-semibold leading-tight ' + (s.percent >= 75 ? 'text-white' : 'text-ink')}>
                    {s.title}
                  </span>
                  <span className={'text-[10px] md:text-[11px] font-bold ' + (s.percent >= 75 ? 'text-white/90' : 'text-muted')}>
                    {s.percent}%
                  </span>
                </a>
              )
            )}
          </div>

          <div className="md:hidden">{cta}</div>

          <div className="flex flex-col gap-2.5">
            <h2 className="font-display font-semibold text-sm">หัวข้อย่อยและ action</h2>
            {chart.subgoals.map((s, i) => (
              <details key={s.id} id={`sg-${s.id}`} className="group bg-white rounded-2xl shadow-soft scroll-mt-4">
                <summary className="flex items-center gap-3 p-4 cursor-pointer list-none">
                  <span className="w-6 h-6 rounded-full bg-chip flex items-center justify-center text-[10px] font-bold text-muted flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="flex-1 min-w-0 text-[13px] font-bold truncate">{s.title}</span>
                  <span className="text-[11px] font-bold text-muted">{s.actions.length} action</span>
                  <ChevronDown size={15} className="text-muted transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-4 pb-4 flex flex-col gap-2.5">
                  {s.passHint && (
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-lavender-bg text-[12px]">
                      <Flag size={13} className="text-lavender-text mt-0.5 flex-shrink-0" />
                      <span>
                        <span className="font-bold text-lavender-text">วิธีผ่าน: </span>
                        {s.passHint}
                      </span>
                    </div>
                  )}
                  {s.actions.length === 0 ? (
                    <span className="text-[12px] text-faint">ยังไม่มี action</span>
                  ) : (
                    <ol className="flex flex-col gap-1.5">
                      {s.actions.map((a, j) => (
                        <li key={a.id} className="flex gap-2.5 text-[13px]">
                          <span className="text-faint font-bold w-4 text-right flex-shrink-0">{j + 1}.</span>
                          <span>{a.label}</span>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              </details>
            ))}
          </div>

          <p className="text-[11px] text-faint text-center">
            เมื่อกด &ldquo;ใช้ Chart นี้&rdquo; คุณจะได้สำเนาของเป้าหมาย หัวข้อย่อย และ action ทั้งหมดไปเริ่มนับความคืบหน้าใหม่ในบัญชีของคุณ
          </p>
        </div>
      </div>
    </main>
  );
}
