"use client";

import { useEffect, useState } from "react";

async function fetchGames() {
  const response = await fetch("/api/igdb/games");
  if (!response.ok) return [];
  return response.json();
}

export default function Home() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGames().then((data) => {
      setGames(data);
      setLoading(false);
    });
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-cyan-500 via-teal-400 to-blue-500 p-8">
      <h1 className="text-4xl font-bold text-cyan-100 mb-8 text-center tracking-tight drop-shadow-lg">
        Top Rated Games
      </h1>
      {loading ? (
        <div className="text-center text-cyan-100 text-lg">Loading games...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {games.map((game) => (
            <div
              key={game.id}
              className="bg-white/10 rounded-2xl shadow-xl backdrop-blur-md border border-cyan-300/20 overflow-hidden hover:scale-105 transition-transform"
            >
              {game.cover?.url && (
                <img
                  src={game.cover.url.replace("t_thumb", "t_cover_big")}
                  alt={game.name}
                  className="w-full h-48 object-cover rounded-t-2xl"
                />
              )}
              <div className="p-4">
                <h2 className="text-xl font-bold text-cyan-300 mb-2 tracking-tight">
                  {game.name}
                </h2>
                <p className="text-cyan-100/80 text-sm mb-2">
                  {game.summary?.slice(0, 100) || "No summary available."}
                </p>
                <div className="text-pink-300 font-bold">
                  Rating: {game.rating ? game.rating.toFixed(1) : "N/A"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <footer className="mt-16 text-center text-cyan-200 text-sm">
        Powered by IGDB API
      </footer>
    </main>
  );
}
