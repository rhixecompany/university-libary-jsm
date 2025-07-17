import { auth } from '@/auth';

import { redirect } from 'next/navigation';

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) redirect('/sign-in');
  const isAdmin = session.user.role === 'ADMIN';

  // if (!isAdmin) {
  //   redirect('/unauthorized');
  // }

  return { session, isAdmin };
}
