"use client"

import { Table } from "@tanstack/react-table"
import { Input } from '@/components/ui/input'

import { Button } from '@/components/ui/button'

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,

    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {

    ChevronDownIcon,

    ColumnsIcon,


} from 'lucide-react'
export function ViewOptions<TData>({
    table,
}: {
    table: Table<TData>
}) {
    return (
        <div className="flex items-center justify-between px-4 lg:px-6 mb-4">
            <Input
                placeholder="Filter titles..."
                value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                    table.getColumn("title")?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
            />
            <div className="flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                            <ColumnsIcon />
                            <span className="hidden lg:inline">Customize Columns</span>
                            <span className="lg:hidden">Columns</span>
                            <ChevronDownIcon />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        {table
                            .getAllColumns()
                            .filter(
                                (column) =>
                                    typeof column.accessorFn !== 'undefined' &&
                                    column.getCanHide()
                            )
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>

            </div>
        </div>
    )
}
