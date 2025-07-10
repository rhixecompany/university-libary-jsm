import BookForm from "@/components/admin/forms/BookForm";
import { Button } from "@/components/ui/button";
import { getAllBooks, getBookById } from "@/lib/actions/book";
import { type Metadata } from 'next';
import Link from "next/link";
import { notFound } from "next/navigation";

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
  // Fetch data based on id
  const [bookDetails] = await getBookById(id)

  if (!bookDetails) notFound();

  return (
    <>
      <Button asChild className="back-btn">
        <Link href="/admin/books">Go Back</Link>
      </Button>

      <section className="w-full max-w-2xl">
        <BookForm type="update" book={bookDetails} />
      </section>
    </>
  );
};
export default Page;
