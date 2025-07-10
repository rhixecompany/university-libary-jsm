
"use client"

// import { signOutUser } from '@/lib/actions/auth';
import { cn } from '@/lib/utils';

import { type Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserMenu from '@/components/UserMenu';
// import SignOutButton from './SignOutButton';

interface Props {
  session: Session | null,
}


const Header = ({ session }: Props) => {
  // const handleSignOut = async () => {
  //   await signOutUser();
  // };
  const pathname = usePathname();

  return (
    <header className="my-10 flex justify-between gap-5">
      <Link href='/'>
        <Image src="/icons/logo.svg" alt="logo" width={40} height={40} />
      </Link>
      <ul className="flex flex-row items-center gap-8">
        <li>
          <Link href='/library' className={
            cn(
              'text-base cursor-pointer capitalize',
              pathname === '/library' ? 'text-light-200' : 'text-light-100'
            )
          }>Library</Link>
        </li>
        <li>
          <UserMenu email={session?.user?.email} name={session?.user?.name} role={session?.user?.role} />
        </li>



      </ul>
    </header>
  )
}

export default Header
