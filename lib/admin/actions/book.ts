'use server'

import { db } from '@/database/drizzle'
import { books } from '@/database/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import type { InsertBook, SelectBook } from '@/database/schema'

export const createBook = async (
  params: Omit<InsertBook, 'availableCopies'>
) => {
  try {
    const newBook = await db
      .insert(books)
      .values({
        ...params,
        availableCopies: params.totalCopies,
      })
      .returning()
    revalidatePath('/admin/books')
    return {
      success: true,
      data: JSON.parse(JSON.stringify(newBook[0])),
    }
  } catch (error) {
    console.log(error)

    return {
      success: false,
      message: 'An error occurred while creating the book',
    }
  }
}

export const updateBook = async (
  id: SelectBook['id'],
  data: Partial<Omit<SelectBook, 'id'>>
) => {
  try {
    const updatedBook = await db
      .update(books)
      .set({
        ...data,
        availableCopies: data.totalCopies,
      })
      .where(eq(books.id, id))
      .returning()
    revalidatePath(`/admin/books/${updatedBook[0].id}`)
    revalidatePath('/admin/books')
    return {
      success: true,
      data: JSON.parse(JSON.stringify(updatedBook[0])),
    }
  } catch (error) {
    console.log(error)

    return {
      success: false,
      message: 'An error occurred while updating the book',
    }
  }
}

export const deleteBook = async (id: SelectBook['id']) => {
  try {
    const deletedBook = await db
      .delete(books)
      .where(eq(books.id, id))
      .returning()
    // revalidatePath(`/admin/books/${deletedBook[0].id}`);
    revalidatePath('/admin/books')
    return {
      success: true,
      data: JSON.parse(JSON.stringify(deletedBook[0])),
    }
  } catch (error) {
    console.log(error)
    return {
      success: false,
      message: 'An error occurred while deleting the book',
    }
  }
}
