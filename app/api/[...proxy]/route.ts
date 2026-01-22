import { NextRequest, NextResponse } from 'next/server';
import { HttpStatusCode } from 'axios';
import { getToken } from 'next-auth/jwt';

const API_URL = process.env.NEXT_PUBLIC_API_URL!;
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET!;

async function refreshAccessToken(refreshToken: string) {
  const res = await fetch(`${API_URL}/api/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    throw new Error('Refresh token failed');
  }

  return res.json() as Promise<{ token: string }>;
}

async function handler(req: NextRequest) {
  const sessionToken = await getToken({
    req,
    secret: NEXTAUTH_SECRET,
  });

  const accessToken = sessionToken?.auth?.token;
  const refreshToken = sessionToken?.auth?.refreshToken;

  if (!accessToken || !refreshToken) {
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: HttpStatusCode.Unauthorized },
    );
  }

  const url = new URL(req.url);
  const targetUrl = `${API_URL}${url.pathname}${url.search}`;

  const createHeaders = (token: string) => {
    const headers = new Headers();
    headers.set(
      'Content-Type',
      req.headers.get('Content-Type') || 'application/json',
    );
    headers.set('Accept', 'application/json');
    headers.set('Cookie', `token=${token}`);
    return headers;
  };

  const body =
    req.method === 'GET' || req.method === 'HEAD'
      ? undefined
      : await req.text();

  const callBackend = async (token: string) => {
    return fetch(targetUrl, {
      method: req.method,
      headers: createHeaders(token),
      body,
    });
  };

  try {
    let backendRes = await callBackend(accessToken);

    if (backendRes.status === HttpStatusCode.Unauthorized) {
      try {
        const refreshed = await refreshAccessToken(refreshToken);

        backendRes = await callBackend(refreshed.token);
      } catch (refreshError) {
        console.log(refreshError);

        return NextResponse.json(
          { message: 'Unauthorized' },
          { status: HttpStatusCode.Unauthorized },
        );
      }
    }

    const data = await backendRes.blob();

    return new NextResponse(data, {
      status: backendRes.status,
      statusText: backendRes.statusText,
      headers: backendRes.headers,
    });
  } catch (error) {
    console.error('Proxy Error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: HttpStatusCode.InternalServerError },
    );
  }
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as DELETE,
  handler as PATCH,
};
