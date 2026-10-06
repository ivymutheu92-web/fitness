import React, { useState } from 'react';
import { 
  TrendingUp, 
  Dumbbell, 
  Activity, 
  Camera, 
  Scale, 
  Ruler, 
  Plus, 
  SlidersHorizontal, 
  Maximize2, 
  Sparkles,
  Heart,
  Calendar,
  Grid
} from 'lucide-react';
import { 
  WorkoutSession, 
  OneRepMaxRecord, 
  CardioLog, 
  BodyTapeMeasurement, 
  PhotoComparison 
} from '../types/fitness';
import { 
  calculate1RM, 
  get1RMPercentages, 
  calculateNavyBodyFat 
} from '../utils/calculations';

interface ProgressEngineProps {
  workoutSessions: WorkoutSession[];
  oneRepMaxRecords: OneRepMaxRecord[];
  cardioLogs: CardioLog[];
  bodyMeasurements: BodyTapeMeasurement[];
  photoComparisons: PhotoComparison[];
  onAdd1RMRecord: (rec: OneRepMaxRecord) => void;
  onAddCardioLog: (log: CardioLog) => void;
  onAddBodyMeasurement: (meas: BodyTapeMeasurement) => void;
  onAddPhotoComparison: (photo: PhotoComparison) => void;
}

export const ProgressEngine: React.FC<ProgressEngineProps> = ({
  workoutSessions,
  oneRepMaxRecords,
  cardioLogs,
  bodyMeasurements,
  photoComparisons,
  onAdd1RMRecord,
  onAddCardioLog,
  onAddBodyMeasurement,
  onAddPhotoComparison,
}) => {
  // Sub-tabs for Progress: Volume, 1RM, Cardio, Body Tape & BF%, Visual Photo Gallery
  const [activeTab, setActiveTab] = useState<'volume' | '1rm' | 'cardio' | 'body' | 'gallery'>('volume');

  // Interactive 1RM Calculator Widget
  const [calcWeight, setCalcWeight] = useState(100);
  const [calcReps, setCalcReps] = useState(5);
  const [calcFormula, setCalcFormula] = useState<'brzycki' | 'epley'>('brzycki');
  const [calcLiftName, setCalcLiftName] = useState('Barbell Bench Press');

  // Interactive Photo Slider State
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50); // 0 to 100%
  const [showGridOverlay, setShowGridOverlay] = useState(true);
  const [showPlumbLine, setShowPlumbLine] = useState(true);
  const [comparisonMode, setComparisonMode] = useState<'slider' | 'sideBySide'>('slider');

  // Add Cardio Form state
  const [showCardioForm, setShowCardioForm] = useState(false);
  const [newCardioType, setNewCardioType] = useState<CardioLog['type']>('running');
  const [newCardioDuration, setNewCardioDuration] = useState(30);
  const [newCardioDistance, setNewCardioDistance] = useState(5.0);
  const [newCardioHR, setNewCardioHR] = useState(148);
  const [newCardioRPE, setNewCardioRPE] = useState(7);

  // Add Measurement Form state
  const [showMeasForm, setShowMeasForm] = useState(false);
  const [newWeight, setNewWeight] = useState(78.5);
  const [newWaist, setNewWaist] = useState(81.0);
  const [newNeck, setNewNeck] = useState(40.0);
  const [newChest, setNewChest] = useState(107.0);
  const [newArms, setNewArms] = useState(39.0);
  const [newHips, setNewHips] = useState(97.0);
  const [newThighs, setNewThighs] = useState(62.0);

  // Live 1RM calculated
  const live1RM = calculate1RM(calcWeight, calcReps, calcFormula);
  const percentageTable = get1RMPercentages(live1RM);

  // Volume load metrics
  const totalLifetimeVolume = workoutSessions.reduce((acc, s) => acc + s.totalVolumeKg, 0);
  const avgSessionVolume = workoutSessions.length > 0 ? Math.round(totalLifetimeVolume / workoutSessions.length) : 0;

  // Selected photo comparison
  const activeComparison = photoComparisons[selectedPhotoIndex] || photoComparisons[0];

  const handleSave1RM = () => {
    const rec: OneRepMaxRecord = {
      id: `1rm_${Date.now()}`,
      exerciseId: calcLiftName.toLowerCase().replace(/\s+/g, '_'),
      exerciseName: calcLiftName,
      date: new Date().toISOString().split('T')[0],
      weightLifted: calcWeight,
      repsPerformed: calcReps,
      estimated1RM: live1RM,
      formula: calcFormula,
    };
    onAdd1RMRecord(rec);
  };

  const handleSaveCardio = (e: React.FormEvent) => {
    e.preventDefault();
    const log: CardioLog = {
      id: `cardio_${Date.now()}`,
      type: newCardioType,
      date: new Date().toISOString().split('T')[0],
      durationMinutes: newCardioDuration,
      distanceKm: newCardioDistance,
      avgHeartRate: newCardioHR,
      maxHeartRate: Math.round(newCardioHR * 1.15),
      rpe: newCardioRPE,
      caloriesBurned: Math.round(newCardioDuration * 11.5),
    };
    onAddCardioLog(log);
    setShowCardioForm(false);
  };

  const handleSaveMeasurement = (e: React.FormEvent) => {
    e.preventDefault();
    const bf = calculateNavyBodyFat({
      gender: 'male',
      heightCm: 180,
      waistCm: newWaist,
      neckCm: newNeck,
      hipsCm: newHips,
    });
    const meas: BodyTapeMeasurement = {
      id: `meas_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      weightKg: newWeight,
      chestCm: newChest,
      armsCm: newArms,
      waistCm: newWaist,
      hipsCm: newHips,
      thighsCm: newThighs,
      calvesCm: 39.0,
      neckCm: newNeck,
      bodyFatPercent: bf ?? undefined,
      notes: 'Logged via Progress Engine',
    };
    onAddBodyMeasurement(meas);
    setShowMeasForm(false);
  };

  return (
    <div className="space-y-8">
      {/* 1. TOP PROGRESS NAVIGATION TABS */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase text-emerald-400 tracking-wider">
            Biometric & Performance Engine
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Comprehensive Progress Tracking
          </h1>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('volume')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === 'volume'
                ? 'bg-slate-800 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Volume Load
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('1rm')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === '1rm'
                ? 'bg-slate-800 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            1RM Calculator
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('cardio')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === 'cardio'
                ? 'bg-slate-800 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Cardio & Endurance
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('body')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === 'body'
                ? 'bg-slate-800 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tape & Body Fat %
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('gallery')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === 'gallery'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Visual Progress Gallery
          </button>
        </div>
      </div>

      {/* 2. TAB CONTENT: VOLUME LOAD ANALYTICS */}
      {activeTab === 'volume' && (
        <div className="space-y-6">
          {/* Summary Metric Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-slate-900/70 border border-slate-800 rounded-2xl">
              <span className="text-[11px] font-mono uppercase text-slate-400">Total Lifted Volume</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1 tabular-nums font-mono">
                {totalLifetimeVolume.toLocaleString()} <span className="text-sm font-normal text-slate-400">kg</span>
              </div>
              <p className="text-xs text-emerald-400 mt-1">Sum of (Weight × Reps × Sets)</p>
            </div>
            <div className="p-5 bg-slate-900/70 border border-slate-800 rounded-2xl">
              <span className="text-[11px] font-mono uppercase text-slate-400">Average Session Tonnage</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1 tabular-nums font-mono">
                {avgSessionVolume.toLocaleString()} <span className="text-sm font-normal text-slate-400">kg</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Across {workoutSessions.length} logged workouts</p>
            </div>
            <div className="p-5 bg-slate-900/70 border border-slate-800 rounded-2xl">
              <span className="text-[11px] font-mono uppercase text-slate-400">Progressive Overload Pace</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1 tabular-nums font-mono">
                +4.8% <span className="text-sm font-normal text-slate-400">/ week</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Optimal adaptive hypertrophy curve</p>
            </div>
          </div>

          {/* Interactive Volume History Chart */}
          <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white">Session Volume Load History</h3>
                <p className="text-xs text-slate-400">Progression across recent training split sessions</p>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                Formula: ∑ (Weight × Reps)
              </span>
            </div>

            {/* SVG Bar Chart */}
            <div className="h-64 w-full pt-4">
              <svg viewBox="0 0 600 200" className="w-full h-full overflow-visible">
                {/* Horizontal Grid lines */}
                <line x1="40" y1="20" x2="580" y2="20" stroke="#1e293b" strokeWidth="1" />
                <line x1="40" y1="70" x2="580" y2="70" stroke="#1e293b" strokeWidth="1" />
                <line x1="40" y1="120" x2="580" y2="120" stroke="#1e293b" strokeWidth="1" />
                <line x1="40" y1="170" x2="580" y2="170" stroke="#334155" strokeWidth="1.5" />

                <text x="30" y="24" fill="#64748b" fontSize="10" textAnchor="end" fontFamily="monospace">12k</text>
                <text x="30" y="74" fill="#64748b" fontSize="10" textAnchor="end" fontFamily="monospace">9k</text>
                <text x="30" y="124" fill="#64748b" fontSize="10" textAnchor="end" fontFamily="monospace">6k</text>
                <text x="30" y="174" fill="#64748b" fontSize="10" textAnchor="end" fontFamily="monospace">0</text>

                {workoutSessions.map((session, idx) => {
                  const x = 70 + idx * 110;
                  const maxVol = 13000;
                  const barHeight = Math.min(150, (session.totalVolumeKg / maxVol) * 150);
                  const y = 170 - barHeight;

                  return (
                    <g key={session.id} className="cursor-pointer group">
                      <rect
                        x={x}
                        y={y}
                        width="48"
                        height={barHeight}
                        rx="6"
                        fill="#10b981"
                        className="transition-all hover:fill-emerald-400 group-hover:opacity-90"
                      />
                      <text
                        x={x + 24}
                        y={y - 8}
                        fill="#e2e8f0"
                        fontSize="10"
                        fontWeight="600"
                        textAnchor="middle"
                        fontFamily="monospace"
                      >
                        {Math.round(session.totalVolumeKg / 1000)}k
                      </text>
                      <text
                        x={x + 24}
                        y="188"
                        fill="#94a3b8"
                        fontSize="9"
                        textAnchor="middle"
                      >
                        {session.date.slice(5)}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* List of Sessions */}
            <div className="pt-4 divide-y divide-slate-800">
              {workoutSessions.map((session) => (
                <div key={session.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-semibold text-white">{session.name}</h4>
                    <span className="text-slate-500 font-mono">{session.date} · {session.durationMinutes} mins · {session.exercises.length} movements</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-emerald-400 text-sm tabular-nums">
                      {session.totalVolumeKg.toLocaleString()} kg
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. TAB CONTENT: 1-REP MAX (1RM) CALCULATOR & HISTORICAL COMPOUND LIFTS */}
      {activeTab === '1rm' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Interactive Calculator (5 cols) */}
            <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5">
              <div>
                <span className="text-[11px] font-mono uppercase text-emerald-400">Formula Modeling</span>
                <h3 className="text-lg font-bold text-white">Estimated 1RM Calculator</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Brzycki: <code className="text-emerald-300">Weight × (36 / (37 - Reps))</code>
                </p>
              </div>

              {/* Lift Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400 uppercase">Compound Lift</label>
                <select
                  value={calcLiftName}
                  onChange={(e) => setCalcLiftName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Barbell Flat Bench Press">Barbell Flat Bench Press</option>
                  <option value="Barbell Back Squat">Barbell Back Squat</option>
                  <option value="Conventional Barbell Deadlift">Conventional Barbell Deadlift</option>
                  <option value="Standing Overhead Press">Standing Overhead Press</option>
                </select>
              </div>

              {/* Formula toggle */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCalcFormula('brzycki')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    calcFormula === 'brzycki'
                      ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40'
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  Brzycki Formula
                </button>
                <button
                  type="button"
                  onClick={() => setCalcFormula('epley')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    calcFormula === 'epley'
                      ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40'
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  Epley Formula
                </button>
              </div>

              {/* Inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Weight Lifted (kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={calcWeight}
                    onChange={(e) => setCalcWeight(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono tabular-nums focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Reps to Failure</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={calcReps}
                    onChange={(e) => setCalcReps(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono tabular-nums focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Calculated Result Box */}
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center space-y-1">
                <span className="text-xs font-mono text-emerald-300 uppercase">Calculated Max Potential</span>
                <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
                  {live1RM} <span className="text-base text-emerald-400">kg</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Estimated based on {calcWeight}kg × {calcReps} reps
                </p>
              </div>

              <button
                type="button"
                onClick={handleSave1RM}
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-transform active:scale-95 shadow-md"
              >
                Log 1RM Record
              </button>
            </div>

            {/* Percentage Training Zones Table (7 cols) */}
            <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div>
                <h3 className="text-base font-bold text-white">Hypertrophy & Strength Loading Zones</h3>
                <p className="text-xs text-slate-400">
                  Exact barbell loading based on calculated 1RM of {live1RM}kg
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300 font-mono">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500 uppercase text-[11px]">
                      <th className="py-2.5 px-3">% of 1RM</th>
                      <th className="py-2.5 px-3">Target Weight</th>
                      <th className="py-2.5 px-3">Rep Range</th>
                      <th className="py-2.5 px-3">Stimulus Focus</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {percentageTable.map((row) => (
                      <tr key={row.percent} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-2 px-3 font-bold text-slate-200">{row.percent}%</td>
                        <td className="py-2 px-3 text-emerald-400 font-bold tabular-nums">
                          {row.weight} kg
                        </td>
                        <td className="py-2 px-3 text-slate-300">{row.reps}</td>
                        <td className="py-2 px-3 text-slate-400">{row.zone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Historical 1RM Compound Records */}
              <div className="pt-4 border-t border-slate-800">
                <h4 className="text-xs font-mono uppercase text-slate-400 mb-3">Saved Personal Bests (PBs)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {oneRepMaxRecords.map((rec) => (
                    <div key={rec.id} className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                      <div className="text-xs font-semibold text-white">{rec.exerciseName}</div>
                      <div className="flex items-baseline justify-between mt-1">
                        <span className="text-lg font-mono font-bold text-amber-400 tabular-nums">
                          {rec.estimated1RM} kg 1RM
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">{rec.date}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Tested: {rec.weightLifted}kg × {rec.repsPerformed} reps
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB CONTENT: CARDIO & ENDURANCE ENGINE */}
      {activeTab === 'cardio' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white">Cardio & Heart Rate Conditioning</h3>
              <p className="text-xs text-slate-400">Pace, distance, HR zones, and Perceived Exertion (RPE 1-10)</p>
            </div>
            <button
              type="button"
              onClick={() => setShowCardioForm(!showCardioForm)}
              className="px-3.5 py-1.5 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Cardio Session</span>
            </button>
          </div>

          {/* New Cardio Log Form */}
          {showCardioForm && (
            <form onSubmit={handleSaveCardio} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <h4 className="text-sm font-semibold text-white">New Cardio Activity Entry</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-400">Modality</label>
                  <select
                    value={newCardioType}
                    onChange={(e) => setNewCardioType(e.target.value as CardioLog['type'])}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  >
                    <option value="running">Running</option>
                    <option value="cycling">Cycling</option>
                    <option value="rowing">Rowing</option>
                    <option value="stairmaster">Stairmaster</option>
                    <option value="hiit">HIIT Circuits</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Duration (mins)</label>
                  <input
                    type="number"
                    value={newCardioDuration}
                    onChange={(e) => setNewCardioDuration(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Distance (km)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newCardioDistance}
                    onChange={(e) => setNewCardioDistance(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Avg Heart Rate (bpm)</label>
                  <input
                    type="number"
                    value={newCardioHR}
                    onChange={(e) => setNewCardioHR(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCardioForm(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg"
                >
                  Save Log
                </button>
              </div>
            </form>
          )}

          {/* Cardio History Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cardioLogs.map((log) => {
              const paceMinPerKm = log.distanceKm > 0 ? (log.durationMinutes / log.distanceKm).toFixed(2) : '--';
              // Zone heuristic: Zone 2 (120-140), Zone 3 (140-160), Zone 4 (160-175), Zone 5 (175+)
              let zoneName = 'Zone 2 Aerobic Base';
              let zoneColor = 'text-emerald-400';
              if (log.avgHeartRate > 175) {
                zoneName = 'Zone 5 VO2 Max';
                zoneColor = 'text-rose-400';
              } else if (log.avgHeartRate > 160) {
                zoneName = 'Zone 4 Lactate Threshold';
                zoneColor = 'text-amber-400';
              } else if (log.avgHeartRate > 140) {
                zoneName = 'Zone 3 Tempo';
                zoneColor = 'text-cyan-400';
              }

              return (
                <div key={log.id} className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white capitalize">{log.type}</span>
                    <span className="text-xs font-mono text-slate-400">{log.date}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2 bg-slate-950 rounded-lg">
                      <span className="text-slate-500 block text-[10px]">Distance</span>
                      <span className="text-white font-bold">{log.distanceKm} km</span>
                    </div>
                    <div className="p-2 bg-slate-950 rounded-lg">
                      <span className="text-slate-500 block text-[10px]">Duration</span>
                      <span className="text-white font-bold">{log.durationMinutes} mins</span>
                    </div>
                    <div className="p-2 bg-slate-950 rounded-lg">
                      <span className="text-slate-500 block text-[10px]">Avg HR</span>
                      <span className="text-white font-bold">{log.avgHeartRate} bpm</span>
                    </div>
                    <div className="p-2 bg-slate-950 rounded-lg">
                      <span className="text-slate-500 block text-[10px]">Pace</span>
                      <span className="text-white font-bold">{paceMinPerKm} min/km</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className={`font-medium ${zoneColor}`}>{zoneName}</span>
                    <span className="text-slate-400 font-mono">RPE {log.rpe}/10</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. TAB CONTENT: TAPE MEASUREMENTS & US NAVY BODY FAT % */}
      {activeTab === 'body' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white">Body Circumference & Navy Body Fat %</h3>
              <p className="text-xs text-slate-400">Weekly tape measurements for chest, arms, waist, and hips</p>
            </div>
            <button
              type="button"
              onClick={() => setShowMeasForm(!showMeasForm)}
              className="px-3.5 py-1.5 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Measurements</span>
            </button>
          </div>

          {/* Form */}
          {showMeasForm && (
            <form onSubmit={handleSaveMeasurement} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <h4 className="text-sm font-semibold text-white">Log Tape Circumferences</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-400">Body Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newWeight}
                    onChange={(e) => setNewWeight(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Waist (Navel, cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newWaist}
                    onChange={(e) => setNewWaist(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Neck (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newNeck}
                    onChange={(e) => setNewNeck(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Chest (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newChest}
                    onChange={(e) => setNewChest(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Arm / Bicep (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newArms}
                    onChange={(e) => setNewArms(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Hips (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newHips}
                    onChange={(e) => setNewHips(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Thigh (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newThighs}
                    onChange={(e) => setNewThighs(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowMeasForm(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg"
                >
                  Save Measurement
                </button>
              </div>
            </form>
          )}

          {/* Measurements Table */}
          <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 uppercase text-[11px]">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Weight</th>
                  <th className="py-2.5 px-3">Body Fat %</th>
                  <th className="py-2.5 px-3">Waist</th>
                  <th className="py-2.5 px-3">Chest</th>
                  <th className="py-2.5 px-3">Arms</th>
                  <th className="py-2.5 px-3">Thighs</th>
                  <th className="py-2.5 px-3">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {bodyMeasurements.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-3 text-white font-bold">{m.date}</td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">{m.weightKg} kg</td>
                    <td className="py-3 px-3 text-amber-400 font-bold">{m.bodyFatPercent ? `${m.bodyFatPercent}%` : '--'}</td>
                    <td className="py-3 px-3">{m.waistCm} cm</td>
                    <td className="py-3 px-3">{m.chestCm} cm</td>
                    <td className="py-3 px-3">{m.armsCm} cm</td>
                    <td className="py-3 px-3">{m.thighsCm} cm</td>
                    <td className="py-3 px-3 text-slate-400 font-sans text-[11px]">{m.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. TAB CONTENT: VISUAL FRONT/SIDE PROGRESS GALLERY WITH ALIGNMENT OVERLAYS */}
      {activeTab === 'gallery' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
            {/* Top Bar for Gallery */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">
                  Side-by-Side Comparison Engine
                </span>
                <h3 className="text-lg font-bold text-white">
                  {activeComparison.title}
                </h3>
                <p className="text-xs text-slate-400">
                  {activeComparison.dateA} ({activeComparison.weightA}kg) vs {activeComparison.dateB} ({activeComparison.weightB}kg)
                </p>
              </div>

              {/* View & Tool Controls */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Photo Selector */}
                {photoComparisons.map((comp, idx) => (
                  <button
                    key={comp.id}
                    type="button"
                    onClick={() => setSelectedPhotoIndex(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedPhotoIndex === idx
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    {comp.view === 'front' ? 'Front Pose' : 'Side Profile'}
                  </button>
                ))}

                {/* Overlay Toggle Buttons */}
                <button
                  type="button"
                  onClick={() => setShowGridOverlay(!showGridOverlay)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                    showGridOverlay
                      ? 'bg-slate-800 text-emerald-400 border-emerald-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                  title="Toggle Posture Alignment Grid"
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span>Alignment Grid</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowPlumbLine(!showPlumbLine)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                    showPlumbLine
                      ? 'bg-slate-800 text-emerald-400 border-emerald-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                  title="Toggle Vertical Plumb Line"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Plumb Line</span>
                </button>

                {/* Mode Selector */}
                <button
                  type="button"
                  onClick={() => setComparisonMode(comparisonMode === 'slider' ? 'sideBySide' : 'slider')}
                  className="px-3 py-1.5 bg-slate-800 text-slate-200 hover:text-white rounded-lg text-xs font-medium border border-slate-700"
                >
                  {comparisonMode === 'slider' ? 'Switch to Side-by-Side' : 'Switch to Split Slider'}
                </button>
              </div>
            </div>

            {/* Visual Comparison Canvas */}
            <div className="relative w-full max-w-3xl mx-auto aspect-[3/4] max-h-[560px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 select-none">
              {comparisonMode === 'slider' ? (
                /* SPLIT DRAG SLIDER MODE */
                <div className="relative w-full h-full overflow-hidden">
                  {/* Base Image (Month 6 / After) */}
                  <img
                    src={activeComparison.imageB}
                    alt="Month 6 Recomposition Result"
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover object-top"
                  />
                  <div className="absolute top-4 right-4 z-20 px-3 py-1 bg-black/70 backdrop-blur-md rounded-lg text-xs font-mono text-emerald-400 border border-emerald-500/30">
                    Month 6 ({activeComparison.weightB}kg)
                  </div>

                  {/* Clipped Top Image (Month 1 / Before) */}
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ width: `${sliderPosition}%` }}
                  >
                    <img
                      src={activeComparison.imageA}
                      alt="Month 1 Baseline Physique"
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover object-top max-w-none"
                      style={{ width: '100%', height: '100%' }}
                    />
                    <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-black/70 backdrop-blur-md rounded-lg text-xs font-mono text-amber-400 border border-amber-500/30">
                      Month 1 ({activeComparison.weightA}kg)
                    </div>
                  </div>

                  {/* Alignment Overlays */}
                  {showGridOverlay && (
                    <div className="absolute inset-0 pointer-events-none z-10 opacity-40">
                      {/* Horizontal Alignment Guideline Markers */}
                      <div className="absolute top-[28%] left-0 right-0 border-b border-emerald-400/60 flex justify-between px-2 text-[9px] font-mono text-emerald-300">
                        <span>Shoulder Line</span>
                      </div>
                      <div className="absolute top-[42%] left-0 right-0 border-b border-emerald-400/60 flex justify-between px-2 text-[9px] font-mono text-emerald-300">
                        <span>Chest / Sternum</span>
                      </div>
                      <div className="absolute top-[58%] left-0 right-0 border-b border-emerald-400/60 flex justify-between px-2 text-[9px] font-mono text-emerald-300">
                        <span>Iliac Crest / Waist</span>
                      </div>
                      <div className="absolute top-[75%] left-0 right-0 border-b border-emerald-400/60 flex justify-between px-2 text-[9px] font-mono text-emerald-300">
                        <span>Mid-Thigh Line</span>
                      </div>
                    </div>
                  )}

                  {showPlumbLine && (
                    <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
                      <div className="w-[1.5px] h-full bg-cyan-400/60 border-l border-dashed border-cyan-400"></div>
                    </div>
                  )}

                  {/* Draggable Vertical Divider Handle */}
                  <div
                    className="absolute top-0 bottom-0 z-30 flex items-center justify-center pointer-events-none"
                    style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                  >
                    <div className="w-0.5 h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
                    <div className="absolute w-8 h-8 rounded-full bg-slate-900 border-2 border-white shadow-xl flex items-center justify-center text-[10px] text-white font-mono">
                      ↔
                    </div>
                  </div>

                  {/* Slider Input Track */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderPosition}
                    onChange={(e) => setSliderPosition(parseFloat(e.target.value))}
                    className="absolute inset-0 opacity-0 cursor-ew-resize z-40 w-full h-full"
                  />
                </div>
              ) : (
                /* SIDE BY SIDE MODE */
                <div className="grid grid-cols-2 h-full w-full divide-x divide-slate-800 relative">
                  <div className="relative h-full w-full">
                    <img
                      src={activeComparison.imageA}
                      alt="Month 1"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute top-3 left-3 px-2 py-0.5 bg-black/70 rounded text-[11px] font-mono text-amber-400">
                      Before ({activeComparison.weightA}kg)
                    </div>
                  </div>
                  <div className="relative h-full w-full">
                    <img
                      src={activeComparison.imageB}
                      alt="Month 6"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute top-3 right-3 px-2 py-0.5 bg-black/70 rounded text-[11px] font-mono text-emerald-400">
                      After ({activeComparison.weightB}kg)
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="text-center text-xs text-slate-400">
              <span className="font-medium text-slate-300">Interactive Alignment Tip:</span> Drag the slider left or right to inspect subcutaneous fat loss, abdominal definition, and latissimus flare against standardized level markers.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
