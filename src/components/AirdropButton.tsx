import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const AirdropButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-24 right-4 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
      onClick={() => navigate('/airdrop')}
    >
      Airdrop
    </motion.button>
  );
};

export default AirdropButton; 