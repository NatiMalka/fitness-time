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
  const [gender, setGender] = useState<'male' | 'female' | 'other' | undefined>(undefined);
  const [weightGoal, setWeightGoal] = useState<'lose' | 'maintain' | 'gain' | undefined>(undefined);
  
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
    
    if (name.trim() && !isNaN(weightValue) && !isNaN(heightValue)) {
      const profile: UserProfile = {
        name: name.trim(),
        weight: weightValue,
        height: heightValue,
        gender,
        weightGoal
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8" dir={language === 'he' ? 'rtl' : 'ltr'}>
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-600 p-6 text-white">
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
        <div className="p-6">
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
                        onClick={() => setGender(option.value as any)}
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
                      onClick={() => setWeightGoal(option.value as any)}
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
            </div>
          )}
          
          {/* Navigation Buttons */}
          <div className={`mt-8 flex ${language === 'he' ? 'flex-row-reverse' : 'flex-row'} justify-between`}>
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="btn-outline"
              >
                {language === 'he' ? 'הקודם' : 'Back'}
              </button>
            ) : (
              <div></div> // Empty div for spacing
            )}
            
            {step < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                className="btn-primary"
                disabled={
                  (step === 1 && !name.trim()) || 
                  (step === 2 && (!weight || !height))
                }
              >
                {language === 'he' ? 'הבא' : 'Next'}
                <ChevronRight size={18} className={language === 'he' ? 'mr-1' : 'ml-1'} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="btn-primary"
              >
                {language === 'he' ? 'סיים והתחל' : 'Finish & Start'}
                <ArrowRight size={18} className={language === 'he' ? 'mr-1' : 'ml-1'} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome; 