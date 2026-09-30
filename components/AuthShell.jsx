import { Bell, Sparkles, Target } from 'lucide-react';

// Brand mark: a tiny 3×3 mandala with the core cell highlighted.
export function LogoMark({ size = 40 }) {
  const cell = Math.round(size / 4.2);
  const gap = Math.max(2, Math.round(size / 18));
  return (
    <span
      className="inline-grid grid-cols-3 place-content-center rounded-[28%] bg-white/15 ring-1 ring-white/25 flex-shrink-0"
      style={{ width: size, height: size, gap }}
      aria-hidden="true"
    >
      {Array.from({ length: 9 }, (_, i) => (
        <span
          key={i}
          className="rounded-[3px]"
          style={{ width: cell, height: cell, background: i === 4 ? '#FFFFFF' : 'rgba(255,255,255,0.45)' }}
        />
      ))}
    </span>
  );
}

const SAMPLE = ['เขียนโค้ด', 'อ่านหนังสือ', 'ออกกำลังกาย', 'เครือข่าย', null, 'สุขภาพจิต', 'การเงิน', 'พอร์ตโฟลิโอ', 'Soft skills'];
const SAMPLE_LEVEL = [0.9, 0.55, 1, 0.35, null, 0.7, 1, 0.45, 0.8];

function SampleChart() {
  return (
    <div className="grid grid-cols-3 gap-2 w-full max-w-[320px]" aria-hidden="true">
      {SAMPLE.map((label, i) =>
        label === null ? (
          <div key={i} className="aspect-square rounded-2xl bg-white flex items-center justify-center p-2 text-center shadow-lg">
            <span className="font-display font-semibold text-[12px] leading-tight text-coral-dark">Full-stack Dev ใน 1 ปี</span>
          </div>
        ) : (
          <div
            key={i}
            className="aspect-square rounded-2xl flex items-end p-2"
            style={{ background: `rgba(255,255,255,${0.08 + SAMPLE_LEVEL[i] * 0.2})` }}
          >
            <span className="text-[10.5px] font-semibold text-white/90 leading-tight">{label}</span>
          </div>
        )
      )}
    </div>
  );
}

const FEATURES = [
  { icon: Target, text: 'แตกเป้าหมายใหญ่เป็น 8 หัวข้อ 64 action' },
  { icon: Sparkles, text: 'AI ช่วยคิดแผนและขั้นตอนย่อยให้' },
  { icon: Bell, text: 'เตือนก้าวถัดไปทุกวัน ไม่หลุดเป้า' },
];

// Shared layout for /login and /register.
// Mobile: short brand bar on top, form as a full-height white sheet.
// Desktop: brand panel on the left, form on the right.
export default function AuthShell({ children }) {
  return (
    <main className="min-h-dvh w-full flex flex-col lg:flex-row bg-brand lg:bg-white">
      {/* Brand panel */}
      <section className="relative overflow-hidden bg-brand text-white lg:w-[46%] lg:min-h-dvh flex flex-col">
        <div className="absolute -top-20 -right-16 w-64 h-64 rounded-full bg-white/10" />
        <div className="absolute -bottom-24 -left-10 w-72 h-72 rounded-full bg-lavender/25 hidden lg:block" />

        {/* Mobile header */}
        <div className="relative lg:hidden px-6 pt-10 pb-12 flex items-center gap-3">
          <LogoMark size={44} />
          <div>
            <div className="font-display font-semibold text-lg leading-tight">Mandala AI</div>
            <div className="text-[12.5px] text-white/80">วางแผนเป้าหมายชีวิตให้เป็นจริง</div>
          </div>
        </div>

        {/* Desktop panel */}
        <div className="relative hidden lg:flex flex-1 flex-col justify-between p-12 xl:p-16">
          <div className="flex items-center gap-3">
            <LogoMark size={40} />
            <span className="font-display font-semibold text-lg">Mandala AI</span>
          </div>

          <div className="flex flex-col gap-8 max-w-md">
            <div>
              <h1 className="font-display font-semibold text-[34px] xl:text-[40px] leading-[1.2]">
                วางแผนเป้าหมายชีวิต
                <br />
                ให้เป็นจริง
              </h1>
              <p className="text-[15px] text-white/80 mt-3 leading-relaxed">
                แตกเป้าหมายใหญ่ให้เป็นแผนที่ลงมือได้ทุกวัน ด้วย Mandala Chart และ AI ที่คอยช่วยทุกขั้นตอน
              </p>
            </div>
            <SampleChart />
            <ul className="flex flex-col gap-3">
              {FEATURES.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-[14px]">
                  <span className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                    <Icon size={15} />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-[12px] text-white/60">ผู้ใช้กว่า 4,200 คนกำลังทำตามเป้าหมายอยู่ตอนนี้</p>
        </div>
      </section>

      {/* Form */}
      <section className="relative flex-1 -mt-6 lg:mt-0 rounded-t-[28px] lg:rounded-none bg-white flex justify-center lg:items-center px-6 pt-8 pb-10 lg:p-14">
        <div className="w-full max-w-sm flex flex-col gap-5">{children}</div>
      </section>
    </main>
  );
}
