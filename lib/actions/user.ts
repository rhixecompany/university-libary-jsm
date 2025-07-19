'use server'

import { db } from '@/database/drizzle'
import type { SelectUser } from '@/database/schema'
import { users } from '@/database/schema'

import { asc, eq } from 'drizzle-orm'

// Get single user by it's ID
export async function getUserById(id: SelectUser['id']) {
  // Fetch data based on id
  return db.select().from(users).where(eq(users.id, id))
}

// Get all users
export async function getAllUsers() {
  return db.select().from(users).orderBy(asc(users.email), asc(users.createdAt))
}
