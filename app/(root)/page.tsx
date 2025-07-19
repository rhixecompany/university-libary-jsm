import BookList from '@/components/BookList'
import BookOverview from '@/components/BookOverview'

import { auth } from '@/auth'

import { getAllbooks } from '@/lib/actions/book'
const Home = async () => {
  const session = await auth()

  const latestBooks = await getAllbooks();

  return (
    <>
      <BookOverview {...latestBooks[0]} userId={session?.user?.id as string} />

      <BookList
        title="Latest Books"
        books={latestBooks.slice(1)}
        containerClassName="mt-28"
      />
    </>
  )
}

export default Home
