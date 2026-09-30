'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { LogOut, Settings, ShieldCheck } from 'lucide-react';

// `up` opens the menu upward from the left — for the admin sidebar footer.
export default function UserMenu({ className = '', up = false }) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    function close(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [open]);

  const user = session?.user;
  if (!user) return <span className={'w-10 h-10 rounded-full bg-white/20 ' + className} />;

  const isAdmin = user.role === 'ADMIN';
  const initial = (user.name || user.email || '?').trim().charAt(0).toUpperCase();

  return (
    <div ref={rootRef} className={'relative ' + className}>
      <button
        type="button"
        aria-label="เมนูผู้ใช้"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="tap w-10 h-10 rounded-full bg-lavender ring-2 ring-white/80 hover:ring-white overflow-hidden flex items-center justify-center"
      >
        {user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          <span className="font-display font-semibold text-sm text-white">{initial}</span>
        )}
      </button>

      {open && (
        <div
          className={
            'absolute z-50 w-60 ' + (up ? 'left-0 bottom-full mb-2' : 'right-0 top-full mt-2') +
            ' bg-white text-ink rounded-2xl shadow-softLg border border-line p-2'
          }
        >
          <div className="px-3 py-2.5">
            <div className="text-sm font-bold truncate">{user.name || 'ผู้ใช้'}</div>
            <div className="text-[11px] text-muted truncate">{user.email}</div>
            <span
              className={
                'inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full ' +
                (isAdmin ? 'bg-coral text-white' : 'bg-chip text-muted')
              }
            >
              {isAdmin ? 'ADMIN' : 'USER'}
            </span>
          </div>
          <div className="h-px bg-line my-1" />
          <Link href="/settings" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-semibold hover:bg-chip">
            <Settings size={15} className="text-muted" /> การตั้งค่า
          </Link>
          {isAdmin && (
            <Link href="/admin" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-semibold hover:bg-chip">
              <ShieldCheck size={15} className="text-coral" /> แดชบอร์ดผู้ดูแล
            </Link>
          )}
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-semibold hover:bg-chip text-left"
          >
            <LogOut size={15} className="text-muted" /> ออกจากระบบ
          </button>
        </div>
      )}
    </div>
  );
}
