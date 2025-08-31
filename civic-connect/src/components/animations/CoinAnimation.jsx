import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, Sparkles } from 'lucide-react';

export default function CoinAnimation({ isVisible, coinsEarned, onComplete }) {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowAnimation(true);
      // Auto hide after 3 seconds
      const timer = setTimeout(() => {
        setShowAnimation(false);
        onComplete && onComplete();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {showAnimation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/20"
          />
          
          {/* Main Animation Container */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1.2, 1],
              opacity: 1,
              rotate: [0, 10, -10, 0]
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: "backOut" }}
            className="relative"
          >
            {/* Sparkles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  x: [0, Math.cos(i * 45 * Math.PI / 180) * 60],
                  y: [0, Math.sin(i * 45 * Math.PI / 180) * 60],
                }}
                transition={{ 
                  duration: 2,
                  delay: 0.3 + i * 0.1,
                  ease: "easeOut"
                }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              >
                <Sparkles className="w-6 h-6 text-yellow-400" />
              </motion.div>
            ))}
            
            {/* Main Coin Circle */}
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 0.5, repeat: Infinity, repeatType: "reverse" }
              }}
              className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-yellow-300"
            >
              <Coins className="w-12 h-12 text-white" />
            </motion.div>
            
            {/* Coins Earned Text */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
                className="text-3xl font-bold text-yellow-600 mb-2"
              >
                +{coinsEarned}
              </motion.div>
              <div className="text-lg text-gray-700 font-medium">
                Civic Coins Earned!
              </div>
            </motion.div>
            
            {/* Floating Coins */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={`coin-${i}`}
                initial={{ 
                  scale: 0,
                  x: 0,
                  y: 0,
                  opacity: 0
                }}
                animate={{
                  scale: [0, 1, 0.8],
                  x: [0, (Math.random() - 0.5) * 200],
                  y: [0, -100 - Math.random() * 50],
                  opacity: [0, 1, 0],
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 2.5,
                  delay: 0.8 + i * 0.2,
                  ease: "easeOut"
                }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                  <Coins className="w-4 h-4 text-white" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}