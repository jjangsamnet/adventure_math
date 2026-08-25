export interface FractionValue {
  numerator: number;
  denominator: number;
  whole?: number; // For mixed numbers in grade 4 e.g. 1 1/3
}

export type FishSpecies =
  | 'clownfish' // 주황 줄무늬 니모
  | 'angelfish' // 청록/노랑 엔젤피쉬
  | 'blowfish' // 통통한 복어
  | 'goldfish' // 빛나는 황금물고기
  | 'bluetang' // 선명한 파랑 블루탱
  | 'rainbow' // 무지개 열대어
  | 'seahorse'; // 깜찍한 해마

export interface FishModel {
  id: string;
  fraction: FractionValue;
  numericValue: number;
  species: FishSpecies;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  sizeScale: number;
  direction: 'left' | 'right';
  xPercent: number; // Swimming position 10% to 90%
  yPercent: number; // Swimming depth 15% to 75%
  isLarger: boolean;
}

export type ProblemCategory =
  | 'same_denominator' // 분모가 같은 분수 (3학년 1~2학기)
  | 'unit_fraction' // 분자가 1인 단위분수 (3학년 1학기)
  | 'same_numerator' // 분자가 같은 분수 (3학년 2학기)
  | 'benchmark_half' // 1/2 또는 1 기준 비교 (3~4학년)
  | 'grade4_simple' // 간단한 배수 통분 또는 대분수 (4학년)
  | 'mixed_improper'; // 대분수와 가분수 비교 (4학년)

export interface Problem {
  id: number;
  roundNumber: number;
  leftFish: FishModel;
  rightFish: FishModel;
  category: ProblemCategory;
  categoryTitle: string;
  explanation: string;
  tipText: string;
}

export interface CatchRecord {
  round: number;
  problem: Problem;
  selectedFish: FishModel;
  isCorrect: boolean;
  scoreGained: number;
  multiplier?: number;
  comboAtCatch?: number;
  timestamp: number;
}

export type GameStatus =
  | 'intro'
  | 'playing'
  | 'reeling' // 낚싯줄 내려오고 물고기 낚는 중
  | 'escaping' // 물고기 도망가는 중
  | 'feedback' // 정답/오답 및 분수 원리 해설 모달/바
  | 'game_over_clear' // 15마리 이상 성공!
  | 'game_over_fail'; // 20마리 끝났으나 15마리 미만

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  showVisualHint: boolean;
  highContrastMode: boolean;
}
