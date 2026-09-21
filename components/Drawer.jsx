'use client';

import { X } from 'lucide-react';

export default function Drawer({ open, onClose, title, subtitle, children }) {
  return (
    <>
      <div
        onClick={onClose}
        aria-hidden="true"
        className={
          'fixed inset-0 bg-ink/30 z-40 transition-opacity duration-300 ' +
          (open ? 'opacity-100' : 'opacity-0 pointer-events-none')
        }
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={
          'fixed z-50 bg-white flex flex-col ' +
          'inset-x-0 bottom-0 rounded-t-[28px] max-h-[85dvh] ' +
          'md:inset-y-0 md:right-0 md:left-auto md:bottom-auto md:w-[420px] md:max-h-none md:rounded-l-[28px] md:rounded-t-none ' +
          'transition-transform duration-300 ease-out ' +
          (open ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-y-0 md:translate-x-full')
        }
      >
        <div className="flex-shrink-0 flex items-start justify-between gap-3 p-5 border-b border-line">
          <div className="min-w-0">
            {subtitle && <div className="text-[11px] font-bold text-muted mb-1">{subtitle}</div>}
            <div className="font-display font-semibold text-base truncate">{title}</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="ปิด"
            className="tap w-8 h-8 flex-shrink-0 rounded-full bg-chip flex items-center justify-center"
          >
            <X size={15} className="text-muted" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </>
  );
}
