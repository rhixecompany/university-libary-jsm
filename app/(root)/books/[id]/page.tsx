/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { auth } from "@/auth";
import BookOverview from "@/components/BookOverview";
import BookVideo from "@/components/BookVideo";
import { notFound } from "next/navigation";

import { getAllBooks, getBookById } from "@/lib/actions/book";
import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book Detail',
};

export const revalidate = 60;


// Return a list of `params` to populate the [id] dynamic segment
export async function generateStaticParams() {
  const books = await getAllBooks()

  return books.map((book) => ({
    id: book.id.toString(),
  }));
}



const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const session = await auth();

  // Fetch data based on id
  const [bookDetails] = await getBookById(id)

  if (!bookDetails) notFound()

  return (
    <>
      <BookOverview  {...bookDetails} userId={session?.user?.id!} />

      <div className="book-details">
        <div className="flex-[1.5]">
          <section className="flex flex-col gap-7">
            <h3>Video</h3>

            <BookVideo videoUrl={bookDetails.videoUrl} />
          </section>
          <section className="mt-10 flex flex-col gap-7">
            <h3>Summary</h3>

            <div className="space-y-5 text-xl text-light-100">
              {bookDetails.summary.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </section>
        </div>

        {/*  SIMILAR*/}
      </div>
    </>
  );
};
export default Page;
