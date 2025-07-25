'use client'
import Link from 'next/link'
import Image from 'next/image'

import { Session } from 'next-auth'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { NavUser } from './NavUser'

const Header = ({ session }: { session: Session }) => {
  const pathname = usePathname()
  const MyUser = {
    name: session.user.name!,
    email: session.user.email!,
    avatar: '/images/shadcn.jpg',
  }
  return (
    <header className="my-10 flex justify-between gap-5">
      <Link href="/">
        <Image src="/icons/logo.svg" alt="logo" width={40} height={40} />
      </Link>

      <ul className="flex flex-row items-center gap-8">
        <li>
          <Link
            href="/library"
            className={cn(
              'cursor-pointer text-base capitalize',
              pathname === '/library' ? 'text-light-200' : 'text-light-100'
            )}
          >
            Library
          </Link>
        </li>
        <li>
          <NavUser user={MyUser} />
        </li>
      </ul>
    </header>
  )
}

export default Header
