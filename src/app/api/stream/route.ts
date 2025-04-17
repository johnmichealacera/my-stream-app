export async function GET() {
  try {
    // Wake up the streaming service first
  const res = await fetch(`${process.env.LIVE_STREAMING_SERVICE_URL}`);
    // Slight delay to give Render time to wake it up
    // await new Promise((resolve) => setTimeout(resolve, 20000));

    // Then trigger your existing flow
  if (res?.status === 200) {
    const res = await fetch(`${process.env.LIVE_STREAMING_SERVICE_URL}/stream/start`, {
      method: 'GET',
    });

    if (!res.ok) {
      throw new Error('Failed to start stream');
    }

    return new Response(JSON.stringify({ message: 'Stream started' }), {
      status: 200,
    });
  }
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Unable to start stream' }), {
      status: 500,
    });
  }
  
}

export async function POST() {
    try {
        // TODO: Add in env variables
      const res = await fetch(`${process.env.LIVE_STREAMING_SERVICE_URL}/stream/stop`, {
        method: 'POST',
      });
  
      if (!res.ok) {
        throw new Error('Failed to stop stream');
      }
  
      return new Response(JSON.stringify({ message: 'Stream stopped' }), {
        status: 200,
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Unable to stop stream' }), {
        status: 500,
      });
    }
  }