import React from 'react';
import { FractionValue } from '../types';

interface FractionDisplayProps {
  fraction: FractionValue;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'bubble' | 'dark' | 'light' | 'gold';
  highlightNumerator?: boolean;
  highlightDenominator?: boolean;
}

export const FractionDisplay: React.FC<FractionDisplayProps> = ({
  fraction,
  size = 'lg',
  variant = 'bubble',
  highlightNumerator = false,
  highlightDenominator = false,
}) => {
  const { numerator, denominator, whole } = fraction;

  // Sizing definitions with large readable typography
  const sizeClasses = {
    sm: {
      whole: 'text-lg',
      numDen: 'text-sm font-bold',
      line: 'w-4 h-0.5 my-0.5',
      container: 'px-2 py-1 gap-1 text-sm',
    },
    md: {
      whole: 'text-2xl font-black',
      numDen: 'text-xl font-black leading-none',
      line: 'w-7 h-0.5 my-0.5',
      container: 'px-3 py-1.5 gap-1.5 text-base',
    },
    lg: {
      whole: 'text-3xl sm:text-4xl font-black',
      numDen: 'text-2xl sm:text-3xl font-black leading-tight',
      line: 'w-8 sm:w-10 h-0.5 sm:h-1 my-0.5',
      container: 'px-3 sm:px-4 py-2 gap-2 text-xl sm:text-2xl',
    },
    xl: {
      whole: 'text-4xl sm:text-5xl font-black',
      numDen: 'text-3xl sm:text-4xl font-black leading-tight',
      line: 'w-10 sm:w-12 h-1 my-1',
      container: 'px-4 sm:px-6 py-2.5 sm:py-3 gap-2.5 text-2xl sm:text-3xl',
    },
  }[size];

  const variantClasses = {
    bubble: 'bg-white/95 text-slate-900 border-2 border-sky-400 shadow-lg rounded-2xl',
    dark: 'bg-slate-900/90 text-white border-2 border-sky-300 shadow-lg rounded-2xl',
    light: 'bg-white text-blue-950 border-2 border-blue-200 shadow-md rounded-2xl',
    gold: 'bg-amber-100 text-amber-950 border-2 border-amber-400 shadow-xl rounded-2xl ring-2 ring-amber-300/60',
  }[variant];

  return (
    <div
      className={`inline-flex items-center justify-center select-none font-bold ${variantClasses} ${sizeClasses.container}`}
      style={{ fontFamily: "'Jua', 'Noto Sans KR', sans-serif" }}
    >
      {/* Whole number for mixed fractions */}
      {whole && whole > 0 && (
        <span
          className={`text-amber-600 font-extrabold ${sizeClasses.whole} drop-shadow-sm mr-0.5`}
          title={`자연수 ${whole}`}
        >
          {whole}
        </span>
      )}

      {/* Fraction Stack */}
      <div className="inline-flex flex-col items-center justify-center leading-none">
        {/* Numerator (분자) */}
        <span
          className={`tracking-tight ${sizeClasses.numDen} ${
            highlightNumerator ? 'text-amber-600 underline font-black' : ''
          }`}
        >
          {numerator}
        </span>

        {/* Fraction Bar (가로 분수선) */}
        <span className={`bg-current rounded-full ${sizeClasses.line}`} />

        {/* Denominator (분모) */}
        <span
          className={`tracking-tight ${sizeClasses.numDen} ${
            highlightDenominator ? 'text-indigo-600 underline font-black' : ''
          }`}
        >
          {denominator}
        </span>
      </div>
    </div>
  );
};
