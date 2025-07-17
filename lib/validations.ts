import { z } from 'zod';

export const signUpSchema = z
  .object({
    name: z.string().min(3),
    email: z.string().email(),
    // universityId: z.coerce.number(),
    avatar: z.string().nonempty('Avatar is required'),
    password: z.string().min(8),
    confirmPassword: z.string().min(8, 'Confirm password must be at least 6 characters'),
    // callbackUrl: z.string(),
  })
  .strict()
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const signInSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    // callbackUrl: z.string(),
  })
  .strict();

// export const bookSchema = z
//   .object({
//     title: z.string().trim().min(2).max(100),
//     description: z.string().trim().min(10).max(1000),
//     author: z.string().trim().min(2).max(100),
//     genre: z.string().trim().min(2).max(50),
//     rating: z.coerce.number().min(1).max(5),
//     totalCopies: z.coerce.number().int().positive().lte(10000),
//     coverUrl: z.string().nonempty(),
//     coverColor: z
//       .string()
//       .trim()
//       .regex(/^#[0-9A-F]{6}$/i),
//     videoUrl: z.string().nonempty(),
//     summary: z.string().trim().min(10),
//   })
//   .strict();

export const authCredentialsSchema = z
  .object({
    name: z.string(),
    email: z.string(),
    password: z.string(),
    avatar: z.string(),
  })
  .strict();

export const bookSchema = z
  .object({
    id: z.string().uuid(),
    title: z.string().trim().min(2).max(100),
    description: z.string().trim().min(10).max(1000),
    author: z.string().trim().min(2).max(100),
    genre: z.string().trim().min(2).max(50),
    rating: z.coerce.number().min(1).max(5),
    totalCopies: z.coerce.number().int().positive().lte(10000),
    coverUrl: z.string().nonempty(),
    coverColor: z
      .string()
      .trim()
      .regex(/^#[0-9A-F]{6}$/i),
    videoUrl: z.string().nonempty(),
    summary: z.string().trim().min(10),
  })
  .strict();

export const borrowBookSchema = z
  .object({
    bookId: z.string(),
    userId: z.string(),
  })
  .strict();

export const userSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    password: z.string(),
    avatar: z.string(),
    role: z.union([z.literal('USER'), z.literal('ADMIN')]).nullable(),
    status: z.union([z.literal('PENDING'), z.literal('APPROVED'), z.literal('REJECTED')]).nullable(),
    lastActivityDate: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable(),
  })
  .strict();
