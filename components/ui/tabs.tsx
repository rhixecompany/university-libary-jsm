'use client'

import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'

import { cn } from '@/lib/utils'

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn('flex flex-col gap-2', className)}
      {...props}
    />
  )
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        'inline-flex h-9 w-fit items-center justify-center rounded-lg bg-slate-100 p-[3px] text-slate-500 dark:bg-slate-800 dark:text-slate-400',
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "focus-visible:outline-ring inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-md border border-slate-200 border-transparent px-2 py-1 text-sm font-medium text-slate-950 transition-[color,box-shadow] focus-visible:border-slate-950 focus-visible:outline-1 focus-visible:ring-[3px] focus-visible:ring-slate-950/50 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:shadow-sm dark:border-slate-800 dark:dark:text-slate-400 dark:text-slate-50 dark:text-slate-500 dark:focus-visible:border-slate-300 dark:focus-visible:ring-slate-300/50 dark:dark:data-[state=active]:border-slate-800 dark:data-[state=active]:border-slate-200 dark:dark:data-[state=active]:bg-slate-800/30 dark:data-[state=active]:bg-slate-200/30 dark:data-[state=active]:bg-slate-950 dark:dark:data-[state=active]:text-slate-50 dark:data-[state=active]:text-slate-950 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn('flex-1 outline-none', className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
