import { motion } from "framer-motion";
import Image from "next/image";

interface RevealCardProps {
  card: string | null;
  isRevealed: boolean;
}

export function RevealCard({ card, isRevealed }: RevealCardProps) {
  return (
    <motion.div
      className="w-28 h-40 rounded-lg shadow-lg flex items-center justify-center cursor-pointer"
      animate={{ rotateY: isRevealed ? 180 : 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="absolute w-full h-full backface-hidden"
        animate={{ opacity: isRevealed ? 0 : 1 }}
      >
        <div className="w-full h-full bg-red-500 rounded-lg flex items-center justify-center">
          <span className="text-4xl text-white">
            <Image
              src="/card_back.png"
              alt="Question"
              width={100}
              height={100}
            />
          </span>
        </div>
      </motion.div>
      <div className="w-full h-full bg-red-500 rounded-lg flex items-center justify-center">
        {card === "Queen" && (
          <Image src="/queen.png" alt="Queen" width={100} height={100} />
        )}
        {card === "King" && (
          <Image src="/king.png" alt="King" width={100} height={100} />
        )}
        {card === "Ace" && (
          <Image src="/ace.png" alt="Ace" width={100} height={100} />
        )}
      </div>
      <motion.div
        className="absolute w-full h-full backface-hidden"
        animate={{ opacity: isRevealed ? 1 : 0 }}
        style={{ transform: "rotateY(180deg)" }}
      >
        <div className="w-full h-full rounded-lg flex items-center justify-center">
          <div className="absolute top-0 left-0 text-xs"></div>
        </div>
      </motion.div>
    </motion.div>
  );
}
