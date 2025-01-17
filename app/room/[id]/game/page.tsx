"use client";

import { useParams, useRouter } from "next/navigation";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import GameArea from "@/components/GameArea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

const socket = io(
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"
);

interface Player {
  username: string;
  id: string;
}
interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: number;
}
const GamePage = () => {
  const { id: roomId } = useParams();
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const username = localStorage.getItem("username");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const handleLeaveGame = (username: string) => {
    socket.emit("leaveRoom", { roomId, username });
    router.push("/");
  };
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const timestamp = Date.now();
      // Emit the message to the server
      socket.emit("sendMessage", {
        roomId,
        username,
        message: newMessage,
        timestamp,
      });
      // Add message to local state
      setMessages((prev) => [
        ...prev,
        {
          id: timestamp.toString(),
          sender: username!,
          message: newMessage,
          timestamp,
        },
      ]);
      setNewMessage("");
    }
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
      console.log("Received players:", playersList);
      setPlayers(playersList);
    });

    // Listen for new messages
    socket.on("newMessage", ({ username, message, timestamp }) => {
      setMessages((prev) => [
        ...prev,
        {
          id: timestamp.toString(),
          sender: username,
          message,
          timestamp,
        },
      ]);
    });

    return () => {
      socket.off("updateGamePlayers");
      socket.off("newMessage");
      socket.disconnect();
    };
  }, [roomId, router]);

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      <div className="flex-grow">
        <GameArea players={players} />
      </div>
      <div className="w-80 flex flex-col">
        <div className="flex flex-col h-full bg-gray-800">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold text-amber-500">Chat</h2>
          </div>
          <ScrollArea className="flex-grow p-4">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-2"
              >
                <span className="font-bold text-amber-500">{msg.sender}: </span>
                <span>{msg.message}</span>
              </motion.div>
            ))}
          </ScrollArea>
          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t border-gray-700"
          >
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-grow bg-gray-700 border-gray-600 text-gray-100"
              />
              <Button
                type="submit"
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                Send
              </Button>
            </div>
          </form>
        </div>
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
