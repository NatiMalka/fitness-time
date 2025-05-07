import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, AlertCircle, ArrowRight, TrendingDown, TrendingUp, Check } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { 
  getWeightStatus, 
  BmiCategoryHebrew 
} from '../../utils/weightCalculator';

interface WeightStatusCardProps {
  className?: string;
}

const WeightStatusCard: React.FC<WeightStatusCardProps> = ({ className = '' }) => {
  const { userProfile, language, t } = useAppContext();
  
  if (!userProfile?.weight || !userProfile?.height) {
    return null;
  }

  const isRtl = language === 'he';
  
  // Calculate weight status using our utility
  const weightStatus = getWeightStatus(
    userProfile.weight,
    userProfile.height,
    userProfile.gender
  );
  
  // Get appropriate status icon
  const getStatusIcon = () => {
    switch (weightStatus.status) {
      case 'underweight':
        return <TrendingDown className="h-5 w-5 text-blue-500" />;
      case 'overweight':
        return <TrendingUp className="h-5 w-5 text-amber-500" />;
      case 'normal':
        return <Check className="h-5 w-5 text-green-500" />;
      default:
        return <Scale className="h-5 w-5 text-indigo-500" />;
    }
  };
  
  // Get status text
  const getStatusText = () => {
    if (weightStatus.status === 'underweight') {
      return t('underweight');
    } else if (weightStatus.status === 'overweight') {
      return t('overweight');
    } else {
      return t('healthyWeight');
    }
  };
  
  // Get status color
  const getStatusColor = () => {
    switch (weightStatus.status) {
      case 'underweight':
        return 'text-blue-700 bg-blue-50';
      case 'overweight':
        return 'text-amber-700 bg-amber-50';
      case 'normal':
        return 'text-green-700 bg-green-50';
      default:
        return 'text-gray-700 bg-gray-50';
    }
  };
  
  // Localize BMI category
  const getBmiCategoryText = () => {
    return language === 'he' 
      ? BmiCategoryHebrew[weightStatus.bmiCategory]
      : weightStatus.bmiCategory;
  };
  
  // Get message text
  const getMessage = () => {
    if (weightStatus.status === 'normal') {
      return t('healthyWeightMessage');
    }
    
    const amount = weightStatus.weightToLoseOrGain.toFixed(1);
    
    if (weightStatus.status === 'underweight') {
      return `${t('weightGainMessage')} ${amount} ${language === 'he' ? 'ק"ג' : 'kg'}`;
    } else {
      return `${t('weightLossMessage')} ${amount} ${language === 'he' ? 'ק"ג' : 'kg'}`;
    }
  };
  
  return (
    <div className={`card p-5 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Scale className={`h-5 w-5 text-indigo-600 ${isRtl ? 'ml-2' : 'mr-2'}`} />
          {t('weightStatus')}
        </h3>
        
        <Link to="/settings" className="text-indigo-600 text-sm hover:underline flex items-center">
          {language === 'he' ? 'הגדרות' : 'Settings'}
          <ArrowRight size={16} className={isRtl ? 'mr-1' : 'ml-1'} />
        </Link>
      </div>
      
      <div className="space-y-4">
        {/* Status Card */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center mb-2">
            {getStatusIcon()}
            <h4 className="font-medium text-gray-900 ml-2 mr-2">
              {getStatusText()}
            </h4>
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor()}`}>
              BMI: {weightStatus.bmi}
            </span>
          </div>
          
          <p className="text-gray-600 text-sm">
            {getMessage()}
          </p>
        </div>
        
        {/* Details Section */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">
              {t('currentWeight')}
            </p>
            <p className="text-lg font-semibold">
              {userProfile.weight} {language === 'he' ? 'ק"ג' : 'kg'}
            </p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">
              {t('healthyRange')}
            </p>
            <p className="text-lg font-semibold">
              {weightStatus.idealRange.min} - {weightStatus.idealRange.max} {language === 'he' ? 'ק"ג' : 'kg'}
            </p>
          </div>
        </div>
        
        {/* BMI and Message Section */}
        <div className="bg-indigo-50 p-3 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-indigo-600 mb-1">
                {t('bmiCategory')}
              </p>
              <p className="font-medium text-indigo-900">
                {getBmiCategoryText()}
              </p>
            </div>
            
            {weightStatus.status !== 'normal' && (
              <div className="flex items-center">
                <AlertCircle size={16} className="text-amber-500 mr-1" />
                <span className="text-xs font-medium text-amber-700">
                  {weightStatus.percentageFromIdeal.toFixed(1)}% 
                  {weightStatus.status === 'overweight' 
                    ? ` ${t('aboveRange')}`
                    : ` ${t('belowRange')}`}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeightStatusCard; 