'use client';

import { useEffect, useRef, useState } from 'react';

const SLOTS = 3;

const POPOVER_ALIGN = {
  left: 'left-0',
  center: 'left-1/2 -translate-x-1/2',
  right: 'right-0',
};

// Three small dots in a card's corner. Each dot with a hint opens a small
// popover; slots without a hint yet render as faint placeholders.
// Place it inside a full-width positioned strip so the popover can align to the card edges.
export default function HintDots({ hints = [], align = 'right' }) {
  const [openIndex, setOpenIndex] = useState(null);
  const rootRef = useRef(null);

  useEffect(() => {
    if (openIndex === null) return;
    function close(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpenIndex(null);
    }
    function onKey(e) {
      if (e.key === 'Escape') setOpenIndex(null);
    }
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', close);
      document.removeEventListener('keydown', onKey);
    };
  }, [openIndex]);

  const open = openIndex !== null ? hints[openIndex] : null;

  return (
    <div ref={rootRef} className="flex items-center gap-1 pointer-events-auto">
      {Array.from({ length: SLOTS }, (_, i) => {
        const hint = hints[i];
        if (!hint) {
          return <span key={i} aria-hidden="true" className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-line" />;
        }
        const active = openIndex === i;
        return (
          <button
            key={i}
            type="button"
            aria-label={hint.label}
            aria-expanded={active}
            onClick={() => setOpenIndex(active ? null : i)}
            className="group p-1 -m-1 rounded-full"
          >
            <span
              className={
                'block w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-transform group-hover:scale-125 ' +
                (active ? 'bg-coral-dark scale-125' : 'bg-lavender')
              }
            />
          </button>
        );
      })}

      {open && (
        <div
          role="tooltip"
          className={
            'absolute bottom-full mb-2 z-20 w-[min(230px,70vw)] bg-white rounded-2xl shadow-softLg border border-line p-3 text-left ' +
            POPOVER_ALIGN[align]
          }
        >
          <div className="text-[10px] font-bold uppercase tracking-wide text-lavender-text mb-1">{open.label}</div>
          <p className="text-[12px] leading-relaxed text-ink">{open.text}</p>
        </div>
      )}
    </div>
  );
}
