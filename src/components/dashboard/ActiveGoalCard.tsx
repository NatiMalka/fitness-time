import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext, Goal } from '../../context/AppContext';
import { Target } from 'lucide-react';

interface ActiveGoalCardProps {
  className?: string;
  goals?: Goal[];
}

const ActiveGoalCard: React.FC<ActiveGoalCardProps> = ({ 
  className = '', 
  goals: propGoals
}) => {
  const { goals: contextGoals, language, weightEntries, userProfile } = useAppContext();
  // Use passed goals or get from context
  const goals = propGoals || contextGoals;
  
  const isRtl = language === 'he';
  
  // Find the first active weight goal (usually created during onboarding)
  const weightGoal = goals.find(goal => goal.type === 'weight' && !goal.completed);
  
  // Get latest weight (current progress)
  const currentWeight = weightEntries.length > 0 
    ? weightEntries[0].weight 
    : userProfile?.weight || 0;
  
  // If no weight goal exists, return a simple card
  if (!weightGoal) {
    return (
      <Link to="/goals" className={`card p-5 hover:shadow-md transition-shadow ${className}`}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500">
            {isRtl ? 'יעדים פעילים' : 'Active Goals'}
          </h3>
          <div className="p-2 rounded-full bg-indigo-50">
            <Target className="h-5 w-5 text-amber-600" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-2xl font-semibold text-gray-900">0</p>
          <p className="text-sm text-gray-600">
            {isRtl ? 'אין יעדים פעילים' : 'No active goals'}
          </p>
        </div>
      </Link>
    );
  }
  
  // Calculate progress
  let progress = 0;
  let goalType = '';
  
  if (weightGoal.targetValue > currentWeight) {
    // Goal is to gain weight
    const totalToGain = weightGoal.targetValue - weightGoal.currentValue;
    const gained = currentWeight - weightGoal.currentValue;
    progress = Math.min(100, Math.max(0, (gained / totalToGain) * 100));
    goalType = isRtl ? 'העלאת משקל' : 'Weight Gain';
  } else if (weightGoal.targetValue < currentWeight) {
    // Goal is to lose weight
    const totalToLose = weightGoal.currentValue - weightGoal.targetValue;
    const lost = weightGoal.currentValue - currentWeight;
    progress = Math.min(100, Math.max(0, (lost / totalToLose) * 100));
    goalType = isRtl ? 'הפחתת משקל' : 'Weight Loss';
  } else {
    // Maintain weight
    progress = 100;
    goalType = isRtl ? 'שמירה על משקל' : 'Weight Maintenance';
  }
  
  return (
    <Link to="/goals" className={`card p-5 hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500">
          {isRtl ? 'יעד משקל פעיל' : 'Active Weight Goal'}
        </h3>
        <div className="p-2 rounded-full bg-amber-50">
          <Target className="h-5 w-5 text-amber-600" />
        </div>
      </div>
      
      <div className="mt-3">
        <p className="text-xl font-semibold text-gray-900">{weightGoal.title}</p>
        
        {/* Current and Target Weight Display */}
        <div className="grid grid-cols-2 gap-2 mt-3 mb-2">
          <div className="bg-gray-50 p-2 rounded-lg">
            <p className="text-xs text-gray-500">{isRtl ? 'משקל נוכחי' : 'Current'}</p>
            <p className="text-lg font-bold">{currentWeight} {isRtl ? 'ק"ג' : 'kg'}</p>
          </div>
          <div className="bg-gray-50 p-2 rounded-lg">
            <p className="text-xs text-gray-500">{isRtl ? 'משקל יעד' : 'Target'}</p>
            <p className="text-lg font-bold">{weightGoal.targetValue} {isRtl ? 'ק"ג' : 'kg'}</p>
          </div>
        </div>

        <div className="mt-2">
          <div className="flex justify-between items-center text-xs text-gray-600 mb-1">
            <span>{goalType}</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-amber-500 h-2 rounded-full transition-all duration-500 shadow-sm" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ActiveGoalCard; 