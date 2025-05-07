import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { format } from 'date-fns';
import { useTranslation } from '../translations';

// Types
export interface WeightEntry {
  id: string;
  date: string;
  weight: number;
}

export interface MealEntry {
  id: string;
  date: string;
  name: string;
  calories: number;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  quality?: string;
  description?: string;
}

export interface ExerciseEntry {
  id: string;
  date: string;
  type: string;
  duration: number;
  caloriesBurned: number;
  intensity?: string;
}

export interface CycleEntry {
  id: string;
  date: string;
  flow?: 'light' | 'medium' | 'heavy';
  symptoms?: string[];
  notes?: string;
}

export interface EmotionalEntry {
  id: string;
  date: string;
  mood: 'great' | 'good' | 'neutral' | 'bad' | 'awful';
  notes?: string;
}

export interface Goal {
  id: string;
  title: string;
  targetValue: number;
  currentValue: number;
  type: 'weight' | 'exercise' | 'nutrition' | 'other';
  deadline?: string;
  completed: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  dateEarned: string;
  type: 'medal' | 'trophy' | 'badge';
  category: 'consistency' | 'milestone' | 'nutrition' | 'exercise' | 'weight' | 'special';
  level: 'bronze' | 'silver' | 'gold';
  xpReward: number;
  progress?: number;
  maxProgress?: number;
  currentProgress?: number;
  hidden?: boolean;
  notificationSent?: boolean;
  maxXp?: number;
}

export interface XpLevel {
  level: number;
  minXp: number;
  maxXp: number;
  title?: string;
}

export interface UserXp {
  level: number;
  current: number;
  toNextLevel: number;
  total: number;
}

export interface TrainingDay {
  day: 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
  isTraining: boolean;
  trainingType?: string[];
  intensity?: 'light' | 'moderate' | 'intense';
  duration?: number;
}

export interface UserSchedule {
  schedule: TrainingDay[];
  preferredTrainingTime?: 'morning' | 'afternoon' | 'evening';
  nutritionPreferences?: {
    mealCount: number;
    dietType?: 'standard' | 'vegetarian' | 'vegan' | 'keto' | 'paleo' | 'other';
    allergies?: string[];
    excludedFoods?: string[];
  };
  hasCompletedSetup: boolean;
  goalWeight?: number;
  goalDate?: string;
  weeklyWeightGoal?: number;
}

export interface UserProfile {
  name: string;
  weight: number;
  height: number;
  birthDate?: string;
  gender?: 'male' | 'female' | 'other';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
  weightGoal?: 'lose' | 'maintain' | 'gain';
  targetWeight?: number;
  trainingSchedule?: UserSchedule;
  xp?: UserXp;
  telegramChatId?: string;
}

// Language type
export type Language = 'en' | 'he';

// Context type
interface AppContextType {
  userProfile: UserProfile | null;
  weightEntries: WeightEntry[];
  mealEntries: MealEntry[];
  exerciseEntries: ExerciseEntry[];
  cycleEntries: CycleEntry[];
  emotionalEntries: EmotionalEntry[];
  goals: Goal[];
  achievements: Achievement[];
  language: Language;
  t: (key: string) => string;
  setLanguage: (lang: Language) => void;
  updateUserProfile: (profile: UserProfile) => void;
  updateTrainingSchedule: (schedule: UserSchedule) => void;
  addWeightEntry: (entry: Omit<WeightEntry, 'id'>) => void;
  updateWeightEntry: (id: string, updates: Partial<Omit<WeightEntry, 'id'>>) => void;
  deleteWeightEntry: (id: string) => void;
  addMealEntry: (entry: Omit<MealEntry, 'id'>) => void;
  updateMealEntry: (id: string, updates: Partial<Omit<MealEntry, 'id'>>) => void;
  deleteMealEntry: (id: string) => void;
  addExerciseEntry: (entry: Omit<ExerciseEntry, 'id'>) => void;
  addCycleEntry: (entry: Omit<CycleEntry, 'id'>) => void;
  addEmotionalEntry: (entry: Omit<EmotionalEntry, 'id'>) => void;
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  addAchievement: (achievement: Omit<Achievement, 'id'>) => void;
  updateAchievement: (id: string, updates: Partial<Achievement>) => void;
  awardXp: (amount: number) => void;
  checkAchievements: () => void;
  updateExerciseEntry: (id: string, updates: Partial<Omit<ExerciseEntry, 'id'>>) => void;
  deleteExerciseEntry: (id: string) => void;
  updateUserXp: (amount: number) => void;
  checkLevelUp: () => boolean;
}

// Mock data function
const generateMockData = () => {
  const today = new Date();
  
  const weightEntries: WeightEntry[] = [];
  
  return {
    userProfile: null,
    weightEntries,
    mealEntries: [
      {
        id: 'meal-1',
        date: format(today, 'yyyy-MM-dd'),
        name: 'Oatmeal with berries',
        calories: 350,
        type: 'breakfast' as const
      },
      {
        id: 'meal-2',
        date: format(today, 'yyyy-MM-dd'),
        name: 'Chicken salad',
        calories: 450,
        type: 'lunch' as const
      }
    ],
    exerciseEntries: [
      {
        id: 'exercise-1',
        date: format(today, 'yyyy-MM-dd'),
        type: 'Running',
        duration: 30,
        caloriesBurned: 300
      }
    ],
    cycleEntries: [
      {
        id: 'cycle-1',
        date: format(new Date(today.getFullYear(), today.getMonth(), 5), 'yyyy-MM-dd'),
        flow: 'medium' as const,
        symptoms: ['cramps', 'fatigue'],
        notes: 'Felt tired most of the day'
      }
    ],
    emotionalEntries: [
      {
        id: 'emotional-1',
        date: format(today, 'yyyy-MM-dd'),
        mood: 'good' as const,
        notes: 'Productive day, feeling accomplished'
      }
    ],
    goals: [
      {
        id: 'goal-1',
        title: 'Reach target weight',
        targetValue: 60,
        currentValue: 65,
        type: 'weight' as const,
        deadline: format(new Date(today.getFullYear(), today.getMonth() + 2, 1), 'yyyy-MM-dd'),
        completed: false
      },
      {
        id: 'goal-2',
        title: 'Exercise 3 times per week',
        targetValue: 12,
        currentValue: 5,
        type: 'exercise' as const,
        deadline: format(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 30), 'yyyy-MM-dd'),
        completed: false
      }
    ],
    achievements: []
  };
};

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem('bodyBalanceData');
    return savedData ? JSON.parse(savedData) : generateMockData();
  });

  const [language, setLanguage] = useState<Language>(() => {
    const savedLang = localStorage.getItem('bodyBalanceLanguage');
    return (savedLang as Language) || 'en';
  });

  const { t } = useTranslation(language);

  useEffect(() => {
    localStorage.setItem('bodyBalanceData', JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    localStorage.setItem('bodyBalanceLanguage', language);
    document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);
  
  const updateUserProfile = (profile: UserProfile) => {
    // Get language from localStorage or default to 'en'
    const lang = localStorage.getItem('bodyBalanceLanguage') || 'en';
    
    // When a user profile is created or updated, reset the demo data
    // and add the current weight as the first weight entry
    const today = new Date();
    const formattedDate = format(today, 'yyyy-MM-dd');
    
    // Create a weight entry based on the profile weight if it doesn't exist for today
    const hasWeightEntryToday = data.weightEntries.some(
      (entry: WeightEntry) => entry.date === formattedDate
    );
    
    // Check if this is the first time setting up a profile (vs updating existing)
    const isNewProfile = !data.userProfile;
    
    // Reset demo data and update with real user information
    setData((prev: AppContextType) => {
      // Create updated weight entries
      let updatedWeightEntries = [...prev.weightEntries];
      
      // If there's no weight entry for today, add one based on profile weight
      if (!hasWeightEntryToday) {
        const newWeightEntry = {
          id: `weight-${Date.now()}`,
          date: formattedDate,
          weight: profile.weight
        };
        updatedWeightEntries = [newWeightEntry, ...updatedWeightEntries];
      } else {
        // If there is an entry today, update it with the new profile weight
        updatedWeightEntries = updatedWeightEntries.map(entry => 
          entry.date === formattedDate 
            ? { ...entry, weight: profile.weight } 
            : entry
        );
      }

      // If first time setup, reset meal and exercise entries
      const updatedMealEntries = isNewProfile ? [] : prev.mealEntries;
      const updatedExerciseEntries = isNewProfile ? [] : prev.exerciseEntries;
      
      return {
        ...prev,
        userProfile: profile,
        weightEntries: updatedWeightEntries,
        mealEntries: updatedMealEntries,
        exerciseEntries: updatedExerciseEntries,
        // Reset goals to be more personalized if this is first time setting up profile
        goals: prev.userProfile ? prev.goals : [
          profile.weightGoal
            ? {
                id: `goal-${Date.now()}`,
                title:
                  lang === 'he'
                    ? profile.weightGoal === 'lose'
                      ? profile.targetWeight 
                        ? `הפחתת משקל ל-${profile.targetWeight} ק"ג` 
                        : 'הפחתת 5 ק"ג'
                      : profile.weightGoal === 'gain'
                        ? profile.targetWeight 
                          ? `העלאת משקל ל-${profile.targetWeight} ק"ג` 
                          : 'העלאת 3 ק"ג'
                        : 'שמירה על משקל'
                    : profile.weightGoal === 'lose'
                      ? profile.targetWeight 
                        ? `Reach target weight of ${profile.targetWeight}kg` 
                        : 'Lose 5kg'
                      : profile.weightGoal === 'gain'
                        ? profile.targetWeight 
                          ? `Reach target weight of ${profile.targetWeight}kg` 
                          : 'Gain 3kg'
                        : 'Maintain current weight',
                targetValue:
                  // Use targetWeight if provided, otherwise use default values
                  profile.targetWeight || (
                    profile.weightGoal === 'lose'
                      ? profile.weight - 5
                      : profile.weightGoal === 'gain'
                        ? profile.weight + 3
                        : profile.weight
                  ),
                currentValue: profile.weight,
                type: 'weight',
                deadline: format(new Date(today.getFullYear(), today.getMonth() + 3, 1), 'yyyy-MM-dd'),
                completed: false
              }
            : undefined
        ].filter(Boolean)
      };
    });
  };

  const updateTrainingSchedule = (schedule: UserSchedule) => {
    if (!data.userProfile) return;
    
    setData((prev: AppContextType) => ({
      ...prev,
      userProfile: {
        ...prev.userProfile!,
        trainingSchedule: schedule
      }
    }));
  };

  const addWeightEntry = (entry: Omit<WeightEntry, 'id'>) => {
    const newEntry = {
      ...entry,
      id: `weight-${Date.now()}`
    };
    setData((prev: AppContextType) => ({
      ...prev,
      weightEntries: [newEntry, ...prev.weightEntries]
    }));
  };

  const updateWeightEntry = (id: string, updates: Partial<Omit<WeightEntry, 'id'>>) => {
    setData((prev: AppContextType) => ({
      ...prev,
      weightEntries: prev.weightEntries.map((entry) => 
        entry.id === id ? { ...entry, ...updates } : entry
      )
    }));
  };

  const deleteWeightEntry = (id: string) => {
    setData((prev: AppContextType) => ({
      ...prev,
      weightEntries: prev.weightEntries.filter((entry) => entry.id !== id)
    }));
  };

  const addMealEntry = (entry: Omit<MealEntry, 'id'>) => {
    const newEntry = {
      ...entry,
      id: `meal-${Date.now()}`
    };
    setData((prev: AppContextType) => ({
      ...prev,
      mealEntries: [newEntry, ...prev.mealEntries]
    }));
  };

  const updateMealEntry = (id: string, updates: Partial<Omit<MealEntry, 'id'>>) => {
    setData((prev: AppContextType) => ({
      ...prev,
      mealEntries: prev.mealEntries.map((entry) => 
        entry.id === id ? { ...entry, ...updates } : entry
      )
    }));
  };

  const deleteMealEntry = (id: string) => {
    setData((prev: AppContextType) => ({
      ...prev,
      mealEntries: prev.mealEntries.filter((entry) => entry.id !== id)
    }));
  };

  const addExerciseEntry = (entry: Omit<ExerciseEntry, 'id'>) => {
    const newEntry = {
      ...entry,
      id: `exercise-${Date.now()}`
    };
    setData((prev: AppContextType) => ({
      ...prev,
      exerciseEntries: [newEntry, ...prev.exerciseEntries]
    }));
  };

  const addCycleEntry = (entry: Omit<CycleEntry, 'id'>) => {
    const newEntry = {
      ...entry,
      id: `cycle-${Date.now()}`
    };
    setData((prev: AppContextType) => ({
      ...prev,
      cycleEntries: [newEntry, ...prev.cycleEntries]
    }));
  };

  const addEmotionalEntry = (entry: Omit<EmotionalEntry, 'id'>) => {
    const newEntry = {
      ...entry,
      id: `emotional-${Date.now()}`
    };
    setData((prev: AppContextType) => ({
      ...prev,
      emotionalEntries: [newEntry, ...prev.emotionalEntries]
    }));
  };

  const addGoal = (goal: Omit<Goal, 'id'>) => {
    const newGoal = {
      ...goal,
      id: `goal-${Date.now()}`
    };
    setData((prev: AppContextType) => ({
      ...prev,
      goals: [newGoal, ...prev.goals]
    }));
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setData((prev: AppContextType) => ({
      ...prev,
      goals: prev.goals.map((goal: Goal) => 
        goal.id === id ? { ...goal, ...updates } : goal
      )
    }));
  };

  const addAchievement = (achievement: Omit<Achievement, 'id'>) => {
    const newAchievement = {
      ...achievement,
      id: `achievement-${Date.now()}`
    };
    setData((prev: AppContextType) => ({
      ...prev,
      achievements: [newAchievement, ...prev.achievements]
    }));
  };

  const updateAchievement = (id: string, updates: Partial<Achievement>) => {
    setData((prev: AppContextType) => ({
      ...prev,
      achievements: prev.achievements.map((achievement: Achievement) => 
        achievement.id === id ? { ...achievement, ...updates } : achievement
      )
    }));
  };

  const awardXp = (amount: number) => {
    if (!data.userProfile) return;

    const xpLevels: XpLevel[] = [
      { level: 1, minXp: 0, maxXp: 100, title: language === 'he' ? 'מתחיל' : 'Beginner' },
      { level: 2, minXp: 100, maxXp: 250, title: language === 'he' ? 'מתקדם' : 'Novice' },
      { level: 3, minXp: 250, maxXp: 500, title: language === 'he' ? 'שוליה' : 'Apprentice' },
      { level: 4, minXp: 500, maxXp: 1000, title: language === 'he' ? 'מומחה מתחיל' : 'Adept' },
      { level: 5, minXp: 1000, maxXp: 2000, title: language === 'he' ? 'מומחה' : 'Expert' },
      { level: 6, minXp: 2000, maxXp: 3500, title: language === 'he' ? 'אומן' : 'Master' },
      { level: 7, minXp: 3500, maxXp: 5000, title: language === 'he' ? 'אומן מתקדם' : 'Advanced Master' },
      { level: 8, minXp: 5000, maxXp: 7500, title: language === 'he' ? 'גיבור' : 'Champion' },
      { level: 9, minXp: 7500, maxXp: 10000, title: language === 'he' ? 'אגדה' : 'Legend' },
      { level: 10, minXp: 10000, maxXp: Number.MAX_SAFE_INTEGER, title: language === 'he' ? 'בלתי מנוצח' : 'Undefeated' },
    ];

    setData((prev: AppContextType) => {
      const currentProfile = prev.userProfile;
      if (!currentProfile) return prev;

      const currentXp = currentProfile.xp?.current || 0;
      const currentLevel = currentProfile.xp?.level || 1;
      
      const newTotalXp = currentXp + amount;
      
      let newLevel = currentLevel;
      let levelUp = false;
      
      for (const levelInfo of xpLevels) {
        if (newTotalXp >= levelInfo.minXp && newTotalXp < levelInfo.maxXp) {
          if (levelInfo.level > currentLevel) {
            levelUp = true;
          }
          newLevel = levelInfo.level;
          break;
        }
      }
      
      const currentLevelInfo = xpLevels.find(l => l.level === newLevel) || xpLevels[0];
      const xpForCurrentLevel = newTotalXp - currentLevelInfo.minXp;
      const xpNeededForNextLevel = currentLevelInfo.maxXp - currentLevelInfo.minXp;
      const progress = Math.floor((xpForCurrentLevel / xpNeededForNextLevel) * 100);

      if (levelUp) {
        const today = format(new Date(), 'yyyy-MM-dd');
        const levelUpAchievement = {
          title: language === 'he' ? `עלית לרמה ${newLevel}!` : `Level Up to ${newLevel}!`,
          description: language === 'he' 
            ? `כל הכבוד! השגת רמה ${newLevel} - ${currentLevelInfo.title}`
            : `Congratulations! You've reached level ${newLevel} - ${currentLevelInfo.title}`,
          icon: 'award',
          dateEarned: today,
          type: 'badge' as const,
          category: 'milestone' as const,
          level: 'silver' as const,
          xpReward: 0,
          notificationSent: false
        };
        
        const achievementId = `achievement-level-${newLevel}-${Date.now()}`;
        prev.achievements.push({ id: achievementId, ...levelUpAchievement });
        
        console.log(`Level up notification: User reached level ${newLevel}`);
      }

      return {
        ...prev,
        userProfile: {
          ...currentProfile,
          xp: {
            currentXp: newTotalXp,
            level: newLevel,
            progress,
            lastUpdated: format(new Date(), 'yyyy-MM-dd')
          }
        }
      };
    });
  };

  const checkAchievements = () => {
    if (!data.userProfile) return;
    
    const today = new Date();
    const formattedToday = format(today, 'yyyy-MM-dd');
    const achievementsToAdd: Omit<Achievement, 'id'>[] = [];
    
    const checkStreakAchievements = () => {
      const entries = {
        weight: [...data.weightEntries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        meal: [...data.mealEntries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        exercise: [...data.exerciseEntries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
      };
      
      const streaks = {
        weight: 0,
        meal: 0,
        exercise: 0
      };
      
      const calculateStreak = (entries: { date: string }[]): number => {
        if (entries.length === 0) return 0;
        
        let streak = 1;
        let previousDate = new Date(entries[0].date);
        
        for (let i = 1; i < entries.length; i++) {
          const currentDate = new Date(entries[i].date);
          const diffDays = Math.floor((previousDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1) {
            streak++;
            previousDate = currentDate;
          } else {
            break;
          }
        }
        
        return streak;
      };
      
      streaks.weight = calculateStreak(entries.weight);
      streaks.meal = calculateStreak(entries.meal);
      streaks.exercise = calculateStreak(entries.exercise);
      
      const streakMilestones = [
        { days: 3, level: 'bronze' as const },
        { days: 7, level: 'silver' as const },
        { days: 30, level: 'gold' as const }
      ];
      
      for (const milestone of streakMilestones) {
        if (streaks.weight >= milestone.days) {
          const existingAchievement = data.achievements.find((a: Achievement) => 
            a.title === (language === 'he' 
              ? `מעקב משקל ${milestone.days} ימים ברצף` 
              : `${milestone.days} Day Weight Tracking Streak`)
          );
          
          if (!existingAchievement) {
            achievementsToAdd.push({
              title: language === 'he' 
                ? `מעקב משקל ${milestone.days} ימים ברצף` 
                : `${milestone.days} Day Weight Tracking Streak`,
              description: language === 'he'
                ? `עקבת אחר המשקל שלך ${milestone.days} ימים ברצף`
                : `You've tracked your weight for ${milestone.days} consecutive days`,
              icon: 'award',
              dateEarned: formattedToday,
              type: 'medal',
              category: 'consistency',
              level: milestone.level,
              xpReward: milestone.days * 10,
              notificationSent: false
            });
          }
        }
      }
    };
    
    const checkMilestoneAchievements = () => {
      const entryMilestones = [
        { count: 10, level: 'bronze' as const },
        { count: 50, level: 'silver' as const },
        { count: 100, level: 'gold' as const }
      ];
      
      for (const milestone of entryMilestones) {
        if (data.weightEntries.length >= milestone.count) {
          const existingAchievement = data.achievements.find((a: Achievement) => 
            a.title === (language === 'he' 
              ? `${milestone.count} רשומות משקל` 
              : `${milestone.count} Weight Entries`)
          );
          
          if (!existingAchievement) {
            achievementsToAdd.push({
              title: language === 'he' 
                ? `${milestone.count} רשומות משקל` 
                : `${milestone.count} Weight Entries`,
              description: language === 'he'
                ? `הוספת ${milestone.count} רשומות משקל`
                : `You've recorded ${milestone.count} weight entries`,
              icon: 'trophy',
              dateEarned: formattedToday,
              type: 'trophy',
              category: 'milestone',
              level: milestone.level,
              xpReward: milestone.count,
              notificationSent: false
            });
          }
        }
      }
    };
    
    checkStreakAchievements();
    checkMilestoneAchievements();
    
    achievementsToAdd.forEach(achievement => {
      const newAchievement = {
        ...achievement,
        id: `achievement-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };
      
      setData((prev: AppContextType) => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement]
      }));
      
      awardXp(achievement.xpReward);
      
      console.log(`Achievement notification: ${achievement.title}`);
    });
  };

  const updateExerciseEntry = (id: string, updates: Partial<Omit<ExerciseEntry, 'id'>>) => {
    setData((prev: AppContextType) => ({
      ...prev,
      exerciseEntries: prev.exerciseEntries.map((entry) => 
        entry.id === id ? { ...entry, ...updates } : entry
      )
    }));
  };

  const deleteExerciseEntry = (id: string) => {
    setData((prev: AppContextType) => ({
      ...prev,
      exerciseEntries: prev.exerciseEntries.filter((entry) => entry.id !== id)
    }));
  };

  const updateUserXp = (amount: number) => {
    if (!data.userProfile) return;
    
    const currentXp = data.userProfile.xp || {
      level: 1,
      current: 0,
      toNextLevel: 100,
      total: 0
    };
    
    // Calculate the new values
    const newTotal = currentXp.total + amount;
    let newCurrent = currentXp.current + amount;
    let newLevel = currentXp.level;
    let newToNextLevel = currentXp.toNextLevel;
    
    // Check if leveled up
    if (newCurrent >= newToNextLevel) {
      newLevel++;
      newCurrent = newCurrent - newToNextLevel;
      newToNextLevel = Math.floor(100 * Math.pow(1.2, newLevel - 1)); // Exponential XP requirements
      
      // Add level up achievement
      const levelUpAchievement = {
        id: `level-up-${newLevel}`,
        title: language === 'he' ? `עלית לרמה ${newLevel}!` : `Reached Level ${newLevel}!`,
        description: language === 'he' 
          ? `הגעת לרמה ${newLevel} בדרך להיות גרסה טובה יותר של עצמך` 
          : `You've reached level ${newLevel} on your fitness journey`,
        dateEarned: new Date().toISOString(),
        type: 'badge' as const,
        category: 'special' as const,
        xpReward: 0, // No XP reward for level up itself
        level: newLevel >= 10 ? 'gold' as const : newLevel >= 5 ? 'silver' as const : 'bronze' as const
      };
      
      updateAchievement(levelUpAchievement.id, levelUpAchievement);
    }
    
    // Update user profile with new XP values
    const updatedProfile = {
      ...data.userProfile,
      xp: {
        level: newLevel,
        current: newCurrent,
        toNextLevel: newToNextLevel,
        total: newTotal
      }
    };
    
    updateUserProfile(updatedProfile);
    
    // Save to localStorage
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
  };
  
  // Function to check if user leveled up (for UI feedback)
  const checkLevelUp = () => {
    if (!data.userProfile || !data.userProfile.xp) return false;
    
    const prevUserProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    const prevXp = prevUserProfile.xp;
    
    if (!prevXp) return false;
    
    return data.userProfile.xp.level > prevXp.level;
  };

  const value = {
    ...data,
    language,
    t,
    setLanguage,
    updateUserProfile,
    updateTrainingSchedule,
    addWeightEntry,
    updateWeightEntry,
    deleteWeightEntry,
    addMealEntry,
    updateMealEntry,
    deleteMealEntry,
    addExerciseEntry,
    addCycleEntry,
    addEmotionalEntry,
    addGoal,
    updateGoal,
    addAchievement,
    updateAchievement,
    awardXp,
    checkAchievements,
    updateExerciseEntry,
    deleteExerciseEntry,
    updateUserXp,
    checkLevelUp
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};