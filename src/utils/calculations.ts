import { UserNutritionProfile, MacroTarget } from '../types/fitness';

/**
 * Basal Metabolic Rate (BMR) via Mifflin-St Jeor Equation:
 * Men: (10 × weight in kg) + (6.25 × height in cm) - (5 × age) + 5
 * Women: (10 × weight in kg) + (6.25 × height in cm) - (5 × age) - 161
 */
export function calculateBMR(profile: {
  gender: 'male' | 'female';
  weightKg: number;
  heightCm: number;
  age: number;
}): number {
  const base = 10 * profile.weightKg + 6.25 * profile.heightCm - 5 * profile.age;
  return profile.gender === 'male' ? Math.round(base + 5) : Math.round(base - 161);
}

export const ACTIVITY_MULTIPLIERS: Record<string, number> = {
  sedentary: 1.2, // Little or no exercise, desk job
  light: 1.375, // Light exercise 1-3 days/week
  moderate: 1.55, // Moderate exercise 3-5 days/week
  very_active: 1.725, // Hard exercise 6-7 days/week
  athlete: 1.9, // Daily intense training or physical job
};

/**
 * Total Daily Energy Expenditure (TDEE) = BMR × Activity Factor
 */
export function calculateTDEE(bmr: number, activityLevel: string): number {
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] || 1.55;
  return Math.round(bmr * multiplier);
}

/**
 * Goal-Specific Adjustments:
 * - Hypertrophy: TDEE + 350-500 kcal (High Protein: ~2.0g/kg, high complex carbs)
 * - Recomposition: Maintenance TDEE (High Protein: ~2.2g/kg, balanced)
 * - Fat Loss: TDEE - 400-500 kcal (High Protein: ~2.2-2.4g/kg to preserve lean mass)
 */
export function calculateNutritionTargets(profile: UserNutritionProfile): MacroTarget {
  const bmr = calculateBMR(profile);
  const tdee = calculateTDEE(bmr, profile.activityLevel);

  let targetCalories = tdee;
  let proteinPerKg = profile.targetProteinPerKg || 2.0;

  if (profile.goal === 'hypertrophy') {
    targetCalories += profile.customCalorieAdjustment ?? 400;
    proteinPerKg = 2.0;
  } else if (profile.goal === 'recomposition') {
    targetCalories += profile.customCalorieAdjustment ?? 0;
    proteinPerKg = 2.2;
  } else if (profile.goal === 'fat_loss') {
    targetCalories -= profile.customCalorieAdjustment ?? 450;
    proteinPerKg = 2.2;
  }

  // Protein calories: 4 kcal per gram
  const proteinGrams = Math.round(profile.weightKg * proteinPerKg);
  const proteinCalories = proteinGrams * 4;

  // Remaining calories split between Carbs (4 kcal/g) and Fats (9 kcal/g)
  const remainingCalories = Math.max(0, targetCalories - proteinCalories);
  
  // Fats: roughly 25-30% of total calories (0.8g - 1.0g per kg)
  const fatCalories = targetCalories * 0.25;
  const fatsGrams = Math.round(fatCalories / 9);

  // Remainder goes to Carbohydrates
  const carbCalories = Math.max(0, remainingCalories - fatCalories);
  const carbsGrams = Math.round(carbCalories / 4);

  // Water requirement: baseline 35ml per kg + 500ml for training
  const waterLiters = Number(((profile.weightKg * 0.035) + 0.6).toFixed(1));

  return {
    calories: Math.round(targetCalories),
    proteinGrams,
    carbsGrams,
    fatsGrams,
    waterLiters,
  };
}

/**
 * 1-Rep Max (1RM) Formulas:
 * - Brzycki: Weight × (36 / (37 - Reps))
 * - Epley: Weight × (1 + Reps / 30)
 */
export function calculate1RM(weight: number, reps: number, formula: 'brzycki' | 'epley' = 'brzycki'): number {
  if (reps <= 0 || weight <= 0) return 0;
  if (reps === 1) return weight;

  if (formula === 'brzycki') {
    if (reps >= 37) return Math.round(weight * 2.5);
    return Math.round(weight * (36 / (37 - reps)));
  }

  // Epley
  return Math.round(weight * (1 + reps / 30));
}

/**
 * Training percentages from 1RM
 */
export function get1RMPercentages(oneRepMax: number) {
  return [
    { percent: 100, reps: '1 RM', weight: Math.round(oneRepMax), zone: 'Maximal Effort' },
    { percent: 95, reps: '2 Reps', weight: Math.round(oneRepMax * 0.95), zone: 'Peaking' },
    { percent: 90, reps: '3-4 Reps', weight: Math.round(oneRepMax * 0.90), zone: 'Heavy Strength' },
    { percent: 85, reps: '5-6 Reps', weight: Math.round(oneRepMax * 0.85), zone: 'Strength Core' },
    { percent: 80, reps: '7-8 Reps', weight: Math.round(oneRepMax * 0.80), zone: 'Hypertrophy Upper' },
    { percent: 75, reps: '9-10 Reps', weight: Math.round(oneRepMax * 0.75), zone: 'Hypertrophy Optimal' },
    { percent: 70, reps: '11-12 Reps', weight: Math.round(oneRepMax * 0.70), zone: 'Hypertrophy Volume' },
    { percent: 65, reps: '15+ Reps', weight: Math.round(oneRepMax * 0.65), zone: 'Muscular Endurance' },
  ];
}

/**
 * Total Volume Load: Sum of (Weight × Reps) for all completed sets
 */
export function calculateVolumeLoad(sets: { weight: number; reps: number; completed: boolean }[]): number {
  return sets
    .filter((s) => s.completed)
    .reduce((sum, s) => sum + s.weight * s.reps, 0);
}

/**
 * US Navy Body Fat % Formula:
 * Men: 86.010 × log10(waist - neck) - 70.041 × log10(height) + 36.76
 * Women: 163.205 × log10(waist + hip - neck) - 97.684 × log10(height) - 78.387
 * (All measurements in cm)
 */
export function calculateNavyBodyFat(data: {
  gender: 'male' | 'female';
  heightCm: number;
  waistCm: number;
  neckCm: number;
  hipsCm?: number;
}): number | null {
  const { gender, heightCm, waistCm, neckCm, hipsCm } = data;
  if (!heightCm || !waistCm || !neckCm) return null;

  try {
    if (gender === 'male') {
      const diff = waistCm - neckCm;
      if (diff <= 0) return null;
      const bf = 86.010 * Math.log10(diff) - 70.041 * Math.log10(heightCm) + 36.76;
      return Number(Math.max(3, Math.min(50, bf)).toFixed(1));
    } else {
      if (!hipsCm) return null;
      const sum = waistCm + hipsCm - neckCm;
      if (sum <= 0) return null;
      const bf = 163.205 * Math.log10(sum) - 97.684 * Math.log10(heightCm) - 78.387;
      return Number(Math.max(8, Math.min(55, bf)).toFixed(1));
    }
  } catch {
    return null;
  }
}

export function kgToLbs(kg: number): number {
  return Math.round(kg * 2.20462);
}

export function lbsToKg(lbs: number): number {
  return Math.round(lbs / 2.20462);
}
