import Link from 'next/link';
import { ChevronLeft, Menu } from 'lucide-react';

export default function Header({
  logoHref,
  backHref,
  title,
  navLinks,
  activeNav,
  right,
}) {
  return (
    <header className="flex-shrink-0 h-16 bg-white flex items-center justify-between px-4 md:px-10 gap-3">
      <div className="flex items-center gap-3 min-w-0">
        {backHref ? (
          <Link
            href={backHref}
            aria-label="ย้อนกลับ"
            className="w-9 h-9 flex-shrink-0 rounded-full bg-chip flex items-center justify-center"
          >
            <ChevronLeft size={18} strokeWidth={2.5} className="text-ink" />
          </Link>
        ) : (
          <Link href={logoHref || '/gallery'} className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-coral flex-shrink-0" />
            <span className="font-display font-semibold text-base hidden sm:inline">Mandala AI</span>
          </Link>
        )}
        {title && (
          <span className="font-display font-semibold text-[15px] truncate">{title}</span>
        )}
      </div>

      {navLinks && (
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={
                n.href === activeNav
                  ? 'text-[13px] font-bold text-coral border-b-2 border-coral pb-1'
                  : 'text-[13px] font-semibold text-muted'
              }
            >
              {n.label}
            </Link>
          ))}
        </nav>
      )}

      <div className="flex items-center gap-2 flex-shrink-0">{right}</div>
    </header>
  );
}
