import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminApp from '@/components/admin/AdminApp';
import { ADMIN_COOKIE, getAdminSecret, verifySessionToken } from '@/lib/admin/session';
import { readSiteContent } from '@/lib/content/store';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  const secret = getAdminSecret();
  if (!token || !secret || !(await verifySessionToken(token, secret))) {
    redirect('/admin/login');
  }

  return <AdminApp initialContent={readSiteContent()} />;
}
