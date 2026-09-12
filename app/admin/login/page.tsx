import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import LoginForm from '@/components/admin/LoginForm';
import { ADMIN_COOKIE, getAdminSecret, isAdminConfigured, verifySessionToken } from '@/lib/admin/session';

export const dynamic = 'force-dynamic';

export default async function AdminLoginPage() {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  const secret = getAdminSecret();
  if (token && secret && (await verifySessionToken(token, secret))) {
    redirect('/admin');
  }

  return <LoginForm configured={isAdminConfigured()} />;
}
