import React from 'react';
import { FractionValue } from '../types';
import { FractionDisplay } from './FractionDisplay';
import { getFractionNumberValue } from '../utils/fractionGenerator';

interface FractionVisualizerProps {
  fractionA: FractionValue;
  fractionB: FractionValue;
  labelA?: string;
  labelB?: string;
  showComparison?: boolean;
}

export const FractionVisualizer: React.FC<FractionVisualizerProps> = ({
  fractionA,
  fractionB,
  labelA = '왼쪽 물고기',
  labelB = '오른쪽 물고기',
  showComparison = true,
}) => {
  const valA = getFractionNumberValue(fractionA);
  const valB = getFractionNumberValue(fractionB);

  const isALarger = valA > valB;
  const isBLarger = valB > valA;

  return (
    <div className="bg-sky-900/90 text-white rounded-2xl p-4 sm:p-5 border border-sky-400/40 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-sky-700/60 pb-2 mb-3">
        <h4 className="text-sm sm:text-base font-bold text-sky-200 flex items-center gap-1.5">
          <span>🔍</span> 분수 막대 눈으로 비교하기
        </h4>
        <span className="text-xs text-sky-300 bg-sky-800/80 px-2 py-0.5 rounded-full">
          전체 1을 똑같이 나눈 크기
        </span>
      </div>

      <div className="space-y-4">
        {/* Fraction A Visual Bar */}
        <div>
          <div className="flex items-center justify-between mb-1.5 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-200">{labelA}</span>
              <FractionDisplay fraction={fractionA} size="sm" variant="bubble" />
            </div>
            <span className="text-sky-300 font-semibold">
              {fractionA.denominator}조각 중 {fractionA.numerator}조각
            </span>
          </div>

          <div className="h-7 sm:h-9 bg-slate-900/80 rounded-xl overflow-hidden flex border-2 border-sky-400/60 relative p-0.5">
            {Array.from({ length: fractionA.denominator }).map((_, idx) => (
              <div
                key={`bar-a-${idx}`}
                className={`flex-1 h-full border-r border-slate-900/80 last:border-r-0 flex items-center justify-center transition-all duration-300 ${
                  idx < fractionA.numerator
                    ? isALarger
                      ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-teal-950 font-black'
                      : 'bg-gradient-to-r from-sky-400 to-blue-500 text-blue-950 font-bold'
                    : 'bg-slate-800/60 text-slate-500'
                }`}
              >
                <span className="text-[10px] sm:text-xs">
                  {idx < fractionA.numerator ? '●' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Sign in Middle */}
        {showComparison && (
          <div className="flex items-center justify-center gap-2 py-0.5">
            <div className="h-px bg-sky-700/60 flex-1" />
            <div className="bg-amber-400 text-amber-950 px-3 py-1 rounded-full text-xs sm:text-sm font-black shadow-md border border-amber-300 flex items-center gap-1">
              <span>{isALarger ? '왼쪽이 더 큼' : '오른쪽이 더 큼'}</span>
              <span className="text-base font-extrabold">{isALarger ? '>' : '<'}</span>
            </div>
            <div className="h-px bg-sky-700/60 flex-1" />
          </div>
        )}

        {/* Fraction B Visual Bar */}
        <div>
          <div className="flex items-center justify-between mb-1.5 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-200">{labelB}</span>
              <FractionDisplay fraction={fractionB} size="sm" variant="bubble" />
            </div>
            <span className="text-sky-300 font-semibold">
              {fractionB.denominator}조각 중 {fractionB.numerator}조각
            </span>
          </div>

          <div className="h-7 sm:h-9 bg-slate-900/80 rounded-xl overflow-hidden flex border-2 border-sky-400/60 relative p-0.5">
            {Array.from({ length: fractionB.denominator }).map((_, idx) => (
              <div
                key={`bar-b-${idx}`}
                className={`flex-1 h-full border-r border-slate-900/80 last:border-r-0 flex items-center justify-center transition-all duration-300 ${
                  idx < fractionB.numerator
                    ? isBLarger
                      ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-teal-950 font-black'
                      : 'bg-gradient-to-r from-sky-400 to-blue-500 text-blue-950 font-bold'
                    : 'bg-slate-800/60 text-slate-500'
                }`}
              >
                <span className="text-[10px] sm:text-xs">
                  {idx < fractionB.numerator ? '●' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
