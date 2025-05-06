import React, { useState, useEffect } from 'react';
import { useAppContext, Achievement } from '../context/AppContext';
import { format, parseISO } from 'date-fns';
import { he } from 'date-fns/locale';
import { 
  Award, 
  Trophy, 
  Medal, 
  BadgeCheck,
  Star,
  Clock,
  Check,
  Utensils,
  Activity,
  Scale,
  Sparkles,
  Zap,
  CheckCircle,
  Target
} from 'lucide-react';

// Achievement types and categories
const achievementTypes = {
  medal: {
    en: 'Medals',
    he: 'מדליות'
  },
  trophy: {
    en: 'Trophies',
    he: 'גביעים'
  },
  badge: {
    en: 'Badges',
    he: 'תגים'
  }
};

const achievementCategories = {
  consistency: {
    en: 'Consistency',
    he: 'עקביות',
    icon: <Clock className="h-5 w-5" />
  },
  milestone: {
    en: 'Milestones',
    he: 'אבני דרך',
    icon: <Check className="h-5 w-5" />
  },
  nutrition: {
    en: 'Nutrition',
    he: 'תזונה',
    icon: <Utensils className="h-5 w-5" />
  },
  exercise: {
    en: 'Exercise',
    he: 'פעילות גופנית',
    icon: <Activity className="h-5 w-5" />
  },
  weight: {
    en: 'Weight Management',
    he: 'ניהול משקל',
    icon: <Scale className="h-5 w-5" />
  },
  special: {
    en: 'Special',
    he: 'מיוחד',
    icon: <Sparkles className="h-5 w-5" />
  }
};

// Achievement levels
const achievementLevels = {
  bronze: {
    en: 'Bronze',
    he: 'ארד',
    color: 'text-amber-500',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200'
  },
  silver: {
    en: 'Silver',
    he: 'כסף',
    color: 'text-slate-400',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200'
  },
  gold: {
    en: 'Gold',
    he: 'זהב',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200'
  }
};

const Achievements: React.FC = () => {
  const { achievements, language, userProfile, t } = useAppContext();

  // Group achievements by type
  const medals = achievements.filter(a => a.type === 'medal');
  const trophies = achievements.filter(a => a.type === 'trophy');
  const badges = achievements.filter(a => a.type === 'badge');

  // Group achievements by category
  const consistencyAchievements = achievements.filter(a => a.category === 'consistency');
  const milestoneAchievements = achievements.filter(a => a.category === 'milestone');
  const nutritionAchievements = achievements.filter(a => a.category === 'nutrition');
  const exerciseAchievements = achievements.filter(a => a.category === 'exercise');
  const weightAchievements = achievements.filter(a => a.category === 'weight');
  const specialAchievements = achievements.filter(a => a.category === 'special');

  // Sort by date earned, most recent first
  const sortByDate = (a: Achievement, b: Achievement) => 
    parseISO(b.dateEarned).getTime() - parseISO(a.dateEarned).getTime();

  // Render achievement icon based on type
  const renderIcon = (type: string, className: string = "h-8 w-8") => {
    switch(type) {
      case 'medal':
        return <Medal className={`${className} text-amber-500`} />;
      case 'trophy':
        return <Trophy className={`${className} text-amber-600`} />;
      case 'badge':
        return <BadgeCheck className={`${className} text-indigo-500`} />;
      default:
        return <Award className={`${className} text-amber-500`} />;
    }
  };

  // Render category icon
  const renderCategoryIcon = (category: string, className: string = "h-5 w-5") => {
    const categoryInfo = achievementCategories[category as keyof typeof achievementCategories];
    if (!categoryInfo) return <Award className={className} />;
    
    // Clone the icon element with the new className
    return React.cloneElement(categoryInfo.icon, { className });
  };

  // Get label for achievement type
  const getTypeLabel = (type: string) => {
    return language === 'he' ? achievementTypes[type as keyof typeof achievementTypes].he : achievementTypes[type as keyof typeof achievementTypes].en;
  };

  // Get label for achievement category
  const getCategoryLabel = (category: string) => {
    return language === 'he' 
      ? achievementCategories[category as keyof typeof achievementCategories]?.he 
      : achievementCategories[category as keyof typeof achievementCategories]?.en;
  };

  // Get level label and colors
  const getLevelInfo = (level: string) => {
    const levelInfo = achievementLevels[level as keyof typeof achievementLevels];
    if (!levelInfo) return achievementLevels.bronze;
    return levelInfo;
  };

  // Format date according to current language
  const formatDate = (date: Date, language: string) => {
    if (language === 'he') {
      return format(date, 'dd/MM/yyyy');
    }
    return format(date, 'MMM d, yyyy');
  };

  // Format date string according to current language
  const formatDateString = (dateStr: string) => {
    if (language === 'he') {
      return format(parseISO(dateStr), 'd MMM, yyyy', { locale: he });
    }
    return format(parseISO(dateStr), 'MMM d, yyyy');
  };

  // Format XP number
  const formatXP = (xp: number) => {
    return language === 'he' ? `${xp} נקודות ניסיון` : `${xp} XP`;
  };

  // Render progress bar for achievements with progress tracking
  const renderProgress = (level: string, currentXp: number, totalRequired: number) => {
    const percent = Math.min(100, Math.round((currentXp / totalRequired) * 100));
    
    return (
      <div className="mt-1">
        <div className="flex justify-between items-center text-xs mb-1">
          <span>{currentXp} XP</span>
          <span>{totalRequired} XP</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-indigo-600 h-2 rounded-full" 
            style={{ width: `${percent}%` }}
          ></div>
        </div>
      </div>
    );
  };

  // Get total XP earned from achievements
  const totalXpEarned = achievements.reduce((total, achievement) => total + (achievement.xpReward || 0), 0);

  // Add a section for recent challenges
  const [completedChallenges, setCompletedChallenges] = useState<any[]>([]);
  
  // Load completed challenges from localStorage on mount
  useEffect(() => {
    const savedChallenges = localStorage.getItem('completedChallenges');
    if (savedChallenges) {
      setCompletedChallenges(JSON.parse(savedChallenges));
    }
  }, []);

  return (
    <div className="space-y-6 pb-6" dir={language === 'he' ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {language === 'he' ? 'הישגים' : 'Achievements'}
        </h1>
        <div className="text-sm text-gray-500">
          {formatDate(new Date(), language)}
        </div>
      </div>

      {/* User Level and XP */}
      {userProfile?.xp && (
        <div className="card p-4 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex items-center">
              <div className="h-14 w-14 rounded-full bg-indigo-100 flex items-center justify-center">
                <Zap className="h-7 w-7 text-indigo-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {language === 'he' ? `רמה ${userProfile.xp.level}` : `Level ${userProfile.xp.level}`}
                </h2>
                <p className="text-sm text-gray-600">
                  {formatXP(userProfile.xp.current)}
                </p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 w-full md:w-2/3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>{Math.min(100, Math.floor((userProfile.xp.current / userProfile.xp.toNextLevel) * 100))}%</span>
                <span>{language === 'he' ? 'הרמה הבאה' : 'Next Level'}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-indigo-600 h-2.5 rounded-full" 
                  style={{ width: `${Math.min(100, Math.floor((userProfile.xp.current / userProfile.xp.toNextLevel) * 100))}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Achievement stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4 flex items-center space-x-3">
          <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
            <Medal className="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">
              {language === 'he' ? 'מדליות שהושגו' : 'Medals Earned'}
            </h3>
            <p className="text-2xl font-semibold text-gray-900">{medals.length}</p>
          </div>
        </div>
        
        <div className="card p-4 flex items-center space-x-3">
          <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
            <Trophy className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">
              {language === 'he' ? 'גביעים שהושגו' : 'Trophies Earned'}
            </h3>
            <p className="text-2xl font-semibold text-gray-900">{trophies.length}</p>
          </div>
        </div>
        
        <div className="card p-4 flex items-center space-x-3">
          <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
            <BadgeCheck className="h-6 w-6 text-indigo-500" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">
              {language === 'he' ? 'תגים שנפתחו' : 'Badges Unlocked'}
            </h3>
            <p className="text-2xl font-semibold text-gray-900">{badges.length}</p>
          </div>
        </div>
        
        <div className="card p-4 flex items-center space-x-3">
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
            <Star className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">
              {language === 'he' ? 'סה"כ XP' : 'Total XP Earned'}
            </h3>
            <p className="text-2xl font-semibold text-gray-900">{totalXpEarned}</p>
          </div>
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-6">
          {language === 'he' ? 'הישגים אחרונים' : 'Recent Achievements'}
        </h2>
        
        {achievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...achievements].sort(sortByDate).slice(0, 6).map(achievement => {
              const levelInfo = getLevelInfo(achievement.level);
              
              return (
                <div 
                  key={achievement.id} 
                  className={`flex flex-col items-center p-4 border ${levelInfo.borderColor} rounded-lg hover:shadow-md transition-shadow`}
                >
                  <div className={`${levelInfo.bgColor} p-3 rounded-full mb-3`}>
                    {renderIcon(achievement.type, "h-10 w-10")}
                  </div>
                  
                  <div className="flex items-center mb-2">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${levelInfo.bgColor} ${levelInfo.color} mr-2`}>
                      {language === 'he' ? levelInfo.he : levelInfo.en}
                    </span>
                    <span className="inline-block px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                      {getCategoryLabel(achievement.category)}
                    </span>
                  </div>
                  
                  <h3 className="font-medium text-center">{achievement.title}</h3>
                  <p className="text-xs text-gray-500 text-center mt-1">{achievement.description}</p>
                  
                  {renderProgress(achievement.level, achievement.xpReward || 0, achievement.maxXp || 0)}
                  
                  <div className="flex items-center justify-between w-full mt-3">
                    <span className="text-xs text-gray-400">
                      {language === 'he' 
                        ? `הושג ב-${formatDateString(achievement.dateEarned)}`
                        : `Earned on ${formatDateString(achievement.dateEarned)}`}
                    </span>
                    <span className="text-xs font-semibold text-indigo-600">
                      +{achievement.xpReward} XP
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10">
            <Award size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              {language === 'he' ? 'אין הישגים עדיין' : 'No achievements yet'}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {language === 'he' 
                ? 'המשך להשתמש באפליקציה ולהשלים את היעדים שלך כדי לזכות במדליות, גביעים ותגים!'
                : 'Keep using Body Balance and completing your goals to earn medals, trophies, and badges!'}
            </p>
          </div>
        )}
      </div>

      {/* Achievement categories */}
      {achievements.length > 0 && (
        <div className="space-y-8">
          {/* Achievement categories */}
          {Object.entries(achievementCategories).map(([category, info]) => {
            const categoryAchievements = achievements.filter(a => a.category === category);
            if (categoryAchievements.length === 0) return null;
            
            return (
              <div key={category}>
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  {React.cloneElement(info.icon, { className: `h-5 w-5 ${language === 'he' ? 'ml-2' : 'mr-2'}` })}
                  {language === 'he' ? info.he : info.en}
                </h2>
                <div className="card overflow-hidden">
                  <ul className="divide-y divide-gray-200">
                    {categoryAchievements.sort(sortByDate).map(achievement => {
                      const levelInfo = getLevelInfo(achievement.level);
                      
                      return (
                        <li key={achievement.id} className="p-4 flex items-start sm:items-center flex-col sm:flex-row">
                          <div className={`h-10 w-10 rounded-full ${levelInfo.bgColor} ${levelInfo.color} flex items-center justify-center ${language === 'he' ? 'ml-3' : 'mr-3'} mb-2 sm:mb-0`}>
                            {renderIcon(achievement.type, "h-5 w-5")}
                          </div>
                          <div className="sm:flex-1">
                            <div className="flex items-center">
                              <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${levelInfo.bgColor} ${levelInfo.color} mr-2`}>
                                {language === 'he' ? levelInfo.he : levelInfo.en}
                              </span>
                              <p className="font-medium text-gray-900">{achievement.title}</p>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{achievement.description}</p>
                            {renderProgress(achievement.level, achievement.xpReward || 0, achievement.maxXp || 0)}
                          </div>
                          <div className="flex flex-col items-end mt-2 sm:mt-0">
                            <div className="text-sm text-gray-400">
                              {formatDateString(achievement.dateEarned)}
                            </div>
                            <div className="text-sm font-semibold text-indigo-600 mt-1">
                              +{achievement.xpReward} XP
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add completed challenges section */}
      {completedChallenges.length > 0 && (
        <div className="card p-5 mb-6">
          <h2 className="text-lg font-semibold mb-4">{t('completedChallenges')}</h2>
          <div className="space-y-3">
            {completedChallenges.slice(0, 5).map((challenge, index) => (
              <div key={index} className="p-4 rounded-lg bg-green-50 border border-green-100">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-green-100">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className={language === 'he' ? 'mr-3' : 'ml-3'}>
                    <p className="font-medium text-green-800">{challenge.title}</p>
                    <p className="text-xs text-green-500">
                      {formatDate(new Date(challenge.completedDate), language)}
                    </p>
                  </div>
                  <div className="flex items-center text-xs font-medium text-indigo-600 ml-auto">
                    <Zap size={12} className={`${language === 'he' ? 'ml-1' : 'mr-1'}`} />
                    +{challenge.xpReward} XP
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Achievements;