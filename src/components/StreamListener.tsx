'use client';

import { useEffect, useState, useRef } from 'react';

export default function StreamListener() {
  const [game, setGame] = useState<any | null>(null);
  const [play, setPlay] = useState<any | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  const startStream = async () => {
    await fetch('/api/stream', { method: 'GET' });
    const es = new EventSource('/api/proxy');
    es.onmessage = (ev) => {
      const { game, play } = JSON.parse(ev.data);
      
      setGame(game);
      setPlay(play);
    };

    es.onerror = (err) => {
      console.log('Stream has ended and closed');

      // Just treat it as "end of game"
      es.close();
      setIsStreaming(false);
    };
    eventSourceRef.current = es;
    setIsStreaming(true);
  };

  const stopStream = async () => {
    await fetch('/api/stream', { method: 'POST' });
    eventSourceRef.current?.close();
    eventSourceRef.current = null;
    setIsStreaming(false);
  };

  useEffect(() => {
    return () => {
      eventSourceRef.current?.close();
    };
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-6 bg-white shadow-lg rounded-2xl p-6 space-y-4">
      <div className="p-4 flex gap-4">
        <button
          onClick={startStream}
          disabled={isStreaming}
          className="btn bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          ▶️ Start Simulation
        </button>
        <button
          onClick={stopStream}
          disabled={!isStreaming}
          className="btn bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
        >
          ⛔ Stop Simulation
        </button>
      </div>

      {game && (
        <>
          <h2 className="text-xl font-bold text-center mb-4">
            {game?.homeTeam?.name} vs {game?.awayTeam?.name}
          </h2>

          <div className="flex justify-around text-2xl font-semibold">
            <div>{game?.homeTeam?.name}</div>
            <div>
              {play?.home} - {play?.away}
            </div>
            <div>{game?.awayTeam?.name}</div>
          </div>

          <div className="text-center text-sm text-gray-500">
            Q{play?.quarter} • {play?.time}
          </div>

          <hr />

          <div className="space-y-3 max-h-80 overflow-y-auto">
            <div className="p-3 bg-gray-100 rounded-xl shadow-sm transition hover:bg-gray-200">
              <div className="font-medium">{play?.event}</div>
              <div className="text-xs text-gray-500 italic">{play?.story}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
