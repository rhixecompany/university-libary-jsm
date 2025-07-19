"use client"

import { IconCirclePlusFilled, IconMail } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from 'next/image'
import Link from "next/link"
export function NavMain({
  items,
}: {
  items: {
    text: string
    route: string
    img?: string
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="bg-slate-900 text-slate-50 hover:bg-slate-900/90 hover:text-slate-50 active:bg-slate-900/90 active:text-slate-50 min-w-8 duration-200 ease-linear dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 dark:hover:text-slate-900 dark:active:bg-slate-50/90 dark:active:text-slate-900"
            >
              <IconCirclePlusFilled />
              <span>Quick Create</span>
            </SidebarMenuButton>
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <IconMail />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.text}>
              <SidebarMenuButton tooltip={item.text} asChild>
                <Link href={item.route}>
                  {item.img && <Image src={item.img} alt="My SVG Icon" width={18} height={18} />}
                  {/* {item.img && <item.img />} */}
                  <span>{item.text}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
