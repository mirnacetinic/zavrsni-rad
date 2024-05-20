'use client';
import { useState, useEffect } from "react";
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";

interface CustomCalendarProps {
    hidden: boolean;
    onSelect: (date: Date) => void;
    selected?: string;
    disabledBefore?: Date;
    disabledAfter?: Date;
}

const CustomCalendar = ({ hidden, onSelect, selected, disabledBefore, disabledAfter }: CustomCalendarProps) => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const generateDays = (year: number, month: number) => {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const days = [];

        for (let i = 0; i < firstDay.getDay(); i++) {
            days.push(null);
        }
        for (let i = 1; i <= lastDay.getDate(); i++) {
            days.push(i);
        }

        return days;
    };

    const [currentDate, setCurrentDate] = useState(now);
    const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
    const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const days = generateDays(currentYear, currentMonth);

    useEffect(() => {
        if (selected && !selectedDate) {
            setSelectedDate(new Date(selected));
        }
    }, [selected, selectedDate]);

    const handlePrevMonth = () => {
        if (isNow(currentMonth)) {
            return;
        }
        const prevMonth = new Date(currentYear, currentMonth - 1, 1);
        setCurrentDate(prevMonth);
        setCurrentMonth(prevMonth.getMonth());
        setCurrentYear(prevMonth.getFullYear());
    };

    const handleNextMonth = () => {
        const nextMonth = new Date(currentYear, currentMonth + 1, 1);
        setCurrentDate(nextMonth);
        setCurrentMonth(nextMonth.getMonth());
        setCurrentYear(nextMonth.getFullYear());
    };

    const handleDayClick = (day: number | null) => {
        if (day !== null) {
            const selectedDate = new Date(currentYear, currentMonth, day, 23);
            if (selectedDate >= now && (!disabledBefore || selectedDate >= disabledBefore) && (!disabledAfter || selectedDate <= disabledAfter)) {
                setSelectedDate(selectedDate);
                onSelect(selectedDate);
            }
        }
    };

    const isFuture = (day: number) => {
        return day >= now.getDate();
    };
    
    const isNow = (month: number) => {
        return now.getMonth() === month && now.getFullYear() === currentYear;
    };

    const isDisabled = (day: number) => {
        const date = new Date(currentYear, currentMonth, day);
        return (disabledBefore && date < disabledBefore) || (disabledAfter && date > disabledAfter);
    };

    return (
        <div className={`flex flex-col h-70 w-60 p-4 bg-white border rounded border-purple-500 shadow ${hidden ? 'hidden' : ''}`}>
            <div className="flex items-center justify-between bg-purple-400 rounded p-1 mb-1">
                <AiFillCaretLeft className={`cursor-pointer ${isNow(currentMonth) ? 'opacity-50 disabled' : ''}`} onClick={handlePrevMonth} />
                <span className="text-lg font-semibold">{months[currentMonth]} {currentYear}</span>
                <AiFillCaretRight className="cursor-pointer" onClick={handleNextMonth} />
            </div>
            <div className="p-2 grid grid-cols-7 gap-1 border rounded border-gray-400">
                <div className="text-center text-gray-600">Su</div>
                <div className="text-center text-gray-600">Mo</div>
                <div className="text-center text-gray-600">Tu</div>
                <div className="text-center text-gray-600">We</div>
                <div className="text-center text-gray-600">Th</div>
                <div className="text-center text-gray-600">Fr</div>
                <div className="text-center text-gray-600">Sa</div>
                {days.map((day, index) => (
                    <div key={index} onClick={() => handleDayClick(day)}
                        className={`text-center cursor-pointer 
                        ${day === selectedDate?.getDate() && currentMonth === selectedDate?.getMonth() && currentYear === selectedDate?.getFullYear() ? 'bg-purple-400 text-white' : ''} 
                        ${day !== null && isNow(currentMonth) && !isFuture(day) ? 'disabled text-gray-400' : ''} 
                        ${day !== null && isDisabled(day) ? 'disabled text-gray-400 cursor-not-allowed' : ''}`}>
                        {day}
                    </div>))}
            </div>
        </div>
    );
};

export default CustomCalendar;
