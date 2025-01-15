"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";

export default function FrontPage() {
  const [isCreatingGame, setIsCreatingGame] = useState(false);
  const [isJoiningGame, setIsJoiningGame] = useState(false);

  const handleCreateGame = () => {
    setIsCreatingGame(true);
    // Add logic for creating a game
  };

  const handleJoinGame = () => {
    setIsJoiningGame(true);
    // Add logic for joining a game
  };

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
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button
              onClick={handleCreateGame}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white text-lg py-6"
              disabled={isCreatingGame}
            >
              {isCreatingGame ? "Creating Game..." : "Create Game"}
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button
              onClick={handleJoinGame}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white text-lg py-6"
              disabled={isJoiningGame}
            >
              {isJoiningGame ? "Joining Game..." : "Join Game"}
            </Button>
          </motion.div>
        </div>
      </div>
      <div className="w-full md:w-1/4 h-1/4 md:h-full">
        {/* <ThreeJSModel modelPath="/models/cards.glb" /> */}
      </div>
    </div>
  );
}
