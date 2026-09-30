'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, Copy, Eye, EyeOff, Globe, Lock, Share2, Users } from 'lucide-react';
import Drawer from '@/components/Drawer';

// Front-end only for now: the public/private switch lives in component state
// and isn't saved anywhere until the backend exists.
export default function ShareButton({ chartId, initialPublic, copyCount }) {
  const [open, setOpen] = useState(false);
  const [isPublic, setIsPublic] = useState(initialPublic);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const publicPath = `/p/${chartId}`;

  async function copyLink() {
    setError('');
    try {
      await navigator.clipboard.writeText(window.location.origin + publicPath);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('คัดลอกไม่ได้ ลองคัดลอกลิงก์ด้วยตัวเอง');
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          'tap flex items-center gap-1.5 h-8 px-3 rounded-full flex-shrink-0 text-[12px] font-bold ' +
          (isPublic ? 'bg-lavender-bg text-lavender-text' : 'bg-chip text-muted')
        }
      >
        {isPublic ? <Globe size={13} /> : <Share2 size={13} />}
        {isPublic ? 'สาธารณะ' : 'แชร์'}
      </button>

      <Drawer open={open} onClose={() => setOpen(false)} title="แชร์ Chart นี้" subtitle="การแชร์">
        <div className="flex flex-col gap-5">
          <button
            type="button"
            onClick={() => setIsPublic((v) => !v)}
            aria-pressed={isPublic}
            className="tap flex items-center gap-3 p-4 rounded-2xl bg-cream text-left"
          >
            <span
              className={
                'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ' +
                (isPublic ? 'bg-coral text-white' : 'bg-white text-muted')
              }
            >
              {isPublic ? <Globe size={18} /> : <Lock size={18} />}
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-sm font-bold">{isPublic ? 'เปิดเป็นสาธารณะอยู่' : 'ส่วนตัว'}</span>
              <span className="block text-[12px] text-muted">
                {isPublic ? 'ทุกคนที่มีลิงก์ดูได้ และอยู่ในหน้าเทมเพลต' : 'เห็นได้แค่คุณคนเดียว'}
              </span>
            </span>
            <span className={'w-11 h-6 rounded-full p-0.5 flex-shrink-0 transition-colors ' + (isPublic ? 'bg-coral' : 'bg-line')}>
              <span className={'block w-5 h-5 rounded-full bg-white shadow transition-transform ' + (isPublic ? 'translate-x-5' : '')} />
            </span>
          </button>

          <div className="flex flex-col gap-2.5">
            <span className="text-[11px] font-bold text-muted">คนอื่นจะเห็นอะไร</span>
            <Row icon={<Eye size={14} />} ok text="เป้าหมาย หัวข้อย่อย และ action ทั้งหมด" />
            <Row icon={<Eye size={14} />} ok text="% ความคืบหน้ารวม และของแต่ละหัวข้อย่อย" />
            <Row icon={<EyeOff size={14} />} text="action ไหนทำแล้ว / ยังไม่ทำ, บันทึก และขั้นตอนย่อย" />
            <Row icon={<Users size={14} />} ok text="คนอื่นกด “ใช้ Chart นี้” เพื่อคัดลอกไปเริ่มใหม่ในบัญชีตัวเองได้" />
          </div>

          {isPublic && (
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold text-muted">ลิงก์สาธารณะ</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={copyLink}
                  className="tap flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-coral text-white text-[13px] font-bold"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'คัดลอกแล้ว' : 'คัดลอกลิงก์'}
                </button>
                <Link
                  href={publicPath}
                  className="tap flex items-center justify-center px-4 rounded-2xl bg-chip text-[13px] font-bold text-muted"
                >
                  ดูตัวอย่าง
                </Link>
              </div>
              <span className="text-[11px] text-faint">มีคนนำไปใช้แล้ว {copyCount} ครั้ง</span>
            </div>
          )}

          {error && <p role="alert" className="text-[12.5px] font-semibold text-red-600">{error}</p>}
        </div>
      </Drawer>
    </>
  );
}

function Row({ icon, text, ok = false }) {
  return (
    <div className="flex items-start gap-2.5 text-[13px]">
      <span className={'mt-0.5 flex-shrink-0 ' + (ok ? 'text-coral' : 'text-faint')}>{icon}</span>
      <span className={ok ? 'text-ink' : 'text-muted'}>
        {!ok && <span className="font-bold">ไม่เห็น: </span>}
        {text}
      </span>
    </div>
  );
}
