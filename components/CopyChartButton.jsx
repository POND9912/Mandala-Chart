'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, CopyPlus } from 'lucide-react';

// Front-end only for now: shows the "copied" state without creating anything.
// Wire this to a real copy endpoint once charts are stored per user.
export default function CopyChartButton({ chartTitle, className = '' }) {
  const [copied, setCopied] = useState(false);

  if (copied) {
    return (
      <div className={'flex flex-col gap-2 p-4 rounded-2xl bg-mint-light ' + className}>
        <span className="flex items-center gap-2 text-sm font-bold">
          <Check size={16} className="text-mint" /> เพิ่มเข้า Chart ของคุณแล้ว
        </span>
        <span className="text-[12px] text-muted leading-relaxed">
          &ldquo;{chartTitle}&rdquo; พร้อมหัวข้อย่อยและ action ทั้งหมด เริ่มนับความคืบหน้าใหม่ที่ 0%
        </span>
        <Link href="/gallery" className="tap self-start text-[13px] font-bold text-coral">
          ไปที่ Chart ของฉัน →
        </Link>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setCopied(true)}
      className={
        'tap flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-coral shadow-coral text-white w-full ' + className
      }
    >
      <CopyPlus size={16} />
      <span className="font-display font-semibold text-sm">ใช้ Chart นี้</span>
    </button>
  );
}
