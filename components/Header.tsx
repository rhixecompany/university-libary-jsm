

import { auth } from '@/auth';
import Image from 'next/image';
import Link from 'next/link';

import MenuList from './MenuList';

const Header = async () => {
  const session = await auth();


  return (
    <header className="my-10 flex justify-between gap-5">
      <Link href="/">
        <Image src="/icons/logo.svg" alt="logo" width={40} height={40} style={{ width: 'auto', height: 'auto' }} loading='eager' />
      </Link>
      <MenuList session={session} />
    </header>
  );
};

export default Header;
