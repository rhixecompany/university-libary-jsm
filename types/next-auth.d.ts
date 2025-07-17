import { DefaultSession } from 'next-auth';

import 'next-auth';

import 'next-auth/jwt';

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    sub: string;
    role: string;
    name: string;
    avatar: string;
  }
}

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      role: string;
      avatar: string;
    } & DefaultSession['user'];
  }

  interface User {
    role: string;
    avatar: string;
  }
}
