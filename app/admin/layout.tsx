import { ReactNode } from 'react'
import { SiteHeader } from "@/components/admin/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/admin/app-sidebar"
import '@/styles/admin.css'
import { requireAdmin } from '@/lib/auth-guard'
const Layout = async ({ children }: { children: ReactNode }) => {
  const { session } = await requireAdmin()

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar session={session} />
      <SidebarInset>
        <SiteHeader session={session} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            {children}
          </div>
        </div>

      </SidebarInset>
    </SidebarProvider>

  )
}

export default Layout
