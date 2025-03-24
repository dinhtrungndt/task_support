import React, { useState } from 'react'
import { BellDot, ChevronLeft, ChevronRight } from 'lucide-react'

export const HeaderPages = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date(2024, 6)); // July 2024
    const [selectedDay, setSelectedDay] = useState(14); // Day 14 selected by default
    
    // Function to get days in month
    const getDaysInMonth = (year, month) => {
      return new Date(year, month + 1, 0).getDate();
    };
    
    // Function to get day of week the month starts on (0 = Sunday, 1 = Monday, etc.)
    const getStartDayOfMonth = (year, month) => {
      return new Date(year, month, 1).getDay();
    };
    
    // Navigate to previous month
    const prevMonth = () => {
      setCurrentMonth(prev => {
        const newMonth = new Date(prev);
        newMonth.setMonth(newMonth.getMonth() - 1);
        return newMonth;
      });
    };
    
    // Navigate to next month
    const nextMonth = () => {
      setCurrentMonth(prev => {
        const newMonth = new Date(prev);
        newMonth.setMonth(newMonth.getMonth() + 1);
        return newMonth;
      });
    };
    
    // Format the month and year
    const formatMonthYear = (date) => {
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };
    
    // Render the calendar days
    const renderCalendarDays = () => {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      const daysInMonth = getDaysInMonth(year, month);
      const startDay = getStartDayOfMonth(year, month);
      
      const days = [];
      
      // Add empty cells for days before the 1st of the month
      for (let i = 0; i < startDay; i++) {
        days.push(<div key={`empty-${i}`} className="w-8 h-8 flex items-center justify-center text-gray-400"></div>);
      }
      
      // Add actual days
      for (let day = 1; day <= daysInMonth; day++) {
        days.push(
          <div 
            key={day} 
            className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer
              ${selectedDay === day ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
            onClick={() => setSelectedDay(day)}
          >
            {day}
          </div>
        );
      }
      
      return days;
    };

    return (
        <div className='flex justify-between w-full'>
            <div>
                <p className='text-base font-bold'>Nguyễn Đình Trưng</p>
                <p className='text-xs'>Let's finish your task today!</p>
            </div>
            <div className='flex gap-4 items-center'>
                <BellDot size={24} className='cursor-pointer hover:text-indigo-600' />
                <img
                    src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
                    alt=""
                    className="w-10 h-10 rounded-md cursor-pointer"
                />
                <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <button onClick={prevMonth} className="p-1 rounded-full hover:bg-gray-100">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="text-sm font-medium">{formatMonthYear(currentMonth)}</h2>
          <button onClick={nextMonth} className="p-1 rounded-full hover:bg-gray-100">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-1">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <div key={index} className="w-8 h-8 flex items-center justify-center text-xs text-gray-500">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {renderCalendarDays()}
        </div>
      </div>
            </div>
        </div>
    )
}
