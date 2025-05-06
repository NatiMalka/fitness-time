import React, { useState } from 'react';
import { useAppContext, MealEntry } from '../context/AppContext';
import { format, parseISO } from 'date-fns';
import { he } from 'date-fns/locale';
import { Utensils, Coffee, ChefHat, Salad, Cookie, Plus, Award, Edit, Trash2, X, Check } from 'lucide-react';

const Nutrition: React.FC = () => {
  const { mealEntries, addMealEntry, updateMealEntry, deleteMealEntry, language, t } = useAppContext();
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [type, setType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [description, setDescription] = useState('');
  const [quality, setQuality] = useState<'1' | '2' | '3' | '4' | '5'>('3');
  
  // Editing state
  const [editingMealId, setEditingMealId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editType, setEditType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [editDescription, setEditDescription] = useState('');
  const [editQuality, setEditQuality] = useState<'1' | '2' | '3' | '4' | '5'>('3');
  const [editDate, setEditDate] = useState('');
  
  // Start editing a meal
  const handleEdit = (meal: MealEntry) => {
    setEditingMealId(meal.id);
    setEditName(meal.name);
    setEditType(meal.type);
    setEditDescription(meal.description || '');
    setEditQuality((meal.quality || '3') as '1' | '2' | '3' | '4' | '5');
    setEditDate(meal.date);
  };
  
  // Cancel editing
  const handleCancelEdit = () => {
    setEditingMealId(null);
  };
  
  // Save edited meal
  const handleSaveEdit = () => {
    if (editingMealId && editName.trim()) {
      updateMealEntry(editingMealId, {
        name: editName.trim(),
        type: editType,
        description: editDescription.trim(),
        quality: editQuality,
        date: editDate
      });
      setEditingMealId(null);
    }
  };
  
  // Delete meal with confirmation
  const handleDelete = (id: string) => {
    if (window.confirm(language === 'he' ? 'האם אתה בטוח שברצונך למחוק ארוחה זו?' : 'Are you sure you want to delete this meal?')) {
      deleteMealEntry(id);
    }
  };

  const mealTypes = [
    { value: 'breakfast', label: language === 'he' ? 'ארוחת בוקר' : 'Breakfast', icon: <Coffee size={18} /> },
    { value: 'lunch', label: language === 'he' ? 'ארוחת צהריים' : 'Lunch', icon: <ChefHat size={18} /> },
    { value: 'dinner', label: language === 'he' ? 'ארוחת ערב' : 'Dinner', icon: <Salad size={18} /> },
    { value: 'snack', label: language === 'he' ? 'חטיף' : 'Snack', icon: <Cookie size={18} /> },
  ];

  const qualityLevels = [
    { value: '1', label: language === 'he' ? 'לא בריא' : 'Poor' },
    { value: '2', label: language === 'he' ? 'סביר' : 'Fair' },
    { value: '3', label: language === 'he' ? 'טוב' : 'Good' },
    { value: '4', label: language === 'he' ? 'טוב מאוד' : 'Very Good' },
    { value: '5', label: language === 'he' ? 'מצוין' : 'Excellent' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const caloriesValue = parseInt(calories, 10) || 0;
    
    if (name.trim()) {
      addMealEntry({
        date,
        name: name.trim(),
        calories: caloriesValue,
        type,
        quality: quality,
        description: description.trim()
      });
      setName('');
      setCalories('');
      setDescription('');
      setQuality('3');
    }
  };

  // Sort entries by date, most recent first
  const sortedEntries = [...mealEntries].sort(
    (a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime()
  );

  // Group entries by date
  const entriesByDate = sortedEntries.reduce<Record<string, MealEntry[]>>((acc, entry) => {
    if (!acc[entry.date]) {
      acc[entry.date] = [];
    }
    acc[entry.date].push(entry);
    return acc;
  }, {});

  // Calculate today's meals
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayMeals = mealEntries.filter(meal => meal.date === today);
  
  // Count meals by type for today
  const mealsByType = mealTypes.reduce<Record<string, number>>((acc, { value }) => {
    acc[value] = todayMeals.filter(meal => meal.type === value).length;
    return acc;
  }, {});

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
      return format(parseISO(dateStr), 'EEEE, d MMMM yyyy', { locale: he });
    }
    return format(parseISO(dateStr), 'EEEE, MMMM d, yyyy');
  };

  // Get quality label from value
  const getQualityLabel = (qualityValue: string) => {
    return qualityLevels.find(q => q.value === qualityValue)?.label || qualityLevels[2].label;
  };

  return (
    <div className="space-y-6 pb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {language === 'he' ? 'מעקב תזונה' : 'Nutrition Tracker'}
        </h1>
        <div className="text-sm text-gray-500">
          {formattedDate(new Date())}
        </div>
      </div>

      {/* Today's summary */}
      <div className="card p-4">
        <h2 className="text-lg font-semibold mb-4">
          {language === 'he' ? 'סיכום יומי' : "Today's Summary"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-indigo-50 rounded-lg p-3 text-center">
            <h3 className="text-sm font-medium text-indigo-800">
              {language === 'he' ? 'סה"כ ארוחות' : 'Total Meals'}
            </h3>
            <p className="text-xl font-semibold text-indigo-900">{todayMeals.length}</p>
          </div>
          {mealTypes.map(({ value, label, icon }) => (
            <div key={value} className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center mb-1">
                {icon}
                <h3 className="text-sm font-medium text-gray-800 ml-1">{label}</h3>
              </div>
              <p className="text-xl font-semibold text-gray-900">{mealsByType[value] || 0}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Add meal form */}
      <div className="card p-4">
        <h2 className="text-lg font-semibold mb-4">
          {language === 'he' ? 'הוסף ארוחה' : 'Add Meal'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="meal-name" className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'he' ? 'שם הארוחה' : 'Meal Name'}
              </label>
              <input
                type="text"
                id="meal-name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={language === 'he' ? 'לדוגמה: דייסת שיבולת שועל עם פירות יער' : 'e.g., Oatmeal with berries'}
                required
                className="input"
              />
            </div>
            <div>
              <label htmlFor="meal-quality" className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'he' ? 'איכות התזונה' : 'Nutritional Quality'}
              </label>
              <select
                id="meal-quality"
                value={quality}
                onChange={e => setQuality(e.target.value as any)}
                className="input"
              >
                {qualityLevels.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'he' ? 'סוג ארוחה' : 'Meal Type'}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {mealTypes.map(({ value, label, icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setType(value as any)}
                    className={`
                      flex flex-col items-center justify-center p-2 rounded-lg border
                      ${type === value ? 'bg-indigo-50 border-indigo-300' : 'border-gray-200 hover:bg-gray-50'}
                    `}
                  >
                    {icon}
                    <span className="text-xs mt-1">{label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="meal-date" className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'he' ? 'תאריך' : 'Date'}
              </label>
              <input
                type="date"
                id="meal-date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="input"
              />
            </div>
          </div>

          <div>
            <label htmlFor="meal-description" className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'he' ? 'רכיבים / פירוט' : 'Ingredients / Details'}
            </label>
            <textarea
              id="meal-description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder={language === 'he' ? 'פרט את רכיבי הארוחה או הערות נוספות' : 'List meal ingredients or add notes'}
              rows={3}
              className="input w-full"
            />
          </div>
          
          <div className="flex justify-end">
            <button type="submit" className="btn-primary">
              <Plus size={20} className="mr-1" />
              {language === 'he' ? 'הוסף ארוחה' : 'Add Meal'}
            </button>
          </div>
        </form>
      </div>

      {/* Meal history */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold">
          {language === 'he' ? 'היסטוריית ארוחות' : 'Meal History'}
        </h2>
        
        {Object.keys(entriesByDate).length > 0 ? (
          Object.entries(entriesByDate).map(([date, entries]) => (
            <div key={date} className="card overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h3 className="font-medium text-gray-900">
                  {formatDateString(date)}
                  <span className="ml-2 text-sm text-gray-500">
                    {entries.length} {language === 'he' ? 'ארוחות' : 'meals'}
                  </span>
                </h3>
              </div>
              <ul className="divide-y divide-gray-200">
                {entries.map(meal => {
                  const mealTypeInfo = mealTypes.find(t => t.value === meal.type);
                  const isEditing = editingMealId === meal.id;
                  
                  return (
                    <li key={meal.id} className="px-4 py-3 hover:bg-gray-50">
                      {isEditing ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <input
                              type="text"
                              value={editName}
                              onChange={e => setEditName(e.target.value)}
                              className="input w-full md:w-1/2"
                              placeholder={language === 'he' ? 'שם הארוחה' : 'Meal name'}
                            />
                            <div className="space-x-2 flex items-center">
                              <button
                                type="button"
                                onClick={handleSaveEdit}
                                className="p-1.5 rounded-full bg-green-50 text-green-600 hover:bg-green-100"
                                title={language === 'he' ? 'שמור' : 'Save'}
                              >
                                <Check size={18} />
                              </button>
                              <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="p-1.5 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100"
                                title={language === 'he' ? 'בטל' : 'Cancel'}
                              >
                                <X size={18} />
                              </button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">
                                {language === 'he' ? 'סוג ארוחה' : 'Meal Type'}
                              </label>
                              <div className="flex space-x-2">
                                {mealTypes.map(({ value, label, icon }) => (
                                  <button
                                    key={value}
                                    type="button"
                                    onClick={() => setEditType(value as any)}
                                    className={`
                                      flex items-center p-1.5 rounded-lg border text-xs
                                      ${editType === value ? 'bg-indigo-50 border-indigo-300' : 'border-gray-200 hover:bg-gray-50'}
                                    `}
                                  >
                                    {icon}
                                    <span className="ml-1">{label}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">
                                {language === 'he' ? 'איכות התזונה' : 'Quality'}
                              </label>
                              <select
                                value={editQuality}
                                onChange={e => setEditQuality(e.target.value as any)}
                                className="input text-sm"
                              >
                                {qualityLevels.map(({ value, label }) => (
                                  <option key={value} value={value}>{label}</option>
                                ))}
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">
                                {language === 'he' ? 'תאריך' : 'Date'}
                              </label>
                              <input
                                type="date"
                                value={editDate}
                                onChange={e => setEditDate(e.target.value)}
                                className="input text-sm"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              {language === 'he' ? 'פירוט' : 'Description'}
                            </label>
                            <textarea
                              value={editDescription}
                              onChange={e => setEditDescription(e.target.value)}
                              className="input text-sm w-full"
                              rows={2}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="mr-3">
                              {mealTypeInfo?.icon || <Utensils size={18} />}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{meal.name}</p>
                              <p className="text-sm text-gray-500">{mealTypeInfo?.label}</p>
                              {meal.description && (
                                <p className="text-xs text-gray-500 mt-1">{meal.description}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="flex items-center text-sm font-medium px-2 py-1 rounded-full bg-indigo-50 text-indigo-700">
                              <Award size={14} className="mr-1" />
                              {getQualityLabel(meal.quality || '3')}
                            </span>
                            <div className="flex space-x-1">
                              <button
                                type="button"
                                onClick={() => handleEdit(meal)}
                                className="p-1.5 rounded-full text-gray-400 hover:bg-gray-100 hover:text-blue-500"
                                title={language === 'he' ? 'ערוך' : 'Edit'}
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(meal.id)}
                                className="p-1.5 rounded-full text-gray-400 hover:bg-gray-100 hover:text-red-500"
                                title={language === 'he' ? 'מחק' : 'Delete'}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))
        ) : (
          <div className="text-center py-12 card">
            <Utensils size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              {language === 'he' ? 'אין רשומות ארוחות עדיין' : 'No meal entries yet'}
            </h3>
            <p className="text-gray-500">
              {language === 'he' 
                ? 'התחל להוסיף את הארוחות שלך כדי לעקוב אחר התזונה שלך!' 
                : 'Start adding your meals to track your nutrition!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Nutrition;
