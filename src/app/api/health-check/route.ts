import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic'; // this disables edge rendering

export async function GET(req: NextRequest) {
  const response = await fetch(`${process.env.LIVE_STREAMING_SERVICE_URL}/health`, {
    method: 'GET',
  });

  if (!response.body) {
    return new Response('No body in response', { status: 500 });
  }

  return new Response(response.body, {
    status: 200,
  });
}
