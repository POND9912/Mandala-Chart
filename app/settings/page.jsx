import Header, { APP_NAV } from '@/components/Header';
import UserMenu from '@/components/UserMenu';
import SettingsView from '@/components/SettingsView';
import { getSession } from '@/lib/auth';

export const metadata = { title: 'การตั้งค่า — Mandala AI' };

export default async function SettingsPage() {
  const session = await getSession();
  const { name, email, image, role } = session.user;

  return (
    <main className="min-h-dvh flex flex-col bg-cream">
      <Header logoHref="/gallery" navLinks={APP_NAV} activeNav="/settings" right={<UserMenu />} />
      <div className="flex-1 px-4 md:px-10 py-5 md:py-8">
        <SettingsView user={{ name, email, image, role }} />
      </div>
    </main>
  );
}
