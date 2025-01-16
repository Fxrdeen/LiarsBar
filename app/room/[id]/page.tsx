"use client";

import { useParams } from "next/navigation";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import { UserCircle } from "lucide-react";

const socket = io("http://localhost:4000");

interface Player {
  id: string;
  username: string;
}

export default function GameRoom() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [userName, setUserName] = useState("");
  const [connected, setConnected] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const router = useRouter();
  const { id: roomId } = useParams();

  const handleLeaveRoom = () => {
    socket.emit("leaveRoom", { roomId, username: userName });
    socket.disconnect();
    router.push("/");
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (!storedUsername) {
      router.push("/");
      return;
    }
    setUserName(storedUsername);

    if (roomId) {
      socket.connect();
      socket.emit("joinRoom", { roomId, username: storedUsername });

      socket.on("updatePlayers", (playersList) => {
        setPlayers(playersList);
        setConnected(true);
        setIsHost(playersList[0]?.username === storedUsername);
      });

      socket.on("gameStarted", () => {
        router.push(`/room/${roomId}/game`);
      });

      socket.on("disconnect", () => {
        setConnected(false);
      });
    }

    const handleBeforeUnload = () => {
      socket.emit("leaveRoom", { roomId, username: storedUsername });
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      socket.off("updatePlayers");
      socket.off("gameStarted");
      socket.off("disconnect");
      handleBeforeUnload();
      socket.disconnect();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [roomId, router]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          className="text-4xl font-bold font-cinzel-decorative text-amber-500 mb-8 text-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Liar's Bar - Game Room
        </motion.h1>
        <motion.div
          className="bg-gray-800 rounded-lg p-6 mb-8 shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xl mb-2">
            Room Code:{" "}
            <span className="font-bold text-amber-400">{roomId}</span>
          </p>
          <p className="text-xl">
            Host: <span className="font-bold text-amber-400">{userName}</span>
          </p>
          <p className="text-xl mt-2">
            Status:{" "}
            {connected ? (
              <span className="text-green-400">Connected</span>
            ) : (
              <span className="text-red-400">Connecting...</span>
            )}
          </p>
        </motion.div>
        <motion.div
          className="bg-gray-800 rounded-lg p-6 mb-8 shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-amber-500">
            Players ({players.length}/4)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <AnimatePresence>
              {players.map((player) => (
                <motion.div
                  key={player.id}
                  className="flex items-center space-x-2 bg-gray-700 p-3 rounded-md"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <UserCircle className="w-6 h-6 text-amber-400" />
                  <span className="font-medium">{player.username}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
        <div className="space-y-4">
          {isHost ? (
            <Button
              className="w-full bg-amber-600 hover:bg-amber-700 text-white text-lg py-6 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
              disabled={players.length < 2}
              onClick={() => {
                socket.emit("startGame", { roomId, players });
              }}
            >
              {players.length < 2 ? "Waiting for Players..." : "Start Game"}
            </Button>
          ) : (
            <Button
              className="w-full bg-gray-600 text-white text-lg py-6 rounded-lg shadow-lg"
              disabled={true}
            >
              Waiting for Host to Start...
            </Button>
          )}
          <Button
            className="w-full bg-gray-700 hover:bg-gray-600 text-white text-lg py-6 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
            onClick={handleLeaveRoom}
          >
            Leave Room
          </Button>
        </div>
        <motion.p
          className="text-center mt-6 text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Players in room: {players.length}
        </motion.p>
      </div>
    </div>
  );
}
