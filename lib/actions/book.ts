'use server'

import { db } from '@/database/drizzle'
import { books, borrowRecords } from '@/database/schema'
import { eq, asc } from 'drizzle-orm'
import dayjs from 'dayjs'
import type { SelectBook } from '@/database/schema'

// Get single book by it's ID
export async function getbookById(id: SelectBook['id']) {
  // Fetch data based on id
  return db.select().from(books).where(eq(books.id, id))
}

// Get all bookss
export async function getAllbooks() {
  return db.select().from(books).orderBy(asc(books.title), asc(books.createdAt))
}

export const borrowBook = async (params: BorrowBookParams) => {
  const { userId, bookId } = params

  try {
    const book = await db
      .select({ availableCopies: books.availableCopies })
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1)

    if (!book.length || book[0].availableCopies <= 0) {
      return {
        success: false,
        error: 'Book is not available for borrowing',
      }
    }

    const dueDate = dayjs().add(7, 'day').toDate().toDateString()

    const record = await db.insert(borrowRecords).values({
      userId,
      bookId,
      dueDate,
      status: 'BORROWED',
    })

    await db
      .update(books)
      .set({ availableCopies: book[0].availableCopies - 1 })
      .where(eq(books.id, bookId))

    return {
      success: true,
      data: JSON.parse(JSON.stringify(record)),
    }
  } catch (error) {
    console.log(error)

    return {
      success: false,
      error: 'An error occurred while borrowing the book',
    }
  }
}
