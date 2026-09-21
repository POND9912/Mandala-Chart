'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import { CATEGORIES } from '@/lib/data';

export default function NewChartStep1() {
  const [title, setTitle] = useState('เป็น Full-stack Developer ภายใน 1 ปี');
  const [category, setCategory] = useState(CATEGORIES[0]);

  const aiHref = `/new/subgoals?title=${encodeURIComponent(title)}&category=${encodeURIComponent(category)}&mode=ai`;
  const manualHref = `/new/subgoals?title=${encodeURIComponent(title)}&category=${encodeURIComponent(category)}&mode=manual`;

  return (
    <main className="min-h-dvh flex flex-col bg-cream">
      <Header backHref="/gallery" title="สร้างเป้าหมายใหม่" />

      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
          <div className="flex-1 w-full max-w-lg flex flex-col gap-5">
            <div className="flex gap-1.5">
              <div className="h-1.5 flex-1 rounded-full bg-coral" />
              <div className="h-1.5 flex-1 rounded-full bg-chip" />
            </div>

            <div>
              <h1 className="font-display font-semibold text-xl md:text-[26px] leading-snug">เป้าหมายหลักของคุณคืออะไร?</h1>
              <p className="text-[13px] md:text-sm text-muted mt-2 leading-relaxed">
                พิมพ์สั้นๆ ก็พอ แล้วให้ AI ช่วยคิดหัวข้อย่อยและแผนปฏิบัติที่เหลือให้ทั้งหมด
              </p>
            </div>

            <label className="block bg-white rounded-2xl p-4 md:p-5 shadow-soft">
              <span className="block text-[11px] font-bold text-muted mb-2">เป้าหมายหลัก</span>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="เช่น เป็น Full-stack Developer ภายใน 1 ปี"
                className="w-full bg-transparent font-display font-semibold text-base md:text-lg placeholder:text-faint placeholder:font-medium"
              />
            </label>

            <div>
              <div className="text-xs font-bold text-muted mb-2.5">หมวดหมู่ (ไม่บังคับ)</div>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    className={'text-xs font-bold px-4 py-2 rounded-full ' + (category === c ? 'bg-coral text-white' : 'bg-chip text-muted')}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <Link
                href={aiHref}
                className="tap flex-1 flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-lavender shadow-lavenderGlow"
              >
                <Sparkles size={16} className="text-white" />
                <span className="font-display font-semibold text-sm text-white">ให้ AI ช่วยคิด 8 หัวข้อย่อย</span>
              </Link>
              <Link
                href={manualHref}
                className="tap flex-1 flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-white shadow-soft"
              >
                <span className="font-display font-semibold text-sm">กรอกหัวข้อย่อยเอง</span>
              </Link>
            </div>
            <span className="text-xs text-faint">เลือกทางไหนก็แก้ไขทีหลังได้เสมอ</span>
          </div>

          <div className="hidden lg:flex flex-1 max-w-md bg-white rounded-[28px] p-8 shadow-softLg flex-col items-center gap-4">
            <span className="self-start text-xs font-bold text-muted">ตัวอย่าง Mandala Chart ของคุณ</span>
            <div className="grid grid-cols-3 gap-2.5 w-full">
              {Array.from({ length: 9 }, (_, i) => i).map((i) =>
                i === 4 ? (
                  <div key={i} className="aspect-square rounded-2xl bg-lavender-bg2 border-2 border-lavender flex items-center justify-center p-1 text-center">
                    <span className="text-[10px] font-bold text-lavender-dark leading-tight">เป้าหมายหลัก</span>
                  </div>
                ) : (
                  <div key={i} className="aspect-square rounded-2xl bg-cream border-2 border-dashed border-line flex items-center justify-center">
                    <Sparkles size={14} className="text-faint animate-floaty" />
                  </div>
                )
              )}
            </div>
            <p className="text-xs text-faint text-center leading-relaxed">ช่องที่เหลือจะถูกเติมให้อัตโนมัติในขั้นตอนถัดไป</p>
          </div>
        </div>
      </div>
    </main>
  );
}
