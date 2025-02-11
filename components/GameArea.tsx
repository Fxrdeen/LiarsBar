"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "./Card";
import { RevealCard } from "./RevealCard";
import { Socket } from "socket.io-client";
import { Button } from "./ui/button";

interface Player {
  id: string;
  username: string;
  cards: string[];
}

interface GameAreaProps {
  players: Player[];
  currentPlayerId: string;
  onPlayersUpdate?: (players: Player[]) => void;
  socket: Socket;
  card: string;
}

export default function GameArea({
  players,
  currentPlayerId,
  onPlayersUpdate,
  socket,
  card,
}: GameAreaProps) {
  const [revealedCard, setRevealedCard] = useState<string | null>(null);
  const [isCardRevealed, setIsCardRevealed] = useState(false);
  const [isCardMoved, setIsCardMoved] = useState(false);
  const [localPlayers, setLocalPlayers] = useState<Player[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setIsCardRevealed(true);
    }, 500);

    setTimeout(() => {
      setIsCardMoved(true);
    }, 5500);
  }, [players, onPlayersUpdate]);

  const getPlayerPosition = (index: number, totalPlayers: number) => {
    switch (index) {
      case 0: // Bottom (current player)
        return { x: "35%", y: "75%", translate: "-50% -50%", width: "400px" };
      case 1: // Top
        return { x: "35%", y: "5%", translate: "-50% -50%", width: "400px" };
      case 2: // Left
        return { x: "20%", y: "20%", translate: "-50% -50%", width: "100px" };
      case 3: // Right
        return { x: "80%", y: "20%", translate: "-50% -50%", width: "100px" };
      default:
        return { x: "50%", y: "50%", translate: "-50% -50%", width: "400px" };
    }
  };

  const getOrderedPlayers = (players: Player[]) => {
    const currentPlayerIndex = players.findIndex(
      (p) => p.id === currentPlayerId
    );
    if (currentPlayerIndex === -1) return players;

    const reorderedPlayers = [...players];
    const currentPlayer = reorderedPlayers.splice(currentPlayerIndex, 1)[0];
    reorderedPlayers.unshift(currentPlayer);
    return reorderedPlayers;
  };

  return (
    <div className="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden">
      {/* Center play area */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gray-800/50 rounded-lg flex items-center justify-center">
        <AnimatePresence>
          {!isCardMoved && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="z-10"
            >
              {card && <RevealCard card={card} isRevealed={isCardRevealed} />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Table type indicator */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, x: "50%", y: "50%" }}
        animate={isCardMoved ? { opacity: 1, scale: 1, x: "5%", y: "5%" } : {}}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="absolute z-20"
      >
        {isCardMoved && (
          <div className="bg-gray-800 rounded-lg p-2 shadow-lg">
            <h3 className="text-sm font-bold text-amber-500">
              {card && `${card}'s Table`}
            </h3>
          </div>
        )}
      </motion.div>

      {/* Players */}
      {getOrderedPlayers(players).map((player, index) => {
        const isCurrentPlayer = player.id === currentPlayerId;
        const { x, y, translate, width } = getPlayerPosition(
          index,
          players.length
        );
        const isVertical = index === 2 || index === 3;

        return (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * index }}
            className="absolute"
            style={{
              left: x,
              top: y,
              transform: `translate(${translate})`,
              width: width,
            }}
          >
            <div
              className={`rounded-lg p-2 ${
                isCurrentPlayer ? "bg-gray-800/70" : "bg-gray-800/40"
              }`}
            >
              <h3 className="text-sm font-bold text-amber-500 mb-1 text-center">
                {player.username}
              </h3>
              <div
                className={`flex ${
                  isVertical ? "flex-col space-y-1" : "justify-center space-x-1"
                }`}
              >
                {player.cards.map((card, i) => (
                  <Card
                    key={i}
                    value={card}
                    isVisible={isCurrentPlayer}
                    isVertical={isVertical}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        );
      })}
      <div className="absolute bottom-4 right-4">
        <Button
          onClick={() => console.log("clicked")}
          disabled={false}
          className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-2"
        >
          Play Selected Cards
        </Button>
      </div>
    </div>
  );
}
