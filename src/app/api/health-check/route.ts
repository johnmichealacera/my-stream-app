import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic'; // this disables edge rendering

export async function GET() {
  console.log("PUBLIC ENV:", process.env.NEXT_PUBLIC_LIVE_STREAMING_SERVICE_URL);

    try {
      const res = await fetch(`${process.env.LIVE_STREAMING_SERVICE_URL}/stream/health`, {
        method: 'GET',
      });
      
  
      if (!res.ok) {
        throw new Error('Failed to start stream');
      }
  
      return new Response(JSON.stringify({ message: 'Service is healthy' }), {
        status: 200,
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Unable to start stream' }), {
        status: 500,
      });
    }
  }
