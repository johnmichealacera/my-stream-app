import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic'; // this disables edge rendering

export async function GET(req: NextRequest) {
  // TODO: Add in env variables
  const response = await fetch(`${process.env.LIVE_STREAMING_SERVICE_URL}/stream`, {
    headers: {
      Accept: 'text/event-stream',
    },
  });

  if (!response.body) {
    return new Response('No body in response', { status: 500 });
  }

  return new Response(response.body, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
