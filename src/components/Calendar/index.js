import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

export const Calendar = () => {
  // Initialize with current date
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(currentDate.getDate());
  const [weekDays, setWeekDays] = useState([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarRef, setCalendarRef] = useState(null);
  
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
  
  useEffect(() => {
    function handleClickOutside(event) {
      if (calendarRef && !calendarRef.contains(event.target)) {
        setIsCalendarOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [calendarRef]);
  
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
  
  const formatShortDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  const isToday = (day, month, year) => {
    const today = new Date();
    return day === today.getDate() && 
           month === today.getMonth() && 
           year === today.getFullYear();
  };
  
  const toggleCalendar = () => {
    setIsCalendarOpen(prev => !prev);
  };
  
  return (
    <div className="relative" ref={setCalendarRef}>
      <button 
        onClick={toggleCalendar}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-all duration-200"
      >
        <CalendarIcon size={16} />
        <span className="text-sm font-medium">{formatShortDate(new Date())}</span>
      </button>
      
      {isCalendarOpen && (
        <div className="absolute right-0 top-12 bg-white shadow-lg rounded-lg p-4 z-40 border border-gray-100 w-64">
          <div className="flex items-center justify-between mb-3">
            <button onClick={prevMonth} className="p-1 rounded-full hover:bg-gray-100 text-gray-600">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <h2 className="text-sm font-medium text-gray-800">{formatMonthYear(currentMonth)}</h2>
            <button onClick={nextMonth} className="p-1 rounded-full hover:bg-gray-100 text-gray-600">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-7 mb-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <div key={index} className="w-8 h-8 flex items-center justify-center text-xs text-gray-500 font-medium">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {weekDays.map((day, index) => (
              <div
                key={index}
                className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer text-xs transition-colors
                  ${isToday(day.date, day.month, day.year) 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                    : selectedDay === day.date && day.isCurrentMonth 
                      ? 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200' 
                      : !day.isCurrentMonth 
                        ? 'text-gray-400 hover:bg-gray-100' 
                        : 'text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setSelectedDay(day.date)}
              >
                {day.date}
              </div>
            ))}
          </div>
          
          <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between">
            <button 
              className="text-xs text-gray-500 hover:text-gray-700"
              onClick={() => {
                setCurrentDate(new Date());
                setCurrentMonth(new Date());
                setSelectedDay(new Date().getDate());
              }}
            >
              Today
            </button>
            <button 
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
              onClick={() => setIsCalendarOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;