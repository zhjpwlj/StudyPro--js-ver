import React from 'react';

const HabitCalendar = ({ history, month, year }) => {
    const today = new Date();
    const currentMonth = month !== undefined ? month : today.getMonth();
    const currentYear = year !== undefined ? year : today.getFullYear();

    const completedDates = new Set(
        history.map(dateStr => new Date(dateStr).toDateString())
    );

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const monthName = new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' });

    const calendarDays = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarDays.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentYear, currentMonth, day);
        const isCompleted = completedDates.has(date.toDateString());
        const isToday = date.toDateString() === today.toDateString();

        calendarDays.push(
            <div key={day} className="flex items-center justify-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                    isCompleted
                        ? 'bg-green-500 text-white'
                        : isToday
                        ? 'bg-primary-100 dark:bg-primary-700/50 text-primary-600 dark:text-white ring-1 ring-primary-500'
                        : ''
                }`}>
                    {day}
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg mt-4">
            <h4 className="font-semibold text-center mb-3 text-sm">{monthName} {currentYear}</h4>
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 dark:text-gray-400 mb-2">
                <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
            </div>
            <div className="grid grid-cols-7 gap-1">
                {calendarDays}
            </div>
        </div>
    );
};

export default HabitCalendar;
