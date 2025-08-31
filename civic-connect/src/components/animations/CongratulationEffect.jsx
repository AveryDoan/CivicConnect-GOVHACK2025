
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';

const ConfettiPiece = ({ x, y, rotate, color }) => (
  <motion.div
    style={{
      position: 'absolute',
      left: x,
      top: 0,
      width: '8px',
      height: '16px',
      backgroundColor: color,
      borderRadius: '4px',
    }}
    initial={{ y: -20, opacity: 1 }}
    animate={{ y: '100vh', opacity: [1, 1, 0], rotate }}
    transition={{ duration: Math.random() * 2 + 2, ease: 'linear' }}
  />
);

const colors = ['#34D399', '#60A5FA', '#FBBF24', '#F472B6', '#A78BFA'];

export default function CongratulationEffect({ isVisible, onComplete, title, message }) {
  const [show, setShow] = useState(false);
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    if (isVisible) {
      setShow(true);

      const newConfetti = Array.from({ length: 100 }).map((_, i) => ({
        id: i,
        x: `${Math.random() * 100}%`,
        rotate: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
      }));
      setConfetti(newConfetti);

      const timer = setTimeout(() => {
        setShow(false);
        onComplete && onComplete();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/30"
          />

          {/* Confetti */}
          {confetti.map(c => <ConfettiPiece key={c.id} {...c} />)}

          {/* Message Box */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 300 }}
            className="relative bg-white/90 backdrop-blur-lg rounded-2xl p-8 text-center shadow-2xl max-w-sm"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {title || "Congratulations!"}
            </h2>
            <p className="text-gray-600">
              {message || "You've successfully checked in."}
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
