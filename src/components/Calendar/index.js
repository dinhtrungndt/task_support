import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Calendar = () => {
  // Initialize with current date
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(currentDate.getDate());
  const [weekDays, setWeekDays] = useState([]);
  
  useEffect(() => {
    const today = new Date(currentDate);
    const day = today.getDate();
    const dayOfWeek = today.getDay();
    
    const startDay = day - dayOfWeek;
    
    const weekArray = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(startDay + i);
      weekArray.push({
        date: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
        isCurrentMonth: date.getMonth() === today.getMonth()
      });
    }
    
    setWeekDays(weekArray);
  }, [currentDate]);
  
  const prevMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() - 1);
      return newMonth;
    });
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };
  
  const nextMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() + 1);
      return newMonth;
    });
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };
  
  const formatMonthYear = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };
  
  const isToday = (day, month, year) => {
    const today = new Date();
    return day === today.getDate() && 
           month === today.getMonth() && 
           year === today.getFullYear();
  };
  
  return (
    <div className="max-w-xs">
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
        {weekDays.map((day, index) => (
          <div
            key={index}
            className={`w-6 h-6 rounded-full flex items-center justify-center cursor-pointer text-xs
              ${isToday(day.date, day.month, day.year) ? 'bg-blue-500 text-white' : 
                 selectedDay === day.date && day.isCurrentMonth ? 'bg-gray-200' : 
                 !day.isCurrentMonth ? 'text-gray-400' : 'text-gray-700'}`}
            onClick={() => setSelectedDay(day.date)}
          >
            {day.date}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;