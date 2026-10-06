import React, { useState } from 'react';
import { MuscleGroup } from '../types/fitness';

interface AnatomyModelProps {
  primaryMuscles?: MuscleGroup[];
  secondaryMuscles?: MuscleGroup[];
  selectedMuscle?: MuscleGroup | null;
  onSelectMuscle?: (muscle: MuscleGroup) => void;
  interactive?: boolean;
  volumeHeatmap?: Record<MuscleGroup, number>; // weekly sets
}

export const AnatomyModel: React.FC<AnatomyModelProps> = ({
  primaryMuscles = [],
  secondaryMuscles = [],
  selectedMuscle = null,
  onSelectMuscle,
  interactive = true,
  volumeHeatmap,
}) => {
  const [view, setView] = useState<'front' | 'back' | 'both'>('both');

  const getMuscleColor = (muscle: MuscleGroup) => {
    if (selectedMuscle === muscle) {
      return '#10b981'; // Emerald 500 active
    }
    if (primaryMuscles.includes(muscle)) {
      return '#f59e0b'; // Amber 500 primary target
    }
    if (secondaryMuscles.includes(muscle)) {
      return '#06b6d4'; // Cyan 500 secondary stabilizer
    }
    if (volumeHeatmap && volumeHeatmap[muscle] !== undefined) {
      const sets = volumeHeatmap[muscle];
      if (sets >= 16) return '#ef4444'; // High volume red/rose
      if (sets >= 10) return '#10b981'; // Optimal hypertrophy volume emerald
      if (sets >= 4) return '#3b82f6'; // Moderate blue
      if (sets > 0) return '#6366f1'; // Low indigo
    }
    return '#1e293b'; // Default muted slate-800
  };

  const getMuscleStroke = (muscle: MuscleGroup) => {
    if (selectedMuscle === muscle || primaryMuscles.includes(muscle)) {
      return '#34d399';
    }
    if (secondaryMuscles.includes(muscle)) {
      return '#22d3ee';
    }
    return '#334155';
  };

  const handleMuscleClick = (muscle: MuscleGroup) => {
    if (interactive && onSelectMuscle) {
      onSelectMuscle(muscle);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* View Switcher Controls */}
      <div className="flex items-center gap-1 p-1 bg-slate-900/90 border border-slate-800 rounded-lg mb-4 text-xs">
        <button
          type="button"
          onClick={() => setView('both')}
          className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
            view === 'both' ? 'bg-slate-800 text-white font-medium shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Full Body (Front & Back)
        </button>
        <button
          type="button"
          onClick={() => setView('front')}
          className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
            view === 'front' ? 'bg-slate-800 text-white font-medium shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Anterior (Front)
        </button>
        <button
          type="button"
          onClick={() => setView('back')}
          className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
            view === 'back' ? 'bg-slate-800 text-white font-medium shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Posterior (Back)
        </button>
      </div>

      {/* Anatomy Diagrams */}
      <div className="flex flex-wrap items-center justify-center gap-6 w-full max-w-2xl">
        {/* FRONT VIEW */}
        {(view === 'both' || view === 'front') && (
          <div className="flex flex-col items-center">
            <span className="text-[11px] font-mono tracking-wider text-slate-500 mb-2 uppercase">Anterior Kinetic Chain</span>
            <div className="relative w-48 sm:w-56 h-[340px] bg-slate-950/60 rounded-xl border border-slate-800/80 p-2 flex items-center justify-center">
              <svg
                viewBox="0 0 200 360"
                className="w-full h-full select-none"
                style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }}
              >
                {/* Body Outline Shadow */}
                <path
                  d="M 100 20 C 108 20 114 26 114 36 C 114 44 108 50 100 50 C 92 50 86 44 86 36 C 86 26 92 20 100 20 Z"
                  fill="#0f172a"
                  stroke="#334155"
                  strokeWidth="1.5"
                />

                {/* Trapezius / Neck */}
                <path
                  d="M 90 48 L 110 48 L 124 62 L 76 62 Z"
                  fill={getMuscleColor('traps')}
                  stroke={getMuscleStroke('traps')}
                  strokeWidth="1"
                  className={interactive ? 'cursor-pointer hover:opacity-80 transition-all' : ''}
                  onClick={() => handleMuscleClick('traps')}
                >
                  <title>Trapezius (Upper Back / Neck)</title>
                </path>

                {/* Left & Right Shoulders (Deltoids) */}
                <path
                  d="M 72 62 Q 54 68 52 86 Q 66 90 70 78 Z"
                  fill={getMuscleColor('shoulders')}
                  stroke={getMuscleStroke('shoulders')}
                  strokeWidth="1"
                  className={interactive ? 'cursor-pointer hover:opacity-80 transition-all' : ''}
                  onClick={() => handleMuscleClick('shoulders')}
                >
                  <title>Right Anterior Deltoid</title>
                </path>
                <path
                  d="M 128 62 Q 146 68 148 86 Q 134 90 130 78 Z"
                  fill={getMuscleColor('shoulders')}
                  stroke={getMuscleStroke('shoulders')}
                  strokeWidth="1"
                  className={interactive ? 'cursor-pointer hover:opacity-80 transition-all' : ''}
                  onClick={() => handleMuscleClick('shoulders')}
                >
                  <title>Left Anterior Deltoid</title>
                </path>

                {/* Chest (Pectoralis Major) */}
                <path
                  d="M 74 65 L 98 67 L 98 102 C 84 102 70 94 70 82 Z"
                  fill={getMuscleColor('chest')}
                  stroke={getMuscleStroke('chest')}
                  strokeWidth="1.2"
                  className={interactive ? 'cursor-pointer hover:opacity-80 transition-all' : ''}
                  onClick={() => handleMuscleClick('chest')}
                >
                  <title>Pectoralis Major (Right)</title>
                </path>
                <path
                  d="M 126 65 L 102 67 L 102 102 C 116 102 130 94 130 82 Z"
                  fill={getMuscleColor('chest')}
                  stroke={getMuscleStroke('chest')}
                  strokeWidth="1.2"
                  className={interactive ? 'cursor-pointer hover:opacity-80 transition-all' : ''}
                  onClick={() => handleMuscleClick('chest')}
                >
                  <title>Pectoralis Major (Left)</title>
                </path>

                {/* Biceps */}
                <path
                  d="M 52 90 Q 46 112 50 128 Q 62 124 64 100 Z"
                  fill={getMuscleColor('biceps')}
                  stroke={getMuscleStroke('biceps')}
                  strokeWidth="1"
                  className={interactive ? 'cursor-pointer hover:opacity-80 transition-all' : ''}
                  onClick={() => handleMuscleClick('biceps')}
                >
                  <title>Biceps Brachii (Right)</title>
                </path>
                <path
                  d="M 148 90 Q 154 112 150 128 Q 138 124 136 100 Z"
                  fill={getMuscleColor('biceps')}
                  stroke={getMuscleStroke('biceps')}
                  strokeWidth="1"
                  className={interactive ? 'cursor-pointer hover:opacity-80 transition-all' : ''}
                  onClick={() => handleMuscleClick('biceps')}
                >
                  <title>Biceps Brachii (Left)</title>
                </path>

                {/* Forearms */}
                <path
                  d="M 48 132 L 38 168 L 48 172 L 56 136 Z"
                  fill={getMuscleColor('forearms')}
                  stroke={getMuscleStroke('forearms')}
                  strokeWidth="1"
                  className={interactive ? 'cursor-pointer hover:opacity-80 transition-all' : ''}
                  onClick={() => handleMuscleClick('forearms')}
                >
                  <title>Forearm Flexors / Brachioradialis (Right)</title>
                </path>
                <path
                  d="M 152 132 L 162 168 L 152 172 L 144 136 Z"
                  fill={getMuscleColor('forearms')}
                  stroke={getMuscleStroke('forearms')}
                  strokeWidth="1"
                  className={interactive ? 'cursor-pointer hover:opacity-80 transition-all' : ''}
                  onClick={() => handleMuscleClick('forearms')}
                >
                  <title>Forearm Flexors / Brachioradialis (Left)</title>
                </path>

                {/* Abdominals (Rectus Abdominis) */}
                <rect
                  x="86"
                  y="106"
                  width="13"
                  height="12"
                  rx="2"
                  fill={getMuscleColor('abs')}
                  stroke={getMuscleStroke('abs')}
                  strokeWidth="1"
                  className={interactive ? 'cursor-pointer hover:opacity-80 transition-all' : ''}
                  onClick={() => handleMuscleClick('abs')}
                />
                <rect
                  x="101"
                  y="106"
                  width="13"
                  height="12"
                  rx="2"
                  fill={getMuscleColor('abs')}
                  stroke={getMuscleStroke('abs')}
                  strokeWidth="1"
                  className={interactive ? 'cursor-pointer hover:opacity-80 transition-all' : ''}
                  onClick={() => handleMuscleClick('abs')}
                />
                <rect
                  x="86"
                  y="120"
                  width="13"
                  height="12"
                  rx="2"
                  fill={getMuscleColor('abs')}
                  stroke={getMuscleStroke('abs')}
                  strokeWidth="1"
                  className={interactive ? 'cursor-pointer hover:opacity-80 transition-all' : ''}
                  onClick={() => handleMuscleClick('abs')}
                />
                <rect
                  x="101"
                  y="120"
                  width="13"
                  height="12"
                  rx="2"
                  fill={getMuscleColor('abs')}
                  stroke={getMuscleStroke('abs')}
                  strokeWidth="1"
                  className={interactive ? 'cursor-pointer hover:opacity-80 transition-all' : ''}
                  onClick={() => handleMuscleClick('abs')}
                />
                <rect
                  x="87"
                  y="134"
                  width="12"
                  height="14"
                  rx="2"
                  fill={getMuscleColor('abs')}
                  stroke={getMuscleStroke('abs')}
                  strokeWidth="1"
                  className={interactive ? 'cursor-pointer hover:opacity-80 transition-all' : ''}
                  onClick={() => handleMuscleClick('abs')}
                />
                <rect
                  x="101"
                  y="134"
                  width="12"
                  height="14"
                  rx="2"
                  fill={getMuscleColor('abs')}
                  stroke={getMuscleStroke('abs')}
                  strokeWidth="1"
                  className={interactive ? 'cursor-pointer hover:opacity-80 transition-all' : ''}
                  onClick={() => handleMuscleClick('abs')}
                />

                {/* Obliques */}
                <path
                  d="M 72 104 L 84 104 L 84 146 L 76 142 Z"
                  fill={getMuscleColor('obliques')}
                  stroke={getMuscleStroke('obliques')}
                  strokeWidth="1"
                  className={interactive ? 'cursor-pointer hover:opacity-80 transition-all' : ''}
                  onClick={() => handleMuscleClick('obliques')}
                >
                  <title>External Obliques (Right)</title>
                </path>
                <path
                  d="M 128 104 L 116 104 L 116 146 L 124 142 Z"
                  fill={getMuscleColor('obliques')}
                  stroke={getMuscleStroke('obliques')}
                  strokeWidth="1"
                  className={interactive ? 'cursor-pointer hover:opacity-80 transition-all' : ''}
                  onClick={() => handleMuscleClick('obliques')}
                >
                  <title>External Obliques (Left)</title>
                </path>

                {/* Quadriceps (Left & Right) */}
                <path
                  d="M 76 156 Q 66 186 70 240 L 94 236 Q 98 190 94 156 Z"
                  fill={getMuscleColor('quads')}
                  stroke={getMuscleStroke('quads')}
                  strokeWidth="1.2"
                  className={interactive ? 'cursor-pointer hover:opacity-80 transition-all' : ''}
                  onClick={() => handleMuscleClick('quads')}
                >
                  <title>Quadriceps Femoris (Right)</title>
                </path>
                <path
                  d="M 124 156 Q 134 186 130 240 L 106 236 Q 102 190 106 156 Z"
                  fill={getMuscleColor('quads')}
                  stroke={getMuscleStroke('quads')}
                  strokeWidth="1.2"
                  className={interactive ? 'cursor-pointer hover:opacity-80 transition-all' : ''}
                  onClick={() => handleMuscleClick('quads')}
                >
                  <title>Quadriceps Femoris (Left)</title>
                </path>

                {/* Calves (Anterior Tibialis / Calf front) */}
                <path
                  d="M 72 254 Q 68 286 74 324 L 86 324 Q 90 286 86 254 Z"
                  fill={getMuscleColor('calves')}
                  stroke={getMuscleStroke('calves')}
                  strokeWidth="1"
                  className={interactive ? 'cursor-pointer hover:opacity-80 transition-all' : ''}
                  onClick={() => handleMuscleClick('calves')}
                >
                  <title>Calf & Tibialis (Right)</title>
                </path>
                <path
                  d="M 128 254 Q 132 286 126 324 L 114 324 Q 110 286 114 254 Z"
                  fill={getMuscleColor('calves')}
                  stroke={getMuscleStroke('calves')}
                  strokeWidth="1"
                  className={interactive ? 'cursor-pointer hover:opacity-80 transition-all' : ''}
                  onClick={() => handleMuscleClick('calves')}
                >
                  <title>Calf & Tibialis (Left)</title>
                </path>
              </svg>
            </div>
          </div>
        )}

        {/* BACK VIEW */}
        {(view === 'both' || view === 'back') && (
          <div className="flex flex-col items-center">
            <span className="text-[11px] font-mono tracking-wider text-slate-500 mb-2 uppercase">Posterior Kinetic Chain</span>
            <div className="relative w-48 sm:w-56 h-[340px] bg-slate-950/60 rounded-xl border border-slate-800/80 p-2 flex items-center justify-center">
              <svg
                viewBox="0 0 200 360"
                className="w-full h-full select-none"
                style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }}
              >
                {/* Head */}
                <path
                  d="M 100 20 C 108 20 114 26 114 36 C 114 44 108 50 100 50 C 92 50 86 44 86 36 C 86 26 92 20 100 20 Z"
                  fill="#0f172a"
                  stroke="#334155"
                  strokeWidth="1.5"
                />

                {/* Upper Trapezius & Rhomboids */}
                <path
                  d="M 90 48 L 110 48 L 130 68 L 100 102 L 70 68 Z"
                  fill={getMuscleColor('traps')}
                  stroke={getMuscleStroke('traps')}
                  strokeWidth="1.2"
                  className={interactive ? 'cursor-pointer hover:opacity-80 transition-all' : ''}
                  onClick={() => handleMuscleClick('traps')}
                >
                  <title>Trapezius & Rhomboids</title>
                </path>

                {/* Rear Deltoids */}
                <path
                  d="M 68 68 Q 50 74 52 90 Q 64 92 68 80 Z"
                  fill={getMuscleColor('shoulders')}
                  stroke={getMuscleStroke('shoulders')}
                  strokeWidth="1"
                  className={interactive ? 'cursor-pointer hover:opacity-80 transition-all' : ''}
                  onClick={() => handleMuscleClick('shoulders')}
                >
                  <title>Posterior Deltoid (Right)</title>
                </path>
                <path
                  d="M 132 68 Q 150 74 148 90 Q 136 92 132 80 Z"
                  fill={getMuscleColor('shoulders')}
                  stroke={getMuscleStroke('shoulders')}
                  strokeWidth="1"
                  className={interactive ? 'cursor-pointer hover:opacity-80 transition-all' : ''}
                  onClick={() => handleMuscleClick('shoulders')}
                >
                  <title>Posterior Deltoid (Left)</title>
                </path>

                {/* Triceps */}
                <path
                  d="M 50 92 Q 44 114 48 128 Q 60 124 62 100 Z"
                  fill={getMuscleColor('triceps')}
                  stroke={getMuscleStroke('triceps')}
                  strokeWidth="1"
                  className={interactive ? 'cursor-pointer hover:opacity-80 transition-all' : ''}
                  onClick={() => handleMuscleClick('triceps')}
                >
                  <title>Triceps Brachii (Right)</title>
                </path>
                <path
                  d="M 150 92 Q 156 114 152 128 Q 140 124 138 100 Z"
                  fill={getMuscleColor('triceps')}
                  stroke={getMuscleStroke('triceps')}
                  strokeWidth="1"
                  className={interactive ? 'cursor-pointer hover:opacity-80 transition-all' : ''}
                  onClick={() => handleMuscleClick('triceps')}
                >
                  <title>Triceps Brachii (Left)</title>
                </path>

                {/* Latissimus Dorsi (Lats) */}
                <path
                  d="M 72 82 L 96 104 L 94 138 C 82 138 68 120 66 100 Z"
                  fill={getMuscleColor('lats')}
                  stroke={getMuscleStroke('lats')}
                  strokeWidth="1.2"
                  className={interactive ? 'cursor-pointer hover:opacity-80 transition-all' : ''}
                  onClick={() => handleMuscleClick('lats')}
                >
                  <title>Latissimus Dorsi (Right)</title>
                </path>
                <path
                  d="M 128 82 L 104 104 L 106 138 C 118 138 132 120 134 100 Z"
                  fill={getMuscleColor('lats')}
                  stroke={getMuscleStroke('lats')}
                  strokeWidth="1.2"
                  className={interactive ? 'cursor-pointer hover:opacity-80 transition-all' : ''}
                  onClick={() => handleMuscleClick('lats')}
                >
                  <title>Latissimus Dorsi (Left)</title>
                </path>

                {/* Lower Back / Erector Spinae */}
                <path
                  d="M 94 104 L 106 104 L 104 148 L 96 148 Z"
                  fill={getMuscleColor('lower_back')}
                  stroke={getMuscleStroke('lower_back')}
                  strokeWidth="1"
                  className={interactive ? 'cursor-pointer hover:opacity-80 transition-all' : ''}
                  onClick={() => handleMuscleClick('lower_back')}
                >
                  <title>Erector Spinae / Lower Back</title>
                </path>

                {/* Gluteus Maximus */}
                <path
                  d="M 72 152 C 72 178 96 182 98 152 Z"
                  fill={getMuscleColor('glutes')}
                  stroke={getMuscleStroke('glutes')}
                  strokeWidth="1.2"
                  className={interactive ? 'cursor-pointer hover:opacity-80 transition-all' : ''}
                  onClick={() => handleMuscleClick('glutes')}
                >
                  <title>Gluteus Maximus (Right)</title>
                </path>
                <path
                  d="M 128 152 C 128 178 104 182 102 152 Z"
                  fill={getMuscleColor('glutes')}
                  stroke={getMuscleStroke('glutes')}
                  strokeWidth="1.2"
                  className={interactive ? 'cursor-pointer hover:opacity-80 transition-all' : ''}
                  onClick={() => handleMuscleClick('glutes')}
                >
                  <title>Gluteus Maximus (Left)</title>
                </path>

                {/* Hamstrings */}
                <path
                  d="M 74 186 Q 68 214 74 240 L 94 238 Q 96 210 96 186 Z"
                  fill={getMuscleColor('hamstrings')}
                  stroke={getMuscleStroke('hamstrings')}
                  strokeWidth="1.2"
                  className={interactive ? 'cursor-pointer hover:opacity-80 transition-all' : ''}
                  onClick={() => handleMuscleClick('hamstrings')}
                >
                  <title>Biceps Femoris / Hamstrings (Right)</title>
                </path>
                <path
                  d="M 126 186 Q 132 214 126 240 L 106 238 Q 104 210 104 186 Z"
                  fill={getMuscleColor('hamstrings')}
                  stroke={getMuscleStroke('hamstrings')}
                  strokeWidth="1.2"
                  className={interactive ? 'cursor-pointer hover:opacity-80 transition-all' : ''}
                  onClick={() => handleMuscleClick('hamstrings')}
                >
                  <title>Biceps Femoris / Hamstrings (Left)</title>
                </path>

                {/* Gastrocnemius / Calves */}
                <path
                  d="M 72 254 Q 64 282 72 322 L 86 322 Q 92 284 86 254 Z"
                  fill={getMuscleColor('calves')}
                  stroke={getMuscleStroke('calves')}
                  strokeWidth="1.2"
                  className={interactive ? 'cursor-pointer hover:opacity-80 transition-all' : ''}
                  onClick={() => handleMuscleClick('calves')}
                >
                  <title>Gastrocnemius & Soleus (Right)</title>
                </path>
                <path
                  d="M 128 254 Q 136 282 128 322 L 114 322 Q 108 284 114 254 Z"
                  fill={getMuscleColor('calves')}
                  stroke={getMuscleStroke('calves')}
                  strokeWidth="1.2"
                  className={interactive ? 'cursor-pointer hover:opacity-80 transition-all' : ''}
                  onClick={() => handleMuscleClick('calves')}
                >
                  <title>Gastrocnemius & Soleus (Left)</title>
                </path>
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Dynamic Legend / State Indicators */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-3 text-xs text-slate-400">
        {primaryMuscles.length > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
            <span>Primary Mover</span>
          </div>
        )}
        {secondaryMuscles.length > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block"></span>
            <span>Secondary Stabilizer</span>
          </div>
        )}
        {volumeHeatmap && (
          <>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
              <span>Optimal Hypertrophy (10-16 sets)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
              <span>Maintenance (&lt;10 sets)</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
