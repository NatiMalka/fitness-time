import React, { useState } from 'react';
import { useAppContext, ExerciseEntry } from '../context/AppContext';
import { format, parseISO } from 'date-fns';
import { he } from 'date-fns/locale';
import { Activity, Plus, BarChart2, Zap, Edit, Trash2, X, Check } from 'lucide-react';

const Exercise: React.FC = () => {
  const { exerciseEntries, addExerciseEntry, updateExerciseEntry, deleteExerciseEntry, language, t } = useAppContext();
  const [type, setType] = useState('');
  const [duration, setDuration] = useState('');
  const [intensity, setIntensity] = useState<'low' | 'medium' | 'high'>('medium');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [isCustomType, setIsCustomType] = useState(false);
  const [customType, setCustomType] = useState('');
  
  // Editing state
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null);
  const [editType, setEditType] = useState('');
  const [editDuration, setEditDuration] = useState('');
  const [editIntensity, setEditIntensity] = useState<'low' | 'medium' | 'high'>('medium');
  const [editDate, setEditDate] = useState('');
  
  // Start editing an exercise
  const handleEdit = (exercise: ExerciseEntry) => {
    setEditingExerciseId(exercise.id);
    setEditType(exercise.type);
    setEditDuration(exercise.duration.toString());
    setEditIntensity((exercise.intensity || 'medium') as 'low' | 'medium' | 'high');
    setEditDate(exercise.date);
  };
  
  // Cancel editing
  const handleCancelEdit = () => {
    setEditingExerciseId(null);
  };
  
  // Save edited exercise
  const handleSaveEdit = () => {
    if (editingExerciseId && editType.trim() && editDuration) {
      const durationValue = parseInt(editDuration, 10);
      if (!isNaN(durationValue) && durationValue > 0) {
        updateExerciseEntry(editingExerciseId, {
          type: editType.trim(),
          duration: durationValue,
          intensity: editIntensity,
          date: editDate
        });
        setEditingExerciseId(null);
      }
    }
  };
  
  // Delete exercise with confirmation
  const handleDelete = (id: string) => {
    if (window.confirm(language === 'he' ? 'האם אתה בטוח שברצונך למחוק אימון זה?' : 'Are you sure you want to delete this exercise?')) {
      deleteExerciseEntry(id);
    }
  };

  const exerciseTypes = language === 'he' ? [
    'ריצה', 'הליכה', 'רכיבה על אופניים', 'שחייה',
    'יוגה', 'אימון כוח', 'אימון אינטרבלים', 'ריקוד',
    'פילאטיס', 'טיול', 'טניס', 'כדורסל',
    'כדורגל', 'כדורעף', 'אחר'
  ] : [
    'Running', 'Walking', 'Cycling', 'Swimming',
    'Yoga', 'Weight Training', 'HIIT', 'Dancing',
    'Pilates', 'Hiking', 'Tennis', 'Basketball',
    'Football', 'Volleyball', 'Other'
  ];

  const intensityLevels = [
    { value: 'low', label: language === 'he' ? 'נמוכה' : 'Low' },
    { value: 'medium', label: language === 'he' ? 'בינונית' : 'Medium' },
    { value: 'high', label: language === 'he' ? 'גבוהה' : 'High' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const durationValue = parseInt(duration, 10);
    const finalType = isCustomType ? customType : type;
    
    if (finalType && !isNaN(durationValue) && durationValue > 0) {
      addExerciseEntry({
        date,
        type: finalType,
        duration: durationValue,
        caloriesBurned: 0, // Set to 0 since we're not using it
        intensity: intensity
      });
      setType('');
      setCustomType('');
      setDuration('');
      setIntensity('medium');
      setIsCustomType(false);
    }
  };

  // Sort entries by date, most recent first
  const sortedEntries = [...exerciseEntries].sort(
    (a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime()
  );

  // Group entries by date
  const entriesByDate = sortedEntries.reduce<Record<string, ExerciseEntry[]>>((acc, entry) => {
    if (!acc[entry.date]) {
      acc[entry.date] = [];
    }
    acc[entry.date].push(entry);
    return acc;
  }, {});

  // Calculate today's exercise stats
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayExercises = exerciseEntries.filter(ex => ex.date === today);
  const totalDurationToday = todayExercises.reduce((sum, ex) => sum + ex.duration, 0);

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

  // Get intensity display
  const getIntensityLabel = (intensity?: string) => {
    switch (intensity) {
      case 'low':
        return language === 'he' ? 'נמוכה' : 'Low';
      case 'medium':
        return language === 'he' ? 'בינונית' : 'Medium';
      case 'high':
        return language === 'he' ? 'גבוהה' : 'High';
      default:
        return language === 'he' ? 'בינונית' : 'Medium';
    }
  };

  // Get intensity color
  const getIntensityColor = (intensity?: string) => {
    switch (intensity) {
      case 'low':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'high':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-yellow-600 bg-yellow-100';
    }
  };

  return (
    <div className="space-y-6 pb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {language === 'he' ? 'מעקב פעילות גופנית' : 'Exercise Tracker'}
        </h1>
        <div className="text-sm text-gray-500">
          {formattedDate(new Date())}
        </div>
      </div>

      {/* Today's summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-4">
          <h3 className="text-sm font-medium text-gray-500">
            {language === 'he' ? 'אימונים היום' : "Today's Workouts"}
          </h3>
          <p className="text-2xl font-semibold text-gray-900">{todayExercises.length}</p>
          <p className="text-sm text-gray-500 mt-1">
            {language === 'he' ? 'סך כל הפעילויות' : 'Total activities'}
          </p>
        </div>
        
        <div className="card p-4">
          <h3 className="text-sm font-medium text-gray-500">
            {language === 'he' ? 'זמן פעילות כולל' : 'Total Duration'}
          </h3>
          <p className="text-2xl font-semibold text-gray-900">{totalDurationToday} {language === 'he' ? 'דקות' : 'min'}</p>
          <p className="text-sm text-gray-500 mt-1">
            {language === 'he' ? 'דקות פעילות היום' : 'Minutes active today'}
          </p>
        </div>
      </div>

      {/* Add exercise form */}
      <div className="card p-4">
        <h2 className="text-lg font-semibold mb-4">
          {language === 'he' ? 'הוסף פעילות גופנית' : 'Add Exercise'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'he' ? 'סוג פעילות' : 'Exercise Type'}
              </label>
              {isCustomType ? (
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={customType}
                    onChange={e => setCustomType(e.target.value)}
                    placeholder={language === 'he' ? 'הכנס סוג פעילות מותאם אישית' : 'Enter custom exercise type'}
                    className="input flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => setIsCustomType(false)}
                    className="btn-outline"
                  >
                    {language === 'he' ? 'ביטול' : 'Cancel'}
                  </button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <select
                    value={type}
                    onChange={e => setType(e.target.value)}
                    className="input flex-1"
                    required={!isCustomType}
                  >
                    <option value="">{language === 'he' ? 'בחר סוג פעילות' : 'Select exercise type'}</option>
                    {exerciseTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setIsCustomType(true)}
                    className="btn-outline"
                  >
                    {language === 'he' ? 'מותאם אישית' : 'Custom'}
                  </button>
                </div>
              )}
            </div>
            <div>
              <label htmlFor="exercise-date" className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'he' ? 'תאריך' : 'Date'}
              </label>
              <input
                type="date"
                id="exercise-date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="input"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'he' ? 'משך זמן (דקות)' : 'Duration (minutes)'}
              </label>
              <input
                type="number"
                id="duration"
                value={duration}
                onChange={e => setDuration(e.target.value)}
                placeholder={language === 'he' ? 'לדוגמה: 30' : 'e.g., 30'}
                min="1"
                required
                className="input"
              />
            </div>
            <div>
              <label htmlFor="intensity" className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'he' ? 'עצימות' : 'Intensity'}
              </label>
              <select
                id="intensity"
                value={intensity}
                onChange={e => setIntensity(e.target.value as any)}
                className="input"
              >
                {intensityLevels.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button type="submit" className="btn-primary">
              <Plus size={20} className="mr-1" />
              {language === 'he' ? 'הוסף פעילות' : 'Add Exercise'}
            </button>
          </div>
        </form>
      </div>

      {/* Exercise history */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold">
          {language === 'he' ? 'היסטוריית אימונים' : 'Exercise History'}
        </h2>
        
        {Object.keys(entriesByDate).length > 0 ? (
          Object.entries(entriesByDate).map(([date, entries]) => (
            <div key={date} className="card overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h3 className="font-medium text-gray-900">
                  {formatDateString(date)}
                  <span className="ml-2 text-sm text-gray-500">
                    {entries.length} {language === 'he' ? 'אימונים' : 'workouts'}
                  </span>
                </h3>
              </div>
              <ul className="divide-y divide-gray-200">
                {entries.map(exercise => {
                  const isEditing = editingExerciseId === exercise.id;
                  
                  return (
                    <li key={exercise.id} className="px-4 py-3 hover:bg-gray-50">
                      {isEditing ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <input
                              type="text"
                              value={editType}
                              onChange={e => setEditType(e.target.value)}
                              className="input w-full md:w-1/2"
                              placeholder={language === 'he' ? 'סוג אימון' : 'Exercise type'}
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
                                {language === 'he' ? 'זמן (דקות)' : 'Duration (minutes)'}
                              </label>
                              <input
                                type="number"
                                value={editDuration}
                                onChange={e => setEditDuration(e.target.value)}
                                min="1"
                                className="input text-sm"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">
                                {language === 'he' ? 'עצימות' : 'Intensity'}
                              </label>
                              <select
                                value={editIntensity}
                                onChange={e => setEditIntensity(e.target.value as any)}
                                className="input text-sm"
                              >
                                {intensityLevels.map(({ value, label }) => (
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
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="mr-3 p-2 rounded-full bg-indigo-50 text-indigo-600">
                              <Activity size={18} />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{exercise.type}</p>
                              <p className="text-sm text-gray-500">
                                {exercise.duration} {language === 'he' ? 'דקות' : 'minutes'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`flex items-center text-sm font-medium px-2 py-1 rounded-full ${getIntensityColor(exercise.intensity)}`}>
                              <Zap size={14} className="mr-1" />
                              {getIntensityLabel(exercise.intensity)}
                            </span>
                            <div className="flex space-x-1">
                              <button
                                type="button"
                                onClick={() => handleEdit(exercise)}
                                className="p-1.5 rounded-full text-gray-400 hover:bg-gray-100 hover:text-blue-500"
                                title={language === 'he' ? 'ערוך' : 'Edit'}
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(exercise.id)}
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
            <Activity size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              {language === 'he' ? 'אין רשומות אימונים עדיין' : 'No exercise entries yet'}
            </h3>
            <p className="text-gray-500">
              {language === 'he' 
                ? 'התחל להוסיף את האימונים שלך כדי לעקוב אחר הפעילות שלך!' 
                : 'Start adding your workouts to track your activity!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Exercise;