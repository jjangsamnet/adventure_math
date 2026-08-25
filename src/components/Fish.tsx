import React from 'react';
import { motion } from 'motion/react';
import { FishModel } from '../types';
import { FractionDisplay } from './FractionDisplay';

interface FishProps {
  fish: FishModel;
  isSwimming?: boolean;
  status?: 'swimming' | 'hooked' | 'escaping' | 'in_tank';
  onClick?: () => void;
  disabled?: boolean;
  isHintActive?: boolean;
}

export const Fish: React.FC<FishProps> = ({
  fish,
  isSwimming = true,
  status = 'swimming',
  onClick,
  disabled = false,
  isHintActive = false,
}) => {
  const isFacingLeft = fish.direction === 'left';

  // SVG Fish Drawings based on species
  const renderFishIllustration = () => {
    switch (fish.species) {
      case 'clownfish': // 니모
        return (
          <svg viewBox="0 0 200 120" className="w-full h-full drop-shadow-md overflow-visible">
            {/* Tail */}
            <motion.path
              d="M 35 60 C 15 30 5 25 5 45 C 5 60 10 65 5 75 C 5 95 15 90 35 60 Z"
              fill={fish.primaryColor}
              stroke="#1e293b"
              strokeWidth="3"
              className="animate-tail"
            />
            {/* Tail Stripe */}
            <path d="M 25 45 C 20 55 20 65 25 75" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
            <path d="M 27 45 C 22 55 22 65 27 75" stroke="#1e293b" strokeWidth="2" fill="none" />

            {/* Dorsal Fin */}
            <path
              d="M 80 32 C 100 10 140 15 155 35 C 130 30 100 30 80 32 Z"
              fill={fish.primaryColor}
              stroke="#1e293b"
              strokeWidth="3"
            />
            <path d="M 120 18 C 122 28 123 32 120 34" stroke="#ffffff" strokeWidth="4" />

            {/* Pectoral Fin */}
            <motion.path
              d="M 110 70 C 95 90 85 90 90 75 Z"
              fill={fish.primaryColor}
              stroke="#1e293b"
              strokeWidth="2.5"
              animate={{ rotate: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            />

            {/* Fish Body */}
            <ellipse
              cx="115"
              cy="60"
              rx="75"
              ry="42"
              fill={fish.primaryColor}
              stroke="#1e293b"
              strokeWidth="3.5"
            />

            {/* White Stripes */}
            <path
              d="M 85 24 C 80 40 80 80 85 96 C 96 92 98 28 85 24 Z"
              fill="#ffffff"
              stroke="#1e293b"
              strokeWidth="2"
            />
            <path
              d="M 130 20 C 125 40 125 80 130 100 C 140 98 142 22 130 20 Z"
              fill="#ffffff"
              stroke="#1e293b"
              strokeWidth="2"
            />

            {/* Eye */}
            <circle cx="165" cy="50" r="10" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" />
            <circle
              cx={status === 'escaping' ? 168 : 167}
              cy={status === 'escaping' ? 48 : 50}
              r={status === 'escaping' ? 6 : 5}
              fill="#0f172a"
            />
            <circle cx="169" cy="48" r="2" fill="#ffffff" />

            {/* Cute Mouth */}
            <path
              d={status === 'escaping' ? 'M 188 62 Q 182 66 186 70' : 'M 185 62 Q 180 58 186 56'}
              stroke="#1e293b"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        );

      case 'angelfish': // 엔젤피쉬
        return (
          <svg viewBox="0 0 200 140" className="w-full h-full drop-shadow-md overflow-visible">
            {/* Tail */}
            <motion.path
              d="M 40 70 C 15 50 5 45 5 70 C 5 95 15 90 40 70 Z"
              fill={fish.secondaryColor}
              stroke="#0891b2"
              strokeWidth="2.5"
              className="animate-tail"
            />

            {/* Top Long Tall Fin */}
            <path
              d="M 100 50 C 90 10 115 2 120 5 C 125 15 118 40 115 50 Z"
              fill={fish.secondaryColor}
              stroke="#0891b2"
              strokeWidth="2.5"
            />

            {/* Bottom Long Fin */}
            <path
              d="M 100 90 C 85 130 95 138 100 135 C 108 125 110 100 115 90 Z"
              fill={fish.secondaryColor}
              stroke="#0891b2"
              strokeWidth="2.5"
            />

            {/* Diamond Body */}
            <path
              d="M 40 70 C 70 30 130 35 175 70 C 130 105 70 110 40 70 Z"
              fill={fish.primaryColor}
              stroke="#0891b2"
              strokeWidth="3.5"
            />

            {/* Vertical decorative stripes */}
            <path d="M 80 45 Q 85 70 80 95" stroke="#facc15" strokeWidth="6" strokeLinecap="round" />
            <path d="M 115 38 Q 120 70 115 102" stroke="#facc15" strokeWidth="7" strokeLinecap="round" />
            <path d="M 145 48 Q 148 70 145 92" stroke="#facc15" strokeWidth="5" strokeLinecap="round" />

            {/* Eye */}
            <circle cx="158" cy="62" r="9" fill="#ffffff" stroke="#0891b2" strokeWidth="2" />
            <circle cx="160" cy="62" r="5" fill="#0f172a" />
            <circle cx="162" cy="60" r="1.5" fill="#ffffff" />

            {/* Mouth */}
            <path d="M 175 70 Q 170 72 176 74" stroke="#0891b2" strokeWidth="2.5" fill="none" />
          </svg>
        );

      case 'blowfish': // 복어
        return (
          <svg viewBox="0 0 200 130" className="w-full h-full drop-shadow-md overflow-visible">
            {/* Small Tail */}
            <motion.path
              d="M 35 65 C 15 50 15 80 35 65 Z"
              fill={fish.secondaryColor}
              stroke="#6b21a8"
              strokeWidth="2.5"
              className="animate-tail"
            />

            {/* Spikes / dots */}
            <circle cx="70" cy="40" r="3" fill="#6b21a8" />
            <circle cx="95" cy="35" r="3.5" fill="#6b21a8" />
            <circle cx="120" cy="40" r="3" fill="#6b21a8" />
            <circle cx="65" cy="85" r="3" fill="#6b21a8" />
            <circle cx="90" cy="95" r="3.5" fill="#6b21a8" />
            <circle cx="125" cy="90" r="3" fill="#6b21a8" />

            {/* Round Puffer Body */}
            <ellipse
              cx="110"
              cy="65"
              rx="68"
              ry="52"
              fill={fish.primaryColor}
              stroke="#6b21a8"
              strokeWidth="3.5"
            />

            {/* Cute Belly */}
            <path
              d="M 60 75 C 80 110 140 110 160 75 C 130 90 90 90 60 75 Z"
              fill={fish.secondaryColor}
              opacity="0.9"
            />

            {/* Side Fin flapping fast */}
            <motion.path
              d="M 115 65 C 100 75 95 85 105 85 Z"
              fill={fish.secondaryColor}
              stroke="#6b21a8"
              strokeWidth="2"
              animate={{ rotate: [-20, 20, -20] }}
              transition={{ repeat: Infinity, duration: 0.6 }}
            />

            {/* Big cute Round Eye */}
            <circle cx="155" cy="55" r="11" fill="#ffffff" stroke="#6b21a8" strokeWidth="2.5" />
            <circle
              cx={status === 'escaping' ? 158 : 156}
              cy={status === 'escaping' ? 53 : 55}
              r={status === 'escaping' ? 7 : 5.5}
              fill="#0f172a"
            />
            <circle cx="158" cy="53" r="2.5" fill="#ffffff" />

            {/* Pouting cute lips */}
            <ellipse cx="178" cy="65" rx="5" ry="6" fill="#f43f5e" stroke="#6b21a8" strokeWidth="2" />
          </svg>
        );

      case 'goldfish': // 황금 물고기
        return (
          <svg viewBox="0 0 200 120" className="w-full h-full drop-shadow-md overflow-visible">
            {/* Big Fancy Wavy Gold Tail */}
            <motion.path
              d="M 40 60 C 10 20 0 10 10 40 C 0 50 5 70 0 85 C 0 110 15 95 40 60 Z"
              fill={fish.secondaryColor}
              stroke="#b45309"
              strokeWidth="2.5"
              className="animate-tail"
            />
            {/* Wavy Top Fin */}
            <path
              d="M 75 35 C 95 15 130 18 145 35 Z"
              fill={fish.secondaryColor}
              stroke="#b45309"
              strokeWidth="2"
            />

            {/* Body */}
            <ellipse
              cx="110"
              cy="60"
              rx="70"
              ry="40"
              fill={fish.primaryColor}
              stroke="#b45309"
              strokeWidth="3.5"
            />

            {/* Sparkle scales */}
            <path d="M 85 55 Q 90 60 85 65" stroke="#fef08a" strokeWidth="3" fill="none" />
            <path d="M 105 48 Q 110 53 105 58" stroke="#fef08a" strokeWidth="3" fill="none" />
            <path d="M 125 55 Q 130 60 125 65" stroke="#fef08a" strokeWidth="3" fill="none" />

            {/* Eye */}
            <circle cx="158" cy="50" r="9" fill="#ffffff" stroke="#b45309" strokeWidth="2" />
            <circle cx="160" cy="50" r="5" fill="#0f172a" />
            <circle cx="162" cy="48" r="2" fill="#ffffff" />

            {/* Smile */}
            <path d="M 175 62 Q 170 65 174 68" stroke="#b45309" strokeWidth="2.5" fill="none" />
          </svg>
        );

      case 'bluetang': // 블루탱
      case 'rainbow':
      case 'seahorse':
      default:
        return (
          <svg viewBox="0 0 200 120" className="w-full h-full drop-shadow-md overflow-visible">
            {/* Tail */}
            <motion.path
              d="M 35 60 C 10 30 10 90 35 60 Z"
              fill={fish.secondaryColor}
              stroke={fish.accentColor}
              strokeWidth="2.5"
              className="animate-tail"
            />
            {/* Top fin */}
            <path
              d="M 70 30 C 110 10 140 25 150 35 Z"
              fill={fish.secondaryColor}
              stroke={fish.accentColor}
              strokeWidth="2"
            />
            {/* Body */}
            <ellipse
              cx="110"
              cy="60"
              rx="72"
              ry="40"
              fill={fish.primaryColor}
              stroke={fish.accentColor}
              strokeWidth="3.5"
            />
            {/* Decorative pattern */}
            <path
              d="M 65 40 C 95 60 130 50 155 70"
              stroke={fish.secondaryColor}
              strokeWidth="8"
              strokeLinecap="round"
              fill="none"
            />
            {/* Eye */}
            <circle cx="160" cy="50" r="9" fill="#ffffff" stroke={fish.accentColor} strokeWidth="2" />
            <circle
              cx={status === 'escaping' ? 163 : 161}
              cy={status === 'escaping' ? 48 : 50}
              r={status === 'escaping' ? 6 : 5}
              fill="#0f172a"
            />
            <circle cx="162" cy="48" r="2" fill="#ffffff" />
            {/* Mouth */}
            <path d="M 178 60 Q 172 63 176 66" stroke={fish.accentColor} strokeWidth="2.5" fill="none" />
          </svg>
        );
    }
  };

  return (
    <div
      className={`relative select-none ${
        disabled ? 'pointer-events-none' : 'cursor-pointer'
      } transition-transform duration-200`}
      onClick={!disabled ? onClick : undefined}
      id={`fish-target-${fish.id}`}
    >
      {/* Swimming Container with motion */}
      <motion.div
        className="relative flex flex-col items-center justify-center group"
        animate={
          status === 'reeling'
            ? {
                y: -180,
                scale: 1.15,
                rotate: isFacingLeft ? 25 : -25,
                transition: { duration: 0.8, ease: 'easeOut' },
              }
            : status === 'escaping'
            ? {
                x: isFacingLeft ? -300 : 300,
                y: -40,
                opacity: 0,
                scale: 0.8,
                transition: { duration: 0.6, ease: 'easeIn' },
              }
            : status === 'in_tank'
            ? {
                y: [0, -4, 0],
                transition: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' },
              }
            : {
                y: [0, -10, 0],
                transition: { repeat: Infinity, duration: 3, ease: 'easeInOut' },
              }
        }
        whileHover={
          status === 'swimming' && !disabled
            ? {
                scale: 1.08,
                filter: 'drop-shadow(0 0 16px rgba(56, 189, 248, 0.9))',
              }
            : {}
        }
        whileTap={
          status === 'swimming' && !disabled
            ? {
                scale: 0.95,
              }
            : {}
        }
      >
        {/* Thought Bubble / Big Readable Fraction Badge */}
        <div className="relative z-20 mb-2 transform -translate-y-1">
          <div
            className={`transition-all duration-300 ${
              isHintActive ? 'ring-4 ring-amber-400 ring-offset-2 rounded-2xl animate-pulse' : ''
            }`}
          >
            <FractionDisplay fraction={fish.fraction} size="lg" variant="bubble" />
          </div>

          {/* Little Pointer arrow down to fish */}
          <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-sky-400 mx-auto -mt-0.5" />
        </div>

        {/* Fish Vector Body */}
        <div
          className={`relative w-44 sm:w-56 md:w-64 h-28 sm:h-36 ${
            isFacingLeft ? 'scale-x-[-1]' : 'scale-x-100'
          }`}
        >
          {renderFishIllustration()}

          {/* Escaping Water Splash text bubble */}
          {status === 'escaping' && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute -top-6 left-1/2 -translate-x-1/2 bg-rose-500 text-white text-xs font-black px-2 py-1 rounded-full whitespace-nowrap shadow-lg"
            >
              도망가자~! 💦
            </motion.div>
          )}

          {/* Reeling Success Sparkle Text */}
          {status === 'reeling' && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              className="absolute -top-8 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-950 text-sm font-black px-3 py-1 rounded-full whitespace-nowrap shadow-xl border-2 border-amber-300"
            >
              🎉 낚았다! +100점
            </motion.div>
          )}
        </div>

        {/* Subtle Water shadow beneath swimming fish */}
        {status === 'swimming' && (
          <div className="w-32 h-4 bg-black/20 rounded-full blur-sm mt-1 transform scale-y-50" />
        )}
      </motion.div>
    </div>
  );
};
