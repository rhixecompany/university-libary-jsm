/* eslint-disable @typescript-eslint/no-misused-promises */
"use client"

import { ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,

    DropdownMenuContent,
    DropdownMenuItem,

    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Edit,
    Heart,
    Trash2
} from "lucide-react"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"
import { deleteBook } from '@/lib/admin/actions/book'
import {
    type ColumnDef,

} from "@tanstack/react-table"
import { IKImage } from "imagekitio-next";
import config from "@/lib/config";
import {
    IconDotsVertical
} from "@tabler/icons-react"
export const columns: ColumnDef<Book>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },

    {
        accessorKey: "title",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Title
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("title")}</div>,
    },
    {
        accessorKey: "coverUrl",
        header: "CoverUrl",
        cell: ({ row }) => <IKImage className="size-10 rounded-sm"
            alt={row.original.coverUrl}
            path={row.original.coverUrl}
            urlEndpoint={config.env.imagekit.urlEndpoint}
            width={500}
            height={300}

        />
    },
    {
        accessorKey: "author",
        header: "Author",
        cell: ({ row }) => <div className="lowercase">{row.getValue("author")}</div>,
    },
    {
        accessorKey: "genre",
        header: "Genre",
        cell: ({ row }) => <div className="lowercase">{row.getValue("genre")}</div>,
    },
    {
        accessorKey: "totalCopies",
        header: "TotalCopies",
        cell: ({ row }) => <div className="lowercase">{row.getValue("totalCopies")}</div>,
    },
    {
        accessorKey: "availableCopies",
        header: "AvailableCopies",
        cell: ({ row }) => <div className="lowercase">{row.getValue("availableCopies")}</div>,
    },


    {
        id: "actions",

        enableHiding: false,

        cell: ({ row }) => {
            const id = row.original.id

            const handleDelete = async () => {
                const result = await deleteBook(id)
                if (result.success) {
                    toast({
                        title: "Success",
                        description: "Book created deletedfully",
                    });


                } else {
                    toast({
                        title: "Error",
                        description: result.message,
                        variant: "destructive",
                    });
                }
            }
            return (<DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
                        size="icon"
                    >
                        <IconDotsVertical />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                    <Link href={`/admin/books/${id}`}>

                        <DropdownMenuItem>
                            <Edit className="text-muted-foreground" />
                            <span>Edit</span>
                        </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem>
                        <Heart className="text-muted-foreground" />
                        <span>Favorite</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleDelete} >
                        <Trash2 className="text-muted-foreground" />
                        <span>Delete</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>)
        }
    },
]
