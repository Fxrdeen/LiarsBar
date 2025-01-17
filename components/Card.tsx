import { motion } from "framer-motion";

interface CardProps {
  value: string;
  isVisible: boolean;
  isVertical?: boolean;
}

export function Card({ value, isVisible, isVertical = false }: CardProps) {
  return (
    <motion.div
      className={`
        ${isVertical ? "w-14 h-20" : "w-20 h-28"} 
        bg-white rounded-md shadow-md flex items-center justify-center 
        relative overflow-hidden cursor-pointer
        hover:shadow-lg transition-shadow duration-200
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {isVisible ? (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <span
            className={`${
              isVertical ? "text-xl" : "text-2xl"
            } font-bold text-gray-800`}
          >
            {value}
          </span>
          <span
            className={`text-sm text-gray-600 absolute ${
              isVertical ? "bottom-0.5" : "bottom-1"
            }`}
          >
            ♠♥♣♦
          </span>
        </div>
      ) : (
        <div className="w-full h-full bg-red-500 rounded-md flex items-center justify-center">
          <div
            className={`
            ${isVertical ? "w-10 h-16" : "w-16 h-24"} 
            border-2 border-white/50 rounded 
            bg-gradient-to-br from-red-600 to-red-400
          `}
          />
        </div>
      )}
    </motion.div>
  );
}
