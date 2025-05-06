import React, { useState } from 'react';
import { useAppContext, CycleEntry } from '../context/AppContext';
import { format, parseISO, addDays, differenceInDays, isSameDay } from 'date-fns';
import { he } from 'date-fns/locale';
import { CalendarHeart, Droplet, Plus } from 'lucide-react';

const flowOptions = [
  { value: 'light', label: 'Light', heLabel: 'קל', color: 'bg-rose-100' },
  { value: 'medium', label: 'Medium', heLabel: 'בינוני', color: 'bg-rose-300' },
  { value: 'heavy', label: 'Heavy', heLabel: 'כבד', color: 'bg-rose-500' },
];

const commonSymptoms = {
  en: [
    'cramps', 'headache', 'bloating', 'fatigue', 
    'mood swings', 'acne', 'breast tenderness', 'backache',
    'nausea', 'insomnia'
  ],
  he: [
    'התכווצויות', 'כאב ראש', 'נפיחות', 'עייפות',
    'שינויי מצב רוח', 'אקנה', 'רגישות בחזה', 'כאב גב',
    'בחילה', 'נדודי שינה'
  ]
};

const FertilityCycle: React.FC = () => {
  const { cycleEntries, addCycleEntry, language, t } = useAppContext();
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [flow, setFlow] = useState<'light' | 'medium' | 'heavy' | undefined>(undefined);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [customSymptom, setCustomSymptom] = useState('');

  // Get symptoms based on current language
  const getCurrentSymptoms = () => {
    return language === 'he' ? commonSymptoms.he : commonSymptoms.en;
  };

  // Map English symptoms to Hebrew and vice versa for display
  const getSymptomDisplay = (symptom: string) => {
    if (commonSymptoms.en.includes(symptom) && language === 'he') {
      const index = commonSymptoms.en.indexOf(symptom);
      return commonSymptoms.he[index];
    }
    if (commonSymptoms.he.includes(symptom) && language === 'en') {
      const index = commonSymptoms.he.indexOf(symptom);
      return commonSymptoms.en[index];
    }
    return symptom;
  };

  const handleAddSymptom = () => {
    if (customSymptom.trim() && !symptoms.includes(customSymptom.trim())) {
      setSymptoms([...symptoms, customSymptom.trim()]);
      setCustomSymptom('');
    }
  };

  const handleRemoveSymptom = (symptom: string) => {
    setSymptoms(symptoms.filter(s => s !== symptom));
  };

  const toggleSymptom = (symptom: string) => {
    if (symptoms.includes(symptom)) {
      handleRemoveSymptom(symptom);
    } else {
      setSymptoms([...symptoms, symptom]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addCycleEntry({
      date,
      flow,
      symptoms: symptoms.length > 0 ? symptoms : undefined,
      notes: notes.trim() || undefined
    });
    
    setFlow(undefined);
    setSymptoms([]);
    setNotes('');
  };

  // Sort entries by date
  const sortedEntries = [...cycleEntries].sort(
    (a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime()
  );

  // Generate calendar data for visualization
  const generateCalendarData = () => {
    if (sortedEntries.length === 0) return [];
    
    // Find the first and last date in entries to display
    const firstDate = parseISO(sortedEntries[0].date);
    const lastDate = parseISO(sortedEntries[sortedEntries.length - 1].date);
    
    // Add some padding to the calendar
    const startDate = addDays(firstDate, -5);
    const endDate = addDays(lastDate, 20);
    
    const days = differenceInDays(endDate, startDate) + 1;
    const calendarDays = [];
    
    for (let i = 0; i < days; i++) {
      const currentDate = addDays(startDate, i);
      const currentDateStr = format(currentDate, 'yyyy-MM-dd');
      const entry = cycleEntries.find(e => e.date === currentDateStr);
      
      calendarDays.push({
        date: currentDate,
        entry
      });
    }
    
    return calendarDays;
  };

  const calendarData = generateCalendarData();

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

  // Get flow label based on current language
  const getFlowLabel = (flowValue: string) => {
    const option = flowOptions.find(f => f.value === flowValue);
    return language === 'he' ? option?.heLabel : option?.label;
  };

  return (
    <div className="space-y-6 pb-6" dir={language === 'he' ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {language === 'he' ? 'מעקב מחזור פוריות' : 'Fertility Cycle Tracker'}
        </h1>
        <div className="text-sm text-gray-500">
          {formattedDate(new Date())}
        </div>
      </div>

      {/* Cycle visualization */}
      <div className="card p-4">
        <h2 className="text-lg font-semibold mb-4">
          {language === 'he' ? 'ציר זמן מחזור' : 'Cycle Timeline'}
        </h2>
        
        {calendarData.length > 0 ? (
          <div className="overflow-x-auto">
            <div className="inline-flex min-w-full">
              {calendarData.map((day, i) => {
                const isToday = isSameDay(day.date, new Date());
                let bgColor = '';
                if (day.entry?.flow === 'light') bgColor = 'bg-rose-100';
                if (day.entry?.flow === 'medium') bgColor = 'bg-rose-300';
                if (day.entry?.flow === 'heavy') bgColor = 'bg-rose-500';
                
                return (
                  <div 
                    key={i} 
                    className={`flex flex-col items-center w-10 ${language === 'he' ? 'ml-1' : 'mr-1'} cursor-pointer ${
                      isToday ? 'ring-2 ring-indigo-500 rounded-md' : ''
                    }`}
                    title={formatDateString(format(day.date, 'yyyy-MM-dd'))}
                  >
                    <div className="text-xs text-gray-500">
                      {language === 'he' 
                        ? format(day.date, 'E', { locale: he })
                        : format(day.date, 'E')}
                    </div>
                    <div className={`
                      w-8 h-8 flex items-center justify-center rounded-full
                      ${bgColor || 'bg-gray-100'}
                      ${isToday ? 'font-bold' : ''}
                    `}>
                      {format(day.date, 'd')}
                    </div>
                    {day.entry?.symptoms && (
                      <div className="mt-1 w-3 h-3 bg-amber-400 rounded-full" 
                        title={day.entry.symptoms.map(s => getSymptomDisplay(s)).join(', ')}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <CalendarHeart size={32} className="mx-auto mb-2 text-gray-300" />
            <p>{language === 'he' 
              ? 'אין נתוני מחזור עדיין. הוסיפי את הרשומה הראשונה שלך כדי לראות את ציר הזמן.' 
              : 'No cycle data yet. Add your first entry to see the timeline.'}</p>
          </div>
        )}
        
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-rose-100 mx-1"></div>
            <span className="text-sm">{language === 'he' ? 'קל' : 'Light'}</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-rose-300 mx-1"></div>
            <span className="text-sm">{language === 'he' ? 'בינוני' : 'Medium'}</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-rose-500 mx-1"></div>
            <span className="text-sm">{language === 'he' ? 'כבד' : 'Heavy'}</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-amber-400 mx-1"></div>
            <span className="text-sm">{language === 'he' ? 'תסמינים' : 'Symptoms'}</span>
          </div>
        </div>
      </div>

      {/* Add cycle entry form */}
      <div className="card p-4">
        <h2 className="text-lg font-semibold mb-4">
          {language === 'he' ? 'הוסיפי רשומת מחזור' : 'Add Cycle Entry'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="cycle-date" className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'he' ? 'תאריך' : 'Date'}
              </label>
              <input
                type="date"
                id="cycle-date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'he' ? 'עוצמת הזרימה' : 'Flow Intensity'}
              </label>
              <div className="flex space-x-2">
                {flowOptions.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFlow(flow === option.value ? undefined : option.value as any)}
                    className={`
                      flex-1 py-2 px-3 rounded-lg border flex items-center justify-center
                      ${flow === option.value 
                        ? `${option.color} border-rose-500 text-rose-800` 
                        : 'border-gray-300 hover:bg-gray-50'}
                    `}
                  >
                    <Droplet size={16} className={language === 'he' ? 'ml-1' : 'mr-1'} />
                    {language === 'he' ? option.heLabel : option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'he' ? 'תסמינים' : 'Symptoms'}
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {getCurrentSymptoms().map(symptom => (
                <button
                  key={symptom}
                  type="button"
                  onClick={() => toggleSymptom(symptom)}
                  className={`
                    px-3 py-1 rounded-full text-sm border
                    ${symptoms.includes(symptom) 
                      ? 'bg-indigo-100 border-indigo-300 text-indigo-800' 
                      : 'border-gray-300 hover:bg-gray-50'}
                  `}
                >
                  {symptom}
                </button>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                value={customSymptom}
                onChange={e => setCustomSymptom(e.target.value)}
                placeholder={language === 'he' ? 'הוסיפי תסמין מותאם אישית' : 'Add custom symptom'}
                className={`input ${language === 'he' ? 'rounded-l-none' : 'rounded-r-none'} flex-1`}
              />
              <button
                type="button"
                onClick={handleAddSymptom}
                className={`btn-outline ${language === 'he' ? 'rounded-r-none border-r-0' : 'rounded-l-none border-l-0'}`}
              >
                {language === 'he' ? 'הוסיפי' : 'Add'}
              </button>
            </div>
            {symptoms.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-1">
                  {language === 'he' ? 'תסמינים שנבחרו:' : 'Selected symptoms:'}
                </p>
                <div className="flex flex-wrap gap-1">
                  {symptoms.map(symptom => (
                    <span 
                      key={symptom} 
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-800"
                    >
                      {getSymptomDisplay(symptom)}
                      <button
                        type="button"
                        onClick={() => handleRemoveSymptom(symptom)}
                        className={`${language === 'he' ? 'mr-1' : 'ml-1'} text-indigo-600 hover:text-indigo-800`}
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'he' ? 'הערות' : 'Notes'}
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              className="input"
              placeholder={language === 'he' 
                ? 'הערות נוספות על הרגשתך' 
                : "Any additional notes about how you're feeling"}
            ></textarea>
          </div>
          
          <div className={`flex ${language === 'he' ? 'justify-start' : 'justify-end'}`}>
            <button type="submit" className="btn-primary">
              <Plus size={20} className={language === 'he' ? 'ml-1' : 'mr-1'} />
              {language === 'he' ? 'הוסיפי רשומה' : 'Add Entry'}
            </button>
          </div>
        </form>
      </div>

      {/* History */}
      <div className="card overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold">
            {language === 'he' ? 'היסטוריית רשומות' : 'Entry History'}
          </h2>
        </div>
        {cycleEntries.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {[...cycleEntries]
              .sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime())
              .map(entry => {
                const flowInfo = flowOptions.find(f => f.value === entry.flow);
                
                return (
                  <li key={entry.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">
                        {formatDateString(entry.date)}
                      </h3>
                      {entry.flow && (
                        <span className={`
                          px-2 py-1 rounded-full text-xs font-medium
                          ${flowInfo?.color} text-rose-800
                        `}>
                          {language === 'he' 
                            ? `זרימה ${getFlowLabel(entry.flow)}` 
                            : `${getFlowLabel(entry.flow)} flow`}
                        </span>
                      )}
                    </div>
                    
                    {entry.symptoms && entry.symptoms.length > 0 && (
                      <div className="mb-2">
                        <p className="text-sm text-gray-500 mb-1">
                          {language === 'he' ? 'תסמינים:' : 'Symptoms:'}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {entry.symptoms.map(symptom => (
                            <span 
                              key={symptom} 
                              className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800"
                            >
                              {getSymptomDisplay(symptom)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {entry.notes && (
                      <p className="text-sm text-gray-600 mt-2">{entry.notes}</p>
                    )}
                  </li>
                );
              })}
          </ul>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>{language === 'he' ? 'אין רשומות עדיין' : 'No entries yet'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FertilityCycle;