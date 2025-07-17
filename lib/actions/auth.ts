'use server';

import { signIn, signOut } from '@/auth';
import { db } from '@/database/drizzle';
import { users } from '@/database/schema';
import config from '@/lib/config';
import { hash } from '@/lib/encrypt';
import ratelimit from '@/lib/ratelimit';
import { workflowClient } from '@/lib/workflow';
import { eq } from 'drizzle-orm';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
export const signInWithCredentials = async (params: Pick<AuthCredentials, 'email' | 'password'>) => {
  const { email, password } = params;

  const ip = (await headers()).get('x-forwarded-for') || '127.0.0.1';
  const { success } = await ratelimit.limit(ip);

  if (!success) return redirect('/too-fast');

  try {
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { success: false, error: result.error };
    }

    return { success: true };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.log(error, 'Signin error');
    return { success: false, error: 'Signin error' };
  }
};

export const signUp = async (params: AuthCredentials) => {
  const { name, email, password, avatar } = params;

  const ip = (await headers()).get('x-forwarded-for') || '127.0.0.1';
  const { success } = await ratelimit.limit(ip);

  if (!success) return redirect('/too-fast');

  const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);

  if (existingUser.length > 0) {
    return { success: false, error: 'User already exists' };
  }

  const hashedPassword = await hash(password);

  try {
    await db.insert(users).values({
      name,
      email,

      password: hashedPassword,
      avatar,
    });

    await workflowClient.trigger({
      url: `${config.env.prodApiEndpoint}/api/workflows/onboarding`,
      body: {
        email,
        name,
      },
    });

    await signInWithCredentials({ email, password });

    return { success: true };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.log(error, 'Signup error');
    return { success: false, error: 'Signup error' };
  }
};

export const signOutUser = async () => {
  return await signOut();
};
