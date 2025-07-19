import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const Page = () => {
  return (
    <>
      <Button asChild className="back-btn">
        <Link href="/admin/account-requests">Go Back</Link>
      </Button>

      <section className="w-full max-w-2xl">
        Account-requestForm
      </section>
    </>
  )
}
export default Page
