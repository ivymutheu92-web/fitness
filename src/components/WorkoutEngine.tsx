import React, { useState } from 'react';
import { 
  Play, 
  Dumbbell, 
  Flame, 
  ArrowRightLeft, 
  Info, 
  Sparkles, 
  ChevronRight, 
  Plus, 
  CheckCircle2, 
  Layers
} from 'lucide-react';
import { Exercise, MuscleGroup, SplitType, WorkoutSession } from '../types/fitness';
import { EXERCISE_LIBRARY, SPLIT_TEMPLATES } from '../data/exerciseLibrary';
import { AnatomyModel } from './AnatomyModel';
import { ExerciseAnimation } from './ExerciseAnimation';
import { SwapExerciseModal } from './SwapExerciseModal';
import { ActiveWorkoutModal } from './ActiveWorkoutModal';

interface WorkoutEngineProps {
  onLogWorkoutSession: (session: WorkoutSession) => void;
  recentSessions: WorkoutSession[];
}

export const WorkoutEngine: React.FC<WorkoutEngineProps> = ({
  onLogWorkoutSession,
  recentSessions,
}) => {
  // Selected Split
  const [selectedSplitKey, setSelectedSplitKey] = useState<SplitType>('ppl_6');
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  // Selected exercise for deep-dive visual inspection
  const [inspectedExercise, setInspectedExercise] = useState<Exercise>(EXERCISE_LIBRARY[0]);

  // Swapping modal state
  const [exerciseToSwap, setExerciseToSwap] = useState<Exercise | null>(null);

  // Active workout modal state
  const [isActiveSessionOpen, setIsActiveSessionOpen] = useState(false);

  // Custom current day exercises (defaults to template day)
  const currentSplit = SPLIT_TEMPLATES[selectedSplitKey];
  const currentDayTemplate = currentSplit.days[activeDayIndex] || currentSplit.days[0];

  const [currentDayExercises, setCurrentDayExercises] = useState<Exercise[]>(() => {
    return currentDayTemplate.exerciseIds
      .map((id) => EXERCISE_LIBRARY.find((e) => e.id === id))
      .filter((e): e is Exercise => !!e);
  });

  // When day or split changes, update the day's exercises
  const handleSelectDay = (dayIdx: number) => {
    setActiveDayIndex(dayIdx);
    const day = currentSplit.days[dayIdx];
    if (day) {
      const exs = day.exerciseIds
        .map((id) => EXERCISE_LIBRARY.find((e) => e.id === id))
        .filter((e): e is Exercise => !!e);
      setCurrentDayExercises(exs);
      if (exs.length > 0) {
        setInspectedExercise(exs[0]);
      }
    }
  };

  const handleSelectSplit = (splitKey: SplitType) => {
    setSelectedSplitKey(splitKey);
    setActiveDayIndex(0);
    const split = SPLIT_TEMPLATES[splitKey];
    const day = split.days[0];
    const exs = day.exerciseIds
      .map((id) => EXERCISE_LIBRARY.find((e) => e.id === id))
      .filter((e): e is Exercise => !!e);
    setCurrentDayExercises(exs);
    if (exs.length > 0) {
      setInspectedExercise(exs[0]);
    }
  };

  // Replace exercise in current day
  const handleSwapReplacement = (newExercise: Exercise) => {
    if (!exerciseToSwap) return;
    setCurrentDayExercises((prev) =>
      prev.map((ex) => (ex.id === exerciseToSwap.id ? newExercise : ex))
    );
    if (inspectedExercise.id === exerciseToSwap.id) {
      setInspectedExercise(newExercise);
    }
    setExerciseToSwap(null);
  };

  // Add exercise to current workout
  const handleAddExerciseToDay = (ex: Exercise) => {
    if (!currentDayExercises.some((e) => e.id === ex.id)) {
      setCurrentDayExercises([...currentDayExercises, ex]);
    }
  };

  // Remove exercise from current day
  const handleRemoveExerciseFromDay = (exId: string) => {
    setCurrentDayExercises((prev) => prev.filter((e) => e.id !== exId));
  };

  // Muscle targets for current workout
  const targetMuscles = Array.from(
    new Set(currentDayExercises.map((e) => e.primaryMuscle))
  );
  const secondaryMuscles = Array.from(
    new Set(currentDayExercises.flatMap((e) => e.secondaryMuscles))
  );

  return (
    <div className="space-y-8">
      {/* 1. TOP HERO & SPLIT SELECTION */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Dynamic Split Training Engine</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {currentSplit.name}
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              {currentSplit.description}
            </p>
          </div>

          {/* Quick Start Action CTA */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsActiveSessionOpen(true)}
              disabled={currentDayExercises.length === 0}
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95 whitespace-nowrap cursor-pointer"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Launch Live Workout Session</span>
            </button>
          </div>
        </div>

        {/* Split Program Selector Segmented Controls */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex flex-wrap items-center gap-2">
          {(Object.keys(SPLIT_TEMPLATES) as SplitType[]).map((key) => {
            const template = SPLIT_TEMPLATES[key];
            const isSelected = selectedSplitKey === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleSelectSplit(key)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-slate-800 text-white border border-emerald-500/40 shadow-sm'
                    : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800/80'
                }`}
              >
                {template.name.split(' (')[0]}
              </button>
            );
          })}
        </div>

        {/* Days Horizontal Carousel */}
        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {currentSplit.days.map((day, idx) => {
            const isDaySelected = activeDayIndex === idx;
            return (
              <button
                key={day.day}
                type="button"
                onClick={() => handleSelectDay(idx)}
                className={`flex flex-col items-start px-4 py-2.5 rounded-xl border text-left shrink-0 transition-all ${
                  isDaySelected
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300 shadow-sm'
                    : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  Day {day.day}
                </span>
                <span className="text-xs font-semibold whitespace-nowrap">
                  {day.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. DUAL COLUMN: WORKOUT LINEUP & ANATOMY HEATMAP */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Today's Exercise Schedule (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>{currentDayTemplate.name}</span>
                <span className="text-xs font-mono text-slate-400">
                  ({currentDayExercises.length} movements)
                </span>
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span>Primary Stimulus:</span>
                <span className="text-emerald-400 font-medium capitalize">
                  {currentDayTemplate.focus.join(', ') || 'Active Recovery'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsActiveSessionOpen(true)}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
            >
              Start Session <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Exercise List Cards */}
          <div className="space-y-3">
            {currentDayExercises.length === 0 ? (
              <div className="p-8 text-center bg-slate-900/40 border border-slate-800 rounded-2xl text-slate-400">
                <p className="text-sm">Rest & Recovery Day. Muscles grow when resting!</p>
                <p className="text-xs text-slate-500 mt-1">Focus on light walking, hydration, and nutritional surplus.</p>
              </div>
            ) : (
              currentDayExercises.map((exercise, index) => {
                const isInspected = inspectedExercise.id === exercise.id;
                return (
                  <div
                    key={exercise.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isInspected
                        ? 'bg-slate-800/80 border-emerald-500/50 shadow-md'
                        : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => setInspectedExercise(exercise)}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-slate-500 font-bold">
                            0{index + 1}
                          </span>
                          <h3 className="text-sm font-semibold text-white hover:text-emerald-300 transition-colors">
                            {exercise.name}
                          </h3>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1.5">
                          <span className="text-[11px] font-mono uppercase bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
                            {exercise.equipment}
                          </span>
                          <span>Primary: <strong className="text-amber-400 capitalize">{exercise.primaryMuscle}</strong></span>
                          <span aria-hidden="true">·</span>
                          <span>Stabilizers: <span className="capitalize">{exercise.secondaryMuscles.join(', ')}</span></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Swap Button */}
                        <button
                          type="button"
                          onClick={() => setExerciseToSwap(exercise)}
                          className="p-2 text-slate-400 hover:text-emerald-400 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
                          title="Swap with equipment alternative"
                        >
                          <ArrowRightLeft className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Quick Rep/Set Guidance */}
                    <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                      <span className="font-mono">
                        Target: 3-4 Sets · 8-12 Reps · RPE 8-9
                      </span>
                      <button
                        type="button"
                        onClick={() => setInspectedExercise(exercise)}
                        className="text-emerald-400 text-[11px] font-medium hover:underline"
                      >
                        Inspect Biomechanics →
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Visual Kinetic Studio & Anatomy Heatmap (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Looping Vector Animation */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">
                  Looping 3D/Vector Kinematics
                </span>
                <h3 className="text-base font-semibold text-white">
                  {inspectedExercise.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setExerciseToSwap(inspectedExercise)}
                className="text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 flex items-center gap-1"
              >
                <ArrowRightLeft className="w-3 h-3 text-emerald-400" />
                Swap
              </button>
            </div>

            {/* Visual Vector Engine */}
            <ExerciseAnimation
              type={inspectedExercise.animationType}
              name={inspectedExercise.name}
              primaryMuscle={inspectedExercise.primaryMuscle}
            />

            {/* Execution Form Cues & Biomechanics */}
            <div className="space-y-2 text-xs">
              <div className="text-[11px] font-mono uppercase text-slate-400">Execution Protocol</div>
              <ul className="space-y-1.5 text-slate-300">
                {inspectedExercise.instructions.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ul>
              {inspectedExercise.tips.length > 0 && (
                <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-300 text-[11px] mt-2">
                  <strong>Pro Coaching Cue:</strong> {inspectedExercise.tips[0]}
                </div>
              )}
            </div>
          </div>

          {/* Interactive Anatomy Heatmap */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider">
                  Targeted Anatomy Heatmap
                </span>
                <h3 className="text-base font-semibold text-white">
                  Muscular Load Distribution
                </h3>
              </div>
              <span className="text-xs text-slate-400">Interactive</span>
            </div>

            <AnatomyModel
              primaryMuscles={[inspectedExercise.primaryMuscle]}
              secondaryMuscles={inspectedExercise.secondaryMuscles}
              interactive={true}
              onSelectMuscle={(muscle) => {
                // Find first exercise hitting this muscle
                const match = EXERCISE_LIBRARY.find((e) => e.primaryMuscle === muscle);
                if (match) setInspectedExercise(match);
              }}
            />
          </div>
        </div>
      </div>

      {/* 3. EXERCISE LIBRARY BROWSER WITH EQUIPMENT FILTERS */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-white">
              Full Exercise Movement Library
            </h3>
            <p className="text-xs text-slate-400">
              Browse all compound barbell lifts, dumbbell isolation, and cable patterns.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {EXERCISE_LIBRARY.length} Standard Exercises
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {EXERCISE_LIBRARY.map((ex) => (
            <div
              key={ex.id}
              className="p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-xl hover:border-slate-700 flex flex-col justify-between gap-3 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-semibold text-white truncate">
                    {ex.name}
                  </h4>
                  <span className="text-[10px] font-mono uppercase bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800 shrink-0">
                    {ex.equipment}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 capitalize">
                  {ex.primaryMuscle} · {ex.secondaryMuscles.slice(0, 2).join(', ')}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                <button
                  type="button"
                  onClick={() => setInspectedExercise(ex)}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
                >
                  View Loop & Form
                </button>
                <button
                  type="button"
                  onClick={() => handleAddExerciseToDay(ex)}
                  className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
                >
                  + Add to Today
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SWAP MODAL */}
      {exerciseToSwap && (
        <SwapExerciseModal
          currentExercise={exerciseToSwap}
          isOpen={!!exerciseToSwap}
          onClose={() => setExerciseToSwap(null)}
          onSelectSwap={handleSwapReplacement}
        />
      )}

      {/* ACTIVE WORKOUT MODAL */}
      <ActiveWorkoutModal
        isOpen={isActiveSessionOpen}
        onClose={() => setIsActiveSessionOpen(false)}
        initialExercises={currentDayExercises}
        splitTitle={`${currentSplit.name.split(' (')[0]} · ${currentDayTemplate.name}`}
        onFinishWorkout={onLogWorkoutSession}
      />
    </div>
  );
};
