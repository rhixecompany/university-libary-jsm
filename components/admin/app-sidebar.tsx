"use client"

import * as React from "react"
import {

  IconInnerShadowTop,

} from "@tabler/icons-react"

import { NavMain } from "@/components/admin/nav-main"
import { NavUser } from "@/components/admin/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { adminSideBarLinks } from '@/constants'
import { Session } from 'next-auth'


export function AppSidebar({ session }: { session: Session }) {
  const MyUser = {
    name: session.user.name!,
    email: session.user.email!,
    avatar: "/images/shadcn.jpg",
  }
  return (
    <Sidebar collapsible="icon" variant="inset" >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={adminSideBarLinks} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={MyUser} />
      </SidebarFooter>
    </Sidebar>
  )
}
