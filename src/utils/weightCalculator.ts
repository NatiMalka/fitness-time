// Weight metrics calculation utilities

// BMI Categories according to WHO standards
export enum BmiCategory {
  SEVERELY_UNDERWEIGHT = 'Severely Underweight',
  UNDERWEIGHT = 'Underweight',
  NORMAL = 'Normal',
  OVERWEIGHT = 'Overweight',
  OBESE_CLASS_1 = 'Obese Class I',
  OBESE_CLASS_2 = 'Obese Class II',
  OBESE_CLASS_3 = 'Obese Class III'
}

// Hebrew translations for BMI categories
export const BmiCategoryHebrew: Record<BmiCategory, string> = {
  [BmiCategory.SEVERELY_UNDERWEIGHT]: 'תת משקל חמור',
  [BmiCategory.UNDERWEIGHT]: 'תת משקל',
  [BmiCategory.NORMAL]: 'משקל תקין',
  [BmiCategory.OVERWEIGHT]: 'עודף משקל',
  [BmiCategory.OBESE_CLASS_1]: 'השמנה דרגה 1',
  [BmiCategory.OBESE_CLASS_2]: 'השמנה דרגה 2',
  [BmiCategory.OBESE_CLASS_3]: 'השמנה דרגה 3'
};

/**
 * Calculate BMI (Body Mass Index)
 * @param weightKg Weight in kilograms
 * @param heightCm Height in centimeters
 * @returns BMI value rounded to 1 decimal place
 */
export const calculateBMI = (weightKg: number, heightCm: number): number => {
  if (weightKg <= 0 || heightCm <= 0) return 0;
  
  const heightM = heightCm / 100;
  return parseFloat((weightKg / (heightM * heightM)).toFixed(1));
};

/**
 * Get BMI category based on BMI value
 * @param bmi BMI value
 * @returns BMI category enum value
 */
export const getBmiCategory = (bmi: number): BmiCategory => {
  if (bmi < 16) return BmiCategory.SEVERELY_UNDERWEIGHT;
  if (bmi < 18.5) return BmiCategory.UNDERWEIGHT;
  if (bmi < 25) return BmiCategory.NORMAL;
  if (bmi < 30) return BmiCategory.OVERWEIGHT;
  if (bmi < 35) return BmiCategory.OBESE_CLASS_1;
  if (bmi < 40) return BmiCategory.OBESE_CLASS_2;
  return BmiCategory.OBESE_CLASS_3;
};

/**
 * Calculate ideal weight range based on height
 * @param heightCm Height in centimeters
 * @param gender Gender ('male', 'female', or 'other')
 * @returns Object with min and max ideal weight values in kg
 */
export const calculateIdealWeightRange = (
  heightCm: number, 
  gender: 'male' | 'female' | 'other' = 'other'
): { min: number; max: number } => {
  // Calculate weight range for BMI between 18.5 and 24.9 (normal range)
  const heightM = heightCm / 100;
  
  // Base calculation on BMI range
  let minWeight = 18.5 * heightM * heightM;
  let maxWeight = 24.9 * heightM * heightM;
  
  // Adjust slightly based on gender (optional biological factors)
  if (gender === 'male') {
    minWeight += 0.5;
    maxWeight += 0.5;
  } else if (gender === 'female') {
    minWeight -= 0.5;
    maxWeight -= 0.5;
  }
  
  return {
    min: parseFloat(minWeight.toFixed(1)),
    max: parseFloat(maxWeight.toFixed(1))
  };
};

/**
 * Calculate overweight amount
 * @param currentWeight Current weight in kg
 * @param heightCm Height in centimeters
 * @param gender Gender ('male', 'female', or 'other')
 * @returns Object with overweight status and details
 */
export const calculateOverweight = (
  currentWeight: number,
  heightCm: number,
  gender: 'male' | 'female' | 'other' = 'other'
): {
  isOverweight: boolean;
  amount: number;
  percentageOverIdeal: number;
  idealRange: { min: number; max: number };
  bmi: number;
  bmiCategory: BmiCategory;
} => {
  const bmi = calculateBMI(currentWeight, heightCm);
  const bmiCategory = getBmiCategory(bmi);
  const idealRange = calculateIdealWeightRange(heightCm, gender);
  
  // Determine if overweight and by how much
  const isOverweight = currentWeight > idealRange.max;
  const amount = isOverweight ? parseFloat((currentWeight - idealRange.max).toFixed(1)) : 0;
  
  // Calculate percentage over ideal max weight
  const percentageOverIdeal = isOverweight
    ? parseFloat(((amount / idealRange.max) * 100).toFixed(1))
    : 0;
  
  return {
    isOverweight,
    amount,
    percentageOverIdeal,
    idealRange,
    bmi,
    bmiCategory
  };
};

/**
 * Calculate underweight amount
 * @param currentWeight Current weight in kg
 * @param heightCm Height in centimeters
 * @param gender Gender ('male', 'female', or 'other')
 * @returns Object with underweight status and details
 */
export const calculateUnderweight = (
  currentWeight: number,
  heightCm: number,
  gender: 'male' | 'female' | 'other' = 'other'
): {
  isUnderweight: boolean;
  amount: number;
  percentageBelowIdeal: number;
  idealRange: { min: number; max: number };
  bmi: number;
  bmiCategory: BmiCategory;
} => {
  const bmi = calculateBMI(currentWeight, heightCm);
  const bmiCategory = getBmiCategory(bmi);
  const idealRange = calculateIdealWeightRange(heightCm, gender);
  
  // Determine if underweight and by how much
  const isUnderweight = currentWeight < idealRange.min;
  const amount = isUnderweight ? parseFloat((idealRange.min - currentWeight).toFixed(1)) : 0;
  
  // Calculate percentage below ideal min weight
  const percentageBelowIdeal = isUnderweight
    ? parseFloat(((amount / idealRange.min) * 100).toFixed(1))
    : 0;
  
  return {
    isUnderweight,
    amount,
    percentageBelowIdeal,
    idealRange,
    bmi,
    bmiCategory
  };
};

/**
 * Calculate weight status details
 * @param currentWeight Current weight in kg
 * @param heightCm Height in centimeters
 * @param gender Gender ('male', 'female', or 'other')
 * @returns Comprehensive weight status information
 */
export const getWeightStatus = (
  currentWeight: number,
  heightCm: number,
  gender: 'male' | 'female' | 'other' = 'other'
): {
  status: 'underweight' | 'normal' | 'overweight';
  bmi: number;
  bmiCategory: BmiCategory;
  idealRange: { min: number; max: number };
  amountFromIdeal: number;
  percentageFromIdeal: number;
  weightToLoseOrGain: number;
} => {
  const bmi = calculateBMI(currentWeight, heightCm);
  const bmiCategory = getBmiCategory(bmi);
  const idealRange = calculateIdealWeightRange(heightCm, gender);
  
  // Determine weight status
  let status: 'underweight' | 'normal' | 'overweight';
  let amountFromIdeal = 0;
  let percentageFromIdeal = 0;
  let weightToLoseOrGain = 0;
  
  if (currentWeight < idealRange.min) {
    status = 'underweight';
    amountFromIdeal = parseFloat((idealRange.min - currentWeight).toFixed(1));
    percentageFromIdeal = parseFloat(((amountFromIdeal / idealRange.min) * 100).toFixed(1));
    weightToLoseOrGain = amountFromIdeal; // Weight to gain
  } else if (currentWeight > idealRange.max) {
    status = 'overweight';
    amountFromIdeal = parseFloat((currentWeight - idealRange.max).toFixed(1));
    percentageFromIdeal = parseFloat(((amountFromIdeal / idealRange.max) * 100).toFixed(1));
    weightToLoseOrGain = amountFromIdeal; // Weight to lose
  } else {
    status = 'normal';
    // Calculate distance from middle of ideal range
    const idealMiddle = (idealRange.min + idealRange.max) / 2;
    amountFromIdeal = parseFloat(Math.abs(currentWeight - idealMiddle).toFixed(1));
    percentageFromIdeal = parseFloat(((amountFromIdeal / idealMiddle) * 100).toFixed(1));
    weightToLoseOrGain = 0; // No need to lose or gain
  }
  
  return {
    status,
    bmi,
    bmiCategory,
    idealRange,
    amountFromIdeal,
    percentageFromIdeal,
    weightToLoseOrGain
  };
};

/**
 * Calculate expected calorie needs based on user profile
 * @param weight Weight in kg
 * @param height Height in cm
 * @param age Age in years
 * @param gender Biological gender for metabolic calculation
 * @param activityLevel Activity level from sedentary to very active
 * @returns Daily calorie needs
 */
export const calculateCalorieNeeds = (
  weight: number,
  height: number,
  age: number,
  gender: 'male' | 'female' | 'other',
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive'
): number => {
  // Calculate Basal Metabolic Rate using Mifflin-St Jeor Equation
  let bmr = 0;
  
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    // female or other uses female formula as default
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }
  
  // Apply activity multiplier
  const activityMultipliers = {
    sedentary: 1.2,      // Little or no exercise
    light: 1.375,         // Light exercise 1-3 days/week
    moderate: 1.55,       // Moderate exercise 3-5 days/week
    active: 1.725,        // Heavy exercise 6-7 days/week
    veryActive: 1.9       // Very heavy exercise, physical job or training twice daily
  };
  
  return Math.round(bmr * activityMultipliers[activityLevel]);
}; 