import { Exercise } from '../types/fitness';

export const EXERCISE_LIBRARY: Exercise[] = [
  // --- PUSH EXERCISES ---
  {
    id: 'bb_bench_press',
    name: 'Barbell Flat Bench Press',
    targetCategory: 'push',
    primaryMuscle: 'chest',
    secondaryMuscles: ['triceps', 'shoulders'],
    equipment: 'barbell',
    difficulty: 'intermediate',
    instructions: [
      'Lie flat on the bench with eyes directly below the racked barbell.',
      'Grip the bar slightly wider than shoulder-width, wrists stacked over elbows.',
      'Unrack, retract scapulae, lower bar with control to lower sternum.',
      'Press powerfully upward through the palms in a slight J-curve bar path.'
    ],
    tips: [
      'Maintain 3 points of contact: head, upper back, and glutes.',
      'Drive your feet firmly into the ground for leg drive stability.',
      'Keep elbows tucked at roughly 45–60 degrees to protect shoulders.'
    ],
    animationType: 'bench_press',
    alternatives: ['db_bench_press', 'incline_bb_press', 'weighted_dips', 'machine_chest_press']
  },
  {
    id: 'db_bench_press',
    name: 'Dumbbell Flat Bench Press',
    targetCategory: 'push',
    primaryMuscle: 'chest',
    secondaryMuscles: ['triceps', 'shoulders'],
    equipment: 'dumbbell',
    difficulty: 'beginner',
    instructions: [
      'Kick dumbbells up into position as you lie back onto the flat bench.',
      'Rotate palms slightly inwards at a 45-degree angle.',
      'Lower the dumbbells until you feel a deep, controlled stretch in the chest.',
      'Squeeze the pecs and press the weights upward until arms are extended.'
    ],
    tips: [
      'Allows greater natural range of motion and joint freedom than barbells.',
      'Do not clang the dumbbells together at the top.'
    ],
    animationType: 'bench_press',
    alternatives: ['bb_bench_press', 'incline_db_press', 'machine_chest_press']
  },
  {
    id: 'incline_db_press',
    name: 'Incline Dumbbell Press (30°)',
    targetCategory: 'push',
    primaryMuscle: 'chest',
    secondaryMuscles: ['shoulders', 'triceps'],
    equipment: 'dumbbell',
    difficulty: 'intermediate',
    instructions: [
      'Set bench to 30 degrees (optimal clavicular head activation).',
      'Press dumbbells upward from the shoulders with wrists neutral.',
      'Lower under controlled 3-second eccentric tempo.'
    ],
    tips: [
      'Avoid high bench angles (>45°) which shift load strictly to anterior delts.'
    ],
    animationType: 'bench_press',
    alternatives: ['bb_bench_press', 'incline_bb_press', 'cable_chest_fly']
  },
  {
    id: 'standing_ohp',
    name: 'Standing Overhead Press',
    targetCategory: 'push',
    primaryMuscle: 'shoulders',
    secondaryMuscles: ['triceps', 'traps', 'abs'],
    equipment: 'barbell',
    difficulty: 'advanced',
    instructions: [
      'Clean or rack bar at collarbone height. Grip just outside shoulders.',
      'Brace glutes and core tightly with neutral pelvis.',
      'Press straight up overhead, moving head back slightly to clear the bar.',
      'Lock out with head through the window and shoulders shrugged into bar.'
    ],
    tips: [
      'Never hyperextend the lumbar spine; squeeze glutes like a steel vise.',
      'Vertical bar trajectory ensures maximum leverage.'
    ],
    animationType: 'overhead_press',
    alternatives: ['db_seated_shoulder_press', 'lateral_raise', 'arnold_press']
  },
  {
    id: 'lateral_raise',
    name: 'Cable / Dumbbell Lateral Raise',
    targetCategory: 'push',
    primaryMuscle: 'shoulders',
    secondaryMuscles: ['traps'],
    equipment: 'cable',
    difficulty: 'beginner',
    instructions: [
      'Stand with feet hip-width, slight forward torso lean of 10-15 degrees.',
      'Lead with elbows slightly higher than wrists in the scapular plane.',
      'Raise until elbows reach shoulder height, pause for 1 second.'
    ],
    tips: [
      'Think about pushing the weights out toward the side walls, not pulling up.',
      'Control the eccentric lowering phase for 3 seconds.'
    ],
    animationType: 'lateral_raise',
    alternatives: ['standing_ohp', 'face_pull']
  },
  {
    id: 'tricep_rope_pushdown',
    name: 'Cable Tricep Rope Pushdown',
    targetCategory: 'push',
    primaryMuscle: 'triceps',
    secondaryMuscles: ['forearms'],
    equipment: 'cable',
    difficulty: 'beginner',
    instructions: [
      'Attach rope to high pulley. Keep elbows pinned securely to your ribs.',
      'Push down extending forearms until arms are fully locked.',
      'Flare the rope ends outward at peak contraction for maximum lateral head squeeze.'
    ],
    tips: [
      'Do not swing or allow elbows to travel forward during the eccentric.'
    ],
    animationType: 'tricep_extension',
    alternatives: ['weighted_dips', 'skull_crushers', 'overhead_tricep_ext']
  },
  {
    id: 'weighted_dips',
    name: 'Parallel Bar Dips',
    targetCategory: 'push',
    primaryMuscle: 'triceps',
    secondaryMuscles: ['chest', 'shoulders'],
    equipment: 'bodyweight',
    difficulty: 'intermediate',
    instructions: [
      'Suspend body on parallel bars with arms straight.',
      'Lean torso forward 20-30 degrees for chest focus or keep upright for triceps.',
      'Lower until upper arms are parallel to floor, then press up decisively.'
    ],
    tips: [
      'Avoid dipping past comfortable active shoulder range of motion.'
    ],
    animationType: 'bench_press',
    alternatives: ['bb_bench_press', 'tricep_rope_pushdown']
  },

  // --- PULL EXERCISES ---
  {
    id: 'bb_deadlift',
    name: 'Conventional Barbell Deadlift',
    targetCategory: 'pull',
    primaryMuscle: 'lower_back',
    secondaryMuscles: ['hamstrings', 'glutes', 'lats', 'traps', 'forearms'],
    equipment: 'barbell',
    difficulty: 'advanced',
    instructions: [
      'Stand with mid-foot directly under the barbell, shins 1 inch away.',
      'Hinge hips back, grip bar with double overhand or mixed grip.',
      'Pull slack out of the barbell until you hear the click.',
      'Drive the floor away through mid-foot, locking hips and knees synchronously.'
    ],
    tips: [
      'Do not jerk the bar off the floor.',
      'Engage lats by picturing squeezing lemons in your armpits.'
    ],
    animationType: 'deadlift',
    alternatives: ['rdl_barbell', 'bb_barbell_row', 'hex_bar_deadlift']
  },
  {
    id: 'bb_barbell_row',
    name: 'Pendlay / Bent-Over Barbell Row',
    targetCategory: 'pull',
    primaryMuscle: 'lats',
    secondaryMuscles: ['traps', 'biceps', 'lower_back', 'forearms'],
    equipment: 'barbell',
    difficulty: 'intermediate',
    instructions: [
      'Hinge at hips with torso near parallel to floor, spine neutral.',
      'Grip barbell just outside shoulder width.',
      'Pull elbows toward ceiling, dragging bar towards upper belly/lower ribcage.',
      'Squeeze shoulder blades together forcefully before lowering.'
    ],
    tips: [
      'Resist excessive body English or bouncing off the legs.',
      'Keep neck packed and neutral with the spine.'
    ],
    animationType: 'barbell_row',
    alternatives: ['db_single_arm_row', 'lat_pulldown', 'pull_up']
  },
  {
    id: 'pull_up',
    name: 'Pronated Wide-Grip Pull-Up',
    targetCategory: 'pull',
    primaryMuscle: 'lats',
    secondaryMuscles: ['biceps', 'traps', 'forearms', 'abs'],
    equipment: 'bodyweight',
    difficulty: 'intermediate',
    instructions: [
      'Hang from bar with hands slightly wider than shoulder width.',
      'Depress scapulae first before bending the elbows.',
      'Drive elbows toward back pockets until chin clears the bar.',
      'Lower all the way down to a controlled dead hang.'
    ],
    tips: [
      'Do not kip or kick legs for momentum.',
      'Full eccentric stretch is key for lat hypertrophy.'
    ],
    animationType: 'pull_up',
    alternatives: ['lat_pulldown', 'bb_barbell_row', 'cable_seated_row']
  },
  {
    id: 'lat_pulldown',
    name: 'Cable Wide Lat Pulldown',
    targetCategory: 'pull',
    primaryMuscle: 'lats',
    secondaryMuscles: ['biceps', 'traps'],
    equipment: 'cable',
    difficulty: 'beginner',
    instructions: [
      'Sit with thigh pads locked snug over quadriceps.',
      'Grip the bar wide, lean back approximately 10 degrees.',
      'Pull bar down to clavicle while driving elbows downward and back.',
      'Control the weight as it rises to full stretch overhead.'
    ],
    tips: [
      'Do not lean back into a horizontal row angle.',
      'Focus on the mind-muscle connection pulling with elbows.'
    ],
    animationType: 'pull_up',
    alternatives: ['pull_up', 'bb_barbell_row', 'cable_seated_row']
  },
  {
    id: 'incline_db_curl',
    name: 'Incline Dumbbell Bicep Curl',
    targetCategory: 'pull',
    primaryMuscle: 'biceps',
    secondaryMuscles: ['forearms'],
    equipment: 'dumbbell',
    difficulty: 'beginner',
    instructions: [
      'Set bench to 45–60 degrees. Sit back with arms hanging vertically.',
      'Keep upper arms stationary, curl dumbbells upward with supinated wrists.',
      'Squeeze biceps hard at top without shifting elbows forward.'
    ],
    tips: [
      'Provides maximum passive stretch on long head of the biceps.',
      'Lower slowly over 3 full seconds.'
    ],
    animationType: 'bicep_curl',
    alternatives: ['bb_bicep_curl', 'hammer_curl', 'cable_preacher_curl']
  },
  {
    id: 'face_pull',
    name: 'Cable Face Pull with External Rotation',
    targetCategory: 'pull',
    primaryMuscle: 'traps',
    secondaryMuscles: ['shoulders'],
    equipment: 'cable',
    difficulty: 'beginner',
    instructions: [
      'Set pulley at eye level with rope attachment.',
      'Step back, pull rope directly towards bridge of nose.',
      'Rotate hands back so thumbs point behind you in a double bicep pose.'
    ],
    tips: [
      'Crucial for rotator cuff balance and posterior deltoid health.'
    ],
    animationType: 'lateral_raise',
    alternatives: ['lateral_raise', 'bb_barbell_row']
  },

  // --- LEGS & LOWER BODY ---
  {
    id: 'bb_back_squat',
    name: 'Barbell High-Bar Back Squat',
    targetCategory: 'legs',
    primaryMuscle: 'quads',
    secondaryMuscles: ['glutes', 'hamstrings', 'calves', 'abs', 'lower_back'],
    equipment: 'barbell',
    difficulty: 'advanced',
    instructions: [
      'Rest barbell securely across upper trapezius shelf.',
      'Feet shoulder-width apart, toes flared slightly out 15-25 degrees.',
      'Take deep 360-degree intra-abdominal breath and brace core.',
      'Descend by breaking simultaneously at hips and knees to parallel or below.',
      'Drive aggressively out of the hole maintaining upright torso angle.'
    ],
    tips: [
      'Keep knees tracking in line with second and third toes.',
      'Distribute weight evenly over tripod of the foot (heel, big toe, pinky toe).'
    ],
    animationType: 'squat',
    alternatives: ['leg_press', 'hack_squat', 'goblet_squat', 'bulgarian_split_squat']
  },
  {
    id: 'rdl_barbell',
    name: 'Romanian Deadlift (RDL)',
    targetCategory: 'legs',
    primaryMuscle: 'hamstrings',
    secondaryMuscles: ['glutes', 'lower_back', 'forearms'],
    equipment: 'barbell',
    difficulty: 'intermediate',
    instructions: [
      'Start standing tall with barbell at hip height.',
      'Slight soft unlock at the knees (keep angle fixed throughout).',
      'Push hips horizontally backward toward wall behind you.',
      'Lower bar close to shins until deep hamstring stretch is reached.',
      'Squeeze glutes forward to return to standing lockout.'
    ],
    tips: [
      'This is a pure hip hinge, not a squat.',
      'Keep bar skimming closely against thighs and shins.'
    ],
    animationType: 'deadlift',
    alternatives: ['lying_leg_curl', 'bb_deadlift', 'db_rdl']
  },
  {
    id: 'leg_press',
    name: '45-Degree Incline Leg Press',
    targetCategory: 'legs',
    primaryMuscle: 'quads',
    secondaryMuscles: ['glutes', 'calves'],
    equipment: 'machine',
    difficulty: 'beginner',
    instructions: [
      'Position back flat against pad with lumbar firmly supported.',
      'Place feet shoulder-width on center platform.',
      'Disengage safety catches, lower platform smoothly to 90-degree knee bend.',
      'Press through full foot back up without violently locking knees out.'
    ],
    tips: [
      'Never allow lower back or tailbone to round off the backrest.'
    ],
    animationType: 'leg_press',
    alternatives: ['bb_back_squat', 'hack_squat', 'bulgarian_split_squat']
  },
  {
    id: 'bulgarian_split_squat',
    name: 'Dumbbell Bulgarian Split Squat',
    targetCategory: 'legs',
    primaryMuscle: 'quads',
    secondaryMuscles: ['glutes', 'hamstrings', 'calves'],
    equipment: 'dumbbell',
    difficulty: 'intermediate',
    instructions: [
      'Elevate rear foot on bench behind you laces down.',
      'Take comfortable lunge stride forward with front foot.',
      'Descend until rear knee gently kisses floor or mat.',
      'Drive up through the front heel and mid-foot.'
    ],
    tips: [
      'Lean torso slightly forward to target glutes, upright for quads.',
      'Unmatched single-leg hypertrophy and hip stabilizer stimulus.'
    ],
    animationType: 'squat',
    alternatives: ['walking_lunges', 'bb_back_squat', 'leg_press']
  },
  {
    id: 'standing_calf_raise',
    name: 'Standing Machine Calf Raise',
    targetCategory: 'legs',
    primaryMuscle: 'calves',
    secondaryMuscles: ['forearms'],
    equipment: 'machine',
    difficulty: 'beginner',
    instructions: [
      'Place balls of feet on step block with heels hanging off.',
      'Lower heels as deep as possible into full dorsiflexion stretch, pause 2s.',
      'Explode onto balls of toes into full plantarflexion contraction, hold 1s.'
    ],
    tips: [
      'Bouncing ruins calf stimulus; paused reps at bottom eradicate stretch reflex.'
    ],
    animationType: 'calf_raise',
    alternatives: ['seated_calf_raise', 'leg_press_calf_raise']
  },

  // --- CORE & ABDOMINALS ---
  {
    id: 'hanging_leg_raise',
    name: 'Hanging Captain / Bar Leg Raise',
    targetCategory: 'core',
    primaryMuscle: 'abs',
    secondaryMuscles: ['obliques', 'forearms'],
    equipment: 'bodyweight',
    difficulty: 'intermediate',
    instructions: [
      'Hang from pull-up bar or support on captain’s chair.',
      'Roll pelvis backward and flex spine to curl knees/feet toward chest.',
      'Do not just swing legs from hip flexors—curl the pelvis upward.'
    ],
    tips: [
      'Control the lowering phase to prevent swinging.'
    ],
    animationType: 'plank',
    alternatives: ['ab_wheel_rollout', 'cable_woodchoppers', 'cable_crunch']
  },
  {
    id: 'ab_wheel_rollout',
    name: 'Abdominal Wheel Rollout',
    targetCategory: 'core',
    primaryMuscle: 'abs',
    secondaryMuscles: ['obliques', 'lats'],
    equipment: 'bodyweight',
    difficulty: 'advanced',
    instructions: [
      'Kneel with wheel directly beneath shoulders.',
      'Tuck pelvis into posterior tilt, roll wheel forward under control.',
      'Extend body out as far as core can maintain flat/rounded back without sagging.',
      'Pull back through abs to return to start.'
    ],
    tips: [
      'Never allow lower back to arch or belly to sag toward the floor.'
    ],
    animationType: 'plank',
    alternatives: ['hanging_leg_raise', 'plank']
  }
];

export const SPLIT_TEMPLATES = {
  ppl_6: {
    name: 'Push / Pull / Legs (6-Day Hypertrophy)',
    description: 'High-frequency 6-day split training each muscle group twice every 7 days for maximum hypertrophy and volume distribution.',
    days: [
      { day: 1, name: 'Push A (Chest & Triceps Focus)', focus: ['chest', 'shoulders', 'triceps'], exerciseIds: ['bb_bench_press', 'incline_db_press', 'standing_ohp', 'lateral_raise', 'tricep_rope_pushdown'] },
      { day: 2, name: 'Pull A (Lats & Biceps Focus)', focus: ['lats', 'biceps', 'traps'], exerciseIds: ['bb_deadlift', 'bb_barbell_row', 'pull_up', 'incline_db_curl', 'face_pull'] },
      { day: 3, name: 'Legs A (Quad & Core Dominant)', focus: ['quads', 'calves', 'abs'], exerciseIds: ['bb_back_squat', 'leg_press', 'bulgarian_split_squat', 'standing_calf_raise', 'hanging_leg_raise'] },
      { day: 4, name: 'Push B (Shoulders & Upper Chest)', focus: ['shoulders', 'chest', 'triceps'], exerciseIds: ['standing_ohp', 'incline_db_press', 'db_bench_press', 'lateral_raise', 'weighted_dips'] },
      { day: 5, name: 'Pull B (Upper Back & Posterior Chain)', focus: ['lats', 'traps', 'biceps'], exerciseIds: ['bb_barbell_row', 'lat_pulldown', 'rdl_barbell', 'incline_db_curl', 'face_pull'] },
      { day: 6, name: 'Legs B (Hamstrings & Posterior Chain)', focus: ['hamstrings', 'glutes', 'calves'], exerciseIds: ['rdl_barbell', 'bb_back_squat', 'bulgarian_split_squat', 'standing_calf_raise', 'ab_wheel_rollout'] },
      { day: 7, name: 'Active Recovery / Rest', focus: [], exerciseIds: [] },
    ]
  },
  ppl_3: {
    name: 'Push / Pull / Legs (3-Day Balanced)',
    description: 'Classic 3-day split ideal for busy schedules, ensuring full-body coverage with ample 48-72h recovery periods.',
    days: [
      { day: 1, name: 'Push Day', focus: ['chest', 'shoulders', 'triceps'], exerciseIds: ['bb_bench_press', 'standing_ohp', 'incline_db_press', 'lateral_raise', 'tricep_rope_pushdown'] },
      { day: 2, name: 'Pull Day', focus: ['lats', 'traps', 'biceps', 'lower_back'], exerciseIds: ['bb_deadlift', 'bb_barbell_row', 'pull_up', 'incline_db_curl', 'face_pull'] },
      { day: 3, name: 'Legs & Core Day', focus: ['quads', 'hamstrings', 'calves', 'abs'], exerciseIds: ['bb_back_squat', 'rdl_barbell', 'leg_press', 'standing_calf_raise', 'hanging_leg_raise'] },
    ]
  },
  upper_lower: {
    name: 'Upper / Lower (4-Day Split)',
    description: 'Power-hypertrophy split dividing training into two heavy strength days and two targeted hypertrophy volume days.',
    days: [
      { day: 1, name: 'Upper A (Heavy Strength)', focus: ['chest', 'lats', 'shoulders', 'triceps', 'biceps'], exerciseIds: ['bb_bench_press', 'bb_barbell_row', 'standing_ohp', 'weighted_dips', 'incline_db_curl'] },
      { day: 2, name: 'Lower A (Quad Dominant)', focus: ['quads', 'calves', 'abs'], exerciseIds: ['bb_back_squat', 'leg_press', 'bulgarian_split_squat', 'standing_calf_raise', 'hanging_leg_raise'] },
      { day: 3, name: 'Rest / Mobility', focus: [], exerciseIds: [] },
      { day: 4, name: 'Upper B (Hypertrophy & Pump)', focus: ['chest', 'lats', 'shoulders', 'biceps'], exerciseIds: ['incline_db_press', 'lat_pulldown', 'lateral_raise', 'face_pull', 'tricep_rope_pushdown'] },
      { day: 5, name: 'Lower B (Hamstrings & Posterior)', focus: ['hamstrings', 'glutes', 'quads'], exerciseIds: ['rdl_barbell', 'bb_back_squat', 'standing_calf_raise', 'ab_wheel_rollout'] },
      { day: 6, name: 'Rest', focus: [], exerciseIds: [] },
      { day: 7, name: 'Rest', focus: [], exerciseIds: [] },
    ]
  },
  full_body: {
    name: 'Full Body (3-Day Split)',
    description: 'Whole-body stimulation 3x per week hitting compound barbell staples on non-consecutive days.',
    days: [
      { day: 1, name: 'Full Body A', focus: ['quads', 'chest', 'lats'], exerciseIds: ['bb_back_squat', 'bb_bench_press', 'bb_barbell_row', 'tricep_rope_pushdown', 'standing_calf_raise'] },
      { day: 2, name: 'Full Body B', focus: ['hamstrings', 'shoulders', 'lats'], exerciseIds: ['bb_deadlift', 'standing_ohp', 'pull_up', 'incline_db_curl', 'hanging_leg_raise'] },
      { day: 3, name: 'Full Body C', focus: ['quads', 'chest', 'hamstrings'], exerciseIds: ['leg_press', 'incline_db_press', 'rdl_barbell', 'lateral_raise', 'ab_wheel_rollout'] },
    ]
  }
};
