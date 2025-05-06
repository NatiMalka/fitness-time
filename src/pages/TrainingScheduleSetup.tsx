import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext, TrainingDay, UserSchedule } from '../context/AppContext';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Award,
  ArrowRight, 
  Dumbbell, 
  Heart, 
  Calendar as CalendarIcon, 
  Utensils, 
  Clock4 
} from 'lucide-react';

// Helper function to get default training days
const getDefaultTrainingDays = (): TrainingDay[] => {
  const days: ('sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday')[] = 
    ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  
  return days.map(day => ({
    day,
    isTraining: ['monday', 'wednesday', 'friday'].includes(day),
    trainingType: ['monday', 'wednesday', 'friday'].includes(day) ? ['general'] : undefined,
    intensity: ['monday', 'wednesday', 'friday'].includes(day) ? 'moderate' : undefined
  }));
};

const TrainingScheduleSetup: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile, updateTrainingSchedule, t, language } = useAppContext();
  const isRtl = language === 'he';
  
  // Step state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  
  // Schedule state
  const [schedule, setSchedule] = useState<TrainingDay[]>(
    userProfile?.trainingSchedule?.schedule || getDefaultTrainingDays()
  );
  
  // Additional preferences
  const [preferredTime, setPreferredTime] = useState<'morning' | 'afternoon' | 'evening'>(
    userProfile?.trainingSchedule?.preferredTrainingTime || 'evening'
  );
  
  const [mealCount, setMealCount] = useState(
    userProfile?.trainingSchedule?.nutritionPreferences?.mealCount || 3
  );
  
  const [dietType, setDietType] = useState<string>(
    userProfile?.trainingSchedule?.nutritionPreferences?.dietType || 'standard'
  );
  
  const [goalWeight, setGoalWeight] = useState<number | undefined>(
    userProfile?.trainingSchedule?.goalWeight || undefined
  );
  
  const [goalDate, setGoalDate] = useState<string | undefined>(
    userProfile?.trainingSchedule?.goalDate || undefined
  );
  
  // Check if user is logged in
  useEffect(() => {
    if (!userProfile) {
      navigate('/welcome');
    }
  }, [userProfile, navigate]);
  
  // Calculate training days count
  const trainingDaysCount = schedule.filter(day => day.isTraining).length;
  
  // Handle day toggle
  const toggleTrainingDay = (dayIndex: number) => {
    const updatedSchedule = [...schedule];
    updatedSchedule[dayIndex].isTraining = !updatedSchedule[dayIndex].isTraining;
    
    // If turning on, set default values
    if (updatedSchedule[dayIndex].isTraining) {
      updatedSchedule[dayIndex].trainingType = ['general'];
      updatedSchedule[dayIndex].intensity = 'moderate';
      updatedSchedule[dayIndex].duration = 45;
    } else {
      // If turning off, clear values
      updatedSchedule[dayIndex].trainingType = undefined;
      updatedSchedule[dayIndex].intensity = undefined;
      updatedSchedule[dayIndex].duration = undefined;
    }
    
    setSchedule(updatedSchedule);
  };
  
  // Handle training type change
  const handleTrainingTypeChange = (dayIndex: number, type: string) => {
    const updatedSchedule = [...schedule];
    const currentTypes = updatedSchedule[dayIndex].trainingType || [];
    
    if (currentTypes.includes(type)) {
      // Remove type if already selected
      updatedSchedule[dayIndex].trainingType = currentTypes.filter(t => t !== type);
    } else {
      // Add type if not selected
      updatedSchedule[dayIndex].trainingType = [...currentTypes, type];
    }
    
    setSchedule(updatedSchedule);
  };
  
  // Handle intensity change
  const handleIntensityChange = (dayIndex: number, intensity: 'light' | 'moderate' | 'intense') => {
    const updatedSchedule = [...schedule];
    updatedSchedule[dayIndex].intensity = intensity;
    setSchedule(updatedSchedule);
  };
  
  // Handle duration change
  const handleDurationChange = (dayIndex: number, duration: number) => {
    const updatedSchedule = [...schedule];
    updatedSchedule[dayIndex].duration = duration;
    setSchedule(updatedSchedule);
  };
  
  // Next step
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleFinish();
    }
  };
  
  // Back step
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  // Finish setup
  const handleFinish = () => {
    const userSchedule: UserSchedule = {
      schedule,
      preferredTrainingTime: preferredTime,
      nutritionPreferences: {
        mealCount,
        dietType: dietType as any,
      },
      hasCompletedSetup: true,
      goalWeight,
      goalDate
    };
    
    updateTrainingSchedule(userSchedule);
    navigate('/dashboard');
  };
  
  const renderDaySelector = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-center mb-6">
          {isRtl ? 'בחר את ימי האימון שלך' : 'Select Your Training Days'}
        </h2>
        
        <div className="grid grid-cols-7 gap-2 mb-6">
          {schedule.map((day, index) => (
            <div 
              key={day.day} 
              className={`
                flex flex-col items-center justify-center p-3 rounded-lg cursor-pointer transition-all
                ${day.isTraining 
                  ? 'bg-indigo-600 text-white shadow-lg scale-105' 
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}
              `}
              onClick={() => toggleTrainingDay(index)}
            >
              <span className="text-xs uppercase">
                {isRtl 
                  ? ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'][index] 
                  : day.day.substring(0, 1).toUpperCase()}
              </span>
              <span className="mt-1 text-sm">
                {!isRtl ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index] : ''}
              </span>
              {day.isTraining && (
                <CheckCircle2 className="h-4 w-4 mt-1" />
              )}
            </div>
          ))}
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-center text-blue-800">
            {isRtl 
              ? `בחרת ${trainingDaysCount} ימי אימון ו-${7 - trainingDaysCount} ימי מנוחה בשבוע` 
              : `You've selected ${trainingDaysCount} training days and ${7 - trainingDaysCount} rest days per week`}
          </p>
        </div>
      </div>
    );
  };
  
  const renderTrainingDetails = () => {
    const trainingTypes = [
      { id: 'general', label: isRtl ? 'אימון כללי' : 'General Workout', icon: <Dumbbell size={16} /> },
      { id: 'cardio', label: isRtl ? 'קרדיו' : 'Cardio', icon: <Heart size={16} /> },
      { id: 'strength', label: isRtl ? 'כוח' : 'Strength', icon: <Dumbbell size={16} /> },
      { id: 'flexibility', label: isRtl ? 'גמישות' : 'Flexibility', icon: <Dumbbell size={16} /> }
    ];
    
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-center mb-6">
          {isRtl ? 'פרטי האימונים שלך' : 'Your Training Details'}
        </h2>
        
        <div className="space-y-6">
          {schedule.filter(day => day.isTraining).map((day, index) => (
            <div key={day.day} className="card p-4 bg-white shadow-sm">
              <h3 className="font-semibold text-lg capitalize mb-3">
                {isRtl 
                  ? ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'][
                      ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].indexOf(day.day)
                    ]
                  : day.day}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    {isRtl ? 'סוג אימון' : 'Training Type'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {trainingTypes.map(type => (
                      <button
                        key={type.id}
                        className={`
                          flex items-center px-3 py-1.5 rounded-full text-sm
                          ${day.trainingType?.includes(type.id)
                            ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                            : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'}
                        `}
                        onClick={() => handleTrainingTypeChange(
                          schedule.findIndex(d => d.day === day.day),
                          type.id
                        )}
                      >
                        {type.icon}
                        <span className={isRtl ? 'mr-1' : 'ml-1'}>{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    {isRtl ? 'עצימות' : 'Intensity'}
                  </p>
                  <div className="flex gap-2">
                    {['light', 'moderate', 'intense'].map(intensity => (
                      <button
                        key={intensity}
                        className={`
                          px-3 py-1.5 rounded-full text-sm flex-1
                          ${day.intensity === intensity
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                        `}
                        onClick={() => handleIntensityChange(
                          schedule.findIndex(d => d.day === day.day),
                          intensity as any
                        )}
                      >
                        {isRtl 
                          ? {light: 'קלה', moderate: 'בינונית', intense: 'גבוהה'}[intensity]
                          : {light: 'Light', moderate: 'Moderate', intense: 'Intense'}[intensity]}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    {isRtl ? 'משך (דקות)' : 'Duration (minutes)'}
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="15"
                      max="120"
                      step="5"
                      value={day.duration || 45}
                      onChange={(e) => handleDurationChange(
                        schedule.findIndex(d => d.day === day.day),
                        parseInt(e.target.value)
                      )}
                      className="flex-1"
                    />
                    <span className="text-sm font-medium w-10 text-center">
                      {day.duration || 45}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  const renderPreferences = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-center mb-6">
          {isRtl ? 'העדפות אימון ותזונה' : 'Training & Nutrition Preferences'}
        </h2>
        
        <div className="card p-5 bg-white shadow-sm">
          <h3 className="font-medium mb-3 flex items-center">
            <Clock4 className={`h-5 w-5 text-indigo-600 ${isRtl ? 'ml-2' : 'mr-2'}`} />
            {isRtl ? 'זמן אימון מועדף' : 'Preferred Training Time'}
          </h3>
          
          <div className="flex gap-2">
            {[
              { id: 'morning', label: isRtl ? 'בוקר' : 'Morning' },
              { id: 'afternoon', label: isRtl ? 'צהריים' : 'Afternoon' },
              { id: 'evening', label: isRtl ? 'ערב' : 'Evening' }
            ].map(time => (
              <button
                key={time.id}
                className={`
                  flex-1 py-2 px-3 rounded-lg text-sm font-medium
                  ${preferredTime === time.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                `}
                onClick={() => setPreferredTime(time.id as any)}
              >
                {time.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="card p-5 bg-white shadow-sm">
          <h3 className="font-medium mb-3 flex items-center">
            <Utensils className={`h-5 w-5 text-indigo-600 ${isRtl ? 'ml-2' : 'mr-2'}`} />
            {isRtl ? 'העדפות תזונה' : 'Nutrition Preferences'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">
                {isRtl ? 'מספר ארוחות ביום' : 'Meals per day'}
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="2"
                  max="6"
                  value={mealCount}
                  onChange={(e) => setMealCount(parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm font-medium w-6 text-center">
                  {mealCount}
                </span>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-2">
                {isRtl ? 'סוג תזונה' : 'Diet type'}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'standard', label: isRtl ? 'רגיל' : 'Standard' },
                  { id: 'vegetarian', label: isRtl ? 'צמחוני' : 'Vegetarian' },
                  { id: 'vegan', label: isRtl ? 'טבעוני' : 'Vegan' },
                  { id: 'keto', label: isRtl ? 'קטו' : 'Keto' }
                ].map(diet => (
                  <button
                    key={diet.id}
                    className={`
                      py-2 px-3 rounded-lg text-sm
                      ${dietType === diet.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                    `}
                    onClick={() => setDietType(diet.id)}
                  >
                    {diet.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const renderGoals = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-center mb-6">
          {isRtl ? 'הגדר את היעדים שלך' : 'Set Your Goals'}
        </h2>
        
        <div className="card p-5 bg-white shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isRtl ? 'משקל יעד (ק"ג)' : 'Goal Weight (kg)'}
              </label>
              <input
                type="number"
                value={goalWeight || ''}
                onChange={(e) => setGoalWeight(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder={isRtl ? 'הזן משקל יעד' : 'Enter target weight'}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isRtl ? 'תאריך יעד' : 'Target Date'}
              </label>
              <input
                type="date"
                value={goalDate || ''}
                onChange={(e) => setGoalDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg mt-6">
              <p className="text-green-800 text-sm">
                {isRtl 
                  ? 'לאחר השלמת הגדרת יעדים, המערכת תיצור אתגרים יומיים מותאמים אישית עבורך!'
                  : 'After completing goal setup, the system will create personalized daily challenges for you!'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="max-w-xl mx-auto" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="text-center my-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {isRtl ? 'הגדרת לוח זמנים לאימונים' : 'Training Schedule Setup'}
        </h1>
        <p className="text-gray-600">
          {isRtl 
            ? 'התאם אישית את לוח האימונים שלך כדי לקבל אתגרים יומיים מותאמים אישית'
            : 'Customize your training schedule to get personalized daily challenges'}
        </p>
      </div>
      
      {/* Progress steps */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <React.Fragment key={index}>
              <div 
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  index + 1 <= currentStep 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                } text-sm font-medium`}
              >
                {index + 1}
              </div>
              {index < totalSteps - 1 && (
                <div 
                  className={`flex-1 h-1 mx-2 ${
                    index + 1 < currentStep ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <div>{isRtl ? 'ימי אימון' : 'Training Days'}</div>
          <div>{isRtl ? 'פרטי אימון' : 'Training Details'}</div>
          <div>{isRtl ? 'העדפות' : 'Preferences'}</div>
          <div>{isRtl ? 'יעדים' : 'Goals'}</div>
        </div>
      </div>
      
      {/* Step content */}
      <div className="bg-gray-50 p-6 rounded-xl shadow-sm mb-6">
        {currentStep === 1 && renderDaySelector()}
        {currentStep === 2 && renderTrainingDetails()}
        {currentStep === 3 && renderPreferences()}
        {currentStep === 4 && renderGoals()}
      </div>
      
      {/* Navigation buttons */}
      <div className="flex justify-between mb-8">
        <button
          onClick={handleBack}
          disabled={currentStep === 1}
          className={`px-6 py-2 rounded-lg ${
            currentStep === 1
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          {isRtl ? 'הקודם' : 'Back'}
        </button>
        
        <button
          onClick={handleNext}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
        >
          {currentStep === totalSteps 
            ? (isRtl ? 'סיים והתחל' : 'Finish & Start') 
            : (isRtl ? 'הבא' : 'Next')}
          <ArrowRight size={16} className={isRtl ? 'mr-2 rotate-180' : 'ml-2'} />
        </button>
      </div>
    </div>
  );
};

export default TrainingScheduleSetup; 