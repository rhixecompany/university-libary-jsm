import { authConfig } from '@/auth.config';
import { db } from '@/database/drizzle';
import { users } from '@/database/schema';
import { compare } from '@/lib/encrypt';
import { eq } from 'drizzle-orm';
import NextAuth, { type User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: '/sign-in',
    newUser: '/sign-up',
  },
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        if (credentials == null) {
          return null;
        }
        const email = credentials.email as string;
        const user = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);

        if (user.length === 0) return null;

        // Check if user exists and if the password matches
        if (user[0] && user[0].password) {
          const isMatch = await compare(credentials.password as string, user[0].password);
          // If password is correct, return user
          if (isMatch) {
            return {
              id: user[0].id,
              name: user[0].name,
              email: user[0].email,
              role: user[0].role,
              avatar: user[0].avatar,
            } as User;
          }
        }

        // If user does not exist or password does not match return null
        return null;
      },
    }),
  ],

  callbacks: {
    ...authConfig.callbacks,
    async session({ session, user, trigger, token }) {
      // Set the user ID from the token
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.name = token.name;
      session.user.avatar = token.avatar;

      // If there is an update, set the user name
      if (trigger === 'update') {
        session.user.name = user.name;
        session.user.avatar = user.avatar;
      }

      return session;
    },
    async jwt({ token, user, trigger, session }) {
      // Assign user fields to token
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.avatar = user.avatar;

        // If user has no name then use the email
        if (user.name === 'NO_NAME') {
          token.name = user.email!.split('@')[0];

          // Update database to reflect the token name
          await db.update(users).set({ name: token.name }).where(eq(users.id, user.id!));
        }

        if (trigger === 'signIn' || trigger === 'signUp') {
          await db
            .update(users)
            .set({ lastActivityDate: new Date().toISOString().slice(0, 10) })
            .where(eq(users.id, user.id!));
        }
      }

      // Handle session updates
      if (session?.user.name && trigger === 'update') {
        token.name = session.user.name;
        token.avatar = session.user.avatar;
      }

      return token;
    },
  },
});
