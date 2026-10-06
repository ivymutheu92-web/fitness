import React, { useState } from 'react';
import { 
  Utensils, 
  Flame, 
  Check, 
  ArrowRightLeft, 
  ShoppingCart, 
  Droplet, 
  Clock, 
  Copy, 
  Plus, 
  ChevronRight, 
  Sliders
} from 'lucide-react';
import { 
  UserNutritionProfile, 
  NutritionGoal, 
  ActivityLevel, 
  DailyMeal, 
  GroceryItem 
} from '../types/fitness';
import { 
  calculateBMR, 
  calculateTDEE, 
  calculateNutritionTargets 
} from '../utils/calculations';
import { MEAL_SWAP_DATABASE } from '../data/sampleData';

interface NutritionEngineProps {
  userProfile: UserNutritionProfile;
  dailyMeals: DailyMeal[];
  groceryList: GroceryItem[];
  onUpdateProfile: (profile: UserNutritionProfile) => void;
  onUpdateMeals: (meals: DailyMeal[]) => void;
  onUpdateGroceryList: (items: GroceryItem[]) => void;
}

export const NutritionEngine: React.FC<NutritionEngineProps> = ({
  userProfile,
  dailyMeals,
  groceryList,
  onUpdateProfile,
  onUpdateMeals,
  onUpdateGroceryList,
}) => {
  // Navigation tabs within Nutrition: Macro Dashboard, Meal Planner, Weekly Grocery List, TDEE Calculator
  const [activeTab, setActiveTab] = useState<'dashboard' | 'meals' | 'grocery' | 'calculator'>('dashboard');

  // Water intake state in ml
  const [waterConsumedMl, setWaterConsumedMl] = useState(2250);

  // Meal swap modal state
  const [swappingMealId, setSwappingMealId] = useState<string | null>(null);

  // New grocery item input
  const [newGroceryName, setNewGroceryName] = useState('');
  const [newGroceryCat, setNewGroceryCat] = useState<GroceryItem['category']>('produce');
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Calculations
  const bmr = calculateBMR(userProfile);
  const tdee = calculateTDEE(bmr, userProfile.activityLevel);
  const targets = calculateNutritionTargets(userProfile);

  // Sum consumed macros from logged meals
  const consumedCalories = dailyMeals
    .filter((m) => m.logged)
    .reduce((sum, m) => sum + m.calories, 0);
  const consumedProtein = dailyMeals
    .filter((m) => m.logged)
    .reduce((sum, m) => sum + m.proteinGrams, 0);
  const consumedCarbs = dailyMeals
    .filter((m) => m.logged)
    .reduce((sum, m) => sum + m.carbsGrams, 0);
  const consumedFats = dailyMeals
    .filter((m) => m.logged)
    .reduce((sum, m) => sum + m.fatsGrams, 0);

  // Percentages for macro bars
  const calPercent = Math.min(100, Math.round((consumedCalories / targets.calories) * 100));
  const proteinPercent = Math.min(100, Math.round((consumedProtein / targets.proteinGrams) * 100));
  const carbsPercent = Math.min(100, Math.round((consumedCarbs / targets.carbsGrams) * 100));
  const fatsPercent = Math.min(100, Math.round((consumedFats / targets.fatsGrams) * 100));

  // Toggle meal logged
  const handleToggleMeal = (id: string) => {
    const updated = dailyMeals.map((m) => (m.id === id ? { ...m, logged: !m.logged } : m));
    onUpdateMeals(updated);
  };

  // Swap meal execution
  const handleSwapMeal = (targetMealId: string, replacementKey: string) => {
    const replacement = MEAL_SWAP_DATABASE[replacementKey];
    if (!replacement) return;

    const updated = dailyMeals.map((m) => {
      if (m.id === targetMealId) {
        return {
          ...replacement,
          id: `meal_${Date.now()}`,
          category: m.category,
          logged: m.logged,
          swapAlternatives: m.swapAlternatives,
        };
      }
      return m;
    });

    onUpdateMeals(updated);
    setSwappingMealId(null);
  };

  // Toggle grocery item checkbox
  const handleToggleGrocery = (id: string) => {
    const updated = groceryList.map((g) => (g.id === id ? { ...g, checked: !g.checked } : g));
    onUpdateGroceryList(updated);
  };

  // Add custom grocery item
  const handleAddGroceryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroceryName.trim()) return;
    const newItem: GroceryItem = {
      id: `g_${Date.now()}`,
      name: newGroceryName.trim(),
      category: newGroceryCat,
      quantity: '1 portion',
      checked: false,
    };
    onUpdateGroceryList([...groceryList, newItem]);
    setNewGroceryName('');
  };

  const copyGroceryListToClipboard = () => {
    const text = groceryList
      .map((g) => `${g.checked ? '[x]' : '[ ]'} ${g.name} (${g.quantity})`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  const currentSwappingMeal = dailyMeals.find((m) => m.id === swappingMealId);

  return (
    <div className="space-y-8">
      {/* 1. TOP NUTRITION BANNER & ENGINE NAVIGATION */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase text-emerald-400 tracking-wider">
            Mifflin-St Jeor Energy Engine
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Tailored Nutrition & Macro Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Basal Metabolic Rate: <strong className="text-slate-200 font-mono">{bmr} kcal</strong> · Maintenance TDEE: <strong className="text-slate-200 font-mono">{tdee} kcal</strong>
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-slate-800 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Macro Rings
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('meals')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === 'meals'
                ? 'bg-slate-800 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Meal Planner & Swaps
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('grocery')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === 'grocery'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Weekly Grocery List
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('calculator')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === 'calculator'
                ? 'bg-slate-800 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            TDEE Profile Settings
          </button>
        </div>
      </div>

      {/* 2. TAB: MACRO DASHBOARD & RINGS */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Main Macro Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Calories Ring / Bar */}
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-slate-400">Daily Calories</span>
                <span className="text-xs font-mono text-emerald-400">{calPercent}%</span>
              </div>
              <div className="text-2xl font-extrabold text-white font-mono tabular-nums">
                {consumedCalories} <span className="text-xs font-normal text-slate-400">/ {targets.calories} kcal</span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${calPercent}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-slate-400">
                Remaining: <strong className="text-slate-200 font-mono">{Math.max(0, targets.calories - consumedCalories)} kcal</strong>
              </p>
            </div>

            {/* Protein */}
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-slate-400">Protein (g)</span>
                <span className="text-xs font-mono text-amber-400">{proteinPercent}%</span>
              </div>
              <div className="text-2xl font-extrabold text-white font-mono tabular-nums">
                {consumedProtein} <span className="text-xs font-normal text-slate-400">/ {targets.proteinGrams} g</span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-amber-500 transition-all duration-500"
                  style={{ width: `${proteinPercent}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-slate-400">
                Target: <strong className="text-slate-200 font-mono">2.0g per kg</strong> of bodyweight
              </p>
            </div>

            {/* Carbohydrates */}
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-slate-400">Carbohydrates (g)</span>
                <span className="text-xs font-mono text-cyan-400">{carbsPercent}%</span>
              </div>
              <div className="text-2xl font-extrabold text-white font-mono tabular-nums">
                {consumedCarbs} <span className="text-xs font-normal text-slate-400">/ {targets.carbsGrams} g</span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-cyan-500 transition-all duration-500"
                  style={{ width: `${carbsPercent}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-slate-400">
                Glycogen replenishment & muscle fuel
              </p>
            </div>

            {/* Fats */}
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-slate-400">Dietary Fats (g)</span>
                <span className="text-xs font-mono text-purple-400">{fatsPercent}%</span>
              </div>
              <div className="text-2xl font-extrabold text-white font-mono tabular-nums">
                {consumedFats} <span className="text-xs font-normal text-slate-400">/ {targets.fatsGrams} g</span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-purple-500 transition-all duration-500"
                  style={{ width: `${fatsPercent}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-slate-400">
                Endocrine & hormonal balance
              </p>
            </div>
          </div>

          {/* Hydration Tracker */}
          <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Droplet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Daily Hydration Log</h3>
                <p className="text-xs text-slate-400 font-mono">
                  {(waterConsumedMl / 1000).toFixed(2)}L consumed of {targets.waterLiters}L recommended target
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setWaterConsumedMl((prev) => prev + 250)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono text-xs rounded-lg border border-slate-700"
              >
                +250 ml (Glass)
              </button>
              <button
                type="button"
                onClick={() => setWaterConsumedMl((prev) => prev + 500)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono text-xs rounded-lg border border-slate-700"
              >
                +500 ml (Bottle)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. TAB: MEAL PLANNER & CUSTOMIZABLE SWAP DATABASE */}
      {(activeTab === 'meals' || activeTab === 'dashboard') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Today&apos;s Tailored Meal Blueprint</h3>
              <p className="text-xs text-slate-400">Mark meals as logged or tap swap to replace with macro-equivalent alternatives</p>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {dailyMeals.filter((m) => m.logged).length} / {dailyMeals.length} Meals Logged
            </span>
          </div>

          <div className="space-y-3">
            {dailyMeals.map((meal) => (
              <div
                key={meal.id}
                className={`p-4 rounded-xl border transition-all ${
                  meal.logged
                    ? 'bg-slate-900/40 border-emerald-500/30'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase bg-slate-950 text-slate-400 px-2 py-0.5 rounded border border-slate-800">
                        {meal.category}
                      </span>
                      <h4 className="text-sm font-semibold text-white">
                        {meal.name}
                      </h4>
                      {meal.logged && (
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/30">
                          Logged
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400">
                      <span className="text-white font-bold">{meal.calories} kcal</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-amber-400">{meal.proteinGrams}g Protein</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-cyan-400">{meal.carbsGrams}g Carbs</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-purple-400">{meal.fatsGrams}g Fats</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-slate-500 flex items-center gap-1 font-sans">
                        <Clock className="w-3 h-3" /> {meal.prepTimeMinutes} mins
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Swap Meal Button */}
                    {meal.swapAlternatives && meal.swapAlternatives.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSwappingMealId(meal.id)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
                      >
                        <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Swap Meal</span>
                      </button>
                    )}

                    {/* Log Toggle Button */}
                    <button
                      type="button"
                      onClick={() => handleToggleMeal(meal.id)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                        meal.logged
                          ? 'bg-emerald-500 text-slate-950 shadow-md'
                          : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>{meal.logged ? 'Consumed' : 'Mark Eaten'}</span>
                    </button>
                  </div>
                </div>

                {/* Ingredients snippet */}
                <div className="mt-2.5 pt-2.5 border-t border-slate-800/60 text-xs text-slate-400">
                  <span className="text-slate-500">Key Ingredients: </span>
                  {meal.ingredients.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. TAB: AUTO-GENERATED WEEKLY GROCERY LIST */}
      {activeTab === 'grocery' && (
        <div className="space-y-6">
          <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-mono uppercase text-emerald-400">Weekly Shopping Optimizer</span>
                <h3 className="text-lg font-bold text-white">Auto-Generated Weekly Grocery List</h3>
                <p className="text-xs text-slate-400">
                  Aggregated from all scheduled meals and macronutrient requirements
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={copyGroceryListToClipboard}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedNotification ? 'Copied to Clipboard!' : 'Copy Checklist'}</span>
                </button>
              </div>
            </div>

            {/* Add Custom Item */}
            <form onSubmit={handleAddGroceryItem} className="flex gap-2">
              <input
                type="text"
                placeholder="Add grocery item (e.g. Grass-fed butter, Chia seeds)..."
                value={newGroceryName}
                onChange={(e) => setNewGroceryName(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <select
                value={newGroceryCat}
                onChange={(e) => setNewGroceryCat(e.target.value as GroceryItem['category'])}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
              >
                <option value="produce">Produce</option>
                <option value="protein">Lean Protein</option>
                <option value="grains">Carbs/Grains</option>
                <option value="fats">Healthy Fats</option>
                <option value="pantry">Pantry</option>
              </select>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all"
              >
                Add
              </button>
            </form>

            {/* Grouped Checklist */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(['produce', 'protein', 'grains', 'fats', 'pantry'] as const).map((cat) => {
                const items = groceryList.filter((g) => g.category === cat);
                if (items.length === 0) return null;

                const catTitles: Record<string, string> = {
                  produce: 'Produce & Fresh Greens',
                  protein: 'Lean Proteins & Poultry',
                  grains: 'Complex Carbohydrates & Grains',
                  fats: 'Healthy Fats & Cold-Pressed Oils',
                  pantry: 'Supplements & Performance Pantry',
                };

                return (
                  <div key={cat} className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-2">
                    <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider">
                      {catTitles[cat]}
                    </h4>
                    <div className="space-y-1.5">
                      {items.map((item) => (
                        <label
                          key={item.id}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-900 cursor-pointer text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={item.checked}
                              onChange={() => handleToggleGrocery(item.id)}
                              className="rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-0 focus:ring-offset-0"
                            />
                            <span className={item.checked ? 'line-through text-slate-500' : 'text-slate-200'}>
                              {item.name}
                            </span>
                          </div>
                          <span className="text-slate-400 font-mono text-[11px]">
                            {item.quantity}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB: TDEE PROFILE SETTINGS */}
      {activeTab === 'calculator' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6 max-w-2xl">
          <div>
            <span className="text-[11px] font-mono uppercase text-emerald-400">Metabolic Tuning</span>
            <h3 className="text-lg font-bold text-white">Mifflin-St Jeor Parameters</h3>
            <p className="text-xs text-slate-400">
              Update body metrics and target goal to dynamically recalculate your daily calorie baseline and macronutrient split.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-400">Biological Sex</label>
              <select
                value={userProfile.gender}
                onChange={(e) => onUpdateProfile({ ...userProfile, gender: e.target.value as 'male' | 'female' })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
              >
                <option value="male">Male (+5 constant)</option>
                <option value="female">Female (-161 constant)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-slate-400">Age (years)</label>
              <input
                type="number"
                value={userProfile.age}
                onChange={(e) => onUpdateProfile({ ...userProfile, age: parseInt(e.target.value) || 25 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-400">Current Weight (kg)</label>
              <input
                type="number"
                step="0.5"
                value={userProfile.weightKg}
                onChange={(e) => onUpdateProfile({ ...userProfile, weightKg: parseFloat(e.target.value) || 75 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-400">Height (cm)</label>
              <input
                type="number"
                value={userProfile.heightCm}
                onChange={(e) => onUpdateProfile({ ...userProfile, heightCm: parseInt(e.target.value) || 175 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
              />
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <label className="text-slate-400">Training Activity Multiplier</label>
            <select
              value={userProfile.activityLevel}
              onChange={(e) => onUpdateProfile({ ...userProfile, activityLevel: e.target.value as ActivityLevel })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
            >
              <option value="sedentary">Sedentary (1.2× - Little or no exercise)</option>
              <option value="light">Lightly Active (1.375× - 1 to 3 workouts/week)</option>
              <option value="moderate">Moderately Active (1.55× - 3 to 5 workouts/week)</option>
              <option value="very_active">Very Active (1.725× - 6 to 7 workouts/week)</option>
              <option value="athlete">Athlete / Extreme (1.9× - Double daily sessions)</option>
            </select>
          </div>

          <div className="space-y-2 text-xs">
            <label className="text-slate-400">Physique Goal & Caloric Offset</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => onUpdateProfile({ ...userProfile, goal: 'hypertrophy', customCalorieAdjustment: 400 })}
                className={`p-3 rounded-xl border text-left transition-colors ${
                  userProfile.goal === 'hypertrophy'
                    ? 'bg-emerald-500/10 border-emerald-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div className="font-semibold text-xs">Bulking / Hypertrophy</div>
                <div className="text-[10px] text-emerald-400 font-mono mt-0.5">+400 kcal surplus</div>
              </button>
              <button
                type="button"
                onClick={() => onUpdateProfile({ ...userProfile, goal: 'recomposition', customCalorieAdjustment: 0 })}
                className={`p-3 rounded-xl border text-left transition-colors ${
                  userProfile.goal === 'recomposition'
                    ? 'bg-emerald-500/10 border-emerald-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div className="font-semibold text-xs">Body Recomposition</div>
                <div className="text-[10px] text-cyan-400 font-mono mt-0.5">Maintenance (0 kcal)</div>
              </button>
              <button
                type="button"
                onClick={() => onUpdateProfile({ ...userProfile, goal: 'fat_loss', customCalorieAdjustment: 450 })}
                className={`p-3 rounded-xl border text-left transition-colors ${
                  userProfile.goal === 'fat_loss'
                    ? 'bg-emerald-500/10 border-emerald-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div className="font-semibold text-xs">Fat Loss / Cutting</div>
                <div className="text-[10px] text-rose-400 font-mono mt-0.5">-450 kcal deficit</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MEAL SWAP MODAL */}
      {swappingMealId && currentSwappingMeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Swap Meal</h3>
                <p className="text-xs text-slate-400">
                  Select a macro-matched alternative for <span className="text-slate-200">{currentSwappingMeal.name}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSwappingMealId(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {currentSwappingMeal.swapAlternatives?.map((altKey) => {
                const alt = MEAL_SWAP_DATABASE[altKey];
                if (!alt) return null;
                return (
                  <div
                    key={altKey}
                    className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white">{alt.name}</h4>
                      <button
                        type="button"
                        onClick={() => handleSwapMeal(currentSwappingMeal.id, altKey)}
                        className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-lg"
                      >
                        Select
                      </button>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                      <span>{alt.calories} kcal</span>
                      <span>·</span>
                      <span className="text-amber-400">{alt.proteinGrams}g Protein</span>
                      <span>·</span>
                      <span className="text-cyan-400">{alt.carbsGrams}g Carbs</span>
                      <span>·</span>
                      <span className="text-purple-400">{alt.fatsGrams}g Fats</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {alt.ingredients.join(', ')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
