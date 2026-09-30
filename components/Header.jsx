import Link from 'next/link';
import { ChevronLeft, LayoutGrid, LayoutTemplate, Settings } from 'lucide-react';
import LogoMark from '@/components/LogoMark';

// Main app sections, shown as tabs in the header (a second row on mobile).
export const APP_NAV = [
  { href: '/gallery', label: 'Chart ของฉัน', icon: LayoutGrid },
  { href: '/templates', label: 'เทมเพลต', icon: LayoutTemplate },
  { href: '/settings', label: 'การตั้งค่า', icon: Settings },
];

// Shared look for the round icon buttons on the right of the header.
// Pair with `data-tip="…"` for a hover label (see .tip in globals.css).
export const HEADER_BTN =
  'tip tap w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors';

function NavTabs({ links, active, className = '' }) {
  return (
    <nav className={'items-center gap-1 p-1 rounded-full bg-white/10 ' + className} aria-label="เมนูหลัก">
      {links.map((n) => {
        const Icon = n.icon;
        const isActive = n.href === active;
        return (
          <Link
            key={n.label}
            href={n.href}
            aria-current={isActive ? 'page' : undefined}
            className={
              'flex items-center justify-center gap-1.5 whitespace-nowrap px-3.5 md:px-4 h-9 rounded-full text-[13px] font-bold transition-colors ' +
              (isActive ? 'bg-white text-coral-dark shadow-sm' : 'text-white/80 hover:text-white hover:bg-white/10')
            }
          >
            {Icon && <Icon size={15} strokeWidth={2.2} />}
            {n.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function Header({ logoHref, backHref, title, navLinks, activeNav, right }) {
  return (
    <header className="flex-shrink-0 bg-brand text-white shadow-softLg">
      <div className="h-16 flex items-center justify-between px-4 md:px-10 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {backHref ? (
            <Link href={backHref} aria-label="ย้อนกลับ" data-tip="ย้อนกลับ" className={HEADER_BTN + ' flex-shrink-0'}>
              <ChevronLeft size={20} strokeWidth={2.5} />
            </Link>
          ) : (
            <Link href={logoHref || '/gallery'} className="flex items-center gap-2.5 flex-shrink-0">
              <LogoMark size={36} />
              <span className="font-display font-semibold text-[17px] hidden sm:inline">Mandala AI</span>
            </Link>
          )}
          {title && <span className="font-display font-semibold text-[15px] md:text-base truncate">{title}</span>}
        </div>

        {navLinks && <NavTabs links={navLinks} active={activeNav} className="hidden md:flex" />}

        <div className="flex items-center gap-2 flex-shrink-0">{right}</div>
      </div>

      {navLinks && (
        <div className="md:hidden px-4 pb-3 -mt-1">
          <NavTabs links={navLinks} active={activeNav} className="flex [&>a]:flex-1" />
        </div>
      )}
    </header>
  );
}
