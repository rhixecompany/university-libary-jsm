import { auth } from '@/auth';

import { type ReactNode } from 'react';

import Header from '@/components/admin/Header';
import Sidebar from '@/components/admin/Sidebar';

import { requireAdmin } from '@/lib/auth-guard';
const Layout = async ({ children }: { children: ReactNode }) => {
  await requireAdmin();
  const session = await auth();

  return (
    <main className="flex min-h-screen w-full flex-row">
      <Sidebar session={session} />

      <div className="admin-container">
        <Header session={session} />
        {children}
      </div>
    </main>
  );
};
export default Layout;
