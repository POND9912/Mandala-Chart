'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { RefreshCw, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import { SUBGOAL_TITLES, regenerateSubgoal } from '@/lib/data';

function Step2Inner() {
  const params = useSearchParams();
  const goalTitle = params.get('title') || 'เป้าหมายของคุณ';
  const mode = params.get('mode') === 'manual' ? 'manual' : 'ai';

  const [subgoals, setSubgoals] = useState(mode === 'manual' ? Array(8).fill('') : SUBGOAL_TITLES.slice());

  const hasEmpty = subgoals.some((t) => !t);

  function fillOne(i) {
    setSubgoals((prev) => prev.map((t, idx) => (idx === i ? regenerateSubgoal(t) : t)));
  }
  function fillOrRegenAll() {
    setSubgoals((prev) => prev.map((t) => (hasEmpty ? (t ? t : regenerateSubgoal('')) : regenerateSubgoal(t))));
  }
  function editOne(i, value) {
    setSubgoals((prev) => prev.map((t, idx) => (idx === i ? value : t)));
  }

  const cells = [...subgoals.slice(0, 4), 'core', ...subgoals.slice(4)];
  let subIndex = -1;

  return (
    <main className="min-h-dvh flex flex-col bg-cream">
      <Header backHref="/new" title="ทบทวนหัวข้อย่อย" />

      <div className="flex-1 overflow-y-auto px-4 md:px-10 py-5 md:py-8">
        <div className="max-w-4xl mx-auto flex flex-col gap-5">
          <div className="flex gap-1.5 max-w-xs">
            <div className="h-1.5 flex-1 rounded-full bg-coral" />
            <div className="h-1.5 flex-1 rounded-full bg-coral" />
          </div>

          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2.5 bg-lavender-bg rounded-2xl px-4 py-3 max-w-lg">
              {mode === 'ai' ? (
                <>
                  <span className="flex-shrink-0 text-[10px] font-bold bg-lavender text-white px-2.5 py-1 rounded-full">AI</span>
                  <span className="text-[12.5px] leading-relaxed">คิด 8 หัวข้อย่อยจากเป้าหมายของคุณแล้ว แก้ไข พิมพ์ทับ หรือลองใหม่ได้เลย</span>
                </>
              ) : (
                <>
                  <span className="flex-shrink-0 text-[10px] font-bold bg-lavender text-white px-2.5 py-1 rounded-full">คุณ</span>
                  <span className="text-[12.5px] leading-relaxed">พิมพ์หัวข้อย่อยของคุณเองได้เลย ช่องไหนคิดไม่ออกกดปุ่ม AI ช่วยได้ทีละช่อง</span>
                </>
              )}
            </div>
            <button
              type="button"
              onClick={fillOrRegenAll}
              className="tap flex items-center gap-2 px-4 py-2.5 rounded-full bg-lavender-bg"
            >
              {hasEmpty ? <Sparkles size={13} className="text-lavender-text" /> : <RefreshCw size={13} className="text-lavender-text" />}
              <span className="text-[12px] font-bold text-lavender-text">{hasEmpty ? 'ให้ AI ช่วยคิดที่เหลือ' : 'คิดใหม่ทั้งหมด'}</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl px-4 py-3.5 shadow-soft flex items-center gap-3">
            <span className="text-[11px] font-bold text-muted flex-shrink-0">เป้าหมายหลัก</span>
            <span className="font-display font-semibold text-sm truncate">{goalTitle}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {cells.map((s, i) => {
              if (s === 'core') {
                return (
                  <div
                    key="core"
                    className="lg:aspect-square rounded-2xl bg-lavender-bg2 border-2 border-lavender p-4 flex lg:flex-col items-center justify-center gap-2 text-center"
                  >
                    <span className="text-xs font-bold text-lavender-dark">เป้าหมายหลัก</span>
                    <span className="hidden lg:block text-[11px] text-lavender-text truncate max-w-full">{goalTitle}</span>
                  </div>
                );
              }
              subIndex += 1;
              const idx = subIndex;
              const empty = !s;
              return (
                <div
                  key={idx}
                  className={
                    'lg:aspect-square rounded-2xl p-3.5 flex lg:flex-col items-center gap-3 lg:justify-center relative ' +
                    (empty ? 'bg-white border-2 border-dashed border-line' : 'bg-white shadow-soft')
                  }
                >
                  <span className="hidden lg:flex absolute top-3 left-3 w-5 h-5 rounded-full bg-chip items-center justify-center text-[10px] font-bold text-muted">
                    {idx + 1}
                  </span>
                  <span className="flex-shrink-0 lg:hidden w-6 h-6 rounded-full bg-chip flex items-center justify-center text-[10px] font-bold text-muted">
                    {idx + 1}
                  </span>
                  <input
                    value={s}
                    onChange={(e) => editOne(idx, e.target.value)}
                    placeholder={`พิมพ์หัวข้อย่อยที่ ${idx + 1}`}
                    className="flex-1 min-w-0 bg-transparent text-[13px] font-semibold text-center placeholder:text-faint placeholder:font-medium lg:mt-3"
                  />
                  {empty ? (
                    <button
                      type="button"
                      aria-label="ให้ AI ช่วยคิดข้อนี้"
                      onClick={() => fillOne(idx)}
                      className="tap flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full bg-lavender-bg text-lavender-text lg:absolute lg:top-2.5 lg:right-2.5"
                    >
                      <Sparkles size={11} />
                      <span className="text-[10px] font-bold">AI</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      aria-label="ลองใหม่ข้อนี้"
                      onClick={() => fillOne(idx)}
                      className="tap flex-shrink-0 w-7 h-7 rounded-full bg-chip flex items-center justify-center lg:absolute lg:top-2.5 lg:right-2.5"
                    >
                      <RefreshCw size={12} className="text-muted" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="lg:hidden" />

          <div className="hidden lg:flex bg-lavender-bg rounded-2xl p-5 flex-col gap-3 max-w-md">
            <span className="text-[11px] font-bold tracking-wide text-lavender-text uppercase">เคล็ดลับ</span>
            <p className="text-[13px] leading-relaxed">
              เป้าหมายที่ดีควรวัดผลได้ ลองระบุตัวเลขหรือระยะเวลาในแต่ละหัวข้อย่อย เช่น &quot;อ่านหนังสือเทคนิค 30 นาที/วัน&quot; แทน &quot;อ่านหนังสือให้เยอะขึ้น&quot;
            </p>
          </div>

          <Link
            href="/chart/fullstack"
            className="tap flex items-center justify-center py-4 rounded-2xl bg-coral shadow-coral max-w-md"
          >
            <span className="font-display font-semibold text-sm text-white">ดูภาพรวม Mandala Chart →</span>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function NewChartStep2() {
  return (
    <Suspense fallback={null}>
      <Step2Inner />
    </Suspense>
  );
}
