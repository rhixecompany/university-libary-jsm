import { db } from '@/database/drizzle'
import type { SelectBook, SelectUser } from '@/database/schema'
import { books, users } from '@/database/schema'
import { eq } from 'drizzle-orm'

export async function deleteUser(id: SelectUser['id']) {
  await db.delete(users).where(eq(users.id, id))
}

export async function deleteBook(id: SelectBook['id']) {
  await db.delete(books).where(eq(books.id, id))
}
