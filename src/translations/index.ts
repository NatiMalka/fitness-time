import { Language } from '../context/AppContext';

type TranslationKey = 
  | 'dashboard'
  | 'weight'
  | 'nutrition'
  | 'exercise'
  | 'fertility'
  | 'emotional'
  | 'goals'
  | 'achievements'
  | 'today'
  | 'addEntry'
  | 'save'
  | 'cancel'
  | 'date'
  | 'notes'
  | 'optional'
  | 'noEntries'
  | 'loading'
  | 'error'
  | 'success'
  | 'delete'
  | 'edit'
  | 'update'
  | 'calories'
  | 'duration'
  | 'type'
  | 'name'
  | 'value'
  | 'target'
  | 'current'
  | 'deadline'
  | 'progress'
  | 'completed'
  | 'active'
  | 'total'
  | 'average'
  | 'history'
  | 'noData'
  | 'addNew'
  | 'notifications'
  | 'profile'
  | 'settings'
  | 'logout'
  | 'mealTypes.breakfast'
  | 'mealTypes.lunch'
  | 'mealTypes.dinner'
  | 'mealTypes.snack'
  | 'mood.great'
  | 'mood.good'
  | 'mood.neutral'
  | 'mood.bad'
  | 'mood.awful'
  | 'flow.light'
  | 'flow.medium'
  | 'flow.heavy'
  | 'symptoms'
  | 'customSymptom'
  | 'addSymptom'
  | 'goalTypes.weight'
  | 'goalTypes.exercise'
  | 'goalTypes.nutrition'
  | 'goalTypes.other'
  | 'viewAll'
  | 'recent'
  | 'change'
  | 'basedOn'
  | 'height'
  | 'birthDate'
  | 'age'
  | 'gender'
  | 'gender.male'
  | 'gender.female'
  | 'gender.other'
  | 'activityLevel'
  | 'activityLevel.sedentary'
  | 'activityLevel.light'
  | 'activityLevel.moderate'
  | 'activityLevel.active'
  | 'activityLevel.very_active'
  | 'weightGoal'
  | 'weightGoal.lose'
  | 'weightGoal.maintain'
  | 'weightGoal.gain'
  | 'personalDetails'
  | 'physicalMetrics'
  | 'lifestyle'
  | 'bmi'
  | 'welcome'
  | 'getStarted'
  | 'next'
  | 'back'
  | 'finish'
  | 'completeProfile'
  | 'requiredField'
  | 'min'
  | 'max'
  | 'intensity'
  | 'intensity.low'
  | 'intensity.medium'
  | 'intensity.high'
  | 'currentWeight'
  | 'activeGoals'
  | 'weightHistory'
  | 'emotionalState'
  | 'recentMeals'
  | 'recentExercises'
  | 'noMealsRecorded'
  | 'noExercisesRecorded'
  | 'minutes'
  | 'totalCaloriesToday'
  | 'addMeal'
  | 'addExercise'
  | 'level'
  | 'xp'
  | 'totalXp'
  | 'nextLevel'
  | 'levelUp'
  | 'earnedXp'
  | 'recentAchievements'
  | 'achievementUnlocked'
  | 'achievementCategory.consistency'
  | 'achievementCategory.milestone'
  | 'achievementCategory.nutrition'
  | 'achievementCategory.exercise'
  | 'achievementCategory.weight'
  | 'achievementCategory.special'
  | 'achievementLevel.bronze'
  | 'achievementLevel.silver'
  | 'achievementLevel.gold'
  | 'streak'
  | 'streakDays'
  | 'dailyChallenge'
  | 'completeDailyChallenge'
  | 'challengeCompleted'
  | 'dailyChallenges';

type Translations = {
  [key in TranslationKey]: string;
};

const translations: Record<Language, Translations> = {
  en: {
    dashboard: 'Dashboard',
    weight: 'Weight',
    nutrition: 'Nutrition',
    exercise: 'Exercise',
    fertility: 'Fertility',
    emotional: 'Emotional',
    goals: 'Goals',
    achievements: 'Achievements',
    today: 'Today',
    addEntry: 'Add Entry',
    save: 'Save',
    cancel: 'Cancel',
    date: 'Date',
    notes: 'Notes',
    optional: 'Optional',
    noEntries: 'No entries yet',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    delete: 'Delete',
    edit: 'Edit',
    update: 'Update',
    calories: 'Calories',
    duration: 'Duration',
    type: 'Type',
    name: 'Name',
    value: 'Value',
    target: 'Target',
    current: 'Current',
    deadline: 'Deadline',
    progress: 'Progress',
    completed: 'Completed',
    active: 'Active',
    total: 'Total',
    average: 'Average',
    history: 'History',
    noData: 'No data available',
    addNew: 'Add New',
    notifications: 'Notifications',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Logout',
    'mealTypes.breakfast': 'Breakfast',
    'mealTypes.lunch': 'Lunch',
    'mealTypes.dinner': 'Dinner',
    'mealTypes.snack': 'Snack',
    'mood.great': 'Great',
    'mood.good': 'Good',
    'mood.neutral': 'Neutral',
    'mood.bad': 'Bad',
    'mood.awful': 'Awful',
    'flow.light': 'Light',
    'flow.medium': 'Medium',
    'flow.heavy': 'Heavy',
    symptoms: 'Symptoms',
    customSymptom: 'Custom Symptom',
    addSymptom: 'Add Symptom',
    'goalTypes.weight': 'Weight Goal',
    'goalTypes.exercise': 'Exercise Goal',
    'goalTypes.nutrition': 'Nutrition Goal',
    'goalTypes.other': 'Other Goal',
    viewAll: 'View all',
    recent: 'Recent',
    change: 'Change',
    basedOn: 'Based on',
    height: 'Height',
    birthDate: 'Birth Date',
    age: 'Age',
    gender: 'Gender',
    'gender.male': 'Male',
    'gender.female': 'Female',
    'gender.other': 'Other',
    activityLevel: 'Activity Level',
    'activityLevel.sedentary': 'Sedentary',
    'activityLevel.light': 'Lightly Active',
    'activityLevel.moderate': 'Moderately Active',
    'activityLevel.active': 'Active',
    'activityLevel.very_active': 'Very Active',
    weightGoal: 'Weight Goal',
    'weightGoal.lose': 'Lose Weight',
    'weightGoal.maintain': 'Maintain Weight',
    'weightGoal.gain': 'Gain Weight',
    personalDetails: 'Personal Details',
    physicalMetrics: 'Physical Metrics',
    lifestyle: 'Lifestyle',
    bmi: 'BMI',
    welcome: 'Welcome',
    getStarted: 'Get Started',
    next: 'Next',
    back: 'Back',
    finish: 'Finish',
    completeProfile: 'Complete Profile',
    requiredField: 'This field is required',
    min: 'Min',
    max: 'Max',
    intensity: 'Intensity',
    'intensity.low': 'Low',
    'intensity.medium': 'Medium',
    'intensity.high': 'High',
    currentWeight: 'Current Weight',
    activeGoals: 'Active Goals',
    weightHistory: 'Weight History',
    emotionalState: 'Emotional State',
    recentMeals: 'Recent Meals',
    recentExercises: 'Recent Exercises',
    noMealsRecorded: 'No meals recorded yet. Add your first meal!',
    noExercisesRecorded: 'No exercises recorded yet. Add your first workout!',
    minutes: 'minutes',
    totalCaloriesToday: 'Total calories today:',
    addMeal: 'Add Meal',
    addExercise: 'Add Exercise',
    level: 'Level',
    xp: 'XP',
    totalXp: 'Total XP',
    nextLevel: 'Next Level',
    levelUp: 'Level Up!',
    earnedXp: 'Earned XP',
    recentAchievements: 'Recent Achievements',
    achievementUnlocked: 'Achievement Unlocked!',
    'achievementCategory.consistency': 'Consistency',
    'achievementCategory.milestone': 'Milestones',
    'achievementCategory.nutrition': 'Nutrition',
    'achievementCategory.exercise': 'Exercise',
    'achievementCategory.weight': 'Weight Management',
    'achievementCategory.special': 'Special',
    'achievementLevel.bronze': 'Bronze',
    'achievementLevel.silver': 'Silver',
    'achievementLevel.gold': 'Gold',
    streak: 'Streak',
    streakDays: 'Day Streak',
    dailyChallenge: 'Daily Challenge',
    completeDailyChallenge: 'Complete Daily Challenge',
    challengeCompleted: 'Challenge Completed!',
    dailyChallenges: 'Daily Challenges'
  },
  he: {
    dashboard: 'לוח בקרה',
    weight: 'משקל',
    nutrition: 'תזונה',
    exercise: 'פעילות גופנית',
    fertility: 'פוריות',
    emotional: 'מצב רגשי',
    goals: 'יעדים',
    achievements: 'הישגים',
    today: 'היום',
    addEntry: 'הוסף רשומה',
    save: 'שמור',
    cancel: 'בטל',
    date: 'תאריך',
    notes: 'הערות',
    optional: 'אופציונלי',
    noEntries: 'אין רשומות עדיין',
    loading: 'טוען...',
    error: 'שגיאה',
    success: 'הצלחה',
    delete: 'מחק',
    edit: 'ערוך',
    update: 'עדכן',
    calories: 'קלוריות',
    duration: 'משך זמן',
    type: 'סוג',
    name: 'שם',
    value: 'ערך',
    target: 'יעד',
    current: 'נוכחי',
    deadline: 'תאריך יעד',
    progress: 'התקדמות',
    completed: 'הושלם',
    active: 'פעיל',
    total: 'סה"כ',
    average: 'ממוצע',
    history: 'היסטוריה',
    noData: 'אין נתונים זמינים',
    addNew: 'הוסף חדש',
    notifications: 'התראות',
    profile: 'פרופיל',
    settings: 'הגדרות',
    logout: 'התנתק',
    'mealTypes.breakfast': 'ארוחת בוקר',
    'mealTypes.lunch': 'ארוחת צהריים',
    'mealTypes.dinner': 'ארוחת ערב',
    'mealTypes.snack': 'חטיף',
    'mood.great': 'מצוין',
    'mood.good': 'טוב',
    'mood.neutral': 'ניטרלי',
    'mood.bad': 'רע',
    'mood.awful': 'גרוע',
    'flow.light': 'קל',
    'flow.medium': 'בינוני',
    'flow.heavy': 'כבד',
    symptoms: 'תסמינים',
    customSymptom: 'תסמין מותאם אישית',
    addSymptom: 'הוסף תסמין',
    'goalTypes.weight': 'יעד משקל',
    'goalTypes.exercise': 'יעד אימון',
    'goalTypes.nutrition': 'יעד תזונה',
    'goalTypes.other': 'יעד אחר',
    viewAll: 'צפה בהכל',
    recent: 'אחרונים',
    change: 'שינוי',
    basedOn: 'מבוסס על',
    height: 'גובה',
    birthDate: 'תאריך לידה',
    age: 'גיל',
    gender: 'מגדר',
    'gender.male': 'זכר',
    'gender.female': 'נקבה',
    'gender.other': 'אחר',
    activityLevel: 'רמת פעילות',
    'activityLevel.sedentary': 'יושבני',
    'activityLevel.light': 'פעילות קלה',
    'activityLevel.moderate': 'פעילות בינונית',
    'activityLevel.active': 'פעיל',
    'activityLevel.very_active': 'פעיל מאוד',
    weightGoal: 'יעד משקל',
    'weightGoal.lose': 'הפחתת משקל',
    'weightGoal.maintain': 'שמירה על משקל',
    'weightGoal.gain': 'עלייה במשקל',
    personalDetails: 'פרטים אישיים',
    physicalMetrics: 'מדדים פיזיים',
    lifestyle: 'אורח חיים',
    bmi: 'מדד מסת גוף',
    welcome: 'ברוכים הבאים',
    getStarted: 'התחל עכשיו',
    next: 'הבא',
    back: 'חזור',
    finish: 'סיים',
    completeProfile: 'השלם פרופיל',
    requiredField: 'שדה חובה',
    min: 'מינימום',
    max: 'מקסימום',
    intensity: 'עצימות',
    'intensity.low': 'נמוכה',
    'intensity.medium': 'בינונית',
    'intensity.high': 'גבוהה',
    currentWeight: 'משקל נוכחי',
    activeGoals: 'יעדים פעילים',
    weightHistory: 'היסטוריית משקל',
    emotionalState: 'מצב רגשי',
    recentMeals: 'ארוחות אחרונות',
    recentExercises: 'אימונים אחרונים',
    noMealsRecorded: 'אין ארוחות רשומות עדיין. הוסף את הארוחה הראשונה שלך!',
    noExercisesRecorded: 'אין אימונים רשומים עדיין. הוסף את האימון הראשון שלך!',
    minutes: 'דקות',
    totalCaloriesToday: 'סך קלוריות היום:',
    addMeal: 'הוסף ארוחה',
    addExercise: 'הוסף אימון',
    level: 'רמה',
    xp: 'XP',
    totalXp: 'סה"כ XP',
    nextLevel: 'רמה הבאה',
    levelUp: 'עלית רמה!',
    earnedXp: 'XP שהושג',
    recentAchievements: 'הישגים אחרונים',
    achievementUnlocked: 'הישג נפתח!',
    'achievementCategory.consistency': 'עקביות',
    'achievementCategory.milestone': 'אבני דרך',
    'achievementCategory.nutrition': 'תזונה',
    'achievementCategory.exercise': 'פעילות גופנית',
    'achievementCategory.weight': 'ניהול משקל',
    'achievementCategory.special': 'מיוחד',
    'achievementLevel.bronze': 'ארד',
    'achievementLevel.silver': 'כסף',
    'achievementLevel.gold': 'זהב',
    streak: 'רצף',
    streakDays: 'ימים ברצף',
    dailyChallenge: 'אתגר יומי',
    completeDailyChallenge: 'השלם אתגר יומי',
    challengeCompleted: 'אתגר הושלם!',
    dailyChallenges: 'אתגרים יומיים'
  }
};

export const useTranslation = (language: Language) => {
  const t = (key: TranslationKey): string => {
    if (!translations[language][key]) {
      // Log warning in development only
      if (import.meta.env.DEV) {
        console.warn(`Translation key "${key}" is missing for language "${language}"`);
      }
      // Fall back to English if translation is missing
      return translations['en'][key] || key;
    }
    return translations[language][key];
  };

  return { t };
};