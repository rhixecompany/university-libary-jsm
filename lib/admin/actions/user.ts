'use server'

import { db } from '@/database/drizzle'
import { users } from '@/database/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import type { InsertUser, SelectUser } from '@/database/schema'

export const createUser = async (params: InsertUser) => {
  try {
    const newUser = await db
      .insert(users)
      .values({
        ...params,
      })
      .returning()
    revalidatePath('/admin/users')
    return {
      success: true,
      data: JSON.parse(JSON.stringify(newUser[0])),
    }
  } catch (error) {
    console.log(error)

    return {
      success: false,
      message: 'An error occurred while creating the user',
    }
  }
}

export const updateUser = async (
  id: SelectUser['id'],
  data: Partial<Omit<SelectUser, 'id'>>
) => {
  try {
    const updatedUser = await db
      .update(users)
      .set({
        ...data,
      })
      .where(eq(users.id, id))
      .returning()
    revalidatePath(`/admin/users/${updatedUser[0].id}`)
    revalidatePath('/admin/users')
    return {
      success: true,
      data: JSON.parse(JSON.stringify(updatedUser[0])),
    }
  } catch (error) {
    console.log(error)

    return {
      success: false,
      message: 'An error occurred while updating the user',
    }
  }
}

export const deleteUser = async (id: SelectUser['id']) => {
  try {
    const deletedUser = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning()
    // revalidatePath(`/admin/users/${deletedUser[0].id}`);
    revalidatePath('/admin/users')
    return {
      success: true,
      data: JSON.parse(JSON.stringify(deletedUser[0])),
    }
  } catch (error) {
    console.log(error)
    return {
      success: false,
      message: 'An error occurred while deleting the user',
    }
  }
}
