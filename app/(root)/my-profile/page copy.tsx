import { signOut } from '@/auth';
import BookList from '@/components/BookList';
import { Button } from '@/components/ui/button';
import { getAllBooks } from '@/lib/actions/book';
const page = async () => {
  const latestBooks = await getAllBooks();
  return (
    <>
      <form
        action={async () => {
          'use server';
          await signOut();
        }}
        className="mb-10 "
      >
        <Button>Logout</Button>
      </form>
      <BookList title="Borrowed Books" books={latestBooks} />
    </>
  );
};

export default page;
