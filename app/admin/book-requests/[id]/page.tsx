import React from 'react'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id

  return (
    <>
      <Button asChild className="back-btn">
        <Link href="/admin/book-requests">Go Back</Link>
      </Button>

      <section className="w-full max-w-2xl">{id} book-requestForm</section>
    </>
  )
}
export default Page
