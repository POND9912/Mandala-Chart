'use client';

import { useEffect, useState } from 'react';
import { Download, Share, X } from 'lucide-react';

function isIos() {
  if (typeof navigator === 'undefined') return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isStandalone() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

const DISMISS_KEY = 'mandala-install-dismissed';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showIosSteps, setShowIosSteps] = useState(false);
  const [dismissed, setDismissed] = useState(true); // start hidden until we know it's worth showing

  useEffect(() => {
    if (isStandalone() || localStorage.getItem(DISMISS_KEY)) return;

    if (isIos()) {
      setDismissed(false);
      return;
    }

    function onBeforeInstall(e) {
      e.preventDefault();
      setDeferredPrompt(e);
      setDismissed(false);
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall);
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, '1');
    setDismissed(true);
    setShowIosSteps(false);
  }

  async function install() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    dismiss();
  }

  if (dismissed) return null;

  const ios = isIos();

  return (
    <div className="rounded-2xl bg-lavender-bg p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-full bg-lavender flex items-center justify-center flex-shrink-0">
            <Download size={16} className="text-white" />
          </span>
          <div>
            <div className="font-display font-semibold text-[13px]">ติดตั้งแอปเพื่อรับการแจ้งเตือน</div>
            <div className="text-[12px] text-lavender-text">
              {ios ? 'บนไอโฟนต้องติดตั้งก่อน ถึงจะเปิดแจ้งเตือนได้' : 'ติดตั้งครั้งเดียว เปิดจากหน้าจอโฮมได้เลย'}
            </div>
          </div>
        </div>
        <button type="button" onClick={dismiss} aria-label="ปิด" className="tap w-7 h-7 flex-shrink-0 rounded-full bg-white/60 flex items-center justify-center">
          <X size={13} className="text-lavender-dark" />
        </button>
      </div>

      {ios ? (
        <>
          {!showIosSteps ? (
            <button
              type="button"
              onClick={() => setShowIosSteps(true)}
              className="tap self-start text-[12.5px] font-bold text-lavender-text"
            >
              วิธีติดตั้ง →
            </button>
          ) : (
            <ol className="flex flex-col gap-2 text-[12.5px] text-ink pl-1">
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center flex-shrink-0 text-[10px] font-bold">1</span>
                แตะปุ่ม <Share size={13} className="inline mx-0.5" /> แชร์ ที่แถบเบราว์เซอร์
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center flex-shrink-0 text-[10px] font-bold">2</span>
                เลือก &quot;เพิ่มไปยังหน้าจอโฮม&quot;
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center flex-shrink-0 text-[10px] font-bold">3</span>
                เปิดแอปจากหน้าจอโฮม แล้วกดกระดิ่งเพื่อเปิดแจ้งเตือน
              </li>
            </ol>
          )}
        </>
      ) : (
        <button
          type="button"
          onClick={install}
          className="tap self-start px-4 py-2 rounded-full bg-lavender text-white text-[12.5px] font-bold"
        >
          ติดตั้งเลย
        </button>
      )}
    </div>
  );
}
