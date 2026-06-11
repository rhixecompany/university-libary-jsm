import React from 'react'
import { notFound } from 'next/navigation'

import BookOverview from '@/components/BookOverview'
import BookVideo from '@/components/BookVideo'
import { getAllbooks, getbookById } from '@/lib/actions/book'
import { type Metadata } from 'next'
import { auth } from '@/auth'

export const metadata: Metadata = {
  title: 'Book Detail',
}

export const revalidate = 60

// Return a list of `params` to populate the [id] dynamic segment
export async function generateStaticParams() {
  const books = await getAllbooks()

  return books.map((book: Book) => ({
    id: book.id.toString(),
  }))
}

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id
  const session = await auth()
  // Fetch data based on id
  const [bookDetails] = await getbookById(id)

  if (!bookDetails) notFound()

  return (
    <>
      <BookOverview {...bookDetails} userId={session?.user?.id as string} />

      <div className="book-details">
        <div className="flex-[1.5]">
          <section className="flex flex-col gap-7">
            <h3>Video</h3>

            <BookVideo videoUrl={bookDetails.videoUrl} />
          </section>
          <section className="mt-10 flex flex-col gap-7">
            <h3>Summary</h3>

            <div className="text-light-100 space-y-5 text-xl">
              {bookDetails.summary.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </section>
        </div>

        {/*  SIMILAR*/}
      </div>
    </>
  )
}
export default Page
