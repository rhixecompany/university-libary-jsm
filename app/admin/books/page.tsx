import React from 'react'

import { DataTable } from "@/components/admin/books/data-table"
import { columns } from "@/components/admin/books/columns"
import { getAllbooks } from '@/lib/actions/book';
import { Button } from '@/components/ui/button'
import Link from 'next/link'


const Page = async () => {
  const latestBooks = await getAllbooks();
  return (

    <section className="w-full rounded-2xl bg-white p-7">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">All Books</h2>
        <Button className="bg-primary-admin" asChild>
          <Link href="/admin/books/new" className="text-white">
            + Create a New Book
          </Link>
        </Button>
      </div>


      <DataTable columns={columns} data={latestBooks} />
    </section>
  )
}

export default Page
