'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Prototype only — safe to ignore registration failures (e.g. in dev over http).
      });
    }
  }, []);
  return null;
}
