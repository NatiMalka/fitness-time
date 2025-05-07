import React, { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { useAppContext } from '../context/AppContext';
import {
  Utensils,
  Activity,
  ArrowRight,
  Heart,
  Target,
  Scale,
  UserCircle,
  Plus,
  Award,
  Zap
} from 'lucide-react';
import DashboardCard from '../components/dashboard/DashboardCard';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import LevelProgressCard from '../components/dashboard/LevelProgressCard';
import DailyChallenge, { Challenge } from '../components/DailyChallenge';
import CompletionConfetti from '../components/CompletionConfetti';
import ActiveGoalCard from '../components/dashboard/ActiveGoalCard';
import WeightStatusCard from '../components/dashboard/WeightStatusCard';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard: React.FC = () => {
  const { 
    weightEntries, 
    mealEntries, 
    exerciseEntries, 
    emotionalEntries, 
    goals,
    achievements,
    language,
    userProfile,
    t,
    addAchievement,
    updateUserXp
  } = useAppContext();
  const navigate = useNavigate();

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    let greeting = '';
    
    if (hour < 12) {
      greeting = language === 'he' ? 'בוקר טוב' : 'Good Morning';
    } else if (hour < 18) {
      greeting = language === 'he' ? 'צהריים טובים' : 'Good Afternoon';
    } else {
      greeting = language === 'he' ? 'ערב טוב' : 'Good Evening';
    }
    
    if (userProfile?.name) {
      greeting += language === 'he' ? `, ${userProfile.name}` : `, ${userProfile.name}`;
    }
    
    return greeting;
  };

  // Get latest weight entry
  const latestWeight = useMemo(() => {
    // Get the latest weight from entries or directly from user profile if no entries
    if (userProfile) {
      return weightEntries.length > 0 ? 
        // Use the most recent weight entry
        weightEntries[0].weight : 
        // Fall back to profile weight if no entries
        userProfile.weight;
    }
    return 0;
  }, [weightEntries, userProfile]);

  // Get latest mood entry
  const latestMood = useMemo(() => {
    return emotionalEntries.length > 0 ? emotionalEntries[0].mood : 'neutral';
  }, [emotionalEntries]);

  // Get chart data for weight history
  const chartData = useMemo(() => {
    // Use the last 7 entries, but display them in chronological order
    const entries = [...weightEntries].slice(0, 7).reverse();
    
    const labels = entries.map(entry => {
      const date = new Date(entry.date);
      if (language === 'he') {
        return format(date, 'd MMM', { locale: he });
      }
      return format(date, 'MMM d');
    });
    
    const data = entries.map(entry => entry.weight);
    
    return {
      labels,
      datasets: [
        {
          label: t('weight'),
          data,
          borderColor: '#6366F1',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          tension: 0.3,
        },
      ],
    };
  }, [weightEntries, language, t]);

  // Format date according to current language
  const formattedDate = (date: string) => {
    const dateObj = new Date(date);
    if (language === 'he') {
      return format(dateObj, 'd MMMM', { locale: he });
    }
    return format(dateObj, 'MMMM d');
  };

  // Sample daily challenges
  const [dailyChallenges, setDailyChallenges] = useState<Challenge[]>([]);

  // Add state for confetti
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiMessage, setConfettiMessage] = useState('');
  const [confettiXp, setConfettiXp] = useState(0);

  // Generate personalized challenges based on user's schedule
  useEffect(() => {
    if (!userProfile) return;

    // Get today's date for challenge generation and tracking
    const today = new Date();
    const todayDateString = today.toISOString().split('T')[0];
    
    // Check if we've already generated challenges for today
    const lastGeneratedDate = localStorage.getItem('lastDailyChallengeDate');
    
    // If challenges were generated today and we have non-empty challenges, don't regenerate
    if (lastGeneratedDate === todayDateString && dailyChallenges.length > 0) {
      return;
    }
    
    // Store today's date as the last generation date
    localStorage.setItem('lastDailyChallengeDate', todayDateString);
    
    // Check if user has completed training schedule setup
    const hasSetupSchedule = userProfile.trainingSchedule?.hasCompletedSetup;

    if (hasSetupSchedule) {
      // Get today's day name (e.g., 'monday', 'tuesday', etc.)
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const todayName = dayNames[today.getDay()];
      
      // Get user's schedule for today
      const todaySchedule = userProfile.trainingSchedule?.schedule.find(day => day.day === todayName);
      
      // Create a new array for challenges
      const newChallenges: Challenge[] = [];
      
      // Add workout challenge if today is a training day
      if (todaySchedule?.isTraining) {
        const workoutType = todaySchedule.trainingType?.[0] || 'general';
        const workoutIntensity = todaySchedule.intensity || 'moderate';
        
        newChallenges.push({
          id: 'daily-workout',
          title: language === 'he' 
            ? `השלם אימון ${
                {general: 'כללי', cardio: 'קרדיו', strength: 'כוח', flexibility: 'גמישות'}[workoutType]
              } ${
                {light: 'קל', moderate: 'בינוני', intense: 'אינטנסיבי'}[workoutIntensity]
              }`
            : `Complete a ${workoutIntensity} ${workoutType} workout`,
          description: language === 'he'
            ? `בצע את האימון המתוכנן שלך להיום ותעד אותו במערכת`
            : `Do your scheduled workout for today and log it in the system`,
          xpReward: workoutIntensity === 'intense' ? 20 : workoutIntensity === 'moderate' ? 15 : 10,
          isCompleted: false,
          category: 'exercise'
        });
      } else {
        // Add rest day challenge
        newChallenges.push({
          id: 'rest-day',
          title: language === 'he' 
            ? 'יום מנוחה - טפל בגופך'
            : 'Rest Day - Take care of your body',
          description: language === 'he'
            ? 'השתמש ביום זה למתיחות, גמישות או מנוחה פעילה'
            : 'Use this day for stretching, flexibility or active recovery',
          xpReward: 5,
          isCompleted: false,
          category: 'exercise'
        });
      }
      
      // Always add a nutrition challenge
      const mealCount = userProfile.trainingSchedule?.nutritionPreferences?.mealCount || 3;
      newChallenges.push({
        id: 'daily-nutrition',
        title: language === 'he' 
          ? `תעד ${mealCount} ארוחות היום` 
          : `Log ${mealCount} meals today`,
        description: language === 'he'
          ? 'עקוב אחר התזונה שלך עם רישום מסודר של הארוחות'
          : 'Track your nutrition with proper meal entries',
        xpReward: 10,
        isCompleted: false,
        category: 'nutrition'
      });
      
      // Add weight tracking if it's the start of the week (Sunday or Monday depending on locale)
      if (todayName === 'sunday' || todayName === 'monday') {
        newChallenges.push({
          id: 'weekly-weight',
          title: language === 'he' 
            ? 'תעד את המשקל השבועי שלך' 
            : 'Log your weekly weight',
          description: language === 'he'
            ? 'עקוב אחר התקדמותך עם מדידת משקל שבועית'
            : 'Track your progress with a weekly weight measurement',
          xpReward: 5,
          isCompleted: false,
          category: 'weight'
        });
      }
      
      // Set the challenges
      setDailyChallenges(newChallenges);
    } else {
      // Default challenges for users who haven't set up their schedule
      // For new users, only show the training schedule setup task
      // This is required before other daily challenges can be generated
      setDailyChallenges([{
        id: 'setup-schedule',
        title: language === 'he' 
          ? 'הגדר את לוח הזמנים שלך' 
          : 'Set up your training schedule',
        description: language === 'he'
          ? 'התאם אישית את האתגרים היומיים שלך על ידי הגדרת לוח זמנים'
          : 'Customize your daily challenges by setting up a schedule',
        xpReward: 25,
        isCompleted: false,
        category: 'tracking'
      }]);
    }
  }, [userProfile, language]);

  // Update handle challenge completion to store to localStorage
  const handleCompleteChallenge = (challengeId: string) => {
    // Find the challenge that was completed
    const challenge = dailyChallenges.find(c => c.id === challengeId);
    if (!challenge || challenge.isCompleted) return;
    
    // Get today's date for recording challenge completion
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Handle schedule setup challenge separately
    if (challengeId === 'setup-schedule') {
      // Mark challenge as completed
      setDailyChallenges(prev => 
        prev.map(c => c.id === challengeId ? { ...c, isCompleted: true } : c)
      );
      
      // Record completion in localStorage
      recordChallengeCompletion(challengeId, today);
      
      // Show message briefly before navigating
      setTimeout(() => navigate('/training-setup'), 1000);
      return;
    }
    
    // For other challenges, update state
    setDailyChallenges(prev => 
      prev.map(c => c.id === challengeId ? { ...c, isCompleted: true } : c)
    );
    
    // Record completion in localStorage
    recordChallengeCompletion(challengeId, today);
    
    // Show completion message and award XP
    setConfettiMessage(
      language === 'he'
        ? `השלמת את האתגר: ${challenge.title}`
        : `Challenge completed: ${challenge.title}`
    );
    setConfettiXp(challenge.xpReward);
    setShowConfetti(true);
    
    // Update user XP
    updateUserXp(challenge.xpReward);
    
    // Record for achievements page
    const completedChallenge = {
      ...challenge,
      // Store challenge data in the user's current language
      title: challenge.title,
      description: challenge.description,
      completedDate: new Date().toISOString()
    };
    
    const savedChallenges = JSON.parse(localStorage.getItem('completedChallenges') || '[]');
    
    // Define an interface for the challenge structure in localStorage
    interface StoredChallenge {
      id: string;
      title: string;
      description: string;
      xpReward: number;
      isCompleted: boolean;
      category: string;
      completedDate: string;
    }
    
    // Check if this challenge already exists in savedChallenges
    const existingChallengeIndex = savedChallenges.findIndex((c: StoredChallenge) => c.id === challenge.id);
    
    if (existingChallengeIndex !== -1) {
      // Update the challenge with the current language but keep the completion date
      savedChallenges[existingChallengeIndex] = {
        ...savedChallenges[existingChallengeIndex],
        title: challenge.title,
        description: challenge.description
      };
    } else {
      // Add new challenge to beginning of array
      savedChallenges.unshift(completedChallenge);
    }
    
    // Keep only last 20 completed challenges
    if (savedChallenges.length > 20) {
      savedChallenges.pop();
    }
    
    localStorage.setItem('completedChallenges', JSON.stringify(savedChallenges));
    
    // First challenge achievement
    if (!dailyChallenges.some(c => c.isCompleted && c.id !== challengeId)) {
      const firstChallengeAchievement = {
        title: language === 'he' ? 'מסע מתחיל בצעד הראשון' : 'A Journey Begins',
        description: language === 'he' ? 'השלמת את האתגר היומי הראשון שלך' : 'Completed your first daily challenge',
        dateEarned: new Date().toISOString(),
        type: 'badge' as const,
        category: 'special' as const,
        xpReward: 25,
        level: 'bronze' as const,
        icon: 'award'
      };
      
      addAchievement(firstChallengeAchievement);
    }
  };
  
  // Helper function to record challenge completion in localStorage
  const recordChallengeCompletion = (challengeId: string, date: string) => {
    const completedChallenges = JSON.parse(localStorage.getItem('dailyChallengesCompleted') || '{}');
    
    // Store completion by date and challenge ID
    completedChallenges[date] = completedChallenges[date] || [];
    if (!completedChallenges[date].includes(challengeId)) {
      completedChallenges[date].push(challengeId);
    }
    
    localStorage.setItem('dailyChallengesCompleted', JSON.stringify(completedChallenges));
  };

  // Add useEffect to check for completed challenges on mount
  // This useEffect runs AFTER challenges are generated
  useEffect(() => {
    if (dailyChallenges.length === 0) return;
    
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    // Get completed challenges from localStorage
    const completedChallengesForToday = JSON.parse(localStorage.getItem('dailyChallengesCompleted') || '{}');
    const todaysCompletedChallenges = completedChallengesForToday[today] || [];
    
    // Mark challenges as completed if they're in the completed list for today
    if (todaysCompletedChallenges.length > 0) {
      setDailyChallenges(prev => 
        prev.map(challenge => 
          todaysCompletedChallenges.includes(challenge.id)
            ? { ...challenge, isCompleted: true }
            : challenge
        )
      );
    }
    
  }, [dailyChallenges.length]);
  
  // Clean up old completed challenges (keep only last 7 days)
  useEffect(() => {
    const completedChallenges = JSON.parse(localStorage.getItem('dailyChallengesCompleted') || '{}');
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    
    // Filter out entries older than 7 days
    const filteredChallenges: Record<string, string[]> = {};
    Object.keys(completedChallenges).forEach(dateStr => {
      const entryDate = new Date(dateStr);
      if (entryDate >= sevenDaysAgo) {
        filteredChallenges[dateStr] = completedChallenges[dateStr];
      }
    });
    
    localStorage.setItem('dailyChallengesCompleted', JSON.stringify(filteredChallenges));
  }, []);

  return (
    <div className="space-y-6" dir={language === 'he' ? 'rtl' : 'ltr'}>
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {getGreeting()}
        </h1>
        <div className="text-sm text-gray-500 mt-1 md:mt-0">
          {language === 'he' 
            ? format(new Date(), 'EEEE, d MMMM yyyy', { locale: he })
            : format(new Date(), 'EEEE, MMMM d, yyyy')}
        </div>
      </div>

      {/* Profile Completion Prompt - Show only if profile is missing */}
      {!userProfile && (
        <div className="card bg-gradient-to-r from-indigo-50 to-blue-50 p-6 flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center mb-4 sm:mb-0">
            <UserCircle size={40} className="text-indigo-500 mr-4" />
            <div>
              <h3 className="font-semibold text-gray-900">
                {language === 'he' ? 'השלם את הפרופיל שלך' : 'Complete Your Profile'}
              </h3>
              <p className="text-sm text-gray-600">
                {language === 'he' 
                  ? 'הוסף את הפרטים האישיים שלך לחוויה מותאמת אישית' 
                  : 'Add your personal details for a better experience'}
              </p>
            </div>
          </div>
          <Link to="/welcome" className="btn-primary">
            {language === 'he' ? 'הגדר פרופיל' : 'Set Up Profile'}
            <ArrowRight size={18} className={language === 'he' ? 'mr-2' : 'ml-2'} />
          </Link>
        </div>
      )}

      {/* Daily Challenges - Moved to the top */}
      <div className="card bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-50 p-6 shadow-lg rounded-xl">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Target className={`h-6 w-6 text-indigo-600 ${language === 'he' ? 'ml-2' : 'mr-2'}`} />
          {t('dailyChallenge')}
        </h2>
        <DailyChallenge 
          challenges={dailyChallenges}
          onComplete={handleCompleteChallenge}
          className="bg-white rounded-lg shadow-sm"
        />
      </div>

      {/* User Level and XP Progress */}
      {userProfile?.xp && (
        <div className="card overflow-hidden shadow-md rounded-xl">
          <LevelProgressCard 
            xp={userProfile.xp}
            className="border-0"
          />
        </div>
      )}

      {/* Weight Status Card - New component showing detailed weight metrics */}
      {userProfile && (
        <WeightStatusCard className="bg-gradient-to-br from-indigo-50 to-purple-50 shadow-md" />
      )}
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Weight Card */}
        <DashboardCard 
          title={t('currentWeight')}
          value={`${latestWeight} ${language === 'he' ? 'ק"ג' : 'kg'}`}
          icon={<Scale className="h-5 w-5 text-blue-600" />}
          linkTo="/weight"
          className="bg-gradient-to-br from-blue-50 to-cyan-50 hover:shadow-md transition-shadow"
        />
        
        {/* Emotional State Card */}
        <DashboardCard 
          title={t('emotionalState')}
          value={t(latestMood)}
          icon={<Heart className="h-5 w-5 text-pink-600" />}
          linkTo="/emotional"
          className="bg-gradient-to-br from-pink-50 to-rose-50 hover:shadow-md transition-shadow"
        />
        
        {/* Active Goals Card - Replaced with ActiveGoalCard */}
        <ActiveGoalCard 
          goals={goals}
          className="bg-gradient-to-br from-amber-50 to-yellow-50"
        />
      </div>

      {/* Weight History Chart */}
      {weightEntries.length > 0 && (
        <div className="card p-6 rounded-xl shadow-md bg-white">
          <h2 className="text-lg font-semibold mb-4">{t('weightHistory')}</h2>
          <div className="h-60">
            <Line 
              data={chartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: false,
                  },
                },
              }} 
            />
          </div>
        </div>
      )}

      {/* Recent Activities Section - Redesigned */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Meals */}
        <div className="card p-6 rounded-xl shadow-md bg-gradient-to-br from-white to-orange-50">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <Utensils className={`h-5 w-5 text-orange-500 ${language === 'he' ? 'ml-2' : 'mr-2'}`} />
              {t('recentMeals')}
            </h2>
            <Link to="/nutrition" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center">
              {t('viewAll')}
              <ArrowRight size={16} className={language === 'he' ? 'mr-1' : 'ml-1'} />
            </Link>
          </div>
          
          {mealEntries.length > 0 && userProfile ? (
            <div className="space-y-4">
              {mealEntries.slice(0, 3).map(meal => (
                <div key={meal.id} className="flex items-center justify-between p-3 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-orange-100">
                      <Utensils className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="ml-4 rtl:mr-4 rtl:ml-0">
                      <p className="font-medium">{meal.name}</p>
                      <p className="text-sm text-gray-500">{formattedDate(meal.date)}</p>
                    </div>
                  </div>
                  <div className="text-right rtl:text-left">
                    <p className="text-sm text-gray-500">{t(`mealTypes.${meal.type}`)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-lg shadow-sm">
              <Utensils className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 mb-4">{t('noMealsRecorded')}</p>
              <Link 
                to="/nutrition" 
                className="btn-primary inline-flex items-center"
              >
                {t('addMeal')}
                <Plus size={16} className={language === 'he' ? 'mr-1' : 'ml-1'} />
              </Link>
            </div>
          )}
        </div>

        {/* Recent Exercises */}
        <div className="card p-6 rounded-xl shadow-md bg-gradient-to-br from-white to-green-50">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <Activity className={`h-5 w-5 text-green-500 ${language === 'he' ? 'ml-2' : 'mr-2'}`} />
              {t('recentExercises')}
            </h2>
            <Link to="/exercise" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center">
              {t('viewAll')}
              <ArrowRight size={16} className={language === 'he' ? 'mr-1' : 'ml-1'} />
            </Link>
          </div>
          
          {exerciseEntries.length > 0 && userProfile ? (
            <div className="space-y-4">
              {exerciseEntries.slice(0, 3).map(exercise => (
                <div key={exercise.id} className="flex items-center justify-between p-3 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-green-100">
                      <Activity className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="ml-4 rtl:mr-4 rtl:ml-0">
                      <p className="font-medium">{exercise.type}</p>
                      <p className="text-sm text-gray-500">{formattedDate(exercise.date)}</p>
                    </div>
                  </div>
                  <div className="text-right rtl:text-left">
                    <p className="font-medium">{exercise.duration} {t('minutes')}</p>
                    {exercise.intensity && (
                      <p className="text-sm text-gray-500">{exercise.intensity}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-lg shadow-sm">
              <Activity className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 mb-4">{t('noExercisesRecorded')}</p>
              <Link 
                to="/exercise" 
                className="btn-primary inline-flex items-center"
              >
                {t('addExercise')}
                <Plus size={16} className={language === 'he' ? 'mr-1' : 'ml-1'} />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Recent Achievements */}
      {achievements && achievements.length > 0 && (
        <div className="card p-6 rounded-xl shadow-md bg-gradient-to-br from-indigo-50 to-purple-50">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <Award className={`h-5 w-5 text-indigo-600 ${language === 'he' ? 'ml-2' : 'mr-2'}`} />
              {t('recentAchievements')}
            </h2>
            <Link to="/achievements" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center">
              {t('viewAll')}
              <ArrowRight size={16} className={language === 'he' ? 'mr-1' : 'ml-1'} />
            </Link>
          </div>
          <div className="space-y-3">
            {achievements.slice(0, 3).map((achievement, index) => (
              <div key={index} className="p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow border-l-4 border-indigo-400">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-indigo-100">
                    <Award className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className={language === 'he' ? 'mr-3' : 'ml-3'}>
                    <p className="font-medium text-gray-900">{achievement.title}</p>
                    <p className="text-xs text-gray-500">{achievement.description}</p>
                  </div>
                  <div className="flex items-center text-xs font-medium text-indigo-600 ml-auto bg-indigo-50 px-2 py-1 rounded-full">
                    <Zap size={12} className={`${language === 'he' ? 'ml-1' : 'mr-1'}`} />
                    +{achievement.xpReward} XP
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add CompletionConfetti component */}
      <CompletionConfetti 
        show={showConfetti}
        message={confettiMessage}
        xpAmount={confettiXp}
        onComplete={() => setShowConfetti(false)}
      />
    </div>
  );
};

export default Dashboard;