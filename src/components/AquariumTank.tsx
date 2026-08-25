import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FishModel } from '../types';
import { FractionDisplay } from './FractionDisplay';
import { Fish } from './Fish';
import { Sparkles, Trophy, Info } from 'lucide-react';

interface AquariumTankProps {
  caughtFishList: FishModel[];
  targetCount?: number;
  totalAttempts?: number;
  currentRound: number;
  onSelectCaughtFish?: (fish: FishModel) => void;
}

export const AquariumTank: React.FC<AquariumTankProps> = ({
  caughtFishList,
  targetCount = 15,
  totalAttempts = 20,
  currentRound,
  onSelectCaughtFish,
}) => {
  const [inspectedFish, setInspectedFish] = useState<FishModel | null>(null);

  const caughtCount = caughtFishList.length;
  const progressPercent = Math.min(100, Math.round((caughtCount / targetCount) * 100));
  const isGoalReached = caughtCount >= targetCount;

  return (
    <div className="w-full relative z-20" id="aquarium-tank-container">
      {/* Top Header of Aquarium / Progress */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 bg-sky-900/90 border-t-2 border-x-2 border-sky-400/60 rounded-t-2xl backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="text-xl">🪸</span>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-1.5">
              <span>내 수족관 어항</span>
              {isGoalReached && (
                <span className="bg-amber-400 text-amber-950 text-xs font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                  <Trophy className="w-3 h-3" /> 목표 달성!
                </span>
              )}
            </h3>
            <p className="text-xs text-sky-200">
              낚은 물고기가 헤엄치는 나만의 어항이에요
            </p>
          </div>
        </div>

        {/* Catch Goal Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 text-xs sm:text-sm font-bold text-white">
              <span className="text-sky-300">낚은 물고기:</span>
              <span className="text-amber-300 text-base sm:text-lg font-black">{caughtCount}</span>
              <span className="text-slate-300">/ {targetCount}마리 목표</span>
              <span className="text-xs text-sky-400 font-normal ml-1">
                (현재 {Math.min(20, currentRound)}/20회)
              </span>
            </div>

            {/* Mini Progress Bar */}
            <div className="w-36 sm:w-48 h-2.5 bg-slate-900/80 rounded-full overflow-hidden border border-sky-500/50 mt-0.5">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  isGoalReached
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-300'
                    : 'bg-gradient-to-r from-sky-400 to-emerald-400'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Glass Tank Area */}
      <div className="relative w-full h-32 sm:h-40 bg-gradient-to-b from-sky-800/80 via-sky-900/90 to-slate-950 border-2 border-sky-400/60 rounded-b-2xl overflow-hidden shadow-2xl backdrop-blur-md">
        {/* Glass reflection highlight */}
        <div className="absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-white/20 to-transparent pointer-events-none z-10" />

        {/* Swaying Seaweed Left & Right */}
        <div className="absolute bottom-0 left-3 z-0 opacity-70 pointer-events-none">
          <svg width="40" height="70" viewBox="0 0 40 70">
            <path
              d="M 10 70 Q 20 40 10 20 Q 5 10 15 0"
              stroke="#10b981"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 25 70 Q 15 45 25 25 Q 30 15 20 5"
              stroke="#059669"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="absolute bottom-0 right-4 z-0 opacity-70 pointer-events-none">
          <svg width="40" height="70" viewBox="0 0 40 70">
            <path
              d="M 30 70 Q 15 40 25 20 Q 30 10 20 0"
              stroke="#059669"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 15 70 Q 25 45 15 25 Q 10 15 20 5"
              stroke="#10b981"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Sandy Bottom Floor with Starfish */}
        <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-amber-700/80 via-amber-600/60 to-transparent z-0 pointer-events-none" />
        <div className="absolute bottom-1 left-24 text-sm opacity-80 pointer-events-none">⭐</div>
        <div className="absolute bottom-1 right-28 text-sm opacity-80 pointer-events-none">🐚</div>

        {/* Bubble particles inside tank */}
        <div className="absolute bottom-2 left-1/4 w-2 h-2 rounded-full bg-white/40 animate-bubble" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-2 left-3/4 w-3 h-3 rounded-full bg-white/30 animate-bubble" style={{ animationDuration: '5.5s', animationDelay: '1s' }} />
        <div className="absolute bottom-2 left-1/2 w-1.5 h-1.5 rounded-full bg-white/50 animate-bubble" style={{ animationDuration: '3.5s', animationDelay: '2s' }} />

        {/* Caught Fish Swimming in the Tank */}
        {caughtFishList.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4 relative z-10">
            <p className="text-sky-200 text-sm sm:text-base font-bold flex items-center gap-1.5">
              <span>🐟</span> 아직 낚은 물고기가 없어요!
            </p>
            <p className="text-xs text-sky-400 mt-1">
              바다에서 더 큰 분수 물고기를 클릭해 낚아보세요 (15마리 이상 잡으면 스테이지 클리어!)
            </p>
          </div>
        ) : (
          <div className="h-full relative overflow-x-auto overflow-y-hidden flex items-center px-4 py-2 gap-3 z-10 scrollbar-thin scrollbar-thumb-sky-600">
            {caughtFishList.map((fish, index) => {
              const isSelected = inspectedFish?.id === fish.id;

              return (
                <motion.div
                  key={`tank-fish-${fish.id}-${index}`}
                  initial={{ scale: 0, y: -20, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  whileHover={{ scale: 1.15, y: -4 }}
                  onClick={() => {
                    setInspectedFish(fish);
                    if (onSelectCaughtFish) onSelectCaughtFish(fish);
                  }}
                  className={`flex-shrink-0 cursor-pointer flex flex-col items-center p-1.5 rounded-xl transition-all duration-200 ${
                    isSelected
                      ? 'bg-sky-700/80 ring-2 ring-amber-400 shadow-lg'
                      : 'hover:bg-sky-800/60'
                  }`}
                  title={`${fish.name} (클릭하여 분수 확인)`}
                >
                  {/* Miniature fish badge */}
                  <div className="scale-75 origin-bottom">
                    <FractionDisplay fraction={fish.fraction} size="sm" variant="gold" />
                  </div>

                  {/* Fish Preview */}
                  <div className="w-16 h-10 mt-0.5">
                    <Fish fish={fish} status="in_tank" isSwimming={true} disabled={true} />
                  </div>

                  <span className="text-[10px] text-sky-200 font-bold mt-0.5 bg-sky-950/60 px-1.5 py-0.2 rounded-full whitespace-nowrap">
                    {fish.name}
                  </span>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Inspected Fish Popover Dialog if user clicked a tank fish */}
      <AnimatePresence>
        {inspectedFish && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 sm:w-80 bg-slate-900/95 text-white p-3 rounded-2xl border-2 border-amber-400 shadow-2xl z-40 backdrop-blur-md"
          >
            <div className="flex items-center justify-between border-b border-slate-700 pb-1.5 mb-2">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> 낚은 물고기 정보
              </span>
              <button
                onClick={() => setInspectedFish(null)}
                className="text-slate-400 hover:text-white text-xs px-1.5 py-0.5 rounded-md bg-slate-800"
              >
                ✕ 닫기
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-sky-950/80 rounded-xl border border-sky-600/50">
                <FractionDisplay fraction={inspectedFish.fraction} size="md" variant="gold" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{inspectedFish.name}</p>
                <p className="text-xs text-emerald-300 font-semibold mt-0.5">
                  ✓ 성공적으로 낚은 분수!
                </p>
                <p className="text-[11px] text-slate-300 mt-1">
                  전체 {inspectedFish.fraction.denominator}조각 중 {inspectedFish.fraction.numerator}조각 크기
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
