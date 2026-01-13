import { NextRequest, NextResponse } from 'next/server';
import { HttpStatusCode } from 'axios';
import { getToken } from 'next-auth/jwt';

async function handler(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const accessToken = token?.auth?.token;

  if (!accessToken) {
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: HttpStatusCode.Unauthorized }
    );
  }

  const url = new URL(req.url);
  const path = url.pathname;
  const targetUrl = `${process.env.NEXT_PUBLIC_API_URL}${path}${url.search}`;
  const headers = new Headers();
  headers.set(
    'Content-Type',
    req.headers.get('Content-Type') || 'application/json'
  );
  headers.set('Accept', 'application/json');
  headers.set('Cookie', `token=${accessToken}`);

  try {
    const backendRes = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      body: req.body,
    });

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
      { status: HttpStatusCode.InternalServerError }
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
