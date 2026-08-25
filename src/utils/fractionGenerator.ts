import { FishModel, FishSpecies, FractionValue, Problem, ProblemCategory } from '../types';

const FISH_SPECIES_LIST: Array<{
  species: FishSpecies;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}> = [
  {
    species: 'clownfish',
    name: '흰동가리 니모',
    primaryColor: '#f97316', // Orange
    secondaryColor: '#ffffff',
    accentColor: '#1e293b',
  },
  {
    species: 'angelfish',
    name: '엔젤피쉬',
    primaryColor: '#06b6d4', // Cyan
    secondaryColor: '#facc15', // Yellow
    accentColor: '#0891b2',
  },
  {
    species: 'bluetang',
    name: '블루탱 도리',
    primaryColor: '#2563eb', // Royal blue
    secondaryColor: '#facc15',
    accentColor: '#1e1b4b',
  },
  {
    species: 'goldfish',
    name: '황금 금붕어',
    primaryColor: '#eab308', // Gold
    secondaryColor: '#fef08a',
    accentColor: '#ca8a04',
  },
  {
    species: 'blowfish',
    name: '통통 복어',
    primaryColor: '#a855f7', // Purple
    secondaryColor: '#f472b6',
    accentColor: '#7e22ce',
  },
  {
    species: 'rainbow',
    name: '무지개 열대어',
    primaryColor: '#10b981', // Emerald
    secondaryColor: '#38bdf8',
    accentColor: '#f43f5e',
  },
  {
    species: 'seahorse',
    name: '귀요미 해마',
    primaryColor: '#ec4899', // Pink
    secondaryColor: '#fed7aa',
    accentColor: '#be185d',
  },
];

export function getFractionNumberValue(f: FractionValue): number {
  const whole = f.whole || 0;
  return whole + f.numerator / f.denominator;
}

export function formatFractionText(f: FractionValue): string {
  if (f.whole && f.whole > 0) {
    return `${f.whole}와 ${f.numerator}/${f.denominator}`;
  }
  return `${f.numerator}/${f.denominator}`;
}

export function generateAll20Problems(stageLevel: number = 1): Problem[] {
  const problems: Problem[] = [];

  // Stage 1 (기초): 주로 분모가 같은 분수 & 단위분수 (3학년 1학기 핵심)
  // Stage 2 (발전): 분자가 같은 분수 & 1/2 기준 비교 (3학년 2학기 ~ 4학년 기초)
  // Stage 3 (심화): 통분 기초 & 대분수/가분수 (4학년 종합)

  for (let i = 1; i <= 20; i++) {
    let problemCategory: ProblemCategory;

    if (stageLevel === 1) {
      if (i <= 8) {
        problemCategory = 'same_denominator';
      } else if (i <= 14) {
        problemCategory = 'unit_fraction';
      } else {
        problemCategory = 'same_numerator';
      }
    } else if (stageLevel === 2) {
      if (i <= 6) {
        problemCategory = 'same_numerator';
      } else if (i <= 12) {
        problemCategory = 'benchmark_half';
      } else {
        problemCategory = 'grade4_simple';
      }
    } else {
      if (i <= 6) {
        problemCategory = 'benchmark_half';
      } else if (i <= 13) {
        problemCategory = 'grade4_simple';
      } else {
        problemCategory = 'mixed_improper';
      }
    }

    const { f1, f2, categoryTitle, explanation, tipText } = createPairForCategory(problemCategory, i);

    const val1 = getFractionNumberValue(f1);
    const val2 = getFractionNumberValue(f2);

    // Randomize species and ensure distinct looks
    const specIndex1 = (i * 2) % FISH_SPECIES_LIST.length;
    const specIndex2 = (i * 2 + 3) % FISH_SPECIES_LIST.length;
    const spec1 = FISH_SPECIES_LIST[specIndex1];
    const spec2 = FISH_SPECIES_LIST[specIndex2];

    // Position fish in left & right zones with subtle organic swimming heights
    const leftFish: FishModel = {
      id: `fish-${i}-left`,
      fraction: f1,
      numericValue: val1,
      species: spec1.species,
      name: spec1.name,
      primaryColor: spec1.primaryColor,
      secondaryColor: spec1.secondaryColor,
      accentColor: spec1.accentColor,
      sizeScale: 1,
      direction: 'right', // Swim facing center or right
      xPercent: 22 + (i % 3) * 3,
      yPercent: 35 + ((i * 7) % 25),
      isLarger: val1 > val2,
    };

    const rightFish: FishModel = {
      id: `fish-${i}-right`,
      fraction: f2,
      numericValue: val2,
      species: spec2.species,
      name: spec2.name,
      primaryColor: spec2.primaryColor,
      secondaryColor: spec2.secondaryColor,
      accentColor: spec2.accentColor,
      sizeScale: 1,
      direction: 'left', // Swim facing center or left
      xPercent: 74 - ((i * 2) % 4) * 3,
      yPercent: 38 + (((i + 2) * 5) % 24),
      isLarger: val2 > val1,
    };

    problems.push({
      id: i,
      roundNumber: i,
      leftFish,
      rightFish,
      category: problemCategory,
      categoryTitle,
      explanation,
      tipText,
    });
  }

  return problems;
}

function createPairForCategory(
  category: ProblemCategory,
  round: number
): {
  f1: FractionValue;
  f2: FractionValue;
  categoryTitle: string;
  explanation: string;
  tipText: string;
} {
  switch (category) {
    case 'same_denominator': {
      // 분모가 같을 때: 분자가 큰 쪽이 더 크다.
      const denOptions = [4, 5, 6, 7, 8, 9, 10];
      const den = denOptions[round % denOptions.length];
      let num1 = 1 + (round % (den - 1));
      let num2 = 1 + ((round + 3) % (den - 1));
      if (num1 === num2) {
        num2 = (num1 % (den - 1)) + 1;
      }

      // 50% chance swap to make left or right larger
      if (round % 2 === 0 && num1 < num2) {
        const tmp = num1;
        num1 = num2;
        num2 = tmp;
      }

      const f1: FractionValue = { numerator: num1, denominator: den };
      const f2: FractionValue = { numerator: num2, denominator: den };
      const larger = num1 > num2 ? f1 : f2;
      const smaller = num1 > num2 ? f2 : f1;

      return {
        f1,
        f2,
        categoryTitle: '분모가 같은 분수 비교 (3학년 1학기)',
        explanation: `분모가 ${den}(으)로 같을 때는 조각의 크기가 같으므로, 조각 수(분자)가 더 많은 ${larger.numerator}/${larger.denominator}가 더 큽니다!`,
        tipText: `💡 분모가 같으면 윗부분(분자)이 큰 물고기가 이겨요! (${larger.numerator}/${larger.denominator} > ${smaller.numerator}/${smaller.denominator})`,
      };
    }

    case 'unit_fraction': {
      // 단위분수 (분자가 1): 분모가 작을수록 전체를 적게 나눈 것이므로 조각이 더 크다.
      const denList = [2, 3, 4, 5, 6, 7, 8, 9, 10];
      const idx1 = round % denList.length;
      let idx2 = (round + 2 + (round % 3)) % denList.length;
      if (idx1 === idx2) idx2 = (idx1 + 1) % denList.length;

      const d1 = denList[idx1];
      const d2 = denList[idx2];

      const f1: FractionValue = { numerator: 1, denominator: d1 };
      const f2: FractionValue = { numerator: 1, denominator: d2 };

      const largerDen = Math.min(d1, d2); // Smaller denominator = larger fraction
      const smallerDen = Math.max(d1, d2);

      return {
        f1,
        f2,
        categoryTitle: '단위분수 크기 비교 (3학년 1학기)',
        explanation: `분자가 1인 단위분수는 전체를 적게 나눌수록 한 조각이 커집니다. 분모가 더 작은 1/${largerDen}이(가) 1/${smallerDen}보다 더 큽니다!`,
        tipText: `💡 분자가 1일 때는 피자를 덜 나눈 쪽(분모가 작은 쪽) 한 조각이 더 커요! (1/${largerDen} > 1/${smallerDen})`,
      };
    }

    case 'same_numerator': {
      // 분자가 같을 때 (단위분수 이외): e.g. 3/5 vs 3/8
      const numerators = [2, 3, 4, 5];
      const num = numerators[round % numerators.length];
      const possibleDens = [num + 1, num + 2, num + 3, num + 4, num + 5].filter((d) => d <= 12);

      const d1 = possibleDens[round % possibleDens.length];
      let d2 = possibleDens[(round + 2) % possibleDens.length];
      if (d1 === d2) d2 = possibleDens[(round + 1) % possibleDens.length] || d1 + 1;

      const f1: FractionValue = { numerator: num, denominator: d1 };
      const f2: FractionValue = { numerator: num, denominator: d2 };

      const larger = d1 < d2 ? f1 : f2;
      const smaller = d1 < d2 ? f2 : f1;

      return {
        f1,
        f2,
        categoryTitle: '분자가 같은 분수 비교 (3학년 2학기)',
        explanation: `분자(${num})가 같을 때에는 한 조각의 크기가 더 큰(분모가 더 작은) ${larger.numerator}/${larger.denominator}가 더 큽니다!`,
        tipText: `💡 똑같은 개수(${num}개)를 먹을 땐, 조각이 더 큰(분모가 작은) ${larger.numerator}/${larger.denominator}가 더 큽니다!`,
      };
    }

    case 'benchmark_half': {
      // 1/2 또는 1 기준 비교
      // e.g. 3/4 (반 넘음) vs 2/6 (반 안됨) or 4/7 vs 2/5
      const benchmarkPairs: Array<{ f1: FractionValue; f2: FractionValue; exp: string }> = [
        {
          f1: { numerator: 3, denominator: 4 }, // 0.75 (> 0.5)
          f2: { numerator: 2, denominator: 6 }, // 0.33 (< 0.5)
          exp: '3/4은 절반(2/4)보다 크고, 2/6은 절반(3/6)보다 작으므로 3/4이 더 큽니다!',
        },
        {
          f1: { numerator: 1, denominator: 3 }, // 0.33
          f2: { numerator: 4, denominator: 5 }, // 0.8
          exp: '4/5는 1에 가깝고 1/3은 절반보다도 작으므로 4/5가 훨씬 큽니다!',
        },
        {
          f1: { numerator: 5, denominator: 8 }, // 0.625
          f2: { numerator: 3, denominator: 8 }, // 0.375
          exp: '5/8는 절반(4/8)보다 크고 3/8은 작으므로 5/8가 더 큽니다!',
        },
        {
          f1: { numerator: 4, denominator: 6 }, // 0.66
          f2: { numerator: 1, denominator: 4 }, // 0.25
          exp: '4/6은 절반(3/6)을 훌쩍 넘지만 1/4은 절반(2/4)보다 작아서 4/6이 더 큽니다!',
        },
        {
          f1: { numerator: 6, denominator: 7 }, // 0.85
          f2: { numerator: 2, denominator: 5 }, // 0.4
          exp: '6/7은 1(7/7)에 거의 꽉 찼지만 2/5는 절반도 안 되므로 6/7이 더 큽니다!',
        },
        {
          f1: { numerator: 3, denominator: 5 }, // 0.6
          f2: { numerator: 1, denominator: 6 }, // 0.16
          exp: '3/5는 절반보다 크고 1/6은 매우 작으므로 3/5가 더 큽니다!',
        },
      ];

      const pair = benchmarkPairs[round % benchmarkPairs.length];
      return {
        f1: pair.f1,
        f2: pair.f2,
        categoryTitle: '절반(1/2) 기준 분수 비교 (3~4학년)',
        explanation: pair.exp,
        tipText: `💡 1/2(절반)보다 큰지 작은지를 비교해 보면 쉽게 알 수 있어요!`,
      };
    }

    case 'grade4_simple': {
      // 배수 관계 분모 통분 (e.g. 1/2 vs 3/8, 2/3 vs 5/6, 3/4 vs 5/8)
      const grade4Pairs: Array<{ f1: FractionValue; f2: FractionValue; exp: string }> = [
        {
          f1: { numerator: 1, denominator: 2 }, // 4/8
          f2: { numerator: 3, denominator: 8 }, // 3/8
          exp: '1/2은 4/8와 같으므로 3/8보다 1/2이 더 큽니다!',
        },
        {
          f1: { numerator: 2, denominator: 3 }, // 4/6
          f2: { numerator: 5, denominator: 6 }, // 5/6
          exp: '2/3은 4/6과 같으므로 5/6가 2/3보다 더 큽니다!',
        },
        {
          f1: { numerator: 3, denominator: 4 }, // 6/8
          f2: { numerator: 5, denominator: 8 }, // 5/8
          exp: '3/4은 6/8과 같으므로 5/8보다 3/4이 더 큽니다!',
        },
        {
          f1: { numerator: 2, denominator: 5 }, // 4/10
          f2: { numerator: 7, denominator: 10 }, // 7/10
          exp: '2/5는 4/10과 같으므로 7/10이 더 큽니다!',
        },
        {
          f1: { numerator: 3, denominator: 6 }, // 1/2
          f2: { numerator: 4, denominator: 6 }, // 4/6
          exp: '분모가 6으로 같으므로 분자가 더 큰 4/6가 3/6보다 큽니다!',
        },
        {
          f1: { numerator: 5, denominator: 9 }, // 5/9
          f2: { numerator: 2, denominator: 3 }, // 6/9
          exp: '2/3은 6/9과 같으므로 5/9보다 2/3이 더 큽니다!',
        },
      ];

      const p = grade4Pairs[round % grade4Pairs.length];
      return {
        f1: p.f1,
        f2: p.f2,
        categoryTitle: '크기가 같은 분수로 바꾸어 비교 (4학년)',
        explanation: p.exp,
        tipText: `💡 분모를 같게 맞춰보면(통분) 어느 쪽이 더 큰지 바로 보여요!`,
      };
    }

    case 'mixed_improper': {
      // 대분수와 가분수 비교 (4학년 1학기)
      const mixedPairs: Array<{ f1: FractionValue; f2: FractionValue; exp: string }> = [
        {
          f1: { whole: 1, numerator: 1, denominator: 4 }, // 1과 1/4 = 5/4
          f2: { numerator: 6, denominator: 4 }, // 6/4 = 1과 2/4
          exp: '1과 1/4은 5/4이므로 6/4이 더 큽니다!',
        },
        {
          f1: { whole: 1, numerator: 3, denominator: 5 }, // 1과 3/5
          f2: { whole: 1, numerator: 1, denominator: 5 }, // 1과 1/5
          exp: '자연수 부분이 1로 같으므로 진분수가 더 큰 1과 3/5가 더 큽니다!',
        },
        {
          f1: { whole: 2, numerator: 1, denominator: 3 }, // 2과 1/3
          f2: { whole: 1, numerator: 2, denominator: 3 }, // 1과 2/3
          exp: '자연수 부분이 2인 2와 1/3이 자연수가 1인 분수보다 훨씬 큽니다!',
        },
        {
          f1: { numerator: 7, denominator: 3 }, // 7/3 = 2와 1/3
          f2: { whole: 1, numerator: 2, denominator: 3 }, // 1과 2/3
          exp: '가분수 7/3은 대분수로 바꾸면 2와 1/3이므로 1과 2/3보다 큽니다!',
        },
      ];

      const mp = mixedPairs[round % mixedPairs.length];
      return {
        f1: mp.f1,
        f2: mp.f2,
        categoryTitle: '대분수와 가분수 비교 (4학년)',
        explanation: mp.exp,
        tipText: `💡 대분수는 자연수 부분을 먼저 보고, 가분수는 대분수로 바꾸어 비교해요!`,
      };
    }
  }
}
