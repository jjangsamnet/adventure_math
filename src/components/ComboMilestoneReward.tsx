import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Flame, Zap, Crown, Sparkles, Star } from 'lucide-react';

export interface MilestoneData {
  streak: number;
  multiplier: number;
  title: string;
  subtitle: string;
  colorScheme: 'gold' | 'purple' | 'rainbow';
  pointsPreview: string;
}

interface ComboMilestoneRewardProps {
  milestone: MilestoneData | null;
  onDismiss: () => void;
}

export const getMilestoneData = (combo: number): MilestoneData | null => {
  if (combo === 15) {
    return {
      streak: 15,
      multiplier: 5,
      title: '👑 전설의 낚시왕 등극!',
      subtitle: '15연속 정답 돌파! 5배 점수 슈퍼 피버 발동!',
      colorScheme: 'rainbow',
      pointsPreview: '+500점 (5X 점수 보너스)',
    };
  }
  if (combo === 10) {
    return {
      streak: 10,
      multiplier: 3,
      title: '🔥 10연속 폭풍 낚시 성공!',
      subtitle: '멈출 수 없는 기세! 3배 점수 메가 피버 발동!',
      colorScheme: 'purple',
      pointsPreview: '+300점 (3X 점수 보너스)',
    };
  }
  if (combo === 5) {
    return {
      streak: 5,
      multiplier: 2,
      title: '⚡ 5연속 콤보 달성!',
      subtitle: '집중력 최고! 2배 점수 피버 모드 발동!',
      colorScheme: 'gold',
      pointsPreview: '+200점 (2X 점수 보너스)',
    };
  }
  return null;
};

export const getActiveMultiplier = (combo: number): number => {
  if (combo >= 15) return 5;
  if (combo >= 10) return 3;
  if (combo >= 5) return 2;
  return 1;
};

export const ComboMilestoneReward: React.FC<ComboMilestoneRewardProps> = ({
  milestone,
  onDismiss,
}) => {
  useEffect(() => {
    if (!milestone) return;

    // Trigger explosive celebratory confetti burst
    if (milestone.streak >= 15) {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#fbbf24', '#f43f5e', '#38bdf8', '#a855f7', '#34d399'],
      });
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 60,
          origin: { x: 0.1, y: 0.6 },
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 60,
          origin: { x: 0.9, y: 0.6 },
        });
      }, 250);
    } else if (milestone.streak >= 10) {
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#a855f7', '#ec4899', '#38bdf8', '#fbbf24'],
      });
    } else if (milestone.streak >= 5) {
      confetti({
        particleCount: 45,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#fbbf24', '#f59e0b', '#38bdf8'],
      });
    }

    // Auto dismiss after 2.2 seconds
    const timer = setTimeout(() => {
      onDismiss();
    }, 2200);

    return () => clearTimeout(timer);
  }, [milestone, onDismiss]);

  if (!milestone) return null;

  const bgStyles = {
    gold: 'from-amber-500/95 via-yellow-600/95 to-amber-700/95 border-amber-300 shadow-amber-500/50',
    purple: 'from-purple-600/95 via-pink-600/95 to-indigo-700/95 border-pink-300 shadow-purple-500/50',
    rainbow: 'from-rose-600/95 via-amber-500/95 to-cyan-600/95 border-yellow-200 shadow-yellow-400/60',
  }[milestone.colorScheme];

  const badgeIcon = {
    5: <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-amber-950 animate-bounce" />,
    10: <Flame className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-pulse" />,
    15: <Crown className="w-8 h-8 sm:w-10 sm:h-10 text-amber-950 animate-bounce" />,
  }[milestone.streak] || <Sparkles className="w-8 h-8 text-yellow-300" />;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm pointer-events-auto"
        onClick={onDismiss}
      >
        <motion.div
          initial={{ scale: 0.3, y: 50, opacity: 0, rotate: -8 }}
          animate={{ scale: 1, y: 0, opacity: 1, rotate: 0 }}
          exit={{ scale: 0.8, y: -40, opacity: 0, transition: { duration: 0.25 } }}
          transition={{ type: 'spring', damping: 14, stiffness: 220 }}
          className={`relative max-w-md w-full bg-gradient-to-br ${bgStyles} border-4 rounded-3xl p-6 sm:p-7 text-center text-white shadow-2xl overflow-hidden cursor-pointer select-none`}
        >
          {/* Animated Background Sun Rays */}
          <div className="absolute inset-0 bg-white/10 animate-pulse pointer-events-none" />
          <div className="absolute -top-12 -left-12 w-32 h-32 bg-white/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-white/20 rounded-full blur-2xl pointer-events-none" />

          {/* Floating Stars */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
            className="absolute top-3 left-3 text-yellow-200 text-xl pointer-events-none"
          >
            ★
          </motion.div>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
            className="absolute top-4 right-4 text-yellow-200 text-2xl pointer-events-none"
          >
            ✦
          </motion.div>

          {/* Top Multiplier Orb Badge */}
          <div className="relative z-10 flex justify-center mb-3">
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1, type: 'spring', damping: 10 }}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-yellow-300 via-amber-200 to-white shadow-xl flex flex-col items-center justify-center ring-4 ring-white/60"
            >
              {badgeIcon}
              <span className="text-amber-950 font-black text-xs tracking-wider -mt-1">
                {milestone.streak} COMBO
              </span>
            </motion.div>
          </div>

          {/* Title & Streak */}
          <motion.h2
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-2xl sm:text-3xl font-black text-white drop-shadow-md tracking-tight mb-1"
          >
            {milestone.title}
          </motion.h2>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-yellow-100 font-bold drop-shadow-sm mb-4">
            {milestone.subtitle}
          </p>

          {/* Big Multiplier Pill */}
          <motion.div
            initial={{ scale: 0.6, y: 15 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 0.25, type: 'spring' }}
            className="inline-flex items-center gap-2 bg-slate-950/80 px-4 py-2 rounded-2xl border-2 border-yellow-300/80 shadow-lg text-yellow-300 font-black text-lg sm:text-xl"
          >
            <span className="text-2xl sm:text-3xl font-black text-yellow-400">
              {milestone.multiplier}X
            </span>
            <span className="text-sm sm:text-base text-white font-bold">
              {milestone.pointsPreview}
            </span>
          </motion.div>

          <p className="text-[11px] text-white/80 mt-3 font-semibold">
            (화면을 터치하면 바로 계속 진행됩니다)
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
