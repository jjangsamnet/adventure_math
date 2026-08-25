import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FishModel,
  Problem,
  CatchRecord,
  GameStatus,
  GameSettings,
} from './types';
import {
  generateAll20Problems,
  getFractionNumberValue,
} from './utils/fractionGenerator';
import {
  playBiteSound,
  playReelSound,
  playCatchSuccessSound,
  playEscapeSound,
  playBubbleSound,
  playStageClearFanfare,
  playLevelFailSound,
  playComboMilestoneSound,
} from './utils/audio';
import { Fish } from './components/Fish';
import { FractionDisplay } from './components/FractionDisplay';
import { FractionVisualizer } from './components/FractionVisualizer';
import { AquariumTank } from './components/AquariumTank';
import { FishingRod } from './components/FishingRod';
import { StageResultModal } from './components/StageResultModal';
import {
  ComboMilestoneReward,
  getMilestoneData,
  getActiveMultiplier,
  MilestoneData,
} from './components/ComboMilestoneReward';
import {
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Trophy,
  Flame,
  CheckCircle,
  XCircle,
  Waves,
  Zap,
  Crown,
  Fish as FishIcon,
} from 'lucide-react';

export default function App() {
  // Game Setup & Settings
  const [stageLevel, setStageLevel] = useState<number>(1);
  const [problems, setProblems] = useState<Problem[]>(() => generateAll20Problems(1));
  const [currentRoundIndex, setCurrentRoundIndex] = useState<number>(0); // 0 to 19 (Round 1 to 20)
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [caughtFishList, setCaughtFishList] = useState<FishModel[]>([]);
  const [records, setRecords] = useState<CatchRecord[]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);
  const [activeMilestone, setActiveMilestone] = useState<MilestoneData | null>(null);

  // Settings
  const [settings, setSettings] = useState<GameSettings>({
    soundEnabled: true,
    musicEnabled: true,
    showVisualHint: false,
    highContrastMode: false,
  });

  // Active interaction animation states
  const [selectedFishId, setSelectedFishId] = useState<string | null>(null);
  const [lastSelectedCorrect, setLastSelectedCorrect] = useState<boolean | null>(null);
  const [rodTarget, setRodTarget] = useState<{ x: number; y: number } | null>(null);
  const [floatingScoreEffect, setFloatingScoreEffect] = useState<{
    points: number;
    multiplier: number;
    text: string;
  } | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{
    text: string;
    isCorrect: boolean;
    explanation: string;
  } | null>(null);

  const currentProblem: Problem | undefined = problems[currentRoundIndex];
  const activeMultiplier = getActiveMultiplier(combo);

  // Initialize or Restart Game
  const startNewGame = useCallback((level: number = 1) => {
    const newProblems = generateAll20Problems(level);
    setProblems(newProblems);
    setCurrentRoundIndex(0);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setCaughtFishList([]);
    setRecords([]);
    setGameStatus('playing');
    setSelectedFishId(null);
    setLastSelectedCorrect(null);
    setRodTarget(null);
    setFeedbackMessage(null);
    setActiveMilestone(null);
    setFloatingScoreEffect(null);
    playBubbleSound(!settings.soundEnabled);
  }, [settings.soundEnabled]);

  // Next Stage Transition
  const handleNextStage = () => {
    const nextLvl = stageLevel < 3 ? stageLevel + 1 : 1;
    setStageLevel(nextLvl);
    startNewGame(nextLvl);
  };

  // Handle clicking on a fish (Primary fishing mechanic)
  const handleFishClick = (fish: FishModel, side: 'left' | 'right') => {
    if (gameStatus !== 'playing' || !currentProblem) return;

    const isCorrect = fish.isLarger;
    setSelectedFishId(fish.id);
    setLastSelectedCorrect(isCorrect);

    // Calculate rod position coordinates
    const targetX = side === 'left' ? 30 : 70;
    const targetY = side === 'left' ? 45 : 48;
    setRodTarget({ x: targetX, y: targetY });

    if (isCorrect) {
      // 1. Success Action
      setGameStatus('reeling');
      playBiteSound(!settings.soundEnabled);
      setTimeout(() => {
        playReelSound(!settings.soundEnabled);
      }, 150);

      const nextCombo = combo + 1;
      const mult = getActiveMultiplier(nextCombo);
      const basePoints = 100 * mult;
      const streakBonus = nextCombo > 1 ? (nextCombo - 1) * 15 : 0;
      const totalPointsGained = basePoints + streakBonus;

      // Check if this streak reaches a celebratory milestone (5, 10, 15)
      const milestone = getMilestoneData(nextCombo);

      setTimeout(() => {
        if (milestone) {
          setActiveMilestone(milestone);
          playComboMilestoneSound(nextCombo, !settings.soundEnabled);
        } else {
          playCatchSuccessSound(!settings.soundEnabled);
        }

        setScore((prev) => prev + totalPointsGained);
        setCombo(nextCombo);
        setMaxCombo((prev) => Math.max(prev, nextCombo));
        setCaughtFishList((prev) => [...prev, fish]);

        // Trigger floating multiplier animation badge
        const multiplierLabel = mult > 1 ? ` (${mult}배 피버!)` : '';
        setFloatingScoreEffect({
          points: totalPointsGained,
          multiplier: mult,
          text: `+${totalPointsGained}점${multiplierLabel}`,
        });

        const feedbackHeading =
          nextCombo >= 15
            ? `👑 15연속 전설의 낚시! +${totalPointsGained}점 (5X)`
            : nextCombo >= 10
            ? `🔥 10연속 메가 피버! +${totalPointsGained}점 (3X)`
            : nextCombo >= 5
            ? `⚡ 5연속 피버 모드! +${totalPointsGained}점 (2X)`
            : nextCombo > 1
            ? `🎉 낚았다! +${totalPointsGained}점 (${nextCombo}연속!)`
            : `🎉 낚았다! +100점`;

        setFeedbackMessage({
          text: feedbackHeading,
          isCorrect: true,
          explanation: currentProblem.explanation,
        });

        // Record round
        const record: CatchRecord = {
          round: currentProblem.roundNumber,
          problem: currentProblem,
          selectedFish: fish,
          isCorrect: true,
          scoreGained: totalPointsGained,
          multiplier: mult,
          comboAtCatch: nextCombo,
          timestamp: Date.now(),
        };
        setRecords((prev) => [...prev, record]);

        // Move to next problem after short celebration
        proceedToNextRoundAfterDelay(milestone ? 2200 : 1600);
      }, 700);
    } else {
      // 2. Failure Action (Small fraction clicked - Fish escapes)
      setGameStatus('escaping');
      playEscapeSound(!settings.soundEnabled);
      setCombo(0);

      const otherFish = side === 'left' ? currentProblem.rightFish : currentProblem.leftFish;

      setFeedbackMessage({
        text: `💦 물고기가 도망쳤어요! 더 큰 분수는 '${otherFish.name}'였어요.`,
        isCorrect: false,
        explanation: currentProblem.explanation,
      });

      // Record round
      const record: CatchRecord = {
        round: currentProblem.roundNumber,
        problem: currentProblem,
        selectedFish: fish,
        isCorrect: false,
        scoreGained: 0,
        multiplier: 1,
        comboAtCatch: 0,
        timestamp: Date.now(),
      };
      setRecords((prev) => [...prev, record]);

      // Move to next problem
      proceedToNextRoundAfterDelay(1700);
    }
  };

  // Helper to advance round
  const proceedToNextRoundAfterDelay = (delayMs: number = 1600) => {
    setTimeout(() => {
      if (currentRoundIndex >= 19) {
        // Game Finished! Evaluate 15/20 goal
        setRecords((currRecords) => {
          const totalCaught = currRecords.filter((r) => r.isCorrect).length;
          if (totalCaught >= 15) {
            setGameStatus('game_over_clear');
            playStageClearFanfare(!settings.soundEnabled);
          } else {
            setGameStatus('game_over_fail');
            playLevelFailSound(!settings.soundEnabled);
          }
          return currRecords;
        });
      } else {
        // Next Problem
        setCurrentRoundIndex((prev) => prev + 1);
        setGameStatus('playing');
        setSelectedFishId(null);
        setLastSelectedCorrect(null);
        setRodTarget(null);
        setFeedbackMessage(null);
        setFloatingScoreEffect(null);
        playBubbleSound(!settings.soundEnabled);
      }
    }, delayMs);
  };

  // Sea Arena visual aura depending on combo level
  const arenaAuraClass =
    combo >= 15
      ? 'border-yellow-300 ring-4 ring-yellow-400/60 shadow-[0_0_40px_rgba(250,204,21,0.5)]'
      : combo >= 10
      ? 'border-pink-400 ring-4 ring-purple-500/60 shadow-[0_0_30px_rgba(236,72,153,0.4)]'
      : combo >= 5
      ? 'border-amber-400 ring-2 ring-amber-400/50 shadow-[0_0_20px_rgba(251,191,36,0.35)]'
      : 'border-sky-400/50 shadow-2xl';

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-900 via-sky-950 to-[#021833] text-white relative overflow-x-hidden font-sans select-none">
      {/* Combo Milestone Reward Banner Modal */}
      <ComboMilestoneReward
        milestone={activeMilestone}
        onDismiss={() => setActiveMilestone(null)}
      />

      {/* Dynamic Ocean Surface Waves & Sun Rays */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Sun Caustics Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-radial from-cyan-400/20 via-sky-500/10 to-transparent blur-2xl animate-caustics" />

        {/* Surface Wave Pattern */}
        <div className="absolute top-0 inset-x-0 h-16 opacity-30 bg-repeat-x animate-wave" />

        {/* Ambient Rising Underwater Bubbles */}
        <div className="absolute bottom-10 left-[10%] w-3 h-3 rounded-full bg-white/20 animate-bubble" style={{ animationDuration: '7s' }} />
        <div className="absolute bottom-20 left-[25%] w-4 h-4 rounded-full bg-white/25 animate-bubble" style={{ animationDuration: '9s', animationDelay: '1.5s' }} />
        <div className="absolute bottom-12 left-[60%] w-2.5 h-2.5 rounded-full bg-white/20 animate-bubble" style={{ animationDuration: '6s', animationDelay: '3s' }} />
        <div className="absolute bottom-16 left-[85%] w-5 h-5 rounded-full bg-white/15 animate-bubble" style={{ animationDuration: '8s', animationDelay: '0.8s' }} />
      </div>

      {/* Top Navigation & Status Bar */}
      <header className="relative z-30 px-3 sm:px-6 py-2.5 bg-sky-950/80 border-b border-sky-600/40 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2 sm:gap-4">
          {/* Logo & Stage Level Title */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-sky-400 p-0.5 flex items-center justify-center shadow-lg">
              <div className="w-full h-full bg-sky-950 rounded-[14px] flex items-center justify-center">
                <span className="text-xl">🎣</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-amber-200 to-white">
                  분수 낚시 대모험
                </h1>
                <span className="bg-sky-700/80 text-sky-200 text-xs px-2 py-0.5 rounded-full font-bold">
                  초등 3~4학년
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-sky-300">
                Stage {stageLevel}: {stageLevel === 1 ? '기초 (분모 같은 분수 & 단위분수)' : stageLevel === 2 ? '발전 (분자 같은 분수 & 1/2 기준)' : '심화 (통분과 대분수)'}
              </p>
            </div>
          </div>

          {/* Core HUD Badges: Round, Score, Combo Multiplier, Caught Goal */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Round Badge */}
            <div className="bg-sky-900/90 border border-sky-500/50 px-3 py-1 rounded-xl flex items-center gap-1.5 shadow-sm">
              <span className="text-xs text-sky-300 font-bold">라운드</span>
              <span className="text-sm sm:text-base font-black text-amber-300">
                {currentRoundIndex + 1}
                <span className="text-xs text-slate-300 font-normal"> / 20</span>
              </span>
            </div>

            {/* Score & Combo */}
            <div className="bg-sky-900/90 border border-sky-500/50 px-3 py-1 rounded-xl flex items-center gap-1.5 shadow-sm">
              <span className="text-xs text-sky-300 font-bold">점수</span>
              <span className="text-sm sm:text-base font-black text-yellow-400">{score}</span>
              {combo > 1 && (
                <span className="bg-rose-500 text-white text-[10px] sm:text-xs font-black px-1.5 py-0.5 rounded-md flex items-center gap-0.5 animate-pulse">
                  <Flame className="w-3 h-3" /> {combo}연속
                </span>
              )}
            </div>

            {/* Dynamic Multiplier Badge when combo is active */}
            {combo >= 5 && (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
                className={`px-2.5 py-1 rounded-xl border flex items-center gap-1 font-black text-xs sm:text-sm shadow-md ${
                  combo >= 15
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-950 border-white'
                    : combo >= 10
                    ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white border-pink-300'
                    : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 border-amber-200'
                }`}
              >
                {combo >= 15 ? (
                  <>
                    <Crown className="w-3.5 h-3.5 text-amber-950" />
                    <span>5X 전설 피버!</span>
                  </>
                ) : combo >= 10 ? (
                  <>
                    <Flame className="w-3.5 h-3.5 text-yellow-300" />
                    <span>3X 메가 피버!</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 text-amber-950" />
                    <span>2X 피버 모드!</span>
                  </>
                )}
              </motion.div>
            )}

            {/* Target Catch Goal Badge */}
            <div className="bg-gradient-to-r from-emerald-950/80 to-sky-900/90 border border-emerald-500/50 px-3 py-1 rounded-xl flex items-center gap-1.5 shadow-sm">
              <span className="text-xs text-emerald-300 font-bold">어항</span>
              <span className="text-sm sm:text-base font-black text-emerald-400">
                {caughtFishList.length}
                <span className="text-xs text-slate-300 font-normal"> / 15마리 목표</span>
              </span>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-1.5 border-l border-sky-700/60 pl-2">
              {/* Visual Hint Toggle */}
              <button
                onClick={() =>
                  setSettings((prev) => ({
                    ...prev,
                    showVisualHint: !prev.showVisualHint,
                  }))
                }
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  settings.showVisualHint
                    ? 'bg-amber-400 text-amber-950 border-amber-300 shadow-md font-bold'
                    : 'bg-sky-900/80 text-sky-200 border-sky-600/50 hover:bg-sky-800'
                }`}
                title={settings.showVisualHint ? '분수 돋보기 닫기' : '분수 돋보기(그림 힌트) 열기'}
              >
                {settings.showVisualHint ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>

              {/* Sound Mute Toggle */}
              <button
                onClick={() =>
                  setSettings((prev) => ({
                    ...prev,
                    soundEnabled: !prev.soundEnabled,
                  }))
                }
                className="p-2 rounded-xl bg-sky-900/80 text-sky-200 border border-sky-600/50 hover:bg-sky-800 transition-all cursor-pointer"
                title={settings.soundEnabled ? '효과음 끄기' : '효과음 켜기'}
              >
                {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* How to Play Guide Modal */}
              <button
                onClick={() => setShowHowToPlay(true)}
                className="p-2 rounded-xl bg-sky-900/80 text-sky-200 border border-sky-600/50 hover:bg-sky-800 transition-all cursor-pointer"
                title="게임 설명 보기"
              >
                <HelpCircle className="w-4 h-4" />
              </button>

              {/* Restart Button */}
              <button
                onClick={() => startNewGame(stageLevel)}
                className="p-2 rounded-xl bg-sky-900/80 text-sky-200 border border-sky-600/50 hover:bg-sky-800 transition-all cursor-pointer"
                title="처음부터 다시하기"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Game Stage Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-3 sm:p-5 flex flex-col justify-between relative z-10">
        {/* Ocean Surface / Fisherman Boat Header */}
        <div className="w-full flex items-center justify-between mb-2">
          {/* Fisherman / Fishing Rod Boat */}
          <div className="flex items-center gap-2 bg-sky-950/70 border border-sky-500/40 px-3 py-1.5 rounded-2xl backdrop-blur-sm">
            <span className="text-2xl animate-float">⛵</span>
            <div className="leading-tight">
              <span className="text-xs font-black text-amber-300 block">바다 낚시터</span>
              <span className="text-[11px] text-sky-200">
                {currentProblem?.categoryTitle || '분수 비교 낚시'}
              </span>
            </div>
          </div>

          {/* Big Clear Game Prompt Banner */}
          <div className="bg-gradient-to-r from-sky-900/90 via-blue-900/90 to-sky-900/90 px-4 sm:px-6 py-2 rounded-2xl border-2 border-sky-400/60 shadow-lg text-center backdrop-blur-md animate-pulse">
            <p className="text-sm sm:text-lg font-black text-amber-300 flex items-center justify-center gap-2">
              <span>🎯</span>
              <span>더 큰 분수 물고기를 클릭해 낚아보세요!</span>
            </p>
          </div>

          {/* Combo Multiplier Tracker Pill */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-sky-200 bg-sky-950/70 px-3 py-1.5 rounded-2xl border border-sky-700/50">
            {combo >= 15 ? (
              <span className="text-yellow-300 font-black">👑 15콤보 돌파! 5X 전설 배수 적용 중!</span>
            ) : combo >= 10 ? (
              <span className="text-pink-300 font-black">🔥 10콤보 돌파! 3X 메가 배수 적용 중!</span>
            ) : combo >= 5 ? (
              <span className="text-amber-300 font-black">⚡ 5콤보 돌파! 2X 피버 배수 적용 중!</span>
            ) : (
              <span>💡 5연속 정답 시 2X 피버 모드!</span>
            )}
          </div>
        </div>

        {/* Visual Fraction Hint (돋보기) Accordion if open */}
        <AnimatePresence>
          {settings.showVisualHint && currentProblem && (
            <motion.div
              initial={{ height: 0, opacity: 0, scale: 0.95 }}
              animate={{ height: 'auto', opacity: 1, scale: 1 }}
              exit={{ height: 0, opacity: 0, scale: 0.95 }}
              className="mb-3 overflow-hidden"
            >
              <FractionVisualizer
                fractionA={currentProblem.leftFish.fraction}
                fractionB={currentProblem.rightFish.fraction}
                labelA={currentProblem.leftFish.name}
                labelB={currentProblem.rightFish.name}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Interactive Ocean Area with Swimming Fish */}
        <div
          className={`relative w-full h-[290px] sm:h-[340px] md:h-[380px] bg-gradient-to-b from-sky-700/40 via-sky-800/60 to-sky-950/80 rounded-3xl border-2 transition-all duration-500 overflow-hidden flex items-center justify-between px-4 sm:px-12 backdrop-blur-sm ${arenaAuraClass}`}
          id="ocean-fishing-arena"
        >
          {/* Active Fever Banner Glow in Sea */}
          {combo >= 5 && (
            <div className="absolute top-3 inset-x-0 flex justify-center pointer-events-none z-20">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`px-4 py-1 rounded-full text-xs sm:text-sm font-black shadow-lg flex items-center gap-1.5 ${
                  combo >= 15
                    ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-amber-950 ring-2 ring-white'
                    : combo >= 10
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white ring-2 ring-pink-300'
                    : 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 ring-2 ring-amber-200'
                }`}
              >
                {combo >= 15 ? '👑 LEGENDARY 5X MULTIPLIER' : combo >= 10 ? '🔥 MEGA 3X MULTIPLIER' : '⚡ FEVER 2X MULTIPLIER'}
              </motion.div>
            </div>
          )}

          {/* Animated Fishing Line and Hook */}
          {rodTarget && (
            <FishingRod
              isFishing={gameStatus === 'reeling' || gameStatus === 'escaping'}
              targetXPercent={rodTarget.x}
              targetYPercent={rodTarget.y}
              isSuccess={lastSelectedCorrect === true}
            />
          )}

          {/* Left Swimming Fish */}
          {currentProblem && (
            <div className="flex-1 flex items-center justify-center">
              <Fish
                fish={currentProblem.leftFish}
                status={
                  selectedFishId === currentProblem.leftFish.id
                    ? gameStatus === 'reeling'
                      ? 'reeling'
                      : gameStatus === 'escaping'
                      ? 'escaping'
                      : 'swimming'
                    : 'swimming'
                }
                onClick={() => handleFishClick(currentProblem.leftFish, 'left')}
                disabled={gameStatus !== 'playing'}
                isHintActive={settings.showVisualHint && currentProblem.leftFish.isLarger}
              />
            </div>
          )}

          {/* Center VS Indicator */}
          <div className="flex flex-col items-center justify-center px-2 z-10">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-sky-950/90 border-2 border-sky-400 flex items-center justify-center text-sm sm:text-base font-black text-amber-300 shadow-xl ring-2 ring-sky-300/30">
              VS
            </div>
            <span className="text-[10px] text-sky-300 font-bold mt-1 bg-sky-950/80 px-2 py-0.5 rounded-full whitespace-nowrap">
              어느 쪽이 더 클까?
            </span>
          </div>

          {/* Right Swimming Fish */}
          {currentProblem && (
            <div className="flex-1 flex items-center justify-center">
              <Fish
                fish={currentProblem.rightFish}
                status={
                  selectedFishId === currentProblem.rightFish.id
                    ? gameStatus === 'reeling'
                      ? 'reeling'
                      : gameStatus === 'escaping'
                      ? 'escaping'
                      : 'swimming'
                    : 'swimming'
                }
                onClick={() => handleFishClick(currentProblem.rightFish, 'right')}
                disabled={gameStatus !== 'playing'}
                isHintActive={settings.showVisualHint && currentProblem.rightFish.isLarger}
              />
            </div>
          )}

          {/* Floating Score Multiplier Indicator on Catch */}
          <AnimatePresence>
            {floatingScoreEffect && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 30 }}
                animate={{ opacity: 1, scale: 1.25, y: -40 }}
                exit={{ opacity: 0, scale: 0.9, y: -80 }}
                transition={{ duration: 1 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
              >
                <div
                  className={`px-4 py-2 rounded-2xl font-black text-xl sm:text-2xl shadow-2xl border-2 flex items-center gap-1.5 ${
                    floatingScoreEffect.multiplier >= 5
                      ? 'bg-amber-400 text-amber-950 border-white ring-4 ring-yellow-300'
                      : floatingScoreEffect.multiplier >= 3
                      ? 'bg-purple-600 text-white border-pink-300 ring-4 ring-pink-400'
                      : floatingScoreEffect.multiplier >= 2
                      ? 'bg-amber-500 text-white border-amber-200 ring-4 ring-amber-300'
                      : 'bg-emerald-500 text-white border-white'
                  }`}
                >
                  <Sparkles className="w-6 h-6 animate-spin" />
                  <span>{floatingScoreEffect.text}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Live Action Feedback Toast Bar */}
          <AnimatePresence>
            {feedbackMessage && (
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                className={`absolute bottom-4 left-1/2 -translate-x-1/2 max-w-lg w-[90%] p-3.5 rounded-2xl border-2 shadow-2xl backdrop-blur-md z-40 text-center ${
                  feedbackMessage.isCorrect
                    ? 'bg-emerald-950/95 text-emerald-100 border-emerald-400'
                    : 'bg-rose-950/95 text-rose-100 border-rose-400'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5 text-base sm:text-lg font-black mb-1">
                  {feedbackMessage.isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400" />
                  )}
                  <span>{feedbackMessage.text}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 font-medium">
                  {feedbackMessage.explanation}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tip Text Bar */}
        {currentProblem && (
          <div className="mt-2 text-center text-xs sm:text-sm text-sky-200 bg-sky-950/60 py-1.5 px-4 rounded-xl border border-sky-800/40">
            {currentProblem.tipText}
          </div>
        )}

        {/* Bottom Glass Aquarium Tank (낚은 물고기 수족관) */}
        <div className="mt-3">
          <AquariumTank
            caughtFishList={caughtFishList}
            targetCount={15}
            totalAttempts={20}
            currentRound={currentRoundIndex + 1}
          />
        </div>
      </main>

      {/* Stage Result / Clear Modal when 20 rounds are completed */}
      {(gameStatus === 'game_over_clear' || gameStatus === 'game_over_fail') && (
        <StageResultModal
          records={records}
          score={score}
          maxCombo={maxCombo}
          stageLevel={stageLevel}
          onRestart={() => startNewGame(stageLevel)}
          onNextStage={handleNextStage}
        />
      )}

      {/* How to Play Guide Modal */}
      <AnimatePresence>
        {showHowToPlay && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border-2 border-sky-400 rounded-3xl p-5 sm:p-6 max-w-lg w-full text-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-700 pb-3 mb-4">
                <h3 className="text-lg sm:text-xl font-black text-amber-300 flex items-center gap-2">
                  <span>🎮</span> 분수 낚시 게임 방법
                </h3>
                <button
                  onClick={() => setShowHowToPlay(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 text-sm font-bold cursor-pointer"
                >
                  ✕ 닫기
                </button>
              </div>

              <div className="space-y-3.5 text-sm text-slate-200">
                <div className="flex items-start gap-3 bg-sky-950/80 p-3 rounded-2xl border border-sky-700/50">
                  <span className="text-2xl">🎣</span>
                  <div>
                    <strong className="text-white font-bold block">1. 더 큰 분수 물고기 낚기</strong>
                    바다에 나타난 두 마리 물고기 중 <span className="text-amber-300 font-bold">더 큰 분수</span>를 클릭해 낚싯대로 낚아보세요 (+100점!).
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-amber-950/40 p-3 rounded-2xl border border-amber-500/50">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <strong className="text-amber-300 font-bold block">2. 콤보 & 피버 배수 보너스</strong>
                    연속 정답 시 점수 폭발!
                    <ul className="text-xs text-amber-100 mt-1 space-y-0.5">
                      <li>• <strong>5연속 정답</strong>: ⚡ 2X 피버 모드 (+200점)</li>
                      <li>• <strong>10연속 정답</strong>: 🔥 3X 메가 피버 (+300점)</li>
                      <li>• <strong>15연속 정답</strong>: 👑 5X 전설 피버 (+500점)</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-sky-950/80 p-3 rounded-2xl border border-sky-700/50">
                  <span className="text-2xl">🐟</span>
                  <div>
                    <strong className="text-white font-bold block">3. 어항 채우기 & 스테이지 클리어</strong>
                    낚은 물고기는 화면 아래 <span className="text-emerald-300 font-bold">어항</span>에 모입니다. 총 20마리 도전 중 <span className="text-amber-300 font-black">15마리 이상</span>을 낚으면 스테이지 클리어!
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-sky-950/80 p-3 rounded-2xl border border-sky-700/50">
                  <span className="text-2xl">🔍</span>
                  <div>
                    <strong className="text-white font-bold block">4. 분수 돋보기 힌트</strong>
                    헷갈릴 땐 상단의 <span className="text-sky-300 font-bold">돋보기(눈 모양) 버튼</span>을 누르면 분수 막대로 크기를 직접 비교할 수 있어요.
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowHowToPlay(false)}
                className="w-full mt-5 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black text-base rounded-2xl shadow-lg transition-all cursor-pointer"
              >
                신나게 낚시하러 가기! 🎣
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

