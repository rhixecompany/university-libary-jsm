import { columns } from '@/components/admin/books/columns';
import { DataTable } from '@/components/admin/books/data-table';
import { Button } from '@/components/ui/button';
import { getAllBooks } from '@/lib/actions/book';
import Link from 'next/link';

const Page = async () => {
  const latestBooks = await getAllBooks();
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

      <div className="mt-7 w-full overflow-hidden">
        <DataTable columns={columns} data={latestBooks} />
      </div>
    </section>
  );
};

export default Page;
