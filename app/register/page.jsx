import AuthShell from '@/components/AuthShell';
import AuthForm from '@/components/AuthForm';
import { googleEnabled } from '@/lib/auth';

export default function RegisterPage() {
  return (
    <AuthShell>
      <AuthForm mode="register" googleEnabled={googleEnabled} />
    </AuthShell>
  );
}
