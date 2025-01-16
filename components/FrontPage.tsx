"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import JoinGameDialog from "@/components/JoinGameDialog";
import { useRouter } from "next/navigation";
// import GameRoom from "./GameRoom";

export default function FrontPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [isSettingUsername, setIsSettingUsername] = useState(true);
  const [isJoinGameOpen, setIsJoinGameOpen] = useState(false);
  const [roomCode, setRoomCode] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
      setIsSettingUsername(false);
    }
  }, []);

  const handleSetUsername = () => {
    if (username.trim()) {
      localStorage.setItem("username", username);
      setIsSettingUsername(false);
    }
  };

  const handleChangeUsername = () => {
    setIsSettingUsername(true);
  };

  const handleCreateGame = () => {
    const newRoomCode = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();
    router.push(`/room/${newRoomCode}`);
  };

  const handleJoinGame = (code: string) => {
    setRoomCode(code.toUpperCase());
    setIsJoinGameOpen(false);
    router.push(`/room/${code}`);
  };

  // if (roomCode) {
  //   return <GameRoom username={username} roomCode={roomCode} />;
  // }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)]">
      <div className="w-full md:w-1/4 h-1/4 md:h-full">
        {/* <ThreeJSModel modelPath="/models/dice.glb" /> */}
      </div>
      <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col items-center justify-center p-8">
        <motion.h1
          className="text-4xl md:text-6xl font-bold font-cinzel-decorative text-amber-500 mb-8 text-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Liar's Bar
        </motion.h1>
        <div className="space-y-4 w-full max-w-md">
          {username && !isSettingUsername ? (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-4"
            >
              <p className="text-lg text-amber-400">Play as "{username}"</p>
              <Button
                onClick={handleChangeUsername}
                className="mt-2 bg-amber-600 hover:bg-amber-700 text-white"
              >
                Change Username
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex space-x-2"
            >
              <Input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-gray-700 border-gray-600 text-gray-100"
              />
              <Button
                onClick={handleSetUsername}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                Set Username
              </Button>
            </motion.div>
          )}
          {username && !isSettingUsername && (
            <>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Button
                  onClick={handleCreateGame}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white text-lg py-6"
                >
                  Create Game
                </Button>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Button
                  onClick={() => setIsJoinGameOpen(true)}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white text-lg py-6"
                >
                  Join Game
                </Button>
              </motion.div>
            </>
          )}
        </div>
      </div>
      <div className="w-full md:w-1/4 h-1/4 md:h-full">
        {/* <ThreeJSModel modelPath="/models/cards.glb" /> */}
      </div>
      <JoinGameDialog
        isOpen={isJoinGameOpen}
        onClose={() => setIsJoinGameOpen(false)}
        onJoin={handleJoinGame}
      />
    </div>
  );
}
