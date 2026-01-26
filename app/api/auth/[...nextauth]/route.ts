import NextAuth, { AuthOptions, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import Credentials from 'next-auth/providers/credentials';
import { parse as parseCookie } from 'set-cookie-parser';

const TOKEN_EXPIRY_DURATION = 30 * 60 * 1000;

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `refreshToken=${token.auth.refreshToken}; token=${token.auth.token}`,
        },
        body: JSON.stringify({
          refreshToken: token.auth.refreshToken,
        }),
      },
    );

    const data = await res.json();

    if (!res.ok) {
      throw data;
    }

    let newToken = '';
    let newRefreshToken = '';

    const setCookieHeader = res.headers.getSetCookie
      ? res.headers.getSetCookie()
      : res.headers.get('set-cookie');

    if (setCookieHeader) {
      const parsedCookies = parseCookie(setCookieHeader);
      parsedCookies.forEach((cookie) => {
        if (cookie.name === 'token') newToken = cookie.value;
        if (cookie.name === 'refreshToken') newRefreshToken = cookie.value;
      });
    }

    if (!newToken) newToken = data.data?.token || data.token;
    if (!newRefreshToken)
      newRefreshToken = data.data?.refreshToken || data.refreshToken;

    return {
      ...token,
      auth: {
        token: newToken || token.auth.token,
        refreshToken: newRefreshToken || token.auth.refreshToken,
      },
      accessTokenExpires: Date.now() + TOKEN_EXPIRY_DURATION,
      error: undefined,
    };
  } catch (error) {
    console.error('RefreshAccessTokenError', error);
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

async function callLogout(token: string) {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Cookie: `token=${token}`,
    },
  });
}

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(
        credentials: Record<'email' | 'password', string> | undefined,
      ) {
        if (!credentials) return null;

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
              credentials: 'include',
            },
          );

          if (!res.ok) return null;

          let token = '';
          let refreshToken = '';

          const setCookieHeader = res.headers.getSetCookie();
          if (setCookieHeader && setCookieHeader.length > 0) {
            const parsedCookies = parseCookie(setCookieHeader);

            parsedCookies.forEach((cookie) => {
              if (cookie.name === 'token') token = cookie.value;
              if (cookie.name === 'refreshToken') refreshToken = cookie.value;
            });
          }

          const user: User = (await res.json()).data?.user;

          return {
            ...user,
            token,
            refreshToken,
          };
        } catch (error) {
          console.error(error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          user: {
            id: user.id,
            email: user.email,
            fullname: user.fullname,
            phone: user.phone,
            role: user.role,
          },
          auth: {
            token: user.token,
            refreshToken: user.refreshToken,
          },
          accessTokenExpires: Date.now() + TOKEN_EXPIRY_DURATION,
        };
      }

      if (Date.now() < ((token.accessTokenExpires || 0) as number)) {
        return token;
      }

      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.user = token.user;
      session.error = token.error;
      return session;
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/logout',
  },
  events: {
    async signOut({ token }) {
      await callLogout(token.auth.token);
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
