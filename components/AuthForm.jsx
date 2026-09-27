'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Loader2 } from 'lucide-react';

// NextAuth error codes (from ?error= or the signIn result) → Thai messages
const AUTH_ERRORS = {
  CredentialsSignin: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
  OAuthAccountNotLinked: 'อีเมลนี้ผูกกับวิธีเข้าสู่ระบบอื่นอยู่แล้ว',
  AccessDenied: 'ไม่มีสิทธิ์เข้าใช้งาน',
  Default: 'เข้าสู่ระบบไม่สำเร็จ ลองใหม่อีกครั้ง',
};

function authError(code) {
  return code ? AUTH_ERRORS[code] || AUTH_ERRORS.Default : '';
}

function Field({ label, ...props }) {
  return (
    <label className="block bg-cream rounded-2xl px-4 py-3.5 focus-within:ring-2 focus-within:ring-coral/40">
      <span className="block text-[10px] font-bold text-muted mb-1">{label}</span>
      <input {...props} className="w-full bg-transparent text-sm font-semibold placeholder:text-faint placeholder:font-medium" />
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

export default function AuthForm({ mode, googleEnabled, callbackUrl = '/gallery', initialError }) {
  const router = useRouter();
  const isRegister = mode === 'register';
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState(authError(initialError));
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (isRegister && form.password !== form.confirm) {
      setError('รหัสผ่านทั้งสองช่องไม่ตรงกัน');
      return;
    }

    setLoading(true);

    if (isRegister) {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setLoading(false);
        setError(data.error || 'สมัครสมาชิกไม่สำเร็จ');
        return;
      }
    }

    // After registering, sign straight in with the same credentials.
    const result = await signIn('credentials', { email: form.email, password: form.password, redirect: false });
    if (result?.error) {
      setLoading(false);
      setError(authError(result.error));
      return;
    }
    router.replace(callbackUrl);
    router.refresh();
  }

  return (
    <>
      <div>
        <h2 className="font-display font-semibold text-xl">{isRegister ? 'สร้างบัญชีใหม่' : 'ยินดีต้อนรับกลับมา'}</h2>
        <p className="text-[13px] text-muted mt-1.5">
          {isRegister ? 'เริ่มวางแผน Mandala Chart แรกของคุณ' : 'เข้าสู่ระบบเพื่อดู Mandala Chart ของคุณ'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {isRegister && (
          <Field label="ชื่อ" type="text" autoComplete="name" required placeholder="ชื่อของคุณ" value={form.name} onChange={set('name')} />
        )}
        <Field label="อีเมล" type="email" autoComplete="email" required placeholder="you@example.com" value={form.email} onChange={set('email')} />
        <Field
          label={isRegister ? 'รหัสผ่าน (อย่างน้อย 8 ตัวอักษร)' : 'รหัสผ่าน'}
          type="password"
          autoComplete={isRegister ? 'new-password' : 'current-password'}
          required
          minLength={isRegister ? 8 : undefined}
          placeholder="••••••••"
          value={form.password}
          onChange={set('password')}
        />
        {isRegister && (
          <Field
            label="ยืนยันรหัสผ่าน"
            type="password"
            autoComplete="new-password"
            required
            placeholder="••••••••"
            value={form.confirm}
            onChange={set('confirm')}
          />
        )}

        {error && (
          <p role="alert" className="text-[12.5px] font-semibold text-red-600 bg-red-50 rounded-xl px-3.5 py-2.5">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="tap flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-coral shadow-coral disabled:opacity-70"
        >
          {loading && <Loader2 size={16} className="animate-spin text-white" />}
          <span className="font-display font-semibold text-sm text-white">{isRegister ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}</span>
        </button>
      </form>

      {googleEnabled && (
        <>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-line" />
            <span className="text-[11px] font-semibold text-faint">หรือ</span>
            <div className="flex-1 h-px bg-line" />
          </div>

          <button
            type="button"
            onClick={() => signIn('google', { callbackUrl })}
            className="tap flex items-center justify-center gap-2.5 py-3.5 rounded-2xl bg-white border border-line hover:bg-cream"
          >
            <GoogleIcon />
            <span className="text-[13px] font-bold">{isRegister ? 'สมัครด้วย Google' : 'เข้าสู่ระบบด้วย Google'}</span>
          </button>
        </>
      )}

      <span className="text-center text-[12.5px] text-muted mt-1">
        {isRegister ? 'มีบัญชีอยู่แล้ว? ' : 'ยังไม่มีบัญชี? '}
        <Link href={isRegister ? '/login' : '/register'} className="font-bold text-coral">
          {isRegister ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
        </Link>
      </span>
    </>
  );
}
