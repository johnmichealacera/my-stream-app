export async function GET() {
  try {
    const res = await fetch('http://localhost:3001/stream/start', {
      method: 'GET',
    });

    if (!res.ok) {
      throw new Error('Failed to start stream');
    }

    return new Response(JSON.stringify({ message: 'Stream started' }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Unable to start stream' }), {
      status: 500,
    });
  }
}

export async function POST() {
    try {
      const res = await fetch('http://localhost:3001/stream/stop', {
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