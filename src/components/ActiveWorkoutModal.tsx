import React, { useState, useEffect } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Check, 
  Clock, 
  Flame, 
  Volume2, 
  ArrowRightLeft,
  ChevronDown
} from 'lucide-react';
import { Exercise, SetType, WorkoutExerciseLog, WorkoutSession } from '../types/fitness';
import { soundEffects } from '../utils/audio';
import { calculateVolumeLoad } from '../utils/calculations';
import { EXERCISE_LIBRARY } from '../data/exerciseLibrary';
import { SwapExerciseModal } from './SwapExerciseModal';

interface ActiveWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFinishWorkout: (session: WorkoutSession) => void;
  initialExercises: Exercise[];
  splitTitle: string;
}

export const ActiveWorkoutModal: React.FC<ActiveWorkoutModalProps> = ({
  isOpen,
  onClose,
  onFinishWorkout,
  initialExercises,
  splitTitle,
}) => {
  // Workout State
  const [exercises, setExercises] = useState<WorkoutExerciseLog[]>([]);
  const [workoutSeconds, setWorkoutSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Rest Timer State
  const [restSecondsRemaining, setRestSecondsRemaining] = useState<number | null>(null);
  const [restDuration, setRestDuration] = useState(90); // default 90s
  const [isRestTimerActive, setIsRestTimerActive] = useState(false);

  // Exercise Swapping
  const [swappingExerciseIndex, setSwappingExerciseIndex] = useState<number | null>(null);

  // Initialize exercises when opened
  useEffect(() => {
    if (isOpen) {
      const initialized = initialExercises.map((ex) => ({
        exerciseId: ex.id,
        exerciseName: ex.name,
        sets: [
          { id: `s_${Math.random()}`, type: 'warmup' as SetType, reps: 10, weight: 40, rpe: 6, completed: false },
          { id: `s_${Math.random()}`, type: 'normal' as SetType, reps: 8, weight: 70, rpe: 8, completed: false },
          { id: `s_${Math.random()}`, type: 'normal' as SetType, reps: 8, weight: 70, rpe: 8.5, completed: false },
          { id: `s_${Math.random()}`, type: 'normal' as SetType, reps: 8, weight: 70, rpe: 9, completed: false },
        ],
      }));
      setExercises(initialized);
      setWorkoutSeconds(0);
      setIsTimerRunning(true);
      setRestSecondsRemaining(null);
      setIsRestTimerActive(false);
    }
  }, [isOpen, initialExercises]);

  // Workout duration clock
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen && isTimerRunning) {
      interval = setInterval(() => {
        setWorkoutSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, isTimerRunning]);

  // Rest countdown timer with sound notifications
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRestTimerActive && restSecondsRemaining !== null && restSecondsRemaining > 0) {
      interval = setInterval(() => {
        setRestSecondsRemaining((prev) => {
          if (prev === null || prev <= 1) {
            setIsRestTimerActive(false);
            soundEffects.playCompletionChime();
            return 0;
          }
          if (prev <= 4 && prev > 1) {
            soundEffects.playCountdownTick();
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRestTimerActive, restSecondsRemaining]);

  if (!isOpen) return null;

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate total volume lifted
  const allSets = exercises.flatMap((e) => e.sets);
  const totalVolumeKg = calculateVolumeLoad(allSets);
  const completedSetsCount = allSets.filter((s) => s.completed).length;

  const startRestTimer = (seconds: number) => {
    setRestDuration(seconds);
    setRestSecondsRemaining(seconds);
    setIsRestTimerActive(true);
    soundEffects.playTactileClick();
  };

  const handleToggleSetComplete = (exIdx: number, setIdx: number) => {
    soundEffects.playTactileClick();
    const updated = [...exercises];
    const targetSet = updated[exIdx].sets[setIdx];
    const willBeCompleted = !targetSet.completed;
    targetSet.completed = willBeCompleted;
    setExercises(updated);

    // Auto-trigger rest timer on set completion if rest timer is not already running
    if (willBeCompleted) {
      startRestTimer(restDuration);
    }
  };

  const handleUpdateSet = (exIdx: number, setIdx: number, field: string, val: unknown) => {
    const updated = [...exercises];
    // @ts-expect-error dynamic key assignment
    updated[exIdx].sets[setIdx][field] = val;
    setExercises(updated);
  };

  const handleAddSet = (exIdx: number) => {
    const updated = [...exercises];
    const lastSet = updated[exIdx].sets[updated[exIdx].sets.length - 1];
    updated[exIdx].sets.push({
      id: `s_${Math.random()}`,
      type: 'normal',
      reps: lastSet ? lastSet.reps : 8,
      weight: lastSet ? lastSet.weight : 60,
      rpe: lastSet ? Math.min(10, lastSet.rpe + 0.5) : 8,
      completed: false,
    });
    setExercises(updated);
  };

  const handleRemoveSet = (exIdx: number, setIdx: number) => {
    const updated = [...exercises];
    if (updated[exIdx].sets.length > 1) {
      updated[exIdx].sets.splice(setIdx, 1);
      setExercises(updated);
    }
  };

  const handleFinish = () => {
    soundEffects.playCompletionChime();
    const session: WorkoutSession = {
      id: `sess_${Date.now()}`,
      name: splitTitle,
      splitType: 'ppl_6',
      date: new Date().toISOString().split('T')[0],
      durationMinutes: Math.max(1, Math.round(workoutSeconds / 60)),
      completed: true,
      totalVolumeKg,
      exercises,
    };
    onFinishWorkout(session);
    onClose();
  };

  const currentSwappingExercise = swappingExerciseIndex !== null
    ? EXERCISE_LIBRARY.find((e) => e.id === exercises[swappingExerciseIndex]?.exerciseId) || {
        id: exercises[swappingExerciseIndex]?.exerciseId || '',
        name: exercises[swappingExerciseIndex]?.exerciseName || '',
        targetCategory: 'push' as const,
        primaryMuscle: 'chest' as const,
        secondaryMuscles: [],
        equipment: 'barbell' as const,
        difficulty: 'intermediate' as const,
        instructions: [],
        tips: [],
        animationType: 'bench_press' as const,
        alternatives: []
      }
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl h-[95vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Top HUD Header */}
        <div className="p-4 sm:px-6 border-b border-slate-800 bg-slate-950/70 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                {splitTitle}
              </h2>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1 font-mono text-emerald-400">
                  <Clock className="w-3.5 h-3.5" />
                  {formatTime(workoutSeconds)}
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1 font-mono text-amber-400">
                  <Flame className="w-3.5 h-3.5" />
                  {totalVolumeKg.toLocaleString()} kg Volume
                </span>
                <span aria-hidden="true">·</span>
                <span>{completedSetsCount} / {allSets.length} Sets</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
              title={isTimerRunning ? 'Pause Elapsed Timer' : 'Resume Timer'}
            >
              {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={handleFinish}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-transform active:scale-95"
            >
              Finish Workout
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Floating / Sticky Rest Timer HUD */}
        <div className="bg-slate-950/90 border-b border-slate-800/80 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <Volume2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-slate-400">Rest Timer:</span>
            {restSecondsRemaining !== null && restSecondsRemaining > 0 ? (
              <span className={`font-mono text-sm font-bold ${restSecondsRemaining <= 5 ? 'text-rose-400 animate-ping' : 'text-emerald-400'}`}>
                {formatTime(restSecondsRemaining)}
              </span>
            ) : (
              <span className="text-slate-500 text-xs">Standby</span>
            )}
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            {[30, 60, 90, 120, 180].map((secs) => (
              <button
                key={secs}
                type="button"
                onClick={() => startRestTimer(secs)}
                className={`px-2.5 py-1 rounded-md font-mono text-[11px] transition-colors ${
                  restDuration === secs && isRestTimerActive
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {secs}s
              </button>
            ))}
            {isRestTimerActive && (
              <button
                type="button"
                onClick={() => {
                  setIsRestTimerActive(false);
                  setRestSecondsRemaining(0);
                }}
                className="p-1 rounded bg-slate-800 text-rose-400 hover:bg-slate-700"
                title="Cancel Rest Timer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Exercises & Set Logging Table */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {exercises.map((exLog, exIdx) => {
            const exMeta = EXERCISE_LIBRARY.find((e) => e.id === exLog.exerciseId);
            return (
              <div
                key={`${exLog.exerciseId}_${exIdx}`}
                className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4"
              >
                {/* Exercise Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-white flex items-center gap-2">
                      <span>{exLog.exerciseName}</span>
                      {exMeta && (
                        <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                          {exMeta.equipment}
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-slate-400 capitalize">
                      Primary: <span className="text-slate-200">{exMeta?.primaryMuscle || 'Target'}</span> · Secondary: {exMeta?.secondaryMuscles.join(', ')}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSwappingExerciseIndex(exIdx)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Swap</span>
                  </button>
                </div>

                {/* Sets Header Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-500 font-mono text-[11px] uppercase">
                        <th className="py-2 px-2 w-12 text-center">Set</th>
                        <th className="py-2 px-2 w-24">Type</th>
                        <th className="py-2 px-2 w-28">Weight (kg)</th>
                        <th className="py-2 px-2 w-24">Reps</th>
                        <th className="py-2 px-2 w-24">RPE</th>
                        <th className="py-2 px-2 w-16 text-center">Done</th>
                        <th className="py-2 px-2 w-10 text-center"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {exLog.sets.map((set, setIdx) => (
                        <tr
                          key={set.id}
                          className={`transition-colors ${
                            set.completed ? 'bg-emerald-950/20 text-slate-200' : 'hover:bg-slate-900/60'
                          }`}
                        >
                          {/* Set Index */}
                          <td className="py-2.5 px-2 text-center font-bold text-slate-400">
                            {setIdx + 1}
                          </td>

                          {/* Set Type */}
                          <td className="py-2.5 px-2">
                            <select
                              value={set.type}
                              onChange={(e) => handleUpdateSet(exIdx, setIdx, 'type', e.target.value)}
                              className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                            >
                              <option value="normal">Normal</option>
                              <option value="warmup">Warmup</option>
                              <option value="drop">Drop Set</option>
                              <option value="failure">Failure</option>
                            </select>
                          </td>

                          {/* Weight Input */}
                          <td className="py-2.5 px-2">
                            <input
                              type="number"
                              step="0.5"
                              value={set.weight}
                              onChange={(e) => handleUpdateSet(exIdx, setIdx, 'weight', parseFloat(e.target.value) || 0)}
                              className="w-20 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white text-right focus:outline-none focus:border-emerald-500 tabular-nums"
                            />
                          </td>

                          {/* Reps Input */}
                          <td className="py-2.5 px-2">
                            <input
                              type="number"
                              value={set.reps}
                              onChange={(e) => handleUpdateSet(exIdx, setIdx, 'reps', parseInt(e.target.value) || 0)}
                              className="w-16 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white text-right focus:outline-none focus:border-emerald-500 tabular-nums"
                            />
                          </td>

                          {/* RPE Input */}
                          <td className="py-2.5 px-2">
                            <select
                              value={set.rpe}
                              onChange={(e) => handleUpdateSet(exIdx, setIdx, 'rpe', parseFloat(e.target.value))}
                              className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                            >
                              <option value="6">RPE 6 (4 in tank)</option>
                              <option value="7">RPE 7 (3 in tank)</option>
                              <option value="8">RPE 8 (2 in tank)</option>
                              <option value="8.5">RPE 8.5 (1-2 in tank)</option>
                              <option value="9">RPE 9 (1 in tank)</option>
                              <option value="9.5">RPE 9.5 (0-1 in tank)</option>
                              <option value="10">RPE 10 (Max / Failure)</option>
                            </select>
                          </td>

                          {/* Checkbox Complete */}
                          <td className="py-2.5 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleSetComplete(exIdx, setIdx)}
                              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                                set.completed
                                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                                  : 'border border-slate-700 bg-slate-900 text-transparent hover:border-slate-500'
                              }`}
                            >
                              <Check className="w-4 h-4 stroke-[3]" />
                            </button>
                          </td>

                          {/* Delete Set */}
                          <td className="py-2.5 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveSet(exIdx, setIdx)}
                              className="text-slate-500 hover:text-rose-400 transition-colors"
                              title="Delete Set"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Add Set Button */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => handleAddSet(exIdx)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Add Set</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between text-xs text-slate-400">
          <span>Active Session Engine · Auto-calculated volume metrics</span>
          <button
            type="button"
            onClick={handleFinish}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-transform active:scale-95"
          >
            Finish & Log Workout
          </button>
        </div>
      </div>

      {/* Swap Modal */}
      {currentSwappingExercise && swappingExerciseIndex !== null && (
        <SwapExerciseModal
          currentExercise={currentSwappingExercise}
          isOpen={swappingExerciseIndex !== null}
          onClose={() => setSwappingExerciseIndex(null)}
          onSelectSwap={(newEx) => {
            const updated = [...exercises];
            updated[swappingExerciseIndex].exerciseId = newEx.id;
            updated[swappingExerciseIndex].exerciseName = newEx.name;
            setExercises(updated);
            setSwappingExerciseIndex(null);
          }}
        />
      )}
    </div>
  );
};
