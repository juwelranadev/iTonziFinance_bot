import React from 'react';
import { motion } from 'framer-motion';

const AirdropPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0B0E11] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-white mb-4">Airdrop</h1>
        <p className="text-xl text-gray-400">Coming Soon</p>
      </motion.div>
    </div>
  );
};

export default AirdropPage; 