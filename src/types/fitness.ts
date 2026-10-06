export type MuscleGroup = 
  | 'chest'
  | 'shoulders'
  | 'triceps'
  | 'biceps'
  | 'forearms'
  | 'lats'
  | 'traps'
  | 'lower_back'
  | 'abs'
  | 'obliques'
  | 'quads'
  | 'hamstrings'
  | 'glutes'
  | 'calves';

export type Equipment =
  | 'barbell'
  | 'dumbbell'
  | 'cable'
  | 'machine'
  | 'bodyweight'
  | 'kettlebell';

export type SplitType = 'ppl_6' | 'ppl_3' | 'upper_lower' | 'full_body';

export interface Exercise {
  id: string;
  name: string;
  targetCategory: 'push' | 'pull' | 'legs' | 'core';
  primaryMuscle: MuscleGroup;
  secondaryMuscles: MuscleGroup[];
  equipment: Equipment;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions: string[];
  tips: string[];
  animationType: 'bench_press' | 'squat' | 'deadlift' | 'overhead_press' | 'pull_up' | 'barbell_row' | 'bicep_curl' | 'tricep_extension' | 'lateral_raise' | 'leg_press' | 'calf_raise' | 'plank';
  alternatives: string[]; // Exercise IDs
}

export type SetType = 'warmup' | 'normal' | 'drop' | 'failure';

export interface WorkoutSet {
  id: string;
  type: SetType;
  reps: number;
  weight: number; // in kg (or user unit)
  rpe: number; // 1 to 10
  completed: boolean;
  notes?: string;
}

export interface WorkoutExerciseLog {
  exerciseId: string;
  exerciseName: string;
  sets: WorkoutSet[];
  notes?: string;
}

export interface WorkoutSession {
  id: string;
  name: string;
  splitType: SplitType;
  date: string; // ISO date string
  durationMinutes: number;
  exercises: WorkoutExerciseLog[];
  completed: boolean;
  totalVolumeKg: number;
}

export interface OneRepMaxRecord {
  id: string;
  exerciseId: string;
  exerciseName: string;
  date: string;
  weightLifted: number;
  repsPerformed: number;
  estimated1RM: number;
  formula: 'brzycki' | 'epley';
}

export interface CardioLog {
  id: string;
  type: 'running' | 'cycling' | 'rowing' | 'stairmaster' | 'hiit';
  date: string;
  durationMinutes: number;
  distanceKm: number;
  avgHeartRate: number;
  maxHeartRate: number;
  rpe: number;
  caloriesBurned: number;
}

export interface BodyTapeMeasurement {
  id: string;
  date: string;
  weightKg: number;
  chestCm: number;
  armsCm: number;
  waistCm: number;
  hipsCm: number;
  thighsCm: number;
  calvesCm: number;
  neckCm: number;
  bodyFatPercent?: number;
  notes?: string;
}

export interface PhotoComparison {
  id: string;
  title: string;
  dateA: string;
  dateB: string;
  weightA: number;
  weightB: number;
  imageA: string;
  imageB: string;
  view: 'front' | 'side' | 'back';
}

export type NutritionGoal = 'hypertrophy' | 'recomposition' | 'fat_loss';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very_active' | 'athlete';
export type Gender = 'male' | 'female';

export interface UserNutritionProfile {
  gender: Gender;
  age: number;
  weightKg: number;
  heightCm: number;
  activityLevel: ActivityLevel;
  goal: NutritionGoal;
  customCalorieAdjustment?: number;
  targetProteinPerKg: number; // e.g. 2.0 or 2.2
}

export interface MacroTarget {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  waterLiters: number;
}

export interface MealItem {
  id: string;
  name: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  servingSize: string;
}

export interface DailyMeal {
  id: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  prepTimeMinutes: number;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  ingredients: string[];
  swapAlternatives?: string[]; // IDs of meal alternatives
  logged: boolean;
}

export interface GroceryItem {
  id: string;
  name: string;
  category: 'produce' | 'protein' | 'grains' | 'fats' | 'pantry';
  quantity: string;
  checked: boolean;
}
