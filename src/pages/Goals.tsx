import React, { useState } from 'react';
import { useAppContext, Goal } from '../context/AppContext';
import { format, parseISO, isPast } from 'date-fns';
import { he } from 'date-fns/locale';
import { Target, Plus, Calendar, Trophy, Check, X, Edit2 } from 'lucide-react';

const goalTypes = [
  { 
    value: 'weight', 
    label: 'Weight Goal',
    heLabel: 'יעד משקל'
  },
  { 
    value: 'exercise', 
    label: 'Exercise Goal',
    heLabel: 'יעד אימון' 
  },
  { 
    value: 'nutrition', 
    label: 'Nutrition Goal',
    heLabel: 'יעד תזונה' 
  },
  { 
    value: 'other', 
    label: 'Other Goal',
    heLabel: 'יעד אחר' 
  },
];

const Goals: React.FC = () => {
  const { goals, addGoal, updateGoal, language } = useAppContext();
  const [title, setTitle] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [currentValue, setCurrentValue] = useState('');
  const [type, setType] = useState<'weight' | 'exercise' | 'nutrition' | 'other'>('weight');
  const [deadline, setDeadline] = useState('');

  // Update goal value state
  const [isUpdating, setIsUpdating] = useState(false);
  const [goalToUpdate, setGoalToUpdate] = useState<string | null>(null);
  const [updateValue, setUpdateValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const targetVal = parseFloat(targetValue);
    const currentVal = parseFloat(currentValue);
    
    if (title.trim() && !isNaN(targetVal) && !isNaN(currentVal)) {
      addGoal({
        title: title.trim(),
        targetValue: targetVal,
        currentValue: currentVal,
        type,
        deadline: deadline || undefined,
        completed: false
      });
      
      setTitle('');
      setTargetValue('');
      setCurrentValue('');
      setDeadline('');
    }
  };

  const startUpdateGoal = (goal: Goal) => {
    setGoalToUpdate(goal.id);
    setUpdateValue(goal.currentValue.toString());
    setIsUpdating(true);
  };

  const cancelUpdateGoal = () => {
    setGoalToUpdate(null);
    setUpdateValue('');
    setIsUpdating(false);
  };

  const submitUpdateGoal = (goalId: string, targetValue: number) => {
    const newValue = parseFloat(updateValue);
    if (!isNaN(newValue)) {
      const completed = newValue >= targetValue;
      updateGoal(goalId, { 
        currentValue: newValue,
        completed
      });
      
      cancelUpdateGoal();
    }
  };

  const markGoalComplete = (goalId: string) => {
    updateGoal(goalId, { completed: true });
  };

  // Sort goals into active and completed
  const activeGoals = goals.filter(g => !g.completed);
  const completedGoals = goals.filter(g => g.completed);

  // Format date according to current language
  const formattedDate = (date: Date) => {
    if (language === 'he') {
      return format(date, 'EEEE, d MMMM yyyy', { locale: he });
    }
    return format(date, 'EEEE, MMMM d, yyyy');
  };

  // Format date string according to current language
  const formatDateString = (dateStr: string) => {
    if (language === 'he') {
      return format(parseISO(dateStr), 'd MMMM yyyy', { locale: he });
    }
    return format(parseISO(dateStr), 'MMMM d, yyyy');
  };

  // Get goal type label based on the current language
  const getGoalTypeLabel = (goalType: string) => {
    const type = goalTypes.find(t => t.value === goalType);
    return language === 'he' ? type?.heLabel : type?.label;
  };

  return (
    <div className="space-y-6 pb-6" dir={language === 'he' ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {language === 'he' ? 'יעדים אישיים' : 'Personal Goals'}
        </h1>
        <div className="text-sm text-gray-500">
          {formattedDate(new Date())}
        </div>
      </div>

      {/* Goal progress overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-4">
          <h3 className="text-sm font-medium text-gray-500">
            {language === 'he' ? 'יעדים פעילים' : 'Active Goals'}
          </h3>
          <p className="text-2xl font-semibold text-gray-900">{activeGoals.length}</p>
          <p className="text-sm text-gray-500 mt-1">
            {language === 'he' ? 'יעדים בתהליך' : 'Goals in progress'}
          </p>
        </div>
        
        <div className="card p-4">
          <h3 className="text-sm font-medium text-gray-500">
            {language === 'he' ? 'יעדים שהושלמו' : 'Completed Goals'}
          </h3>
          <p className="text-2xl font-semibold text-gray-900">{completedGoals.length}</p>
          <p className="text-sm text-gray-500 mt-1">
            {language === 'he' ? 'הישגים נפתחו!' : 'Achievement unlocked!'}
          </p>
        </div>
      </div>

      {/* Add goal form */}
      <div className="card p-4">
        <h2 className="text-lg font-semibold mb-4">
          {language === 'he' ? 'הוסף יעד חדש' : 'Add New Goal'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="goal-title" className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'he' ? 'כותרת היעד' : 'Goal Title'}
            </label>
            <input
              type="text"
              id="goal-title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={language === 'he' 
                ? 'לדוגמה: הגעה למשקל יעד של 60 ק"ג' 
                : 'e.g., Reach target weight of 60kg'}
              required
              className="input"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'he' ? 'סוג יעד' : 'Goal Type'}
              </label>
              <select
                value={type}
                onChange={e => setType(e.target.value as any)}
                className="input"
              >
                {goalTypes.map(option => (
                  <option key={option.value} value={option.value}>
                    {language === 'he' ? option.heLabel : option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="target-value" className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'he' ? 'ערך יעד' : 'Target Value'}
              </label>
              <input
                type="number"
                id="target-value"
                value={targetValue}
                onChange={e => setTargetValue(e.target.value)}
                placeholder={language === 'he' ? 'לדוגמה: 60' : 'e.g., 60'}
                step="any"
                required
                className="input"
              />
            </div>
            <div>
              <label htmlFor="current-value" className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'he' ? 'ערך נוכחי' : 'Current Value'}
              </label>
              <input
                type="number"
                id="current-value"
                value={currentValue}
                onChange={e => setCurrentValue(e.target.value)}
                placeholder={language === 'he' ? 'לדוגמה: 65' : 'e.g., 65'}
                step="any"
                required
                className="input"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'he' ? 'תאריך יעד (אופציונלי)' : 'Target Date (Optional)'}
            </label>
            <input
              type="date"
              id="deadline"
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
              className="input"
            />
          </div>
          
          <div className={`flex ${language === 'he' ? 'justify-start' : 'justify-end'}`}>
            <button type="submit" className="btn-primary">
              <Plus size={20} className={language === 'he' ? 'ml-1' : 'mr-1'} />
              {language === 'he' ? 'הוסף יעד' : 'Add Goal'}
            </button>
          </div>
        </form>
      </div>

      {/* Active goals */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          {language === 'he' ? 'יעדים פעילים' : 'Active Goals'}
        </h2>
        
        {activeGoals.length > 0 ? (
          <div className="space-y-4">
            {activeGoals.map(goal => {
              const progress = Math.min(100, Math.max(0, (goal.currentValue / goal.targetValue) * 100));
              const isOverdue = goal.deadline && isPast(parseISO(goal.deadline));
              const typeInfo = goalTypes.find(t => t.value === goal.type);
              
              return (
                <div 
                  key={goal.id} 
                  className={`card p-4 ${isOverdue ? 'border-amber-300' : ''}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                    <span className="badge-secondary">
                      {language === 'he' ? typeInfo?.heLabel : typeInfo?.label}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500">
                        {language === 'he' 
                          ? `${goal.currentValue} מתוך ${goal.targetValue}`
                          : `${goal.currentValue} of ${goal.targetValue}`}
                      </p>
                      <span className="text-sm font-medium">
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {goal.deadline && (
                    <div className="flex items-center mt-3 text-sm">
                      <Calendar size={16} className={`${language === 'he' ? 'ml-1' : 'mr-1'} ${isOverdue ? 'text-amber-500' : 'text-gray-400'}`} />
                      <span className={isOverdue ? 'text-amber-600' : 'text-gray-500'}>
                        {isOverdue 
                          ? (language === 'he' ? 'פג תוקף: ' : 'Overdue: ')
                          : (language === 'he' ? 'יעד: ' : 'Target: ')}
                        {formatDateString(goal.deadline)}
                      </span>
                    </div>
                  )}
                  
                  <div className="mt-4 flex justify-between items-center">
                    {isUpdating && goalToUpdate === goal.id ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          value={updateValue}
                          onChange={e => setUpdateValue(e.target.value)}
                          className="input w-24"
                          step="any"
                        />
                        <button 
                          onClick={() => submitUpdateGoal(goal.id, goal.targetValue)}
                          className="p-2 text-green-600 hover:text-green-800"
                        >
                          <Check size={18} />
                        </button>
                        <button 
                          onClick={cancelUpdateGoal}
                          className="p-2 text-rose-600 hover:text-rose-800"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => startUpdateGoal(goal)}
                        className="btn-outline px-3 py-1 text-sm"
                      >
                        <Edit2 size={16} className={language === 'he' ? 'ml-1' : 'mr-1'} />
                        {language === 'he' ? 'עדכן התקדמות' : 'Update Progress'}
                      </button>
                    )}
                    
                    <button 
                      onClick={() => markGoalComplete(goal.id)}
                      className="btn-secondary px-3 py-1 text-sm"
                    >
                      <Check size={16} className={language === 'he' ? 'ml-1' : 'mr-1'} />
                      {language === 'he' ? 'סמן כהושלם' : 'Mark Complete'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 card">
            <Target size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              {language === 'he' ? 'אין יעדים פעילים' : 'No active goals'}
            </h3>
            <p className="text-gray-500">
              {language === 'he' 
                ? 'צור את היעד הראשון שלך כדי להתחיל לעקוב אחר ההתקדמות שלך'
                : 'Create your first goal to start tracking your progress'}
            </p>
          </div>
        )}
      </div>

      {/* Completed goals */}
      {completedGoals.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">
            {language === 'he' ? 'יעדים שהושלמו' : 'Completed Goals'}
          </h2>
          <div className="card overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {completedGoals.map(goal => (
                <li key={goal.id} className="p-4 flex items-center">
                  <div className="h-8 w-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">
                    <Trophy size={18} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{goal.title}</p>
                    <p className="text-sm text-gray-500">
                      {goal.targetValue} {goal.type === 'weight' && (language === 'he' ? 'ק"ג' : 'kg')}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;