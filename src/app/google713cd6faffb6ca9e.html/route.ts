import { NextResponse } from 'next/server';

export async function GET() {
  return new NextResponse('google-site-verification: google713cd6faffb6ca9e.html', {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}