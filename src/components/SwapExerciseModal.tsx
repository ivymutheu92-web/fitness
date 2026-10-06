import React, { useState } from 'react';
import { X, ArrowRightLeft, Dumbbell, ShieldCheck } from 'lucide-react';
import { Exercise, Equipment } from '../types/fitness';
import { EXERCISE_LIBRARY } from '../data/exerciseLibrary';

interface SwapExerciseModalProps {
  currentExercise: Exercise;
  isOpen: boolean;
  onClose: () => void;
  onSelectSwap: (newExercise: Exercise) => void;
}

export const SwapExerciseModal: React.FC<SwapExerciseModalProps> = ({
  currentExercise,
  isOpen,
  onClose,
  onSelectSwap,
}) => {
  const [equipmentFilter, setEquipmentFilter] = useState<Equipment | 'all'>('all');

  if (!isOpen) return null;

  // Filter candidates: alternatives linked in exercise OR exercises sharing same primary muscle
  const candidates = EXERCISE_LIBRARY.filter((ex) => {
    if (ex.id === currentExercise.id) return false;
    const isDirectAlternative = currentExercise.alternatives.includes(ex.id);
    const sharesPrimary = ex.primaryMuscle === currentExercise.primaryMuscle;
    const matchesEquipment = equipmentFilter === 'all' || ex.equipment === equipmentFilter;
    return (isDirectAlternative || sharesPrimary) && matchesEquipment;
  });

  const equipmentOptions: { label: string; value: Equipment | 'all' }[] = [
    { label: 'All Equipment', value: 'all' },
    { label: 'Dumbbell', value: 'dumbbell' },
    { label: 'Barbell', value: 'barbell' },
    { label: 'Cable', value: 'cable' },
    { label: 'Machine', value: 'machine' },
    { label: 'Bodyweight', value: 'bodyweight' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Swap Exercise</h2>
              <p className="text-xs text-slate-400">
                Replace <span className="text-slate-200 font-medium">{currentExercise.name}</span> with equivalent stimuli
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Equipment Filter Bar */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-900/50">
          <div className="text-[11px] font-mono uppercase text-slate-400 mb-2">Equipment Availability Filter</div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {equipmentOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setEquipmentFilter(opt.value)}
                className={`px-3 py-1 text-xs rounded-md whitespace-nowrap transition-colors ${
                  equipmentFilter === opt.value
                    ? 'bg-emerald-500 text-slate-950 font-medium'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Candidate List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {candidates.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">
              No matching exercises found for selected equipment filter. Try selecting &quot;All Equipment&quot;.
            </div>
          ) : (
            candidates.map((cand) => (
              <div
                key={cand.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-xl hover:border-slate-700 transition-colors gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">{cand.name}</span>
                    <span className="text-[10px] font-mono uppercase text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                      {cand.equipment}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>Primary: <strong className="text-slate-300 capitalize">{cand.primaryMuscle}</strong></span>
                    <span aria-hidden="true">·</span>
                    <span>Secondary: <span className="capitalize">{cand.secondaryMuscles.join(', ')}</span></span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Direct biomechanical substitution (scapular & torque match)</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectSwap(cand)}
                  className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg whitespace-nowrap transition-all active:scale-95 shadow-sm"
                >
                  Swap In
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>{candidates.length} alternatives available</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-slate-300 hover:bg-slate-800"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
