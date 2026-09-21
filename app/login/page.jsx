import Link from 'next/link';
import { HEAT_RAMP } from '@/lib/data';

function DecoGrid({ big = false }) {
  const size = big ? 34 : 20;
  const gap = big ? 8 : 5;
  const cells = Array.from({ length: 9 }, (_, i) => (i === 4 ? '#B8A9FF' : HEAT_RAMP[(i * 2) % 4]));
  return (
    <div className="grid grid-cols-3" style={{ gap, width: size * 3 + gap * 2 }}>
      {cells.map((c, i) => (
        <div key={i} className={big ? 'rounded-[9px]' : 'rounded-md'} style={{ width: size, height: size, background: c }} />
      ))}
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-dvh w-full flex flex-col lg:flex-row bg-white">
      {/* Branding panel — desktop only real content, still shown compact on mobile */}
      <div className="relative overflow-hidden flex-1 bg-lavender-bg flex flex-col items-center justify-center gap-6 px-8 py-14 lg:py-20">
        <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-lavender-bg2 opacity-70" />
        <div className="absolute -bottom-16 -right-12 w-48 h-48 rounded-full bg-mint-light opacity-60" />

        <div className="relative flex flex-col items-center gap-4 text-center max-w-md">
          <span className="w-14 h-14 rounded-2xl bg-coral" />
          <h1 className="font-display font-semibold text-2xl lg:text-[30px] leading-snug">
            วางแผนเป้าหมายชีวิตให้เป็นจริง
          </h1>
          <p className="hidden lg:block text-sm text-lavender-dark leading-relaxed">
            Mandala AI ช่วยแตกเป้าหมายใหญ่ให้เป็นแผนปฏิบัติที่ทำได้จริง พร้อม AI คอยแนะนำทุกขั้นตอน
          </p>
          <div className="mt-1">
            <DecoGrid big />
          </div>
          <div className="hidden lg:block mt-2 bg-white rounded-2xl px-6 py-3.5 shadow-soft">
            <span className="text-[13px] font-semibold">ผู้ใช้กว่า 4,200 คนกำลังทำตามเป้าหมายอยู่ตอนนี้</span>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-14 bg-white">
        <div className="w-full max-w-sm flex flex-col gap-4">
          <div>
            <h2 className="font-display font-semibold text-xl">ยินดีต้อนรับกลับมา</h2>
            <p className="text-[13px] text-muted mt-1.5">เข้าสู่ระบบเพื่อดู Mandala Chart ของคุณ</p>
          </div>

          <label className="block bg-cream rounded-2xl px-4 py-3.5">
            <span className="block text-[10px] font-bold text-muted mb-1">อีเมล</span>
            <input type="email" placeholder="you@example.com" className="w-full bg-transparent text-sm font-semibold placeholder:text-faint placeholder:font-medium" />
          </label>

          <label className="block bg-cream rounded-2xl px-4 py-3.5">
            <span className="block text-[10px] font-bold text-muted mb-1">รหัสผ่าน</span>
            <input type="password" placeholder="••••••••" className="w-full bg-transparent text-sm font-semibold placeholder:text-faint placeholder:font-medium" />
          </label>

          <span className="self-end text-xs font-semibold text-muted">ลืมรหัสผ่าน?</span>

          <Link
            href="/gallery"
            className="tap flex items-center justify-center py-3.5 rounded-2xl bg-coral shadow-coral"
          >
            <span className="font-display font-semibold text-sm text-white">เข้าสู่ระบบ</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-line" />
            <span className="text-[11px] font-semibold text-faint">หรือ</span>
            <div className="flex-1 h-px bg-line" />
          </div>

          <button type="button" className="tap flex items-center justify-center gap-2.5 py-3.5 rounded-2xl bg-cream">
            <span className="w-[18px] h-[18px] rounded-full border-2 border-faint" />
            <span className="text-[13px] font-bold">ดำเนินการต่อด้วยบัญชีโซเชียล</span>
          </button>

          <span className="text-center text-[12.5px] text-muted mt-1">
            ยังไม่มีบัญชี? <span className="font-bold text-coral">สมัครสมาชิก</span>
          </span>
        </div>
      </div>
    </main>
  );
}
