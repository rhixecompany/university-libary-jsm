import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40 aria-invalid:border-red-500 dark:aria-invalid:ring-red-900/20 dark:dark:aria-invalid:ring-red-900/40 dark:aria-invalid:border-red-900 inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-md border border-slate-200 px-2 py-0.5 text-xs font-medium transition-[color,box-shadow] focus-visible:border-slate-950 focus-visible:ring-[3px] focus-visible:ring-slate-950/50 dark:border-slate-800 dark:focus-visible:border-slate-300 dark:focus-visible:ring-slate-300/50 [&>svg]:pointer-events-none [&>svg]:size-3',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-slate-900 text-slate-50 dark:bg-slate-50 dark:text-slate-900 [a&]:hover:bg-slate-900/90 dark:[a&]:hover:bg-slate-50/90',
        secondary:
          'border-transparent bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50 [a&]:hover:bg-slate-100/90 dark:[a&]:hover:bg-slate-800/90',
        destructive:
          'border-transparent bg-red-500 text-white focus-visible:ring-red-500/20 dark:bg-red-500/60 dark:bg-red-900 dark:dark:bg-red-900/60 dark:dark:focus-visible:ring-red-900/40 dark:focus-visible:ring-red-500/40 dark:focus-visible:ring-red-900/20 [a&]:hover:bg-red-500/90 dark:[a&]:hover:bg-red-900/90',
        outline:
          'text-slate-950 dark:text-slate-50 [a&]:hover:bg-slate-100 [a&]:hover:text-slate-900 dark:[a&]:hover:bg-slate-800 dark:[a&]:hover:text-slate-50',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span'

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
