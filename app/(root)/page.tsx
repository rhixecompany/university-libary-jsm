/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { auth } from '@/auth';
import BookList from '@/components/BookList';
import BookOverview from '@/components/BookOverview';
import { getAllBooks } from '@/lib/actions/book';
const Home = async () => {
  const session = await auth();

  const latestBooks = await getAllBooks();

  return (
    <>
      <BookOverview {...latestBooks[0]} userId={session?.user?.id!} />

      <BookList title="Latest Books" books={latestBooks} containerClassName="mt-28" />
      {/* <BookList title="Latest Books" books={latestBooks.slice(1)} containerClassName="mt-28" /> */}
    </>
  );
};

export default Home;
