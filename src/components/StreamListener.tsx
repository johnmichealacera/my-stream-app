'use client';

import { useEffect, useState, useRef } from 'react';
import confetti from 'canvas-confetti';

export default function StreamListener() {
  const [game, setGame] = useState<any | null>(null);
  const [play, setPlay] = useState<any | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const prevHomeScoreRef = useRef<number>(0);
  const prevAwayScoreRef = useRef<number>(0);
  const gameRef = useRef<any>(0);
  const [highlightHome, setHighlightHome] = useState(false);
  const [highlightAway, setHighlightAway] = useState(false);
  const [homeScoreBoost, setHomeScoreBoost] = useState<string | null>(null);
  const [awayScoreBoost, setAwayScoreBoost] = useState<string | null>(null);
  const score2Ref = useRef<HTMLAudioElement | null>(null);
  const score3Ref = useRef<HTMLAudioElement | null>(null);
  const victoryRef = useRef<HTMLAudioElement | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  const [isServiceReady, setIsServiceReady] = useState(false);

  useEffect(() => {
    const checkService = async () => {
      try {
        const res = await fetch('/api/health-check', { method: 'GET' });

        if (res.ok) {
          setIsServiceReady(true);
        } else {
          throw new Error('Not ready');
        }
      } catch (err) {
        console.log('Service not ready, retrying...');
        setTimeout(checkService, 3000); // Retry every 3 seconds
      }
    };

    checkService();
  }, []);


  useEffect(() => {
    score2Ref.current = new Audio('/sounds/score2.mp3');
    score3Ref.current = new Audio('/sounds/score3.mp3');
    victoryRef.current = new Audio('/sounds/victory.mp3');
  }, []);

  const startStream = async () => {
    setIsGameOver(false);
    await fetch('/api/stream', { method: 'GET' });
    const es = new EventSource('/api/proxy');
    es.onmessage = (ev) => {
      const { game, play } = JSON.parse(ev.data);
      const prevHome = prevHomeScoreRef.current;
      const prevAway = prevAwayScoreRef.current;

      if (prevHome !== null && play.home !== prevHome) {
        setHighlightHome(true);
        setTimeout(() => setHighlightHome(false), 800);
      }

      if (prevAway !== null && play.away !== prevAway) {
        setHighlightAway(true);
        setTimeout(() => setHighlightAway(false), 800);
      }

      if (prevHome !== null && play.home > prevHome) {
        const diff = play.home - prevHome;
        setHomeScoreBoost(diff === 3 ? '3PT!' : `+${diff}`);
        // Play sound
        if (diff === 3) {
          score3Ref.current?.play();
        } else {
          score2Ref.current?.play();
        }
        setTimeout(() => setHomeScoreBoost(null), 1200);
      }
    
      if (prevAway !== null && play.away > prevAway) {
        const diff = play.away - prevAway;
        setAwayScoreBoost(diff === 3 ? '3PT!' : `+${diff}`);
        // Play sound
        if (diff === 3) {
          score3Ref.current?.play();
        } else {
          score2Ref.current?.play();
        }
        setTimeout(() => setAwayScoreBoost(null), 1200);
      }

      // Update refs for the next comparison
      prevHomeScoreRef.current = play.home;
      prevAwayScoreRef.current = play.away;
      gameRef.current = game;
      
      setGame(game);
      setPlay(play);
    };

    es.onerror = (err) => {
      console.log('Stream has ended and closed');
    
        if (prevHomeScoreRef.current > prevAwayScoreRef.current) {
          setWinner(gameRef.current.homeTeam.name);
        } else if (prevAwayScoreRef.current > prevHomeScoreRef.current  ) {
          setWinner(gameRef.current.awayTeam.name);
        } else {
          setWinner('It\'s a tie!');
        }
        setIsGameOver(true);
        // ... after setting winner
        confetti({
          particleCount: 200,
          spread: 80,
          origin: { y: 0.6 },
        });
    
        // Play victory music
        victoryRef.current?.play();

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

  if (!isServiceReady) {
    return (
      <div className="flex justify-center items-center h-screen flex-col text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-50 mb-4"></div>
        <p className="text-gray-600 text-lg">Waking up the streaming service on Render...</p>
        <p className="text-sm text-gray-400">(This might take a few seconds)</p>
      </div>
    );
  }  
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
          <h2
            className={`text-xl font-bold text-center mb-4 transition-all ${
              isGameOver && winner ? 'text-green-600 animate-bounce' : ''
            }`}
          >
            {isGameOver && winner
              ? `🏆 ${winner} Wins!`
              : `${game?.homeTeam?.name} vs ${game?.awayTeam?.name}`}
          </h2>

          <div className="flex justify-around text-2xl font-semibold">
            <div className="relative">
              {game?.homeTeam?.name}
              {homeScoreBoost && (
                <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-green-600 text-sm animate-float">
                  {homeScoreBoost}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <span className={`px-2 rounded transition-all ${highlightHome ? 'bg-yellow-200' : ''}`}>
                {play?.home}
              </span>
              -
              <span className={`px-2 rounded transition-all ${highlightAway ? 'bg-yellow-200' : ''}`}>
                {play?.away}
              </span>
            </div>
            <div className="relative">
              {game?.awayTeam?.name}
              {awayScoreBoost && (
                <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-green-600 text-sm animate-float">
                  {awayScoreBoost}
                </span>
              )}
            </div>
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
