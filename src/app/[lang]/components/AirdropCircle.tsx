import { motion } from 'framer-motion';

export default function AirdropCircle() {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
        repeat: Infinity,
        repeatType: "reverse"
      }}
      className="relative w-16 h-16 mb-4"
    >
      {/* Outer glowing circle */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 animate-pulse" />
      
      {/* Inner circle */}
      <div className="absolute inset-1 rounded-full bg-gray-900 flex items-center justify-center">
        <span className="text-white font-bold text-sm">Airdrop</span>
      </div>
      
      {/* Pulsing ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-blue-500"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
} 