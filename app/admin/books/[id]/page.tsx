import React from 'react'
import { db } from '@/database/drizzle'
import { books } from '@/database/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import BookForm from '@/components/admin/forms/BookForm'
import { getAllbooks, getbookById } from '@/lib/actions/book';
import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book Detail',
};

export const revalidate = 60;

// Return a list of `params` to populate the [id] dynamic segment
export async function generateStaticParams() {
  const books = await getAllbooks();

  return books.map((book: Book) => ({
    id: book.id.toString(),
  }));
}

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id

  // Fetch data based on id
  const [bookDetails] = await getbookById(id);

  if (!bookDetails) notFound();

  return (
    <>


      <Button asChild className="back-btn">
        <Link href="/admin/books">Go Back</Link>
      </Button>

      <section className="w-full max-w-2xl">
        <BookForm type='update' {...bookDetails} />
      </section>
    </>
  )
}
export default Page
