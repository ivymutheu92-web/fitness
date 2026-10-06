import React from 'react';
import { Dumbbell, TrendingUp, Utensils, Play, Activity } from 'lucide-react';

export type MainTab = 'workouts' | 'progress' | 'nutrition';

interface NavigationProps {
  activeTab: MainTab;
  onSelectTab: (tab: MainTab) => void;
  onStartQuickWorkout: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  onStartQuickWorkout,
}) => {
  return (
    <>
      {/* DESKTOP & TABLET TOP BAR (Top Bar Contract: 3 zones, 1 row) */}
      <header className="sticky top-0 z-40 w-full bg-slate-950/85 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Zone 1: Brand Wordmark (Single clean text element, no descriptor chips or fake versions) */}
          <button
            type="button"
            onClick={() => onSelectTab('workouts')}
            className="flex items-center gap-2.5 text-left text-lg font-extrabold tracking-tight text-white hover:text-emerald-400 transition-colors"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
            <span>KINETIC</span>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <button
              type="button"
              onClick={() => onSelectTab('workouts')}
              className={`transition-colors whitespace-nowrap py-1 relative ${
                activeTab === 'workouts'
                  ? 'text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-500'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Daily Workouts
            </button>
            <button
              type="button"
              onClick={() => onSelectTab('progress')}
              className={`transition-colors whitespace-nowrap py-1 relative ${
                activeTab === 'progress'
                  ? 'text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-500'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Progress Tracking
            </button>
            <button
              type="button"
              onClick={() => onSelectTab('nutrition')}
              className={`transition-colors whitespace-nowrap py-1 relative ${
                activeTab === 'nutrition'
                  ? 'text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-500'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Tailored Nutrition
            </button>
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onStartQuickWorkout}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-md transition-all active:scale-95 whitespace-nowrap"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>Start Workout</span>
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE BOTTOM TAB BAR (Thumb zone ergonomics, 44px+ hitboxes) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 md:hidden px-2 pb-safe">
        <div className="grid grid-cols-3 items-center h-16">
          <button
            type="button"
            onClick={() => onSelectTab('workouts')}
            className={`min-h-[48px] flex flex-col items-center justify-center transition-colors ${
              activeTab === 'workouts' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Dumbbell className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-tight mt-1">Workouts</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('progress')}
            className={`min-h-[48px] flex flex-col items-center justify-center transition-colors ${
              activeTab === 'progress' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-tight mt-1">Progress</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('nutrition')}
            className={`min-h-[48px] flex flex-col items-center justify-center transition-colors ${
              activeTab === 'nutrition' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Utensils className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-tight mt-1">Nutrition</span>
          </button>
        </div>
      </nav>
    </>
  );
};
