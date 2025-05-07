import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext, UserProfile } from '../context/AppContext';
import { Check, ChevronRight, ArrowRight } from 'lucide-react';

const Welcome: React.FC = () => {
  const { updateUserProfile, language, userProfile } = useAppContext();
  const navigate = useNavigate();
  
  // Redirect if user profile already exists
  useEffect(() => {
    if (userProfile) {
      navigate('/dashboard');
    }
  }, [userProfile, navigate]);
  
  // Step tracking
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  
  // Form state
  const [name, setName] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [gender, setGender] = useState<"male" | "female" | "other" | undefined>(undefined);
  const [weightGoal, setWeightGoal] = useState<"lose" | "maintain" | "gain" | undefined>(undefined);
  const [targetWeight, setTargetWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState<'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive'>('sedentary');
  
  // Go to next step
  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };
  
  // Go to previous step
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  // Handle final submission
  const handleFinish = () => {
    const weightValue = parseFloat(weight);
    const heightValue = parseFloat(height);
    const targetWeightValue = parseFloat(targetWeight);
    
    if (name.trim() && !isNaN(weightValue) && !isNaN(heightValue) && 
        (weightGoal === 'maintain' || !isNaN(targetWeightValue))) {
      const profile: UserProfile = {
        name: name.trim(),
        weight: weightValue,
        height: heightValue,
        birthDate: '',
        activityLevel,
        gender,
        weightGoal,
        targetWeight: targetWeightValue || weightValue // Use current weight for maintain goal
      };
      
      updateUserProfile(profile);
      navigate('/dashboard');
    }
  };
  
  // Translation helpers
  const genderOptions = [
    { value: 'male', labelEn: 'Male', labelHe: 'זכר' },
    { value: 'female', labelEn: 'Female', labelHe: 'נקבה' },
    { value: 'other', labelEn: 'Other', labelHe: 'אחר' }
  ];
  
  const weightGoalOptions = [
    { value: 'lose', labelEn: 'Lose Weight', labelHe: 'הפחתת משקל', icon: '↓' },
    { value: 'maintain', labelEn: 'Maintain Weight', labelHe: 'שמירה על משקל', icon: '→' },
    { value: 'gain', labelEn: 'Gain Weight', labelHe: 'העלאת משקל', icon: '↑' }
  ];

  return (
    <div className="h-screen w-full bg-gradient-to-br from-violet-600 via-indigo-600 to-sky-500 animate-gradient-x bg-size-200 overflow-hidden flex items-center justify-center px-4 sm:px-6" dir={language === 'he' ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-lg bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-500 animate-float">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-8 text-white">
          <h1 className="text-2xl font-bold">
            {language === 'he' ? 'ברוכים הבאים לבריאות מאוזנת' : 'Welcome to Body Balance'}
          </h1>
          <p className="mt-2 text-indigo-100">
            {language === 'he' 
              ? 'בואו נגדיר כמה פרטים בסיסיים כדי להתאים אישית את החוויה שלך'
              : "Let's set up a few basic details to personalize your experience"}
          </p>
          
          {/* Progress Bar */}
          <div className="mt-6 flex items-center">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <React.Fragment key={i}>
                <div 
                  className={`rounded-full h-8 w-8 flex items-center justify-center font-medium ${
                    i + 1 === step ? 'bg-white text-indigo-600' : 
                    i + 1 < step ? 'bg-indigo-400 text-white' : 'bg-indigo-800 text-white'
                  }`}
                >
                  {i + 1 < step ? <Check size={16} /> : i + 1}
                </div>
                {i < totalSteps - 1 && (
                  <div 
                    className={`h-1 flex-1 ${
                      i + 1 < step ? 'bg-indigo-400' : 'bg-indigo-800'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        
        {/* Content */}
        <div className="p-8">
          {/* Step 1: Name */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {language === 'he' ? 'איך נוכל לקרוא לך?' : 'What should we call you?'}
              </h2>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'he' ? 'השם שלך' : 'Your Name'}
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={language === 'he' ? 'הכנס את שמך' : 'Enter your name'}
                  className="input w-full"
                  required
                />
              </div>
            </div>
          )}
          
          {/* Step 2: Physical Metrics */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {language === 'he' ? 'המדדים הפיזיים שלך' : 'Your Physical Metrics'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'he' ? 'משקל (ק"ג)' : 'Weight (kg)'}
                  </label>
                  <input
                    type="number"
                    id="weight"
                    value={weight}
                    onChange={e => setWeight(e.target.value)}
                    placeholder={language === 'he' ? 'הכנס משקל' : 'Enter weight'}
                    className="input w-full"
                    min="1"
                    step="0.1"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'he' ? 'גובה (ס"מ)' : 'Height (cm)'}
                  </label>
                  <input
                    type="number"
                    id="height"
                    value={height}
                    onChange={e => setHeight(e.target.value)}
                    placeholder={language === 'he' ? 'הכנס גובה' : 'Enter height'}
                    className="input w-full"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'he' ? 'מגדר (אופציונלי)' : 'Gender (Optional)'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {genderOptions.map(option => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setGender(option.value as 'male' | 'female' | 'other' | undefined)}
                        className={`p-2 rounded-lg border ${
                          gender === option.value
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {language === 'he' ? option.labelHe : option.labelEn}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label htmlFor="activity-level" className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'he' ? 'רמת פעילות' : 'Activity Level'}
                  </label>
                  <select
                    id="activity-level"
                    value={activityLevel}
                    onChange={e => setActivityLevel(e.target.value as 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive')}
                    className="input"
                  >
                    <option value="sedentary">{language === 'he' ? 'יושבני' : 'Sedentary'}</option>
                    <option value="light">{language === 'he' ? 'פעילות קלה' : 'Lightly Active'}</option>
                    <option value="moderate">{language === 'he' ? 'פעילות בינונית' : 'Moderately Active'}</option>
                    <option value="active">{language === 'he' ? 'פעיל' : 'Active'}</option>
                    <option value="veryActive">{language === 'he' ? 'פעיל מאוד' : 'Very Active'}</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          
          {/* Step 3: Goals */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {language === 'he' ? 'מהן המטרות שלך?' : 'What are your goals?'}
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'he' ? 'יעד משקל' : 'Weight Goal'}
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {weightGoalOptions.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setWeightGoal(option.value as 'lose' | 'maintain' | 'gain' | undefined)}
                      className={`p-3 rounded-lg border flex items-center ${
                        weightGoal === option.value
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-xl mr-3">{option.icon}</span>
                      <span>{language === 'he' ? option.labelHe : option.labelEn}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Weight Field - Show only if lose or gain weight is selected */}
              {(weightGoal === 'lose' || weightGoal === 'gain') && (
                <div className="mt-4">
                  <label htmlFor="target-weight" className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'he' 
                      ? `משקל יעד (ק"ג) - ${weightGoal === 'lose' ? 'להפחתה' : 'לעלייה'}`
                      : `Target Weight (kg) - ${weightGoal === 'lose' ? 'to lose' : 'to gain'}`}
                  </label>
                  <input
                    type="number"
                    id="target-weight"
                    value={targetWeight}
                    onChange={e => setTargetWeight(e.target.value)}
                    placeholder={language === 'he' ? 'הכנס משקל יעד' : 'Enter target weight'}
                    className="input w-full"
                    min="1"
                    step="0.1"
                    required
                  />
                  {weight && targetWeight && (
                    <p className="mt-2 text-sm">
                      {language === 'he'
                        ? `${weightGoal === 'lose' 
                            ? `יעד: להפחית ${(parseFloat(weight) - parseFloat(targetWeight)).toFixed(1)} ק"ג` 
                            : `יעד: לעלות ${(parseFloat(targetWeight) - parseFloat(weight)).toFixed(1)} ק"ג`}`
                        : `${weightGoal === 'lose' 
                            ? `Goal: Lose ${(parseFloat(weight) - parseFloat(targetWeight)).toFixed(1)} kg` 
                            : `Goal: Gain ${(parseFloat(targetWeight) - parseFloat(weight)).toFixed(1)} kg`}`}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* Navigation Buttons */}
          <div className={`mt-10 flex justify-between items-center ${language === 'he' ? 'flex-row-reverse' : ''}`}>
            {/* For Hebrew, show Next/Finish button first (left), then Back (right) */}
            {language === 'he' ? (
              <>
                {step < totalSteps ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="btn-primary shadow-lg rounded-full px-10 py-3 text-lg font-bold transition-transform transform hover:scale-105 hover:shadow-xl focus:ring-4 focus:ring-indigo-300"
                    disabled={
                      (step === 1 && !name.trim()) || 
                      (step === 2 && (!weight || !height))
                    }
                    style={{ minWidth: '120px' }}
                  >
                    {'הבא'}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleFinish}
                    className="btn-primary shadow-lg rounded-full px-10 py-3 text-lg font-bold transition-transform transform hover:scale-105 hover:shadow-xl focus:ring-4 focus:ring-indigo-300"
                    style={{ minWidth: '120px' }}
                  >
                    {'סיים והתחל'}
                  </button>
                )}
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="btn-outline"
                  >
                    {'הקודם'}
                  </button>
                ) : (
                  <div></div>
                )}
              </>
            ) : (
              <>
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="btn-outline"
                  >
                    {'Back'}
                  </button>
                ) : (
                  <div></div>
                )}
                {step < totalSteps ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="btn-primary shadow-lg rounded-full px-10 py-3 text-lg font-bold transition-transform transform hover:scale-105 hover:shadow-xl focus:ring-4 focus:ring-indigo-300"
                    disabled={
                      (step === 1 && !name.trim()) || 
                      (step === 2 && (!weight || !height))
                    }
                    style={{ minWidth: '120px' }}
                  >
                    {'Next'}
                    <ChevronRight size={20} className="ml-2" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleFinish}
                    className="btn-primary shadow-lg rounded-full px-10 py-3 text-lg font-bold transition-transform transform hover:scale-105 hover:shadow-xl focus:ring-4 focus:ring-indigo-300"
                    style={{ minWidth: '120px' }}
                  >
                    {'Finish & Start'}
                    <ArrowRight size={20} className="ml-2" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome; 