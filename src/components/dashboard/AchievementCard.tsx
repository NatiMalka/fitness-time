import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext, Achievement } from '../../context/AppContext';
import { 
  Trophy, 
  Medal, 
  BadgeCheck,
  Award,
  Star
} from 'lucide-react';

export interface AchievementCardProps {
  achievement: Achievement;
  showProgress?: boolean;
  className?: string;
}

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

const AchievementCard: React.FC<AchievementCardProps> = ({ 
  achievement,
  showProgress = true,
  className = ''
}) => {
  const { language, t } = useAppContext();
  const isRtl = language === 'he';
  
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
  
  // Get level info
  const getLevelInfo = (level: string) => {
    return achievementLevels[level as keyof typeof achievementLevels] || achievementLevels.bronze;
  };
  
  const levelInfo = getLevelInfo(achievement.level);
  
  // Render progress bar for achievements with progress tracking
  const renderProgress = () => {
    if (!showProgress || achievement.progress === undefined) return null;
    
    return (
      <div className="mt-2">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>{achievement.progress}%</span>
          {achievement.currentProgress !== undefined && achievement.maxProgress !== undefined && (
            <span>{achievement.currentProgress} / {achievement.maxProgress}</span>
          )}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-indigo-600 h-2 rounded-full" 
            style={{ width: `${achievement.progress}%` }}
          ></div>
        </div>
      </div>
    );
  };
  
  return (
    <div className={`card p-4 border ${levelInfo.borderColor} ${className}`}>
      <div className="flex items-start space-x-3">
        <div className={`p-2 rounded-full ${levelInfo.bgColor} ${levelInfo.color} flex-shrink-0`}>
          {renderIcon(achievement.type)}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">{achievement.title}</h3>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-indigo-50 text-indigo-600">
              +{achievement.xpReward} XP
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">{achievement.description}</p>
          {renderProgress()}
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-500">
          {isRtl ? levelInfo.he : levelInfo.en}
        </span>
        <Link to="/achievements" className="text-xs text-indigo-600 hover:text-indigo-800">
          {t('viewAll')}
        </Link>
      </div>
    </div>
  );
};

export default AchievementCard; 