'use client'

import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'




// import { Label } from '@/components/ui/label'
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from '@/components/ui/select'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

import { useState } from "react"

import { Pagination } from "./table-pagination"
import { ViewOptions } from './table-toggle'




interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {

    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    })


    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
            pagination,
        },

        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    })



    return (
        // <div
        //     className="flex w-full flex-col justify-start gap-6"
        // >
        //     <ViewOptions table={table} />
        //     <div
        //         className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
        //     >
        //         <div className="overflow-hidden rounded-lg border">
        //             <Table>
        //                 <TableHeader className="bg-muted sticky top-0 z-10">
        //                     {table.getHeaderGroups().map((headerGroup) => (
        //                         <TableRow key={headerGroup.id}>
        //                             {headerGroup.headers.map((header) => {
        //                                 return (
        //                                     <TableHead key={header.id} colSpan={header.colSpan}>
        //                                         {header.isPlaceholder
        //                                             ? null
        //                                             : flexRender(
        //                                                 header.column.columnDef.header,
        //                                                 header.getContext()
        //                                             )}
        //                                     </TableHead>
        //                                 )
        //                             })}
        //                         </TableRow>
        //                     ))}
        //                 </TableHeader>
        //                 <TableBody >
        //                     {table.getRowModel().rows?.length ? (
        //                         table.getRowModel().rows.map((row) => (
        //                             <TableRow
        //                                 key={row.id}
        //                                 data-state={row.getIsSelected() && "selected"}
        //                             >
        //                                 {row.getVisibleCells().map((cell) => (
        //                                     <TableCell key={cell.id}>
        //                                         {flexRender(cell.column.columnDef.cell, cell.getContext())}
        //                                     </TableCell>
        //                                 ))}
        //                             </TableRow>
        //                         ))
        //                     ) : (
        //                         <TableRow>
        //                             <TableCell colSpan={columns.length} className="h-24 text-center">
        //                                 No results.
        //                             </TableCell>
        //                         </TableRow>
        //                     )}
        //                 </TableBody>
        //             </Table>
        //         </div>
        //         <Pagination table={table} />
        //     </div>

        // </div>

        <div className='mt-7 w-full gap-4'>
            <ViewOptions table={table} />
            <div className='overflow-hidden rounded-lg border mb-4'>
                <Table>
                    <TableHeader className="bg-muted sticky top-0 z-10">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} colSpan={header.colSpan}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody >
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

            </div>
            <Pagination table={table} />
        </div>
    )
}