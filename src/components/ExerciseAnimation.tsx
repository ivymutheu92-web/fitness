import React, { useEffect, useState } from 'react';
import { Play, Pause } from 'lucide-react';

interface ExerciseAnimationProps {
  type: string;
  name: string;
  primaryMuscle?: string;
}

export const ExerciseAnimation: React.FC<ExerciseAnimationProps> = ({
  type,
  name,
  primaryMuscle = 'Target Muscle',
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [showPath, setShowPath] = useState(true);
  const [progress, setProgress] = useState(0); // 0 to 1

  // Loop timer for smooth 3.5s rep cycle
  useEffect(() => {
    let animId: number;
    let startTime: number | null = null;
    const duration = 3400; // 3.4 seconds per complete rep loop

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      if (isPlaying) {
        const elapsed = (timestamp - startTime) % duration;
        setProgress(elapsed / duration);
      }
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  // Sine curve normalized: 0 (start/top) -> 1 (eccentric bottom) -> 0 (concentric peak)
  // We use easeInOut sine for lifelike biomechanics
  const phase = Math.sin(progress * Math.PI * 2 - Math.PI / 2) * 0.5 + 0.5;

  const renderAnimationGraphics = () => {
    switch (type) {
      case 'bench_press': {
        // Bar position: y 100 (top lockout) to y 155 (touch chest)
        const barY = 95 + phase * 65;
        const elbowX = 70 - phase * 18;
        const elbowY = 125 + phase * 22;

        return (
          <g>
            {/* Flat Bench */}
            <rect x="40" y="165" width="160" height="12" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
            <line x1="60" y1="177" x2="60" y2="215" stroke="#334155" strokeWidth="5" strokeLinecap="round" />
            <line x1="180" y1="177" x2="180" y2="215" stroke="#334155" strokeWidth="5" strokeLinecap="round" />
            
            {/* Torso lying down */}
            <rect x="65" y="150" width="110" height="20" rx="6" fill="#0f172a" stroke="#475569" strokeWidth="2" />
            {/* Head */}
            <circle cx="180" cy="158" r="10" fill="#334155" />
            
            {/* Chest muscle tension highlight */}
            <ellipse 
              cx="120" 
              cy="155" 
              rx="22" 
              ry="10" 
              fill={phase > 0.6 ? '#f59e0b' : '#10b981'} 
              opacity={0.3 + phase * 0.6}
            />

            {/* Arm & Forearm */}
            <path
              d={`M 140 156 Q ${elbowX + 45} ${elbowY} 120 ${barY}`}
              fill="none"
              stroke="#64748b"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d={`M 100 156 Q ${elbowX + 15} ${elbowY} 120 ${barY}`}
              fill="none"
              stroke="#94a3b8"
              strokeWidth="5"
              strokeLinecap="round"
            />

            {/* Trajectory Guide (J-Curve Bar Path) */}
            {showPath && (
              <line
                x1="120"
                y1="95"
                x2="120"
                y2="160"
                stroke="#10b981"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                opacity="0.6"
              />
            )}

            {/* Barbell & Plates */}
            <line x1="35" y1={barY} x2="205" y2={barY} stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" />
            <rect x="35" y={barY - 20} width="8" height="40" rx="2" fill="#ef4444" stroke="#dc2626" />
            <rect x="44" y={barY - 17} width="6" height="34" rx="2" fill="#3b82f6" />
            <rect x="190" y={barY - 17} width="6" height="34" rx="2" fill="#3b82f6" />
            <rect x="197" y={barY - 20} width="8" height="40" rx="2" fill="#ef4444" stroke="#dc2626" />
          </g>
        );
      }

      case 'squat': {
        // Standing (phase=0) to Deep Squat (phase=1)
        const hipY = 135 + phase * 48;
        const hipX = 110 - phase * 18;
        const kneeX = 132 + phase * 12;
        const kneeY = 175 + phase * 16;
        const barY = 82 + phase * 50;
        const barX = 108 - phase * 4;

        return (
          <g>
            {/* Ground Plane */}
            <line x1="30" y1="230" x2="210" y2="230" stroke="#334155" strokeWidth="3" />

            {/* Feet */}
            <path d="M 125 230 L 145 230" stroke="#475569" strokeWidth="6" strokeLinecap="round" />

            {/* Lower Leg (Shin) */}
            <line x1="130" y1="230" x2={kneeX} y2={kneeY} stroke="#64748b" strokeWidth="6" strokeLinecap="round" />

            {/* Upper Leg (Femur / Quad) */}
            <line x1={kneeX} y1={kneeY} x2={hipX} y2={hipY} stroke="#94a3b8" strokeWidth="7" strokeLinecap="round" />
            
            {/* Quad contraction highlight */}
            <line 
              x1={kneeX} 
              y1={kneeY} 
              x2={hipX} 
              y2={hipY} 
              stroke={phase > 0.5 ? '#f59e0b' : '#10b981'} 
              strokeWidth="5" 
              opacity={0.3 + phase * 0.7} 
            />

            {/* Torso */}
            <line x1={hipX} y1={hipY} x2={barX} y2={barY + 12} stroke="#cbd5e1" strokeWidth="9" strokeLinecap="round" />
            
            {/* Head */}
            <circle cx={barX + 8} cy={barY - 2} r="10" fill="#e2e8f0" />

            {/* Trajectory Guide (Vertical Bar Path directly over midfoot) */}
            {showPath && (
              <line
                x1="130"
                y1="70"
                x2="130"
                y2="230"
                stroke="#10b981"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                opacity="0.5"
              />
            )}

            {/* Barbell on Traps */}
            <line x1={barX - 45} y1={barY} x2={barX + 50} y2={barY} stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" />
            <circle cx={barX - 40} cy={barY} r="18" fill="#ef4444" stroke="#dc2626" strokeWidth="2" />
            <circle cx={barX + 45} cy={barY} r="18" fill="#ef4444" stroke="#dc2626" strokeWidth="2" />
          </g>
        );
      }

      case 'deadlift': {
        // Floor pull (phase=1) to Lockout (phase=0)
        const deadPhase = 1 - phase; // 1 = standing lockout, 0 = at floor
        const barY = 205 - deadPhase * 75;
        const hipX = 90 + deadPhase * 25;
        const hipY = 150 - deadPhase * 15;
        const shoulderX = 125 + deadPhase * 5;
        const shoulderY = 115 - deadPhase * 35;

        return (
          <g>
            <line x1="30" y1="225" x2="210" y2="225" stroke="#334155" strokeWidth="3" />
            
            {/* Feet */}
            <line x1="125" y1="225" x2="145" y2="225" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
            
            {/* Legs */}
            <line x1="130" y1="225" x2="120" y2="185" stroke="#64748b" strokeWidth="6" strokeLinecap="round" />
            <line x1="120" y1="185" x2={hipX} y2={hipY} stroke="#94a3b8" strokeWidth="7" strokeLinecap="round" />
            
            {/* Posterior chain tension glow */}
            <line 
              x1={hipX} 
              y1={hipY} 
              x2={shoulderX} 
              y2={shoulderY} 
              stroke="#f59e0b" 
              strokeWidth="6" 
              opacity={0.3 + (1 - deadPhase) * 0.7} 
            />

            {/* Torso & Head */}
            <line x1={hipX} y1={hipY} x2={shoulderX} y2={shoulderY} stroke="#e2e8f0" strokeWidth="8" strokeLinecap="round" />
            <circle cx={shoulderX + 6} cy={shoulderY - 14} r="10" fill="#cbd5e1" />

            {/* Arm hanging vertical to bar */}
            <line x1={shoulderX} y1={shoulderY} x2="132" y2={barY} stroke="#64748b" strokeWidth="5" strokeLinecap="round" />

            {/* Vertical Bar Path */}
            {showPath && (
              <line
                x1="132"
                y1="120"
                x2="132"
                y2="225"
                stroke="#10b981"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                opacity="0.5"
              />
            )}

            {/* Barbell & Plates */}
            <line x1="85" y1={barY} x2="175" y2={barY} stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" />
            <circle cx="85" cy={barY} r="20" fill="#3b82f6" stroke="#2563eb" strokeWidth="2" />
            <circle cx="175" cy={barY} r="20" fill="#3b82f6" stroke="#2563eb" strokeWidth="2" />
          </g>
        );
      }

      case 'overhead_press': {
        const pressY = 115 - (1 - phase) * 55;

        return (
          <g>
            <line x1="50" y1="225" x2="190" y2="225" stroke="#334155" strokeWidth="3" />
            {/* Body standing tall */}
            <line x1="115" y1="225" x2="115" y2="160" stroke="#64748b" strokeWidth="7" strokeLinecap="round" />
            <line x1="115" y1="160" x2="115" y2="105" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" />
            <circle cx="115" cy="90" r="10" fill="#cbd5e1" />

            {/* Arms extending upward */}
            <path
              d={`M 115 110 Q ${115 + (1 - phase) * 15} ${pressY + 20} 115 ${pressY}`}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="5"
              strokeLinecap="round"
            />

            {/* Shoulder tension halo */}
            <circle cx="115" cy="110" r="14" fill="#f59e0b" opacity={0.3 + (1 - phase) * 0.6} />

            {/* Barbell overhead */}
            <line x1="50" y1={pressY} x2="180" y2={pressY} stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" />
            <circle cx="55" cy={pressY} r="16" fill="#10b981" stroke="#059669" strokeWidth="2" />
            <circle cx="175" cy={pressY} r="16" fill="#10b981" stroke="#059669" strokeWidth="2" />
          </g>
        );
      }

      default: {
        // Universal Biomechanical Movement Loop
        const liftY = 120 + phase * 40;
        return (
          <g>
            <line x1="40" y1="210" x2="200" y2="210" stroke="#334155" strokeWidth="3" />
            <circle cx="120" cy="80" r="12" fill="#cbd5e1" />
            <line x1="120" y1="92" x2="120" y2="155" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" />
            <line x1="120" y1="155" x2="105" y2="210" stroke="#64748b" strokeWidth="6" strokeLinecap="round" />
            <line x1="120" y1="155" x2="135" y2="210" stroke="#64748b" strokeWidth="6" strokeLinecap="round" />
            
            {/* Dynamic Lever Arm */}
            <line x1="120" y1="105" x2="120" y2={liftY} stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />
            <circle cx="120" cy={liftY} r="12" fill="#10b981" />
          </g>
        );
      }
    }
  };

  return (
    <div className="relative flex flex-col items-center bg-slate-950 border border-slate-800 rounded-xl overflow-hidden p-3 w-full">
      {/* Top HUD Display */}
      <div className="flex items-center justify-between w-full text-xs mb-1">
        <div className="flex items-center gap-1.5 font-medium text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Kinematic Loop: {name}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPath(!showPath)}
            className={`px-2 py-0.5 rounded text-[10px] border transition-colors ${
              showPath
                ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                : 'border-slate-800 bg-slate-900 text-slate-500'
            }`}
          >
            Bar Path Guide
          </button>
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            title={isPlaying ? 'Pause Loop' : 'Play Loop'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Looping Vector Canvas */}
      <div className="relative w-full h-52 flex items-center justify-center">
        <svg viewBox="0 0 240 240" className="w-full h-full">
          {/* Subtle Grid Backdrop */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="240" height="240" fill="url(#grid)" />

          {/* Biomechanical Graphics */}
          {renderAnimationGraphics()}
        </svg>

        {/* Rep Tempo Phase Badge */}
        <div className="absolute bottom-2 left-2 text-[11px] font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
          Phase: {phase > 0.5 ? 'Eccentric (Stretch)' : 'Concentric (Contract)'}
        </div>

        {/* Muscle Focus Badge */}
        <div className="absolute bottom-2 right-2 text-[11px] font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
          Target: {primaryMuscle}
        </div>
      </div>
    </div>
  );
};
