import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { CatchRecord } from '../types';
import { FractionDisplay } from './FractionDisplay';
import { FractionVisualizer } from './FractionVisualizer';
import {
  Trophy,
  RotateCcw,
  Sparkles,
  Award,
  ChevronRight,
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Flame,
} from 'lucide-react';

interface StageResultModalProps {
  records: CatchRecord[];
  score: number;
  maxCombo?: number;
  stageLevel: number;
  onRestart: () => void;
  onNextStage?: () => void;
}

export const StageResultModal: React.FC<StageResultModalProps> = ({
  records,
  score,
  maxCombo = 0,
  stageLevel,
  onRestart,
  onNextStage,
}) => {
  const caughtCount = records.filter((r) => r.isCorrect).length;
  const isCleared = caughtCount >= 15;
  const [selectedRecord, setSelectedRecord] = useState<CatchRecord | null>(
    records.length > 0 ? records[0] : null
  );

  // Trigger celebration confetti if cleared
  useEffect(() => {
    if (isCleared) {
      const duration = 2.5 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: ['#38bdf8', '#fbbf24', '#34d399', '#f43f5e'],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: ['#38bdf8', '#fbbf24', '#34d399', '#f43f5e'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [isCleared]);

  // Star calculation
  // 15-16 = 1 star, 17-19 = 2 stars, 20 = 3 stars
  const starCount = caughtCount >= 20 ? 3 : caughtCount >= 17 ? 2 : caughtCount >= 15 ? 1 : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-3xl bg-gradient-to-b from-sky-900 to-slate-900 border-2 border-sky-400 rounded-3xl p-5 sm:p-8 shadow-2xl text-white relative my-auto"
      >
        {/* Top Banner / Celebration */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-amber-950 mb-3 shadow-xl ring-4 ring-yellow-400/40">
            {isCleared ? (
              <Trophy className="w-10 h-10 sm:w-12 sm:h-12" />
            ) : (
              <RotateCcw className="w-10 h-10 sm:w-12 sm:h-12 text-slate-800" />
            )}
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-sky-200 tracking-tight">
            {isCleared ? '🎉 스테이지 클리어! 🎉' : '아쉬워요! 다시 도전해볼까요?'}
          </h2>

          <p className="text-sm sm:text-base text-sky-200 mt-1 font-semibold">
            {isCleared
              ? `20마리 중 ${caughtCount}마리의 큰 분수 물고기를 낚아 어항을 채웠어요!`
              : `목표(15마리) 중 ${caughtCount}마리를 잡았어요. 조금만 더 연습하면 통과할 수 있어요!`}
          </p>

          {/* Star rating */}
          {isCleared && (
            <div className="flex items-center justify-center gap-2 mt-3">
              {[1, 2, 3].map((starIdx) => (
                <motion.div
                  key={`star-${starIdx}`}
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: starIdx * 0.2 + 0.2, type: 'spring' }}
                  className={`text-3xl sm:text-4xl ${
                    starIdx <= starCount ? 'text-amber-400 drop-shadow-lg' : 'text-slate-600'
                  }`}
                >
                  ★
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Score & Stat Badges (4 Columns including Max Combo) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6">
          <div className="bg-sky-950/70 border border-sky-600/40 rounded-2xl p-3 text-center">
            <span className="text-xs text-sky-300 font-bold block">최종 점수</span>
            <span className="text-lg sm:text-2xl font-black text-amber-300 mt-0.5 block">
              {score}점
            </span>
          </div>

          <div className="bg-sky-950/70 border border-sky-600/40 rounded-2xl p-3 text-center">
            <span className="text-xs text-sky-300 font-bold block">낚은 물고기</span>
            <span className="text-lg sm:text-2xl font-black text-emerald-400 mt-0.5 block">
              {caughtCount} <span className="text-xs text-slate-400 font-normal">/ 20</span>
            </span>
          </div>

          <div className="bg-sky-950/70 border border-sky-600/40 rounded-2xl p-3 text-center">
            <span className="text-xs text-sky-300 font-bold block">최대 연속 콤보</span>
            <span className="text-lg sm:text-2xl font-black text-rose-400 mt-0.5 block flex items-center justify-center gap-1">
              <Flame className="w-5 h-5 text-amber-400" />
              <span>{maxCombo}연속</span>
            </span>
          </div>

          <div className="bg-sky-950/70 border border-sky-600/40 rounded-2xl p-3 text-center">
            <span className="text-xs text-sky-300 font-bold block">정답률</span>
            <span className="text-lg sm:text-2xl font-black text-sky-300 mt-0.5 block">
              {Math.round((caughtCount / 20) * 100)}%
            </span>
          </div>
        </div>

        {/* Combo Milestone Achievement Banner if achieved */}
        {maxCombo >= 5 && (
          <div className="mb-5 p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-purple-500/20 border border-yellow-400/40 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">
                {maxCombo >= 15 ? '👑' : maxCombo >= 10 ? '🔥' : '⚡'}
              </span>
              <div className="text-left text-xs sm:text-sm">
                <span className="font-black text-yellow-300 block">
                  {maxCombo >= 15
                    ? '15연속 전설의 낚시왕 (5X 배수) 달성!'
                    : maxCombo >= 10
                    ? '10연속 메가 피버 (3X 배수) 달성!'
                    : '5연속 피버 모드 (2X 배수) 달성!'}
                </span>
                <span className="text-slate-300 text-xs">
                  연속 정답으로 엄청난 보너스 점수를 획득했습니다.
                </span>
              </div>
            </div>
            <span className="bg-yellow-400 text-amber-950 text-xs font-black px-2.5 py-1 rounded-xl whitespace-nowrap">
              {maxCombo >= 15 ? '5X FEVER' : maxCombo >= 10 ? '3X MEGA' : '2X FEVER'}
            </span>
          </div>
        )}


        {/* Question Review Notebook (오답 노트 & 분수 복습) */}
        <div className="bg-slate-950/80 rounded-2xl p-4 border border-sky-700/50 mb-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
            <h3 className="text-sm sm:text-base font-extrabold text-sky-200 flex items-center gap-1.5">
              <span>📖</span> 20문제 전체 복습하기 (클릭하여 해설 보기)
            </h3>
            <span className="text-xs text-slate-400">
              초록: 낚음 / 빨강: 놓침
            </span>
          </div>

          {/* Horizontal scrollable round buttons */}
          <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-thin scrollbar-thumb-sky-600">
            {records.map((rec, idx) => {
              const isSelected = selectedRecord?.round === rec.round;
              return (
                <button
                  key={`record-btn-${idx}`}
                  onClick={() => setSelectedRecord(rec)}
                  className={`flex-shrink-0 w-9 h-9 rounded-xl font-black text-xs flex items-center justify-center transition-all ${
                    isSelected
                      ? 'ring-2 ring-amber-400 scale-105'
                      : 'opacity-80 hover:opacity-100'
                  } ${
                    rec.isCorrect
                      ? 'bg-emerald-600 text-white shadow-emerald-900/50 shadow-md'
                      : 'bg-rose-600 text-white shadow-rose-900/50 shadow-md'
                  }`}
                  title={`${rec.round}라운드 ${rec.isCorrect ? '성공' : '실패'}`}
                >
                  {rec.round}
                </button>
              );
            })}
          </div>

          {/* Selected Question Detail Card */}
          {selectedRecord && (
            <div className="bg-sky-900/60 rounded-xl p-3 sm:p-4 border border-sky-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-sky-300 bg-sky-950 px-2 py-0.5 rounded-md">
                  {selectedRecord.round}번 문제 : {selectedRecord.problem.categoryTitle}
                </span>
                <span
                  className={`text-xs font-black flex items-center gap-1 px-2 py-0.5 rounded-full ${
                    selectedRecord.isCorrect
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-rose-500/20 text-rose-300'
                  }`}
                >
                  {selectedRecord.isCorrect ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> 낚기 성공 (+100)
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5" /> 물고기 도망감
                    </>
                  )}
                </span>
              </div>

              {/* Fraction Visualizer inside review */}
              <div className="my-2">
                <FractionVisualizer
                  fractionA={selectedRecord.problem.leftFish.fraction}
                  fractionB={selectedRecord.problem.rightFish.fraction}
                  labelA={selectedRecord.problem.leftFish.name}
                  labelB={selectedRecord.problem.rightFish.name}
                />
              </div>

              {/* Friendly Explanation */}
              <div className="mt-2 text-xs sm:text-sm text-amber-200 bg-slate-900/90 p-2.5 rounded-lg border border-amber-400/30 font-medium">
                💡 <strong className="text-amber-300">정답 해설:</strong>{' '}
                {selectedRecord.problem.explanation}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onRestart}
            className="w-full sm:w-auto px-6 py-3.5 bg-sky-700 hover:bg-sky-600 text-white font-extrabold text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" /> 다시 도전하기
          </button>

          {isCleared && onNextStage && (
            <button
              onClick={onNextStage}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-amber-950 font-black text-base rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer ring-2 ring-yellow-200"
            >
              <span>다음 난이도 도전! (Stage {stageLevel + 1})</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
