import StreamListener from '../components/StreamListener';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        🏀 Live Basketball Stream Playground
      </h1>
      <StreamListener />
    </main>
  );
}
