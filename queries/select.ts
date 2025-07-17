import { db } from '@/database/drizzle';
import type { SelectBook, SelectUser } from '@/database/schema';
import { books, users } from '@/database/schema';

import { asc, between, eq, sql } from 'drizzle-orm';

export async function getUserById(id: SelectUser['id']): Promise<Array<Pick<SelectUser, 'email' | 'id'>>> {
  return db.select().from(users).where(eq(users.id, id));
}
// export async function getUsersWithBooksCount(
//   page = 1,
//   pageSize = 5,
// ): Promise<
//   Array<{
//     booksCount: number;
//     id: string;
//     // role: "ADMIN" | "USER";
//     fullName: string;
//     email: string
//   }>
// > {
//   return db
//     .select({
//       ...getTableColumns(users),
//       booksCount: count(books.id),
//     })
//     .from(users)
//     .leftJoin(books, eq(users.id, books.userId))
//     .groupBy(users.id)
//     .orderBy(asc(users.id))
//     .limit(pageSize)
//     .offset((page - 1) * pageSize);
// }
export async function getBooksForLast24Hours(page = 1, pageSize = 5): Promise<Array<Pick<SelectBook, 'title' | 'id'>>> {
  return db
    .select({
      id: books.id,
      title: books.title,
    })
    .from(books)
    .where(between(books.createdAt, sql`now() - interval '1 day'`, sql`now()`))
    .orderBy(asc(books.title), asc(books.id))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
}
