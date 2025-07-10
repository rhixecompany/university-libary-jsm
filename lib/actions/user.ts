"use server";

import { db } from "@/database/drizzle";
import { users } from "@/database/schema";

import { desc, eq } from "drizzle-orm";

// Get single user by it's ID
export async function getUserById(id: string) {
  // Fetch data based on id
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  return user
}

// Get all users
export async function getAllUsers() {
  const allusers = (await db
    .select()
    .from(users)
    .orderBy(desc(users.createdAt))) as UserParams[];
  return allusers
}

