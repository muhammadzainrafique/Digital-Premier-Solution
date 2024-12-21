import 'next-auth';
import { JWT } from 'next-auth/jwt';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      _id?: string;
      role?: string;
      name?: string;
    } & DefaultSession['user'];
  }

  interface User {
    _id?: string;
    role?: string;
    name?: string;
  }
}

declare module 'next-auth' {
  interface JWT {
    id?: string;
    role?: string;
    name?: string;
  }
}
