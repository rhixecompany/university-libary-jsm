import { db } from '@/database/drizzle';
import type { SelectBook, SelectUser } from '@/database/schema';
import { books, users } from '@/database/schema';
import { eq } from 'drizzle-orm';

export async function updateUser(id: SelectUser['id'], data: Partial<Omit<SelectUser, 'id'>>) {
  await db.update(users).set(data).where(eq(users.id, id));
}

export async function updateBook(id: SelectBook['id'], data: Partial<Omit<SelectBook, 'id'>>) {
  await db.update(books).set(data).where(eq(books.id, id));
}
