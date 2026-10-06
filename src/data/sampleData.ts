import { 
  UserNutritionProfile, 
  WorkoutSession, 
  OneRepMaxRecord, 
  CardioLog, 
  BodyTapeMeasurement, 
  PhotoComparison, 
  DailyMeal, 
  GroceryItem 
} from '../types/fitness';

export const INITIAL_USER_PROFILE: UserNutritionProfile = {
  gender: 'male',
  age: 27,
  weightKg: 78.5,
  heightCm: 180,
  activityLevel: 'moderate',
  goal: 'hypertrophy',
  targetProteinPerKg: 2.0,
  customCalorieAdjustment: 350,
};

export const INITIAL_PHOTO_COMPARISONS: PhotoComparison[] = [
  {
    id: 'comp_front',
    title: 'Front Posture Recomposition (Month 1 vs Month 6)',
    dateA: '2026-04-12',
    dateB: '2026-10-04',
    weightA: 82.0,
    weightB: 78.5,
    imageA: '/src/assets/images/physique_front_month1_1791291601311.jpg',
    imageB: '/src/assets/images/physique_front_month6_1791291612942.jpg',
    view: 'front',
  },
  {
    id: 'comp_side',
    title: 'Sagittal Profile Alignment (Month 1 vs Month 6)',
    dateA: '2026-04-12',
    dateB: '2026-10-04',
    weightA: 82.0,
    weightB: 78.5,
    imageA: '/src/assets/images/physique_side_month1_1791291623415.jpg',
    imageB: '/src/assets/images/physique_side_month6_1791291633638.jpg',
    view: 'side',
  },
];

export const INITIAL_1RM_RECORDS: OneRepMaxRecord[] = [
  {
    id: '1rm_bench',
    exerciseId: 'bb_bench_press',
    exerciseName: 'Barbell Flat Bench Press',
    date: '2026-10-02',
    weightLifted: 102.5,
    repsPerformed: 4,
    estimated1RM: 114,
    formula: 'brzycki',
  },
  {
    id: '1rm_squat',
    exerciseId: 'bb_back_squat',
    exerciseName: 'Barbell Back Squat',
    date: '2026-09-30',
    weightLifted: 140.0,
    repsPerformed: 5,
    estimated1RM: 160,
    formula: 'brzycki',
  },
  {
    id: '1rm_deadlift',
    exerciseId: 'bb_deadlift',
    exerciseName: 'Conventional Barbell Deadlift',
    date: '2026-09-27',
    weightLifted: 175.0,
    repsPerformed: 3,
    estimated1RM: 188,
    formula: 'brzycki',
  },
  {
    id: '1rm_ohp',
    exerciseId: 'standing_ohp',
    exerciseName: 'Standing Overhead Press',
    date: '2026-10-04',
    weightLifted: 67.5,
    repsPerformed: 5,
    estimated1RM: 77,
    formula: 'brzycki',
  },
];

export const INITIAL_BODY_MEASUREMENTS: BodyTapeMeasurement[] = [
  {
    id: 'meas_1',
    date: '2026-08-01',
    weightKg: 81.2,
    chestCm: 104.5,
    armsCm: 37.0,
    waistCm: 86.0,
    hipsCm: 99.0,
    thighsCm: 60.5,
    calvesCm: 38.0,
    neckCm: 39.0,
    bodyFatPercent: 17.8,
    notes: 'Baseline check before hypertrophy cycle',
  },
  {
    id: 'meas_2',
    date: '2026-09-01',
    weightKg: 79.8,
    chestCm: 106.0,
    armsCm: 38.2,
    waistCm: 83.5,
    hipsCm: 98.0,
    thighsCm: 61.2,
    calvesCm: 38.5,
    neckCm: 39.5,
    bodyFatPercent: 15.6,
    notes: 'Waist down 2.5cm, arm perimeter +1.2cm',
  },
  {
    id: 'meas_3',
    date: '2026-10-01',
    weightKg: 78.5,
    chestCm: 107.5,
    armsCm: 39.0,
    waistCm: 81.0,
    hipsCm: 97.5,
    thighsCm: 62.0,
    calvesCm: 39.0,
    neckCm: 40.0,
    bodyFatPercent: 13.9,
    notes: 'Optimal muscle tone and abdominal separation visible',
  },
];

export const INITIAL_CARDIO_LOGS: CardioLog[] = [
  {
    id: 'cardio_1',
    type: 'running',
    date: '2026-10-05',
    durationMinutes: 32,
    distanceKm: 5.4,
    avgHeartRate: 146,
    maxHeartRate: 168,
    rpe: 7,
    caloriesBurned: 380,
  },
  {
    id: 'cardio_2',
    type: 'rowing',
    date: '2026-10-03',
    durationMinutes: 20,
    distanceKm: 4.2,
    avgHeartRate: 158,
    maxHeartRate: 174,
    rpe: 8,
    caloriesBurned: 245,
  },
  {
    id: 'cardio_3',
    type: 'cycling',
    date: '2026-09-29',
    durationMinutes: 45,
    distanceKm: 18.5,
    avgHeartRate: 138,
    maxHeartRate: 155,
    rpe: 6,
    caloriesBurned: 420,
  },
];

export const INITIAL_WORKOUT_HISTORY: WorkoutSession[] = [
  {
    id: 'sess_1',
    name: 'Push A (Chest & Triceps Focus)',
    splitType: 'ppl_6',
    date: '2026-10-04',
    durationMinutes: 62,
    completed: true,
    totalVolumeKg: 8940,
    exercises: [
      {
        exerciseId: 'bb_bench_press',
        exerciseName: 'Barbell Flat Bench Press',
        sets: [
          { id: 's1', type: 'warmup', reps: 10, weight: 60, rpe: 5, completed: true },
          { id: 's2', type: 'normal', reps: 8, weight: 90, rpe: 8, completed: true },
          { id: 's3', type: 'normal', reps: 8, weight: 90, rpe: 8.5, completed: true },
          { id: 's4', type: 'normal', reps: 6, weight: 95, rpe: 9, completed: true },
        ],
      },
      {
        exerciseId: 'incline_db_press',
        exerciseName: 'Incline Dumbbell Press (30°)',
        sets: [
          { id: 's5', type: 'normal', reps: 10, weight: 32, rpe: 8, completed: true },
          { id: 's6', type: 'normal', reps: 10, weight: 32, rpe: 8.5, completed: true },
          { id: 's7', type: 'normal', reps: 8, weight: 34, rpe: 9, completed: true },
        ],
      },
      {
        exerciseId: 'standing_ohp',
        exerciseName: 'Standing Overhead Press',
        sets: [
          { id: 's8', type: 'normal', reps: 8, weight: 55, rpe: 8, completed: true },
          { id: 's9', type: 'normal', reps: 7, weight: 55, rpe: 8.5, completed: true },
          { id: 's10', type: 'normal', reps: 6, weight: 55, rpe: 9, completed: true },
        ],
      },
      {
        exerciseId: 'lateral_raise',
        exerciseName: 'Cable / Dumbbell Lateral Raise',
        sets: [
          { id: 's11', type: 'normal', reps: 15, weight: 14, rpe: 8, completed: true },
          { id: 's12', type: 'normal', reps: 15, weight: 14, rpe: 9, completed: true },
          { id: 's13', type: 'drop', reps: 12, weight: 10, rpe: 10, completed: true },
        ],
      },
      {
        exerciseId: 'tricep_rope_pushdown',
        exerciseName: 'Cable Tricep Rope Pushdown',
        sets: [
          { id: 's14', type: 'normal', reps: 12, weight: 30, rpe: 8, completed: true },
          { id: 's15', type: 'normal', reps: 12, weight: 30, rpe: 9, completed: true },
          { id: 's16', type: 'failure', reps: 10, weight: 30, rpe: 10, completed: true },
        ],
      },
    ],
  },
  {
    id: 'sess_2',
    name: 'Pull A (Lats & Biceps Focus)',
    splitType: 'ppl_6',
    date: '2026-10-02',
    durationMinutes: 68,
    completed: true,
    totalVolumeKg: 9480,
    exercises: [
      {
        exerciseId: 'bb_deadlift',
        exerciseName: 'Conventional Barbell Deadlift',
        sets: [
          { id: 'd1', type: 'warmup', reps: 8, weight: 100, rpe: 5, completed: true },
          { id: 'd2', type: 'normal', reps: 5, weight: 150, rpe: 8, completed: true },
          { id: 'd3', type: 'normal', reps: 5, weight: 160, rpe: 8.5, completed: true },
          { id: 'd4', type: 'normal', reps: 3, weight: 175, rpe: 9.5, completed: true },
        ],
      },
      {
        exerciseId: 'bb_barbell_row',
        exerciseName: 'Pendlay / Bent-Over Barbell Row',
        sets: [
          { id: 'd5', type: 'normal', reps: 8, weight: 80, rpe: 8, completed: true },
          { id: 'd6', type: 'normal', reps: 8, weight: 80, rpe: 8.5, completed: true },
          { id: 'd7', type: 'normal', reps: 8, weight: 80, rpe: 9, completed: true },
        ],
      },
      {
        exerciseId: 'pull_up',
        exerciseName: 'Pronated Wide-Grip Pull-Up',
        sets: [
          { id: 'd8', type: 'normal', reps: 10, weight: 78.5, rpe: 8, completed: true },
          { id: 'd9', type: 'normal', reps: 9, weight: 78.5, rpe: 8.5, completed: true },
          { id: 'd10', type: 'normal', reps: 8, weight: 78.5, rpe: 9, completed: true },
        ],
      },
      {
        exerciseId: 'incline_db_curl',
        exerciseName: 'Incline Dumbbell Bicep Curl',
        sets: [
          { id: 'd11', type: 'normal', reps: 12, weight: 16, rpe: 8.5, completed: true },
          { id: 'd12', type: 'normal', reps: 10, weight: 16, rpe: 9, completed: true },
          { id: 'd13', type: 'normal', reps: 10, weight: 14, rpe: 9.5, completed: true },
        ],
      },
    ],
  },
  {
    id: 'sess_3',
    name: 'Legs A (Quad & Core Dominant)',
    splitType: 'ppl_6',
    date: '2026-09-30',
    durationMinutes: 72,
    completed: true,
    totalVolumeKg: 11250,
    exercises: [
      {
        exerciseId: 'bb_back_squat',
        exerciseName: 'Barbell High-Bar Back Squat',
        sets: [
          { id: 'l1', type: 'warmup', reps: 10, weight: 80, rpe: 5, completed: true },
          { id: 'l2', type: 'normal', reps: 6, weight: 130, rpe: 8, completed: true },
          { id: 'l3', type: 'normal', reps: 6, weight: 135, rpe: 8.5, completed: true },
          { id: 'l4', type: 'normal', reps: 5, weight: 140, rpe: 9, completed: true },
        ],
      },
      {
        exerciseId: 'leg_press',
        exerciseName: '45-Degree Incline Leg Press',
        sets: [
          { id: 'l5', type: 'normal', reps: 12, weight: 220, rpe: 8, completed: true },
          { id: 'l6', type: 'normal', reps: 12, weight: 240, rpe: 8.5, completed: true },
          { id: 'l7', type: 'normal', reps: 10, weight: 260, rpe: 9, completed: true },
        ],
      },
      {
        exerciseId: 'standing_calf_raise',
        exerciseName: 'Standing Machine Calf Raise',
        sets: [
          { id: 'l8', type: 'normal', reps: 15, weight: 85, rpe: 8, completed: true },
          { id: 'l9', type: 'normal', reps: 15, weight: 85, rpe: 8.5, completed: true },
          { id: 'l10', type: 'normal', reps: 12, weight: 90, rpe: 9, completed: true },
        ],
      },
    ],
  },
];

export const INITIAL_DAILY_MEALS: DailyMeal[] = [
  {
    id: 'meal_1',
    category: 'breakfast',
    name: 'Power Oats with Whey Isolate & Blueberries',
    prepTimeMinutes: 10,
    calories: 620,
    proteinGrams: 48,
    carbsGrams: 75,
    fatsGrams: 14,
    ingredients: [
      '100g Rolled Whole Oats',
      '40g Grass-Fed Whey Isolate Vanilla',
      '80g Fresh Blueberries',
      '20g Chia Seeds',
      '200ml Unsweetened Almond Milk'
    ],
    swapAlternatives: ['meal_alt_eggs', 'meal_alt_pancakes'],
    logged: true,
  },
  {
    id: 'meal_2',
    category: 'lunch',
    name: 'Grilled Free-Range Chicken Breast, Quinoa & Avocado',
    prepTimeMinutes: 20,
    calories: 780,
    proteinGrams: 62,
    carbsGrams: 72,
    fatsGrams: 24,
    ingredients: [
      '220g Chicken Breast (Herbed Garlic)',
      '180g Cooked Tri-Color Quinoa',
      '1/2 Hass Avocado sliced',
      '150g Steamed Broccoli with Lemon',
      '10ml Extra Virgin Olive Oil'
    ],
    swapAlternatives: ['meal_alt_salmon', 'meal_alt_steak_rice'],
    logged: true,
  },
  {
    id: 'meal_3',
    category: 'snack',
    name: 'Pre-Workout Greek Yogurt, Banana & Almond Butter',
    prepTimeMinutes: 5,
    calories: 440,
    proteinGrams: 32,
    carbsGrams: 52,
    fatsGrams: 12,
    ingredients: [
      '220g 0% Plain Greek Yogurt',
      '1 Medium Ripe Banana',
      '20g Natural Roasted Almond Butter',
      '1 tsp Raw Honey'
    ],
    swapAlternatives: ['meal_alt_rice_cakes', 'meal_alt_protein_shake'],
    logged: false,
  },
  {
    id: 'meal_4',
    category: 'dinner',
    name: 'Wild Alaskan Salmon Fillet, Roasted Sweet Potato & Asparagus',
    prepTimeMinutes: 25,
    calories: 760,
    proteinGrams: 54,
    carbsGrams: 65,
    fatsGrams: 28,
    ingredients: [
      '200g Wild Sockeye Salmon Fillet',
      '250g Cubed Roasted Sweet Potato',
      '120g Grilled Asparagus Spears',
      '10ml Olive Oil with Sea Salt & Rosemary'
    ],
    swapAlternatives: ['meal_alt_sirloin', 'meal_alt_turkey_pasta'],
    logged: false,
  },
];

export const MEAL_SWAP_DATABASE: Record<string, DailyMeal> = {
  meal_alt_eggs: {
    id: 'meal_alt_eggs',
    category: 'breakfast',
    name: 'Sourdough Toast with Scrambled Eggs & Turkey Bacon',
    prepTimeMinutes: 12,
    calories: 610,
    proteinGrams: 46,
    carbsGrams: 58,
    fatsGrams: 20,
    ingredients: [
      '3 Whole Free-Range Eggs + 2 Egg Whites',
      '2 Slices Artisanal Sourdough Toast',
      '3 Strips Nitrate-Free Turkey Bacon',
      'Handful of Baby Spinach'
    ],
    logged: false,
  },
  meal_alt_salmon: {
    id: 'meal_alt_salmon',
    category: 'lunch',
    name: 'Pan-Seared Salmon Poke Bowl with Jasmine Rice',
    prepTimeMinutes: 18,
    calories: 770,
    proteinGrams: 55,
    carbsGrams: 78,
    fatsGrams: 26,
    ingredients: [
      '190g Atlantic Salmon cubes',
      '180g Steamed Jasmine Rice',
      '60g Edamame beans shelled',
      'Cucumber slices, Nori strips & Tamari sauce'
    ],
    logged: false,
  },
  meal_alt_steak_rice: {
    id: 'meal_alt_steak_rice',
    category: 'lunch',
    name: 'Grass-Fed Flank Steak with Basmati Rice & Asparagus',
    prepTimeMinutes: 20,
    calories: 790,
    proteinGrams: 64,
    carbsGrams: 70,
    fatsGrams: 25,
    ingredients: [
      '220g Flank Steak medium-rare',
      '200g Cooked Basmati Rice',
      '100g Roasted Asparagus',
      'Chimichurri herb drizzle'
    ],
    logged: false,
  },
  meal_alt_sirloin: {
    id: 'meal_alt_sirloin',
    category: 'dinner',
    name: 'Top Sirloin Steak with Roasted Russet Potato & Garlic Green Beans',
    prepTimeMinutes: 25,
    calories: 780,
    proteinGrams: 62,
    carbsGrams: 64,
    fatsGrams: 27,
    ingredients: [
      '220g Lean Top Sirloin Steak',
      '220g Baked Russet Potato with greek yogurt dollop',
      '150g Sauteed Green Beans with Garlic'
    ],
    logged: false,
  },
  meal_alt_rice_cakes: {
    id: 'meal_alt_rice_cakes',
    category: 'snack',
    name: 'Crispy Rice Cakes with Peanut Butter, Sliced Banana & Whey',
    prepTimeMinutes: 4,
    calories: 430,
    proteinGrams: 30,
    carbsGrams: 54,
    fatsGrams: 11,
    ingredients: [
      '3 Organic Brown Rice Cakes',
      '25g 100% Natural Peanut Butter',
      '1 sliced banana',
      '1 scoop isolate in water'
    ],
    logged: false,
  }
};

export const INITIAL_GROCERY_LIST: GroceryItem[] = [
  // Produce
  { id: 'g_1', name: 'Fresh Blueberries', category: 'produce', quantity: '2 punnets (300g)', checked: true },
  { id: 'g_2', name: 'Broccoli Crowns', category: 'produce', quantity: '2 large heads', checked: true },
  { id: 'g_3', name: 'Sweet Potatoes', category: 'produce', quantity: '1.5 kg', checked: false },
  { id: 'g_4', name: 'Asparagus Spears', category: 'produce', quantity: '2 bunches (500g)', checked: false },
  { id: 'g_5', name: 'Bananas', category: 'produce', quantity: '1 bunch (6 items)', checked: true },
  { id: 'g_6', name: 'Hass Avocados', category: 'produce', quantity: '4 medium', checked: false },
  { id: 'g_7', name: 'Baby Spinach', category: 'produce', quantity: '1 family bag (250g)', checked: false },

  // Lean Proteins
  { id: 'g_8', name: 'Free-Range Chicken Breast', category: 'protein', quantity: '1.2 kg', checked: true },
  { id: 'g_9', name: 'Wild Sockeye Salmon Fillets', category: 'protein', quantity: '800g (4 portions)', checked: false },
  { id: 'g_10', name: 'Lean Top Sirloin Steak', category: 'protein', quantity: '650g', checked: false },
  { id: 'g_11', name: 'Free-Range Eggs (Large)', category: 'protein', quantity: '1 carton (18 eggs)', checked: true },
  { id: 'g_12', name: 'Plain Greek Yogurt 0% Fat', category: 'protein', quantity: '1 kg tub', checked: true },

  // Complex Carbs & Grains
  { id: 'g_13', name: 'Rolled Whole Oats', category: 'grains', quantity: '1 kg bag', checked: true },
  { id: 'g_14', name: 'Tri-Color Quinoa', category: 'grains', quantity: '500g bag', checked: false },
  { id: 'g_15', name: 'Basmati / Jasmine Rice', category: 'grains', quantity: '1 kg bag', checked: true },
  { id: 'g_16', name: 'Artisanal Sourdough Loaf', category: 'grains', quantity: '1 loaf', checked: false },

  // Healthy Fats & Seeds
  { id: 'g_17', name: 'Extra Virgin Olive Oil (Cold-Pressed)', category: 'fats', quantity: '750ml bottle', checked: true },
  { id: 'g_18', name: 'Chia Seeds', category: 'fats', quantity: '250g pack', checked: false },
  { id: 'g_19', name: 'Natural Roasted Almond Butter', category: 'fats', quantity: '350g jar', checked: true },

  // Pantry & Supplements
  { id: 'g_20', name: 'Grass-Fed Whey Isolate (Vanilla)', category: 'pantry', quantity: '1 kg tub', checked: true },
  { id: 'g_21', name: 'Unsweetened Almond Milk', category: 'pantry', quantity: '2 liters', checked: true },
  { id: 'g_22', name: 'Raw Honey / Himalayan Sea Salt', category: 'pantry', quantity: '1 jar', checked: true },
];
