export type UserRole = 'admin' | 'user';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      fullname: string;
      role: UserRole;
      phone: number;
    };
  }

  interface User {
    id: string;
    email: string;
    fullname: string;
    role: UserRole;
    phone: number;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: {
      id: string;
      email: string;
      fullname: string;
      role: UserRole;
      phone: number;
    };
  }
}
