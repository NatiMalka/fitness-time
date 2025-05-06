import React, { useState, useEffect } from 'react';
import { useAppContext, UserProfile } from '../context/AppContext';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { UserCircle, User, ChevronRight, Save } from 'lucide-react';

const UserSettings: React.FC = () => {
  const { userProfile, updateUserProfile, language, t } = useAppContext();
  
  // Form state
  const [name, setName] = useState(userProfile?.name || '');
  const [weight, setWeight] = useState(userProfile?.weight?.toString() || '');
  const [height, setHeight] = useState(userProfile?.height?.toString() || '');
  const [birthDate, setBirthDate] = useState(userProfile?.birthDate || '');
  const [gender, setGender] = useState<'male' | 'female' | 'other' | undefined>(userProfile?.gender);
  const [activityLevel, setActivityLevel] = useState<'sedentary' | 'light' | 'moderate' | 'active' | 'very_active' | undefined>(userProfile?.activityLevel);
  const [weightGoal, setWeightGoal] = useState<'lose' | 'maintain' | 'gain' | undefined>(userProfile?.weightGoal);

  // Initial form setup
  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name);
      setWeight(userProfile.weight.toString());
      setHeight(userProfile.height.toString());
      setBirthDate(userProfile.birthDate || '');
      setGender(userProfile.gender);
      setActivityLevel(userProfile.activityLevel);
      setWeightGoal(userProfile.weightGoal);
    }
  }, [userProfile]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const weightValue = parseFloat(weight);
    const heightValue = parseFloat(height);
    
    if (name.trim() && !isNaN(weightValue) && !isNaN(heightValue)) {
      const profile: UserProfile = {
        name: name.trim(),
        weight: weightValue,
        height: heightValue,
        birthDate: birthDate || undefined,
        gender,
        activityLevel,
        weightGoal
      };
      
      updateUserProfile(profile);
    }
  };
  
  // Format date according to current language
  const formattedDate = (date: Date) => {
    if (language === 'he') {
      return format(date, 'EEEE, d MMMM yyyy', { locale: he });
    }
    return format(date, 'EEEE, MMMM d, yyyy');
  };

  // Translation helpers
  const genderOptions = [
    { value: 'male', labelEn: 'Male', labelHe: 'זכר' },
    { value: 'female', labelEn: 'Female', labelHe: 'נקבה' },
    { value: 'other', labelEn: 'Other', labelHe: 'אחר' }
  ];
  
  const activityOptions = [
    { value: 'sedentary', labelEn: 'Sedentary (little or no exercise)', labelHe: 'יושבני (מעט או ללא פעילות גופנית)' },
    { value: 'light', labelEn: 'Light (light exercise 1-3 days/week)', labelHe: 'קל (פעילות קלה 1-3 ימים בשבוע)' },
    { value: 'moderate', labelEn: 'Moderate (moderate exercise 3-5 days/week)', labelHe: 'בינוני (פעילות בינונית 3-5 ימים בשבוע)' },
    { value: 'active', labelEn: 'Active (hard exercise 6-7 days/week)', labelHe: 'פעיל (פעילות קשה 6-7 ימים בשבוע)' },
    { value: 'very_active', labelEn: 'Very Active (intense exercise daily)', labelHe: 'פעיל מאוד (פעילות אינטנסיבית יומית)' }
  ];
  
  const weightGoalOptions = [
    { value: 'lose', labelEn: 'Lose Weight', labelHe: 'הפחתת משקל' },
    { value: 'maintain', labelEn: 'Maintain Weight', labelHe: 'שמירה על משקל' },
    { value: 'gain', labelEn: 'Gain Weight', labelHe: 'העלאת משקל' }
  ];

  // Get label based on language
  const getLabel = (options: any[], value: string) => {
    const option = options.find(opt => opt.value === value);
    return language === 'he' ? option?.labelHe : option?.labelEn;
  };

  return (
    <div className="space-y-6 pb-6" dir={language === 'he' ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {language === 'he' ? 'הגדרות משתמש' : 'User Settings'}
        </h1>
        <div className="text-sm text-gray-500">
          {formattedDate(new Date())}
        </div>
      </div>

      {/* Profile Section */}
      <div className="card p-6 space-y-6">
        <div className="flex items-center space-x-4">
          <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
            <UserCircle size={48} />
          </div>
          <div>
            <h2 className="text-xl font-semibold">
              {userProfile?.name || (language === 'he' ? 'ברוך הבא' : 'Welcome')}
            </h2>
            <p className="text-gray-500">
              {language === 'he' 
                ? 'הגדר את הפרטים האישיים שלך לחוויה מותאמת אישית' 
                : 'Set up your personal details for a customized experience'}
            </p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center text-gray-900">
              <User size={20} className={language === 'he' ? 'ml-2' : 'mr-2'} />
              {language === 'he' ? 'מידע אישי' : 'Personal Information'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'he' ? 'שם' : 'Name'}*
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={language === 'he' ? 'הכנס את שמך' : 'Enter your name'}
                  required
                  className="input"
                />
              </div>
              <div>
                <label htmlFor="birth-date" className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'he' ? 'תאריך לידה' : 'Birth Date'}
                </label>
                <input
                  type="date"
                  id="birth-date"
                  value={birthDate}
                  onChange={e => setBirthDate(e.target.value)}
                  className="input"
                />
              </div>
            </div>
          </div>
          
          {/* Physical Metrics */}
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center text-gray-900">
              <ChevronRight size={20} className={language === 'he' ? 'ml-2' : 'mr-2'} />
              {language === 'he' ? 'מדדים פיזיים' : 'Physical Metrics'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'he' ? 'משקל (ק"ג)' : 'Weight (kg)'}*
                </label>
                <input
                  type="number"
                  id="weight"
                  value={weight}
                  onChange={e => setWeight(e.target.value)}
                  placeholder={language === 'he' ? 'הכנס משקל' : 'Enter weight'}
                  required
                  min="1"
                  step="0.1"
                  className="input"
                />
              </div>
              <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'he' ? 'גובה (ס"מ)' : 'Height (cm)'}*
                </label>
                <input
                  type="number"
                  id="height"
                  value={height}
                  onChange={e => setHeight(e.target.value)}
                  placeholder={language === 'he' ? 'הכנס גובה' : 'Enter height'}
                  required
                  min="1"
                  className="input"
                />
              </div>
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'he' ? 'מגדר' : 'Gender'}
                </label>
                <select
                  id="gender"
                  value={gender || ''}
                  onChange={e => setGender(e.target.value as any || undefined)}
                  className="input"
                >
                  <option value="">{language === 'he' ? 'בחר מגדר' : 'Select gender'}</option>
                  {genderOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {language === 'he' ? option.labelHe : option.labelEn}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Lifestyle Settings */}
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center text-gray-900">
              <ChevronRight size={20} className={language === 'he' ? 'ml-2' : 'mr-2'} />
              {language === 'he' ? 'הגדרות אורח חיים' : 'Lifestyle Settings'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="activity-level" className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'he' ? 'רמת פעילות' : 'Activity Level'}
                </label>
                <select
                  id="activity-level"
                  value={activityLevel || ''}
                  onChange={e => setActivityLevel(e.target.value as any || undefined)}
                  className="input"
                >
                  <option value="">{language === 'he' ? 'בחר רמת פעילות' : 'Select activity level'}</option>
                  {activityOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {language === 'he' ? option.labelHe : option.labelEn}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="weight-goal" className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'he' ? 'יעד משקל' : 'Weight Goal'}
                </label>
                <select
                  id="weight-goal"
                  value={weightGoal || ''}
                  onChange={e => setWeightGoal(e.target.value as any || undefined)}
                  className="input"
                >
                  <option value="">{language === 'he' ? 'בחר יעד משקל' : 'Select weight goal'}</option>
                  {weightGoalOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {language === 'he' ? option.labelHe : option.labelEn}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className={`flex ${language === 'he' ? 'justify-start' : 'justify-end'}`}>
            <button type="submit" className="btn-primary">
              <Save size={20} className={language === 'he' ? 'ml-2' : 'mr-2'} />
              {language === 'he' ? 'שמור הגדרות' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Additional Info */}
      {userProfile && (
        <div className="card p-6">
          <h3 className="text-lg font-medium mb-4 text-gray-900">
            {language === 'he' ? 'פרטי המשתמש שלך' : 'Your User Details'}
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">
                  {language === 'he' ? 'שם' : 'Name'}
                </p>
                <p className="font-medium">{userProfile.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  {language === 'he' ? 'משקל' : 'Weight'}
                </p>
                <p className="font-medium">{userProfile.weight} {language === 'he' ? 'ק"ג' : 'kg'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  {language === 'he' ? 'גובה' : 'Height'}
                </p>
                <p className="font-medium">{userProfile.height} {language === 'he' ? 'ס"מ' : 'cm'}</p>
              </div>
              {userProfile.gender && (
                <div>
                  <p className="text-sm text-gray-500">
                    {language === 'he' ? 'מגדר' : 'Gender'}
                  </p>
                  <p className="font-medium">{getLabel(genderOptions, userProfile.gender)}</p>
                </div>
              )}
              {userProfile.activityLevel && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">
                    {language === 'he' ? 'רמת פעילות' : 'Activity Level'}
                  </p>
                  <p className="font-medium">{getLabel(activityOptions, userProfile.activityLevel)}</p>
                </div>
              )}
              {userProfile.weightGoal && (
                <div>
                  <p className="text-sm text-gray-500">
                    {language === 'he' ? 'יעד משקל' : 'Weight Goal'}
                  </p>
                  <p className="font-medium">{getLabel(weightGoalOptions, userProfile.weightGoal)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSettings; 