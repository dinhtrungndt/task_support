import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 3)); 
  const [selectedDay, setSelectedDay] = useState(24);
  
  const prevMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() - 1);
      return newMonth;
    });
  };
  
  const nextMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() + 1);
      return newMonth;
    });
  };
  
  const formatMonthYear = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };
  
  const renderWeekRow = () => {
    const days = [24, 25, 26, 27, 28, 29, 30]; 
    
    return days.map(day => (
      <div
        key={day}
        className={`w-6 h-6 rounded-full flex items-center justify-center cursor-pointer text-xs
          ${selectedDay === day ? 'bg-blue-500 text-white' : 'text-gray-700'}`}
        onClick={() => setSelectedDay(day)}
      >
        {day}
      </div>
    ));
  };
  
  return (
    <div className="max-w-xs border border-gray-200 p-2 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <button onClick={prevMonth} className="p-1 rounded-full hover:bg-gray-100">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h2 className="text-xs font-medium">{formatMonthYear(currentMonth)}</h2>
        <button onClick={nextMonth} className="p-1 rounded-full hover:bg-gray-100">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      
      <div className="flex justify-between mb-1">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <div key={index} className="w-6 h-6 flex items-center justify-center text-xs text-gray-500">
            {day}
          </div>
        ))}
      </div>
      
      <div className="flex justify-between">
        {renderWeekRow()}
      </div>
    </div>
  );
};

export default Calendar;