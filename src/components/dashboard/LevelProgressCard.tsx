import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext, UserXp } from '../../context/AppContext';
import { Zap, Award, ChevronRight } from 'lucide-react';

export interface LevelProgressCardProps {
  xp: UserXp;
  className?: string;
  compact?: boolean;
}

const LevelProgressCard: React.FC<LevelProgressCardProps> = ({ 
  xp,
  className = '',
  compact = false
}) => {
  const { language, t } = useAppContext();
  const isRtl = language === 'he';
  
  // Get level title based on level
  const getLevelTitle = (level: number): string => {
    const titles: Record<number, { en: string, he: string }> = {
      1: { en: 'Beginner', he: 'מתחיל' },
      2: { en: 'Novice', he: 'מתקדם' },
      3: { en: 'Apprentice', he: 'שוליה' },
      4: { en: 'Adept', he: 'מומחה מתחיל' },
      5: { en: 'Expert', he: 'מומחה' },
      6: { en: 'Master', he: 'אומן' },
      7: { en: 'Advanced Master', he: 'אומן מתקדם' },
      8: { en: 'Champion', he: 'גיבור' },
      9: { en: 'Legend', he: 'אגדה' },
      10: { en: 'Undefeated', he: 'בלתי מנוצח' }
    };
    
    return isRtl ? titles[level]?.he || '' : titles[level]?.en || '';
  };
  
  if (compact) {
    return (
      <div className={`card p-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <Zap className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="ml-3">
              <div className="flex items-center">
                <span className="font-medium text-gray-900">{t('level')} {xp.level}</span>
                <span className="ml-2 text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">
                  {xp.current} XP
                </span>
              </div>
              <div className="mt-1 w-32 bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-indigo-600 h-1.5 rounded-full" 
                  style={{ width: `${Math.min(100, Math.floor((xp.current / xp.toNextLevel) * 100))}%` }}
                ></div>
              </div>
            </div>
          </div>
          <Link to="/achievements" className="p-1 rounded-full bg-gray-100 hover:bg-gray-200">
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`card p-5 bg-gradient-to-r from-indigo-50 to-purple-50 ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div className="flex items-center">
          <div className="h-14 w-14 rounded-full bg-indigo-100 flex items-center justify-center">
            <Zap className="h-7 w-7 text-indigo-600" />
          </div>
          <div className={`${isRtl ? 'mr-4' : 'ml-4'}`}>
            <h2 className="text-xl font-bold text-gray-900">
              {t('level')} {xp.level} - {getLevelTitle(xp.level)}
            </h2>
            <p className="text-sm text-gray-600">
              {xp.current} XP
            </p>
          </div>
        </div>
        <div className="mt-4 md:mt-0 w-full md:w-2/5">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>{Math.min(100, Math.floor((xp.current / xp.toNextLevel) * 100))}%</span>
            <span>{t('nextLevel')}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-indigo-600 h-2.5 rounded-full" 
              style={{ width: `${Math.min(100, Math.floor((xp.current / xp.toNextLevel) * 100))}%` }}
            ></div>
          </div>
          <div className="mt-2 text-right">
            <Link to="/achievements" className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center justify-end">
              {t('viewAll')} <Award size={12} className={`${isRtl ? 'mr-1' : 'ml-1'}`} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelProgressCard; 