import React from 'react';
import { motion } from 'motion/react';

interface FishingRodProps {
  isFishing: boolean;
  targetXPercent: number; // 0 to 100
  targetYPercent: number; // 0 to 100
  isSuccess: boolean;
}

export const FishingRod: React.FC<FishingRodProps> = ({
  isFishing,
  targetXPercent,
  targetYPercent,
  isSuccess,
}) => {
  if (!isFishing) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
      {/* Fishing Line */}
      <motion.svg
        className="w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Line from top center boat to fish mouth */}
        <motion.line
          x1="50%"
          y1="0%"
          x2={`${targetXPercent}%`}
          y2={`${targetYPercent}%`}
          stroke="#e2e8f0"
          strokeWidth="2.5"
          strokeDasharray="4 2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        />
      </motion.svg>

      {/* Golden Fishing Hook */}
      <motion.div
        className="absolute"
        style={{
          left: `${targetXPercent}%`,
          top: `${targetYPercent}%`,
          transform: 'translate(-50%, -50%)',
        }}
        initial={{ scale: 0, y: -50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.3, type: 'spring' }}
      >
        <svg viewBox="0 0 40 40" className="w-10 h-10 drop-shadow-lg">
          {/* Hook shape */}
          <path
            d="M 20 5 L 20 22 C 20 30 10 30 10 22 C 10 18 15 18 16 20"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <circle cx="20" cy="5" r="3" fill="#d97706" />
          {/* Splash particles if bite */}
          {isSuccess && (
            <>
              <circle cx="12" cy="18" r="2" fill="#38bdf8" className="animate-ping" />
              <circle cx="26" cy="24" r="2" fill="#facc15" className="animate-ping" />
            </>
          )}
        </svg>
      </motion.div>
    </div>
  );
};
