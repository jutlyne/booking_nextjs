import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

interface BackendUser {
  id: string;
  email: string;
  fullname: string;
  role: string;
  phone: number;
}

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
            credentials: 'include',
          }
        );

        if (!res.ok) return null;

        const user: BackendUser = (await res.json()).data?.user;

        return {
          id: user.id,
          email: user.email,
          fullname: user.fullname,
          phone: user.phone,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = {
          id: user.id,
          email: user.email,
          fullname: user.fullname,
          phone: user.phone,
          role: user.role,
        };
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
});

export { handler as GET, handler as POST };
