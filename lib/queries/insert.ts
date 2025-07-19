import { db } from '@/database/drizzle'
import type { InsertBook, InsertUser } from '@/database/schema'
import { books, users } from '@/database/schema'

export async function createUser(data: InsertUser) {
  await db.insert(users).values(data)
}
export async function createBook(data: InsertBook) {
  await db.insert(books).values(data)
}
