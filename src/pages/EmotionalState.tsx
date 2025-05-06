import React, { useState } from 'react';
import { useAppContext, EmotionalEntry } from '../context/AppContext';
import { format, parseISO, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { he } from 'date-fns/locale';
import { 
  SmilePlus, 
  Plus, 
  Calendar 
} from 'lucide-react';

const moodOptions = [
  { value: 'great', label: 'Great', heLabel: 'מצוין', emoji: '😄', color: 'bg-green-100 text-green-800' },
  { value: 'good', label: 'Good', heLabel: 'טוב', emoji: '🙂', color: 'bg-emerald-100 text-emerald-800' },
  { value: 'neutral', label: 'Neutral', heLabel: 'ניטרלי', emoji: '😐', color: 'bg-blue-100 text-blue-800' },
  { value: 'bad', label: 'Bad', heLabel: 'רע', emoji: '😕', color: 'bg-amber-100 text-amber-800' },
  { value: 'awful', label: 'Awful', heLabel: 'נורא', emoji: '😞', color: 'bg-rose-100 text-rose-800' },
];

const EmotionalState: React.FC = () => {
  const { emotionalEntries, addEmotionalEntry, language } = useAppContext();
  const [mood, setMood] = useState<'great' | 'good' | 'neutral' | 'bad' | 'awful'>('neutral');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addEmotionalEntry({
      date,
      mood,
      notes: notes.trim() || undefined
    });
    
    setNotes('');
  };

  // Sort entries by date, most recent first
  const sortedEntries = [...emotionalEntries].sort(
    (a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime()
  );

  // Create week view data
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday as week start
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
  const daysOfWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Format date according to current language
  const formattedDate = (date: Date) => {
    if (language === 'he') {
      return format(date, 'EEEE, d MMMM yyyy', { locale: he });
    }
    return format(date, 'EEEE, MMMM d, yyyy');
  };

  // Get the appropriate mood label based on the current language
  const getMoodLabel = (moodValue: string) => {
    const option = moodOptions.find(m => m.value === moodValue);
    return language === 'he' ? option?.heLabel : option?.label;
  };

  return (
    <div className="space-y-6 pb-6" dir={language === 'he' ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {language === 'he' ? 'מעקב מצב רגשי' : 'Emotional State Tracker'}
        </h1>
        <div className="text-sm text-gray-500">
          {formattedDate(new Date())}
        </div>
      </div>

      {/* Weekly mood overview */}
      <div className="card p-4">
        <h2 className="text-lg font-semibold mb-4">
          {language === 'he' ? 'מצב הרוח השבועי' : "This Week's Mood"}
        </h2>
        <div className="grid grid-cols-7 gap-2">
          {daysOfWeek.map(day => {
            const dayStr = format(day, 'yyyy-MM-dd');
            const entry = emotionalEntries.find(e => e.date === dayStr);
            const moodInfo = entry ? moodOptions.find(m => m.value === entry.mood) : null;
            const isToday = format(today, 'yyyy-MM-dd') === dayStr;
            
            return (
              <div 
                key={dayStr}
                className={`
                  flex flex-col items-center p-2 rounded-lg
                  ${isToday ? 'ring-2 ring-indigo-500' : ''}
                  ${entry ? moodInfo?.color || 'bg-gray-100' : 'bg-gray-100'}
                `}
              >
                <div className="text-xs font-medium mb-1">
                  {language === 'he' 
                    ? format(day, 'EEE', { locale: he })
                    : format(day, 'EEE')}
                </div>
                <div className="text-lg mb-1">{format(day, 'd')}</div>
                <div className="text-xl">
                  {entry ? moodInfo?.emoji : ''}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add mood entry form */}
      <div className="card p-4">
        <h2 className="text-lg font-semibold mb-4">
          {language === 'he' ? 'הוסף רשומת מצב רוח' : 'Add Mood Entry'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="mood-date" className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'he' ? 'תאריך' : 'Date'}
              </label>
              <input
                type="date"
                id="mood-date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="input"
              />
            </div>
            <div className="flex items-end">
              <label className="block text-sm font-medium text-gray-700 mb-1 w-full">
                {language === 'he' ? 'איך אתה מרגיש היום?' : 'How are you feeling today?'}
              </label>
            </div>
          </div>
          
          <div className="grid grid-cols-5 gap-2">
            {moodOptions.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => setMood(option.value as any)}
                className={`
                  flex flex-col items-center p-3 rounded-lg border
                  ${mood === option.value 
                    ? option.color + ' border-current' 
                    : 'border-gray-300 hover:bg-gray-50'}
                `}
              >
                <span className="text-2xl mb-1">{option.emoji}</span>
                <span className="text-sm">{language === 'he' ? option.heLabel : option.label}</span>
              </button>
            ))}
          </div>
          
          <div>
            <label htmlFor="mood-notes" className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'he' ? 'רשומת יומן (אופציונלי)' : 'Journal Entry (Optional)'}
            </label>
            <textarea
              id="mood-notes"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={4}
              className="input"
              placeholder={language === 'he' 
                ? 'כתוב על היום שלך, רגשות, טריגרים, או כל דבר שהיית רוצה לזכור על איך אתה מרגיש...'
                : "Write about your day, emotions, triggers, or anything you'd like to remember about how you're feeling..."}
            ></textarea>
          </div>
          
          <div className={`flex ${language === 'he' ? 'justify-start' : 'justify-end'}`}>
            <button type="submit" className="btn-primary">
              <Plus size={20} className={language === 'he' ? 'ml-1' : 'mr-1'} />
              {language === 'he' ? 'שמור מצב רוח' : 'Save Mood'}
            </button>
          </div>
        </form>
      </div>

      {/* Mood history */}
      <div className="card overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold">
            {language === 'he' ? 'היסטוריית מצב רוח' : 'Mood History'}
          </h2>
        </div>
        {sortedEntries.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {sortedEntries.map(entry => {
              const moodInfo = moodOptions.find(m => m.value === entry.mood);
              
              return (
                <li key={entry.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">
                      {language === 'he'
                        ? format(parseISO(entry.date), 'EEEE, d MMMM yyyy', { locale: he })
                        : format(parseISO(entry.date), 'EEEE, MMMM d, yyyy')}
                    </h3>
                    <span className={`
                      px-3 py-1 rounded-full text-sm font-medium
                      ${moodInfo?.color}
                    `}>
                      <span className={language === 'he' ? 'ml-1' : 'mr-1'}>{moodInfo?.emoji}</span>
                      {language === 'he' ? moodInfo?.heLabel : moodInfo?.label}
                    </span>
                  </div>
                  
                  {entry.notes && (
                    <p className="text-gray-600 mt-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                      {entry.notes}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="text-center py-12">
            <SmilePlus size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              {language === 'he' ? 'אין רשומות מצב רוח עדיין' : 'No mood entries yet'}
            </h3>
            <p className="text-gray-500">
              {language === 'he' 
                ? 'התחל לעקוב אחר המצב הרגשי שלך כדי לראות דפוסים לאורך זמן'
                : 'Start tracking your emotional state to see patterns over time'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmotionalState;