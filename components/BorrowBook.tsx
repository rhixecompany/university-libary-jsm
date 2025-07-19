'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { borrowBook } from '@/lib/actions/book'

interface Props {
  userId: string
  bookId: string
  borrowingEligibility: {
    isEligible: boolean
    message: string
  }
}

const BorrowBook = ({
  userId,
  bookId,
  borrowingEligibility: { isEligible, message },
}: Props) => {
  const router = useRouter()
  const [borrowing, setBorrowing] = useState(false)

  const handleBorrowBook = async () => {
    if (!isEligible) {
      // toast({
      //   title: 'Error',
      //   description: message,
      //   variant: 'destructive',
      // })
      toast.warning(`${message}`)
    }

    setBorrowing(true)

    try {
      const result = await borrowBook({ bookId, userId })

      if (result.success) {
        // toast({
        //   title: 'Success',
        //   description: 'Book borrowed successfully',
        // })
        toast.success(`Book borrowed successfully`)

        router.push('/')
      } else {
        // toast({
        //   title: 'Error',
        //   description: result.error,
        //   variant: 'destructive',
        // })
        toast.error(`${result.error}`)
      }
    } catch (error) {

      console.log(error)
      // toast({
      //   title: 'Error',
      //   description: 'An error occurred while borrowing the book',
      //   variant: 'destructive',
      // })
      toast.error('An error occurred while borrowing the book')
    } finally {
      setBorrowing(false)
    }
  }

  return (
    <Button
      className="book-overview_btn"
      onClick={handleBorrowBook}
      disabled={borrowing}
    >
      <Image src="/icons/book.svg" alt="book" width={20} height={20} />
      <p className="font-bebas-neue text-dark-100 text-xl">
        {borrowing ? 'Borrowing ...' : 'Borrow Book'}
      </p>
    </Button>
  )
}
export default BorrowBook
