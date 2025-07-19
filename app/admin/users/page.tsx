import React from 'react'


import { Button } from '@/components/ui/button'
import Link from 'next/link'

const Page = () => {

  return (

    <section className="w-full rounded-2xl bg-white p-7">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">All Users</h2>
        <Button className="bg-primary-admin" asChild>
          <Link href="/admin/users/new" className="text-white">
            + Create a New User
          </Link>
        </Button>
      </div>


      <div className="mt-7 w-full overflow-hidden">
        <p>Table</p>

      </div>
    </section>
  )
}

export default Page
