"use client";

import { motion } from "framer-motion";

interface Player {
  id: string;
  username: string;
}

interface GameAreaProps {
  players: Player[];
}

export default function GameArea({ players }: GameAreaProps) {
  const getPlayerPosition = (index: number, totalPlayers: number) => {
    const angle = (index / totalPlayers) * 2 * Math.PI;
    const radius = 40; // Adjust this value to change the circle size
    const x = 50 + radius * Math.cos(angle);
    const y = 50 + radius * Math.sin(angle);
    return { x, y };
  };

  return (
    <div className="relative w-full h-full bg-green-900 rounded-lg overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-32 h-48 bg-white rounded-lg shadow-lg flex items-center justify-center text-4xl font-bold text-gray-800"
        >
          🃏
        </motion.div>
      </div>
      {players.map((player, index) => {
        const { x, y } = getPlayerPosition(index, players.length);
        return (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * index }}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
              <h3 className="text-lg font-bold text-amber-500 mb-2">
                {player.username}
              </h3>
              <div className="flex space-x-1">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-6 h-8 bg-white rounded-sm shadow-sm transform rotate-3 -ml-4 first:ml-0"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
