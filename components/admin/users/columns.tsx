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
    IconCircleCheckFilled,

    IconLoader
} from "@tabler/icons-react"
import {
    type ColumnDef,

} from "@tanstack/react-table";
import {
    IconDotsVertical
} from "@tabler/icons-react"
import config from "@/lib/config";
import { Badge } from "@/components/ui/badge"
import { formatDateTime } from "@/lib/utils"
import { IKImage } from "imagekitio-next";
import {
    Edit,
    Heart,
    Trash2
} from "lucide-react"
import Link from "next/link"
// import { toast } from "@/hooks/use-toast"
// import { deleteBook } from '@/lib/admin/actions/book'

export const columns: ColumnDef<UserParams>[] = [
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
        accessorKey: "email",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Email
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
    },
    {
        accessorKey: "universityCard",
        header: "University Card",
        cell: ({ row }) => <IKImage className="size-10 rounded-sm"
            alt={row.original.universityCard}
            path={row.original.universityCard}
            urlEndpoint={config.env.imagekit.urlEndpoint}
            width={500}
            height={300}

        />
    },
    {
        accessorKey: "fullName",
        header: "Full Name",
        cell: ({ row }) => <div className="lowercase">{row.getValue("fullName")}</div>,
    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => (
            <Badge variant="outline" className="px-1.5 text-muted-foreground">
                {row.original.role === "ADMIN" ? (
                    <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
                ) : (
                    <IconLoader />
                )}
                {row.original.role}
            </Badge>
        ),
    },
    {
        accessorKey: "lastActivityDate",
        header: () => <div className="text-right">LastActivityDate</div>,
        cell: ({ row }) => {
            const lastActivityDate = row.original.lastActivityDate
            const formatted = formatDateTime(lastActivityDate!)
            return <time className="text-right font-medium">{formatted.dateTime}</time>
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: () => {
            // cell: ({ row }) => {
            // const id = row.original.id

            const handleDelete = async () => {
                // const result = await deleteBook(id)
                // if (result.success) {
                //     toast({
                //         title: "Success",
                //         description: "Book created deletedfully",
                //     });


                // } else {
                //     toast({
                //         title: "Error",
                //         description: result.message,
                //         variant: "destructive",
                //     });
                // }
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
                    <Link href='#'>

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
