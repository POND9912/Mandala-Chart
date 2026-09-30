'use client';

import { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import {
  Bell,
  Check,
  Crown,
  Globe,
  KeyRound,
  Lock,
  LogOut,
  ShieldCheck,
  Sparkles,
  Trash2,
  User,
} from 'lucide-react';

const SECTIONS = [
  { id: 'profile', label: 'โปรไฟล์', icon: User },
  { id: 'notifications', label: 'การแจ้งเตือน', icon: Bell },
  { id: 'privacy', label: 'ความเป็นส่วนตัว', icon: ShieldCheck },
  { id: 'plan', label: 'แพ็กเกจ', icon: Crown },
  { id: 'account', label: 'บัญชี', icon: KeyRound },
];

// Preferences are front-end only for now: kept in this browser's localStorage
// until there's a settings API. Reads/writes are guarded because storage can throw.
const PREFS_KEY = 'mandala:prefs';
const DEFAULT_PREFS = {
  dailyReminder: true,
  reminderTime: '08:00',
  weeklySummary: false,
  defaultPublic: false,
  showNameOnPublic: true,
};

function loadPrefs() {
  try {
    return { ...DEFAULT_PREFS, ...JSON.parse(localStorage.getItem(PREFS_KEY) || '{}') };
  } catch {
    return DEFAULT_PREFS;
  }
}

function savePrefs(prefs) {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {
    // Storage unavailable (private mode etc.) — settings just won't persist.
  }
}

export default function SettingsView({ user }) {
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);
  const [name, setName] = useState(user.name || '');
  const [toast, setToast] = useState('');

  useEffect(() => setPrefs(loadPrefs()), []);

  function update(patch) {
    setPrefs((p) => {
      const next = { ...p, ...patch };
      savePrefs(next);
      return next;
    });
  }

  function notify(text) {
    setToast(text);
    setTimeout(() => setToast(''), 2600);
  }

  const initial = (user.name || user.email || '?').trim().charAt(0).toUpperCase();
  const isAdmin = user.role === 'ADMIN';

  return (
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-5 md:gap-8">
      {/* Section nav: chips on mobile, sticky list on desktop */}
      <aside className="md:w-56 flex-shrink-0">
        <h1 className="font-display font-semibold text-xl md:text-2xl mb-3 md:mb-5">การตั้งค่า</h1>
        <nav className="flex md:flex-col gap-1.5 overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 pb-1 md:sticky md:top-6">
          {SECTIONS.map(({ id, label, icon: Icon }) => (
            <a
              key={id}
              href={`#${id}`}
              className="flex items-center gap-2.5 whitespace-nowrap px-3.5 py-2 md:py-2.5 rounded-full md:rounded-xl text-[13px] font-bold text-muted bg-white md:bg-transparent shadow-soft md:shadow-none hover:bg-white hover:text-ink transition-colors"
            >
              <Icon size={15} /> {label}
            </a>
          ))}
        </nav>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col gap-5">
        <Card id="profile" icon={User} title="โปรไฟล์" subtitle="ชื่อนี้จะแสดงบน Chart ที่คุณเปิดเป็นสาธารณะ">
          <div className="flex items-center gap-4">
            <span className="w-16 h-16 rounded-full bg-lavender ring-4 ring-lavender-bg overflow-hidden flex items-center justify-center flex-shrink-0">
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <span className="font-display font-semibold text-2xl text-white">{initial}</span>
              )}
            </span>
            <div className="min-w-0">
              <div className="font-display font-semibold text-base truncate">{user.name || 'ผู้ใช้'}</div>
              <div className="text-[13px] text-muted truncate">{user.email}</div>
              <span
                className={
                  'inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full ' +
                  (isAdmin ? 'bg-coral text-white' : 'bg-chip text-muted')
                }
              >
                {isAdmin ? 'ADMIN' : 'USER'}
              </span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <TextField label="ชื่อที่แสดง" value={name} onChange={setName} placeholder="ชื่อของคุณ" />
            <TextField label="อีเมล" value={user.email || ''} readOnly hint="เปลี่ยนอีเมลไม่ได้" />
          </div>

          <div className="flex justify-end">
            <PrimaryButton onClick={() => notify('ตัวอย่างเท่านั้น — การบันทึกชื่อจะใช้ได้เมื่อเชื่อมหลังบ้าน')}>
              บันทึกโปรไฟล์
            </PrimaryButton>
          </div>
        </Card>

        <Card id="notifications" icon={Bell} title="การแจ้งเตือน" subtitle="ให้ Mandala AI ช่วยเตือนก้าวถัดไปของคุณ">
          <ToggleRow
            title="เตือน action รายวัน"
            description="สุ่ม action ที่ยังไม่เสร็จจาก Chart ที่กำลังทำ มาเตือนวันละครั้ง"
            checked={prefs.dailyReminder}
            onChange={(v) => update({ dailyReminder: v })}
          />
          <div className={'flex items-center justify-between gap-4 pl-1 transition-opacity ' + (prefs.dailyReminder ? '' : 'opacity-40 pointer-events-none')}>
            <span className="text-[13px] font-semibold text-muted">เวลาที่เตือน</span>
            <input
              type="time"
              value={prefs.reminderTime}
              onChange={(e) => update({ reminderTime: e.target.value })}
              className="h-10 px-3 rounded-xl bg-cream text-base font-bold text-ink"
            />
          </div>
          <Divider />
          <ToggleRow
            title="สรุปความคืบหน้ารายสัปดาห์"
            description="ทุกวันอาทิตย์ สรุปว่าสัปดาห์นี้ทำไปกี่ action และหัวข้อไหนควรเร่ง"
            checked={prefs.weeklySummary}
            onChange={(v) => update({ weeklySummary: v })}
          />
        </Card>

        <Card id="privacy" icon={ShieldCheck} title="ความเป็นส่วนตัว" subtitle="กำหนดว่าคนอื่นจะเห็นอะไรจาก Chart ของคุณ">
          <div className="flex flex-col gap-2">
            <span className="text-[13px] font-bold">Chart ใหม่ตั้งค่าเริ่มต้นเป็น</span>
            <div className="grid grid-cols-2 gap-2.5">
              <ChoiceCard
                active={!prefs.defaultPublic}
                onClick={() => update({ defaultPublic: false })}
                icon={Lock}
                title="ส่วนตัว"
                text="เห็นได้แค่คุณ"
              />
              <ChoiceCard
                active={prefs.defaultPublic}
                onClick={() => update({ defaultPublic: true })}
                icon={Globe}
                title="สาธารณะ"
                text="อยู่ในหน้าเทมเพลต"
              />
            </div>
          </div>
          <Divider />
          <ToggleRow
            title="แสดงชื่อบน Chart สาธารณะ"
            description="ถ้าปิด จะแสดงเป็น “ผู้ใช้ Mandala AI” แทนชื่อของคุณ"
            checked={prefs.showNameOnPublic}
            onChange={(v) => update({ showNameOnPublic: v })}
          />
        </Card>

        <Card id="plan" icon={Crown} title="แพ็กเกจ" subtitle="ตอนนี้คุณใช้แพ็กเกจฟรี">
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="rounded-2xl border-2 border-line p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-display font-semibold text-base">Free</span>
                <span className="text-[10px] font-bold text-coral bg-lavender-bg px-2 py-0.5 rounded-full">ใช้อยู่</span>
              </div>
              <PlanItem text="สร้าง Mandala Chart ไม่จำกัด" />
              <PlanItem text="Hint “วิธีผ่าน” ทุกหัวข้อ" />
              <PlanItem text="แชร์และใช้เทมเพลต" />
            </div>
            <div className="relative overflow-hidden rounded-2xl bg-brand text-white p-4 flex flex-col gap-2">
              <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10" />
              <div className="relative flex items-center justify-between">
                <span className="font-display font-semibold text-base flex items-center gap-1.5">
                  <Sparkles size={15} /> Premium
                </span>
                <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full">เร็ว ๆ นี้</span>
              </div>
              <PlanItem light text="ทุกอย่างใน Free" />
              <PlanItem light text="Hint “ก้าวถัดไป” แผนรายวันที่ AI ย่อยให้" />
              <PlanItem light text="Hint “ถ้าติดอยู่” หาสาเหตุ + แผนกู้" />
              <button
                type="button"
                onClick={() => notify('Premium จะเปิดให้สมัครเร็ว ๆ นี้')}
                className="tap relative mt-1 h-10 rounded-xl bg-white text-coral-dark text-[13px] font-bold"
              >
                แจ้งเตือนเมื่อเปิดให้สมัคร
              </button>
            </div>
          </div>
        </Card>

        <Card id="account" icon={KeyRound} title="บัญชี">
          <ActionRow
            icon={KeyRound}
            title="เปลี่ยนรหัสผ่าน"
            description="ใช้ได้กับบัญชีที่สมัครด้วยอีเมล"
            button="เปลี่ยน"
            onClick={() => notify('การเปลี่ยนรหัสผ่านจะใช้ได้เมื่อเชื่อมหลังบ้าน')}
          />
          <Divider />
          <ActionRow
            icon={LogOut}
            title="ออกจากระบบ"
            description="ออกจากระบบบนอุปกรณ์นี้"
            button="ออกจากระบบ"
            onClick={() => signOut({ callbackUrl: '/login' })}
          />
          <Divider />
          <ActionRow
            danger
            icon={Trash2}
            title="ลบบัญชี"
            description="ลบบัญชีและ Chart ทั้งหมดถาวร กู้คืนไม่ได้"
            button="ลบบัญชี"
            onClick={() => notify('การลบบัญชีจะใช้ได้เมื่อเชื่อมหลังบ้าน')}
          />
        </Card>
      </div>

      {toast && (
        <div
          role="status"
          className="fixed left-1/2 -translate-x-1/2 bottom-6 z-50 max-w-[calc(100vw-32px)] flex items-center gap-2 px-4 py-3 rounded-2xl bg-ink text-white text-[13px] font-semibold shadow-softLg"
        >
          <Check size={15} className="text-mint flex-shrink-0" /> {toast}
        </div>
      )}
    </div>
  );
}

function Card({ id, icon: Icon, title, subtitle, children }) {
  return (
    <section id={id} className="scroll-mt-6 bg-white rounded-[20px] shadow-soft p-5 md:p-6 flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <span className="w-9 h-9 rounded-xl bg-lavender-bg text-coral flex items-center justify-center flex-shrink-0">
          <Icon size={17} />
        </span>
        <div>
          <h2 className="font-display font-semibold text-base">{title}</h2>
          {subtitle && <p className="text-[12.5px] text-muted mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

function Divider() {
  return <div className="h-px bg-line" />;
}

function TextField({ label, value, onChange, placeholder, readOnly, hint }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[12.5px] font-bold">{label}</span>
      <input
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        readOnly={readOnly}
        placeholder={placeholder}
        className={
          'h-12 px-4 rounded-2xl text-base font-semibold border border-transparent transition ' +
          (readOnly ? 'bg-chip text-muted' : 'bg-cream focus:bg-white focus:border-coral focus:ring-4 focus:ring-coral/10')
        }
      />
      {hint && <span className="text-[11px] text-faint">{hint}</span>}
    </label>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={'w-12 h-7 rounded-full p-0.5 flex-shrink-0 transition-colors ' + (checked ? 'bg-coral' : 'bg-line')}
    >
      <span className={'block w-6 h-6 rounded-full bg-white shadow transition-transform ' + (checked ? 'translate-x-5' : '')} />
    </button>
  );
}

function ToggleRow({ title, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <div className="text-[14px] font-bold">{title}</div>
        <div className="text-[12.5px] text-muted mt-0.5 leading-relaxed">{description}</div>
      </div>
      <Toggle checked={checked} onChange={onChange} label={title} />
    </div>
  );
}

function ChoiceCard({ active, onClick, icon: Icon, title, text }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={
        'tap flex items-center gap-3 p-3.5 rounded-2xl text-left border-2 transition-colors ' +
        (active ? 'border-coral bg-lavender-bg' : 'border-line bg-white hover:bg-cream')
      }
    >
      <span
        className={
          'w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ' + (active ? 'bg-coral text-white' : 'bg-chip text-muted')
        }
      >
        <Icon size={16} />
      </span>
      <span className="min-w-0">
        <span className="block text-[13px] font-bold">{title}</span>
        <span className="block text-[11.5px] text-muted">{text}</span>
      </span>
    </button>
  );
}

function PlanItem({ text, light = false }) {
  return (
    <span className={'relative flex items-start gap-2 text-[12.5px] ' + (light ? 'text-white/90' : 'text-ink')}>
      <Check size={14} className={'mt-0.5 flex-shrink-0 ' + (light ? 'text-white' : 'text-mint')} />
      {text}
    </span>
  );
}

function ActionRow({ icon: Icon, title, description, button, onClick, danger = false }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-start gap-3 min-w-0">
        <Icon size={17} className={'mt-0.5 flex-shrink-0 ' + (danger ? 'text-red-500' : 'text-muted')} />
        <div className="min-w-0">
          <div className={'text-[14px] font-bold ' + (danger ? 'text-red-600' : '')}>{title}</div>
          <div className="text-[12.5px] text-muted mt-0.5">{description}</div>
        </div>
      </div>
      <button
        type="button"
        onClick={onClick}
        className={
          'tap h-9 px-4 rounded-xl text-[13px] font-bold whitespace-nowrap flex-shrink-0 ' +
          (danger ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-chip text-ink hover:bg-line')
        }
      >
        {button}
      </button>
    </div>
  );
}

function PrimaryButton({ children, onClick }) {
  return (
    <button type="button" onClick={onClick} className="tap h-11 px-5 rounded-xl bg-brand text-white text-[13px] font-bold shadow-coral">
      {children}
    </button>
  );
}
