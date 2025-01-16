"use client";

import { useParams, useRouter } from "next/navigation";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import ChatSidebar from "@/components/ChatSidebar";
import GameArea from "@/components/GameArea";

const socket = io("http://localhost:4000");

interface Player {
  username: string;
  id: string;
}

const GamePage = () => {
  const { id: roomId } = useParams();
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const username = localStorage.getItem("username");
  const handleLeaveGame = (username: string) => {
    socket.emit("leaveRoom", { roomId, username });
    router.push("/");
  };

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (!username) {
      router.push("/");
      return;
    }

    socket.connect();

    // Join the game room with username
    socket.emit("joinGameRoom", { roomId, username });

    // Listen for player updates
    socket.on("updateGamePlayers", (playersList) => {
      console.log("Received players:", playersList); // Debug log
      setPlayers(playersList);
    });

    return () => {
      socket.off("updateGamePlayers");
      socket.disconnect();
    };
  }, [roomId, router]);

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      <div className="flex-grow">
        <GameArea players={players} />
      </div>
      <div className="w-80 flex flex-col">
        <ChatSidebar />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-4"
        >
          <Button
            onClick={() => handleLeaveGame(username!)}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            Leave Game
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default GamePage;
