import React, { useState } from 'react';
import { useAppContext, WeightEntry } from '../context/AppContext';
import { format, parseISO } from 'date-fns';
import { he } from 'date-fns/locale';
import { Line } from 'react-chartjs-2';
import { Weight as WeightIcon, Plus, ArrowDown, ArrowUp, Edit, Trash2, X, Check } from 'lucide-react';

const WeightTracker: React.FC = () => {
  const { weightEntries, addWeightEntry, updateWeightEntry, deleteWeightEntry, language, t } = useAppContext();
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  
  // Editing state
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [editWeight, setEditWeight] = useState('');
  const [editDate, setEditDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const weightValue = parseFloat(weight);
    
    if (!isNaN(weightValue) && weightValue > 0) {
      addWeightEntry({
        date,
        weight: weightValue
      });
      setWeight('');
    }
  };
  
  // Start editing an entry
  const handleEdit = (entry: WeightEntry) => {
    setEditingEntryId(entry.id);
    setEditWeight(entry.weight.toString());
    setEditDate(entry.date);
  };
  
  // Cancel editing
  const handleCancelEdit = () => {
    setEditingEntryId(null);
  };
  
  // Save edited entry
  const handleSaveEdit = () => {
    if (editingEntryId && editWeight) {
      const weightValue = parseFloat(editWeight);
      if (!isNaN(weightValue) && weightValue > 0) {
        updateWeightEntry(editingEntryId, {
          weight: weightValue,
          date: editDate
        });
        setEditingEntryId(null);
      }
    }
  };
  
  // Delete entry with confirmation
  const handleDelete = (id: string) => {
    if (window.confirm(language === 'he' ? 'האם אתה בטוח שברצונך למחוק רשומת משקל זו?' : 'Are you sure you want to delete this weight entry?')) {
      deleteWeightEntry(id);
    }
  };

  // Sort entries by date, most recent first for displaying in the table
  const sortedEntries = [...weightEntries].sort(
    (a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime()
  );

  // Sort entries by date, oldest first for chart
  const chartEntries = [...sortedEntries].reverse().slice(-30);

  // Format date according to current language
  const formattedDate = (date: Date) => {
    if (language === 'he') {
      return format(date, 'EEEE, d MMMM yyyy', { locale: he });
    }
    return format(date, 'EEEE, MMMM d, yyyy');
  };

  // Format short date according to current language
  const formatShortDate = (dateStr: string) => {
    if (language === 'he') {
      return format(parseISO(dateStr), 'd MMMM, yyyy', { locale: he });
    }
    return format(parseISO(dateStr), 'MMMM d, yyyy');
  };

  const chartData = {
    labels: chartEntries.map(entry => format(parseISO(entry.date), 'MMM d', { locale: language === 'he' ? he : undefined })),
    datasets: [
      {
        label: `${t('weight')} (kg)`,
        data: chartEntries.map(entry => entry.weight),
        borderColor: 'rgb(79, 70, 229)',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        min: Math.min(...chartEntries.map(e => e.weight)) - 1,
        max: Math.max(...chartEntries.map(e => e.weight)) + 1,
      },
    },
  };

  // Calculate stats
  const calculateStats = () => {
    if (weightEntries.length === 0) return { current: 0, change: 0, average: 0 };
    
    const current = sortedEntries[0].weight;
    const change = sortedEntries.length > 1 
      ? current - sortedEntries[1].weight 
      : 0;
    
    const sum = sortedEntries.reduce((acc, entry) => acc + entry.weight, 0);
    const average = sum / sortedEntries.length;
    
    return { current, change, average };
  };

  const { current, change, average } = calculateStats();
  const sinceLastEntry = language === 'he' ? 'מאז הרשומה האחרונה' : 'since last entry';

  return (
    <div className="space-y-6 pb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{t('weight')} {t('history')}</h1>
        <div className="text-sm text-gray-500">
          {formattedDate(new Date())}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4">
          <h3 className="text-sm font-medium text-gray-500">{t('current')} {t('weight')}</h3>
          <p className="text-2xl font-semibold text-gray-900">{current.toFixed(1)} kg</p>
          <div className="mt-1 flex items-center">
            {change !== 0 && (
              <>
                {change < 0 ? (
                  <ArrowDown className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <ArrowUp className="h-4 w-4 text-rose-500 mr-1" />
                )}
                <span 
                  className={`text-sm ${change < 0 ? 'text-green-600' : 'text-rose-600'}`}
                >
                  {Math.abs(change).toFixed(1)} kg {sinceLastEntry}
                </span>
              </>
            )}
          </div>
        </div>
        
        <div className="card p-4">
          <h3 className="text-sm font-medium text-gray-500">{t('average')} {t('weight')}</h3>
          <p className="text-2xl font-semibold text-gray-900">{average.toFixed(1)} kg</p>
          <p className="text-sm text-gray-500 mt-1">
            {language === 'he' 
              ? `מבוסס על ${weightEntries.length} רשומות` 
              : `Based on ${weightEntries.length} entries`}
          </p>
        </div>
        
        <div className="card p-4">
          <h3 className="text-sm font-medium text-gray-500">{t('addNew')} {t('weight')}</h3>
          <form onSubmit={handleSubmit} className="mt-2 flex items-end space-x-2">
            <div className="flex-1">
              <label htmlFor="weight" className="sr-only">{t('weight')} (kg)</label>
              <input
                type="number"
                id="weight"
                value={weight}
                onChange={e => setWeight(e.target.value)}
                placeholder={language === 'he' ? 'משקל בק"ג' : 'Weight in kg'}
                step="0.1"
                min="20"
                max="300"
                required
                className="input"
              />
            </div>
            <div>
              <button 
                type="submit" 
                className="btn-primary h-full"
                disabled={!weight}
              >
                <Plus size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Weight chart */}
      <div className="card p-4">
        <h2 className="text-lg font-semibold mb-4">{t('weight')} {t('history')}</h2>
        <div style={{ height: '300px' }}>
          {chartEntries.length > 0 ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <WeightIcon size={48} className="mb-2 text-gray-300" />
              <p>{t('noData')}</p>
              <p className="text-sm">
                {language === 'he' 
                  ? 'הוסף את הרשומה הראשונה שלך כדי לראות את ההתקדמות שלך' 
                  : 'Add your first entry to see your progress'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Entry history table */}
      <div className="card overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold">{t('history')}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('date')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('weight')} (kg)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'he' ? 'שינוי' : 'Change'}
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'he' ? 'פעולות' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedEntries.map((entry, index) => {
                const prevEntry = sortedEntries[index + 1];
                const weightChange = prevEntry ? entry.weight - prevEntry.weight : 0;
                const isEditing = editingEntryId === entry.id;
                
                return (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    {isEditing ? (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="date"
                            value={editDate}
                            onChange={e => setEditDate(e.target.value)}
                            className="input text-sm"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            value={editWeight}
                            onChange={e => setEditWeight(e.target.value)}
                            step="0.1"
                            min="20"
                            max="300"
                            className="input text-sm w-24"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {/* Empty during edit */}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <button
                            type="button"
                            onClick={handleSaveEdit}
                            className="p-1.5 rounded-full bg-green-50 text-green-600 hover:bg-green-100 inline-flex items-center justify-center"
                            title={language === 'he' ? 'שמור' : 'Save'}
                          >
                            <Check size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="p-1.5 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 inline-flex items-center justify-center"
                            title={language === 'he' ? 'בטל' : 'Cancel'}
                          >
                            <X size={16} />
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatShortDate(entry.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {entry.weight.toFixed(1)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {weightChange !== 0 && (
                            <span className={weightChange < 0 ? 'text-green-600' : 'text-rose-600'}>
                              {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(entry)}
                            className="p-1.5 rounded-full text-gray-400 hover:bg-gray-100 hover:text-blue-500 inline-flex items-center justify-center"
                            title={language === 'he' ? 'ערוך' : 'Edit'}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(entry.id)}
                            className="p-1.5 rounded-full text-gray-400 hover:bg-gray-100 hover:text-red-500 inline-flex items-center justify-center"
                            title={language === 'he' ? 'מחק' : 'Delete'}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
              {weightEntries.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    {t('noEntries')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WeightTracker;