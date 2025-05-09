import React from 'react';
import { useAppContext } from '../context/AppContext';
import { CheckCircle, Clock, Zap, Target, Star, TrendingUp } from 'lucide-react';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  isCompleted: boolean;
  category: 'nutrition' | 'exercise' | 'weight' | 'tracking';
  icon?: React.ReactNode; // Optional custom icon
  deadline?: string; // Optional deadline
}

export interface DailyChallengeProps {
  challenges: Challenge[];
  onComplete?: (challengeId: string) => void;
  className?: string;
}

const DailyChallenge: React.FC<DailyChallengeProps> = ({ 
  challenges,
  onComplete,
  className = ''
}) => {
  const { language, t } = useAppContext();
  const isRtl = language === 'he';
  
  // Get category icon
  const getCategoryIcon = (category: string, size = 16) => {
    switch(category) {
      case 'nutrition':
        return <Star size={size} className="text-amber-500" />;
      case 'exercise':
        return <TrendingUp size={size} className="text-green-500" />;
      case 'weight':
        return <Target size={size} className="text-blue-500" />;
      case 'tracking':
        return <Clock size={size} className="text-purple-500" />;
      default:
        return <Target size={size} className="text-indigo-500" />;
    }
  };
  
  // Format remaining time
  const getTimeRemaining = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffMs = deadlineDate.getTime() - now.getTime();
    
    if (diffMs <= 0) return language === 'he' ? 'פג תוקף' : 'Expired';
    
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHrs < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return language === 'he' 
        ? `${diffMins} דקות נותרו` 
        : `${diffMins} mins left`;
    }
    
    return language === 'he' 
      ? `${diffHrs} שעות נותרו` 
      : `${diffHrs} hrs left`;
  };
  
  // Handle challenge completion
  const handleCompleteChallenge = (challenge: Challenge) => {
    // If the challenge is already completed or no completion handler is provided, do nothing
    if (challenge.isCompleted || !onComplete) return;
    
    onComplete(challenge.id);
  };
  
  if (challenges.length === 0) {
    return (
      <div className={`card p-5 ${className}`}>
        <div className="text-center py-4">
          <Target size={40} className="mx-auto mb-3 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-700">
            {language === 'he' ? 'אין אתגרים יומיים כרגע' : 'No Daily Challenges Right Now'}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {language === 'he' 
              ? 'חזור מאוחר יותר לאתגרים חדשים' 
              : 'Check back later for new challenges'}
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`card p-5 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">
          {t('dailyChallenges')}
        </h3>
        <div className="text-xs text-gray-500">
          {challenges.filter(c => c.isCompleted).length}/{challenges.length} {t('completed')}
        </div>
      </div>
      
      <div className="space-y-3">
        {/* Special emphasis if the only challenge is to set up the schedule */}
        {challenges.length === 1 && challenges[0].id === 'setup-schedule' && !challenges[0].isCompleted && (
          <div className="bg-indigo-50 p-3 rounded-lg mb-4 text-sm text-indigo-700">
            {language === 'he' 
              ? 'יש להגדיר את לוח הזמנים שלך כדי לקבל אתגרים יומיים מותאמים אישית'
              : 'Set up your schedule to receive personalized daily challenges'}
          </div>
        )}
        
        {/* Show message when all challenges are completed for today */}
        {challenges.length > 0 && challenges.every(c => c.isCompleted) && (
          <div className="bg-green-50 p-4 rounded-lg mb-4 text-center">
            <CheckCircle size={32} className="mx-auto mb-2 text-green-500" />
            <p className="font-medium text-green-700">
              {language === 'he' 
                ? 'כל האתגרים היומיים הושלמו'
                : 'All daily challenges completed'}
            </p>
            <p className="text-sm text-green-600 mt-1">
              {language === 'he' 
                ? 'בדוק מחר לאתגרים חדשים'
                : 'Check back tomorrow for new challenges'}
            </p>
            <div className="flex items-center justify-center text-xs font-medium text-indigo-600 mt-2 bg-indigo-50 py-1 px-3 rounded-full max-w-fit mx-auto">
              <Zap size={12} className={`${isRtl ? 'ml-1' : 'mr-1'}`} />
              {language === 'he' 
                ? 'השגת XP היום' 
                : 'XP earned today'}: {challenges.reduce((total, c) => total + c.xpReward, 0)}
            </div>
          </div>
        )}
        
        {challenges.map((challenge) => (
          <div 
            key={challenge.id}
            className={`p-3 rounded-lg border ${
              challenge.isCompleted 
                ? 'bg-green-50 border-green-200 cursor-default' 
                : challenge.id === 'setup-schedule' 
                  ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 hover:shadow-md cursor-pointer' 
                  : 'hover:bg-gray-50 border-gray-200 cursor-pointer'
            } transition-all`}
            onClick={() => !challenge.isCompleted && handleCompleteChallenge(challenge)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${challenge.isCompleted ? 'bg-green-100' : 'bg-gray-100'}`}>
                  {challenge.isCompleted 
                    ? <CheckCircle size={18} className="text-green-600" />
                    : challenge.icon || getCategoryIcon(challenge.category, 18)
                  }
                </div>
                <div className={`${isRtl ? 'mr-3' : 'ml-3'}`}>
                  <p className={`font-medium ${challenge.isCompleted ? 'text-green-800' : 'text-gray-900'}`}>
                    {challenge.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{challenge.description}</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center text-xs font-medium text-indigo-600">
                  <Zap size={12} className={`${isRtl ? 'ml-1' : 'mr-1'}`} />
                  +{challenge.xpReward} XP
                </div>
                
                {challenge.deadline && !challenge.isCompleted && (
                  <div className="text-xs text-gray-500 mt-1 flex items-center">
                    <Clock size={10} className={`${isRtl ? 'ml-1' : 'mr-1'}`} />
                    {getTimeRemaining(challenge.deadline)}
                  </div>
                )}
              </div>
            </div>
            
            {!challenge.isCompleted && onComplete && (
              <button 
                className={`w-full mt-2 py-1 text-xs font-medium text-center rounded ${
                  challenge.id === 'setup-schedule' 
                    ? 'text-white bg-indigo-600 hover:bg-indigo-700' 
                    : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCompleteChallenge(challenge);
                }}
              >
                {t('completeDailyChallenge')}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyChallenge; 