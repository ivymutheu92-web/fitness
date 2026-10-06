import React, { useState, useEffect } from 'react';
import { Navigation, MainTab } from './components/Navigation';
import { WorkoutEngine } from './components/WorkoutEngine';
import { ProgressEngine } from './components/ProgressEngine';
import { NutritionEngine } from './components/NutritionEngine';
import { ActiveWorkoutModal } from './components/ActiveWorkoutModal';
import { 
  WorkoutSession, 
  OneRepMaxRecord, 
  CardioLog, 
  BodyTapeMeasurement, 
  PhotoComparison, 
  UserNutritionProfile, 
  DailyMeal, 
  GroceryItem 
} from './types/fitness';
import { 
  INITIAL_USER_PROFILE, 
  INITIAL_WORKOUT_HISTORY, 
  INITIAL_1RM_RECORDS, 
  INITIAL_CARDIO_LOGS, 
  INITIAL_BODY_MEASUREMENTS, 
  INITIAL_PHOTO_COMPARISONS, 
  INITIAL_DAILY_MEALS, 
  INITIAL_GROCERY_LIST 
} from './data/sampleData';
import { EXERCISE_LIBRARY } from './data/exerciseLibrary';

export default function App() {
  const [activeTab, setActiveTab] = useState<MainTab>('workouts');
  const [isQuickWorkoutOpen, setIsQuickWorkoutOpen] = useState(false);

  // Persistent States
  const [userProfile, setUserProfile] = useState<UserNutritionProfile>(() => {
    try {
      const saved = localStorage.getItem('kinetic_user_profile');
      return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
    } catch {
      return INITIAL_USER_PROFILE;
    }
  });

  const [workoutSessions, setWorkoutSessions] = useState<WorkoutSession[]>(() => {
    try {
      const saved = localStorage.getItem('kinetic_workout_history');
      return saved ? JSON.parse(saved) : INITIAL_WORKOUT_HISTORY;
    } catch {
      return INITIAL_WORKOUT_HISTORY;
    }
  });

  const [oneRepMaxRecords, setOneRepMaxRecords] = useState<OneRepMaxRecord[]>(() => {
    try {
      const saved = localStorage.getItem('kinetic_1rm_records');
      return saved ? JSON.parse(saved) : INITIAL_1RM_RECORDS;
    } catch {
      return INITIAL_1RM_RECORDS;
    }
  });

  const [cardioLogs, setCardioLogs] = useState<CardioLog[]>(() => {
    try {
      const saved = localStorage.getItem('kinetic_cardio_logs');
      return saved ? JSON.parse(saved) : INITIAL_CARDIO_LOGS;
    } catch {
      return INITIAL_CARDIO_LOGS;
    }
  });

  const [bodyMeasurements, setBodyMeasurements] = useState<BodyTapeMeasurement[]>(() => {
    try {
      const saved = localStorage.getItem('kinetic_body_measurements');
      return saved ? JSON.parse(saved) : INITIAL_BODY_MEASUREMENTS;
    } catch {
      return INITIAL_BODY_MEASUREMENTS;
    }
  });

  const [photoComparisons, setPhotoComparisons] = useState<PhotoComparison[]>(() => {
    try {
      const saved = localStorage.getItem('kinetic_photo_comparisons');
      return saved ? JSON.parse(saved) : INITIAL_PHOTO_COMPARISONS;
    } catch {
      return INITIAL_PHOTO_COMPARISONS;
    }
  });

  const [dailyMeals, setDailyMeals] = useState<DailyMeal[]>(() => {
    try {
      const saved = localStorage.getItem('kinetic_daily_meals');
      return saved ? JSON.parse(saved) : INITIAL_DAILY_MEALS;
    } catch {
      return INITIAL_DAILY_MEALS;
    }
  });

  const [groceryList, setGroceryList] = useState<GroceryItem[]>(() => {
    try {
      const saved = localStorage.getItem('kinetic_grocery_list');
      return saved ? JSON.parse(saved) : INITIAL_GROCERY_LIST;
    } catch {
      return INITIAL_GROCERY_LIST;
    }
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('kinetic_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('kinetic_workout_history', JSON.stringify(workoutSessions));
  }, [workoutSessions]);

  useEffect(() => {
    localStorage.setItem('kinetic_1rm_records', JSON.stringify(oneRepMaxRecords));
  }, [oneRepMaxRecords]);

  useEffect(() => {
    localStorage.setItem('kinetic_cardio_logs', JSON.stringify(cardioLogs));
  }, [cardioLogs]);

  useEffect(() => {
    localStorage.setItem('kinetic_body_measurements', JSON.stringify(bodyMeasurements));
  }, [bodyMeasurements]);

  useEffect(() => {
    localStorage.setItem('kinetic_photo_comparisons', JSON.stringify(photoComparisons));
  }, [photoComparisons]);

  useEffect(() => {
    localStorage.setItem('kinetic_daily_meals', JSON.stringify(dailyMeals));
  }, [dailyMeals]);

  useEffect(() => {
    localStorage.setItem('kinetic_grocery_list', JSON.stringify(groceryList));
  }, [groceryList]);

  // Handlers
  const handleLogWorkout = (newSession: WorkoutSession) => {
    setWorkoutSessions([newSession, ...workoutSessions]);
  };

  const handleAdd1RM = (rec: OneRepMaxRecord) => {
    setOneRepMaxRecords([rec, ...oneRepMaxRecords]);
  };

  const handleAddCardio = (log: CardioLog) => {
    setCardioLogs([log, ...cardioLogs]);
  };

  const handleAddMeasurement = (meas: BodyTapeMeasurement) => {
    setBodyMeasurements([meas, ...bodyMeasurements]);
  };

  const handleAddPhotoComparison = (comp: PhotoComparison) => {
    setPhotoComparisons([comp, ...photoComparisons]);
  };

  // Quick default workout routine for top button
  const defaultQuickExercises = EXERCISE_LIBRARY.slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300 pb-20 md:pb-12">
      {/* Universal Top Navigation Header */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onStartQuickWorkout={() => setIsQuickWorkoutOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'workouts' && (
          <WorkoutEngine
            onLogWorkoutSession={handleLogWorkout}
            recentSessions={workoutSessions}
          />
        )}

        {activeTab === 'progress' && (
          <ProgressEngine
            workoutSessions={workoutSessions}
            oneRepMaxRecords={oneRepMaxRecords}
            cardioLogs={cardioLogs}
            bodyMeasurements={bodyMeasurements}
            photoComparisons={photoComparisons}
            onAdd1RMRecord={handleAdd1RM}
            onAddCardioLog={handleAddCardio}
            onAddBodyMeasurement={handleAddMeasurement}
            onAddPhotoComparison={handleAddPhotoComparison}
          />
        )}

        {activeTab === 'nutrition' && (
          <NutritionEngine
            userProfile={userProfile}
            dailyMeals={dailyMeals}
            groceryList={groceryList}
            onUpdateProfile={setUserProfile}
            onUpdateMeals={setDailyMeals}
            onUpdateGroceryList={setGroceryList}
          />
        )}
      </main>

      {/* Universal Quick Workout Modal */}
      {isQuickWorkoutOpen && (
        <ActiveWorkoutModal
          isOpen={isQuickWorkoutOpen}
          onClose={() => setIsQuickWorkoutOpen(false)}
          initialExercises={defaultQuickExercises}
          splitTitle="Live Hypertrophy Session"
          onFinishWorkout={(session) => {
            handleLogWorkout(session);
            setIsQuickWorkoutOpen(false);
          }}
        />
      )}

      {/* Quiet Footer */}
      <footer className="border-t border-slate-900 mt-12 py-6 text-center text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>KINETIC Athletic Performance & Hypertrophy Architecture</span>
          <span className="font-mono text-[11px] text-slate-600">
            Push · Pull · Legs · Mifflin-St Jeor TDEE · Brzycki 1RM
          </span>
        </div>
      </footer>
    </div>
  );
}
