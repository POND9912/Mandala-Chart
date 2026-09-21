import { Fredoka, Quicksand } from 'next/font/google';
import './globals.css';
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';

const fredoka = Fredoka({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-fredoka',
  display: 'swap',
});

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-quicksand',
  display: 'swap',
});

export const metadata = {
  title: 'Mandala AI',
  description: 'วางแผนเป้าหมายชีวิตให้ AI ช่วยคุณทุกก้าว',
  manifest: '/manifest.json',
};

export const viewport = {
  themeColor: '#FF7A59',
};

export default function RootLayout({ children }) {
  return (
    <html lang="th" className={`${fredoka.variable} ${quicksand.variable}`}>
      <body className="font-body bg-cream text-ink antialiased">
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
