import { motion } from "framer-motion";

interface RevealCardProps {
  card: string | null;
  isRevealed: boolean;
}

export function RevealCard({ card, isRevealed }: RevealCardProps) {
  return (
    <motion.div
      className="w-28 h-40 bg-white rounded-lg shadow-lg flex items-center justify-center cursor-pointer"
      animate={{ rotateY: isRevealed ? 180 : 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="absolute w-full h-full backface-hidden"
        animate={{ opacity: isRevealed ? 0 : 1 }}
      >
        <div className="w-full h-full bg-red-500 rounded-lg flex items-center justify-center">
          <span className="text-4xl text-white">?</span>
        </div>
      </motion.div>
      <motion.div
        className="absolute w-full h-full backface-hidden"
        animate={{ opacity: isRevealed ? 1 : 0 }}
        style={{ transform: "rotateY(180deg)" }}
      >
        <div className="w-full h-full bg-white rounded-lg flex items-center justify-center">
          <span className="text-4xl font-bold text-gray-800">{card}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
