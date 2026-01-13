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
    error?: string;
  }

  interface User {
    id: string;
    email: string;
    fullname: string;
    role: UserRole;
    phone: number;
    token: string;
    refreshToken: string;
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
    auth: {
      token: string;
      refreshToken: string;
    };
    accessTokenExpires: number;
    error?: string;
  }
}
