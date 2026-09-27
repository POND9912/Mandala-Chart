import AuthShell from '@/components/AuthShell';
import AuthForm from '@/components/AuthForm';
import { googleEnabled } from '@/lib/auth';

// Only allow same-site relative callback URLs (no open redirects).
function safeCallback(url) {
  return typeof url === 'string' && url.startsWith('/') && !url.startsWith('//') ? url : '/gallery';
}

export default function LoginPage({ searchParams }) {
  return (
    <AuthShell>
      <AuthForm
        mode="login"
        googleEnabled={googleEnabled}
        callbackUrl={safeCallback(searchParams?.callbackUrl)}
        initialError={searchParams?.error}
      />
    </AuthShell>
  );
}
