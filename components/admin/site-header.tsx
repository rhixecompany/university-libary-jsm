import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Session } from 'next-auth'
// import { SidebarInput } from '@/components/ui/sidebar'

// import Image from 'next/image'
import Link from 'next/link'
import { Button } from '../ui/button'
export function SiteHeader({ session }: { session: Session }) {
  return (
    <header className="h-(--header-height) group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) flex shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{session?.user?.name}</h1>
        <div className="ml-auto flex items-center gap-2">
          {/* <div className="rounded-lg hidden sm:flex">
            <Image
              src="/icons/admin/search.svg"
              alt="calendar"
              width={14}
              height={14}
            />
            <SidebarInput
              type="text"
              className="admin-search_input"
              placeholder="Search users, books  by title, author, genre."
            />
          </div> */}
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <Link
              href="https://github.com/shadcn-ui/ui/tree/main/apps/v4/app/(examples)/dashboard"
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground"
            >
              GitHub
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
