'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, BellRing } from 'lucide-react';
import { randomDailyAction } from '@/lib/data';

function isIos() {
  if (typeof navigator === 'undefined') return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isStandalone() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

export default function NotifyBell() {
  const router = useRouter();
  const [supported, setSupported] = useState(true);
  const [permission, setPermission] = useState('default');
  const [hint, setHint] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setSupported(false);
      return;
    }
    setPermission(Notification.permission);
  }, []);

  async function handleClick() {
    if (!supported) {
      setHint(isIos() ? 'บนไอโฟน ต้องกด "Add to Home Screen" ก่อน ถึงจะเปิดแจ้งเตือนได้' : 'เบราว์เซอร์นี้ยังไม่รองรับการแจ้งเตือน');
      return;
    }
    if (isIos() && !isStandalone()) {
      setHint('บนไอโฟน ต้องเพิ่มแอปนี้ที่หน้าจอโฮม (Add to Home Screen) ก่อน ถึงจะขอสิทธิ์แจ้งเตือนได้');
      return;
    }

    let perm = Notification.permission;
    if (perm === 'default') {
      perm = await Notification.requestPermission();
      setPermission(perm);
    }
    if (perm !== 'granted') {
      setHint('คุณยังไม่ได้อนุญาตให้แจ้งเตือน ลองเปิดสิทธิ์ในตั้งค่าเบราว์เซอร์');
      return;
    }

    const action = randomDailyAction();
    setHint('');

    if (!action) {
      const n = new Notification('ทุก Chart เสร็จหมดแล้ว', {
        body: 'ไม่มี action ที่ต้องเตือนตอนนี้ — เพิ่มเป้าหมายใหม่ได้เลย',
        icon: '/icon-192.svg',
      });
      n.onclick = () => {
        window.focus();
        router.push('/gallery');
        n.close();
      };
      return;
    }

    // Chart-aware body so it's unambiguous which of the user's Mandala
    // Charts this reminder belongs to.
    const n = new Notification(action.chartTitle, {
      body: `${action.subgoalTitle} • ${action.label}`,
      icon: '/icon-192.svg',
      tag: action.chartId, // one notification per chart replaces the last, doesn't stack
    });
    const deepLink = `/chart/${action.chartId}/subgoal/${action.subgoalId}`;
    n.onclick = () => {
      window.focus();
      router.push(deepLink);
      n.close();
    };
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleClick}
        aria-label="เปิดการแจ้งเตือนรายวัน"
        className="tap w-9 h-9 rounded-full bg-chip flex items-center justify-center"
      >
        {permission === 'granted' ? <BellRing size={16} className="text-coral" /> : <Bell size={16} className="text-muted" />}
      </button>
      {hint && (
        <div className="absolute right-0 top-11 z-30 w-56 bg-white rounded-2xl shadow-softLg p-3.5 text-[12px] leading-relaxed">
          {hint}
          <button type="button" onClick={() => setHint('')} className="block mt-2 text-[11px] font-bold text-muted">
            ปิด
          </button>
        </div>
      )}
    </div>
  );
}
