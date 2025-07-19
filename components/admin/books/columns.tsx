'use client'

import { ColumnDef } from '@tanstack/react-table'

// import { toast } from 'sonner'
// import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import { Checkbox } from '@/components/ui/checkbox'

import Image from 'next/image'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'

import { ColumnHeader } from './column-header'
// import { CellViewer } from './cell-viewer'
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

// Create a separate component for the drag handle
import { toast } from 'sonner'
import { deleteBook } from '@/lib/admin/actions/book'
import Link from 'next/link'
import { formatDateTime, timeAgo } from '@/lib/utils'

export const columns: ColumnDef<Book>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <div className="flex items-center justify-center p-1">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center p-1">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: 'Title',
    // header: ({ column }) => (
    //     <ColumnHeader column={column} title="Title" />
    // ),
    // cell: ({ row }) => {
    //     return <CellViewer item={row.original} />
    // },
    // enableHiding: false,
  },
  {
    accessorKey: 'author',
    // header: "Author"
    header: ({ column }) => <ColumnHeader column={column} title="Author" />,
    // cell: ({ row }) => (
    //     <div className="w-32">
    //         <Badge variant="outline" className="text-muted-foreground px-1.5">
    //             {row.original.author}
    //         </Badge>
    //     </div>
    // ),
  },
  {
    accessorKey: 'rating',
    header: 'Rating',
    // header: () => <div className="text-right">Rating</div>,
    // cell: ({ row }) => {
    //     const rating = parseInt(row.getValue("rating"))
    //     const formatted = new Intl.NumberFormat("en-US").format(rating)
    //     return <div className="text-right font-medium">{formatted}</div>
    // },
  },

  // {
  //     accessorKey: 'totalCopies',
  //     header: 'Total Copies'
  //     // header: () => <div className="w-full text-right">TotalCopies</div>,
  //     // cell: ({ row }) => (
  //     //     <form
  //     //         onSubmit={(e) => {
  //     //             e.preventDefault()
  //     //             toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
  //     //                 loading: `Saving ${row.original.title}`,
  //     //                 success: 'Done',
  //     //                 error: 'Error',
  //     //             })
  //     //         }}
  //     //     >
  //     //         <Label htmlFor={`${row.original.id}-totalCopies`} className="sr-only">
  //     //             TotalCopies
  //     //         </Label>
  //     //         <Input
  //     //             className="hover:bg-input/30 focus-visible:bg-background h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border"
  //     //             defaultValue={row.original.totalCopies}
  //     //             id={`${row.original.id}-totalCopies`}
  //     //         />
  //     //     </form>
  //     // ),
  // },
  {
    accessorKey: 'genre',
    header: 'Genre',
    // header: () => <div className="w-full text-right">Genre</div>,
    // cell: ({ row }) => (
    //     <form
    //         onSubmit={(e) => {
    //             e.preventDefault()
    //             toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
    //                 loading: `Saving ${row.original.title}`,
    //                 success: 'Done',
    //                 error: 'Error',
    //             })
    //         }}
    //     >
    //         <Label htmlFor={`${row.original.id}-genre`} className="sr-only">
    //             Genre
    //         </Label>
    //         <Input
    //             className="hover:bg-input/30 focus-visible:bg-background h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border"
    //             defaultValue={row.original.genre}
    //             id={`${row.original.id}-genre`}
    //         />
    //     </form>
    // ),
  },
  {
    accessorKey: 'createdAt',
    header: 'CreatedAt',
    // header: () => <div className="text-right">Rating</div>,
    cell: ({ row }) => {
      const createdAt = row.original.createdAt
      const formatted = timeAgo(createdAt!)
      // const formatted = formatDateTime(createdAt!).dateTime
      return <time>{formatted}</time>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const id = row.original.id

      const handleDelete = async () => {
        const result = await deleteBook(id)
        if (result.success) {
          //   toast({
          //     title: 'Success',
          //     description: 'Book created deletedfully',
          //   });
          toast.success('Book  deleted ')
        } else {
          //   toast({
          //     title: 'Error',
          //     description: result.message,
          //     variant: 'destructive',
          //   });
          toast.error(`${result.message}`)
        }
      }
      return (
        <div className="flex flex-col gap-1 p-2">
          <Link href={`/admin/books/${id}`} className="border-b">
            <Button
              asChild
              variant="ghost"
              className="text-muted-foreground data-[state=open]:bg-muted flex size-5"
              size="icon"
            >
              <div className="relative">
                <Image
                  src="/icons/admin/edit.svg"
                  alt="upload-icon"
                  fill
                  className="object-contain"
                />
              </div>
            </Button>
          </Link>
          <Button
            onClick={handleDelete}
            asChild
            variant="ghost"
            className="text-muted-foreground data-[state=open]:bg-muted flex size-5"
            size="icon"
          >
            <div className="relative">
              <Image
                src="/icons/admin/trash.svg"
                alt="upload-icon"
                fill
                className="object-contain"
              />
            </div>
          </Button>
        </div>
      )
    },
  },
]
