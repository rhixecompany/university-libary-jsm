'use client';

import { cn } from '@/lib/utils';

import UserMenu from '@/components/UserMenu';
import { type Session } from 'next-auth';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Props {
  session: Session | null;
}

const MenuList = ({ session }: Props) => {
  const pathname = usePathname();

  return (
    <ul className="flex flex-row items-center gap-8">
      <li>
        <Link href="/library" className={cn('text-base cursor-pointer capitalize', pathname === '/library' ? 'text-light-200' : 'text-light-100')}>
          Library
        </Link>
      </li>
      {session?.user ? (
        <li>
          <UserMenu email={session.user.email} name={session.user.name} role={session.user.role} avatar={session.user.avatar} />
        </li>
      ) : (
        <li>
          <Link href="/sign-in" className={cn('text-base cursor-pointer capitalize', pathname === '/sign-in' ? 'text-light-200' : 'text-light-100')}>
            Login
          </Link>
        </li>
      )}
    </ul>
  );
};

export default MenuList;
