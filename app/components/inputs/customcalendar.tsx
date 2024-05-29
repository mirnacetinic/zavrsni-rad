'use client';
import { useState, useEffect } from "react";
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";

interface Reservation {
    checkIn: Date;
    checkOut: Date;
}

interface CustomCalendarProps {
    hidden: boolean;
    onSelect: (date: Date) => void;
    reservations?: Reservation[];
    prices? : {price:number,from:Date,to:Date}[];
    selected?: string;
    disabledBefore?: Date;
    disabledAfter?: Date;
}

const CustomCalendar = ({ hidden, onSelect, selected, disabledBefore, disabledAfter, reservations, prices }: CustomCalendarProps) => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const generateDays = (year: number, month: number) => {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const days: (number | null)[] = [];

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
            if (selectedDate >= now && (!disabledBefore || selectedDate >= disabledBefore) && (!disabledAfter || selectedDate <= disabledAfter) && !(isReserved(day))) {
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

    const isDisabled = (day: number | null) => {
        if (day === null) return true;
        const date = new Date(currentYear, currentMonth, day);
        if ((disabledBefore && date < disabledBefore) || (isNow(currentMonth) && !isFuture(day)) || (disabledAfter && date > disabledAfter)) return true;

        if(prices){
            const setPrice=prices.filter((price)=>price.from<=date && price.to>=date);
            if(setPrice.length!=1) return true;
            
        }

        if (reservations) {
            for (const reservation of reservations) {
                const checkInDate = reservation.checkIn;
                const checkOutDate = reservation.checkOut;

                if (date >= checkInDate && date <= checkOutDate) return true;

                if (disabledBefore && checkInDate > disabledBefore && date > checkOutDate) return true;
                if (disabledAfter && checkOutDate < disabledAfter && date < checkInDate) return true;
            }
        }

        return false;
    };

    const isReserved = (day: number | null) => {
        if (day == null) return false;
        const currentDate = new Date(currentYear, currentMonth, day);
        if (reservations) {
            for (const reservation of reservations) {
                if (currentDate >= reservation.checkIn && currentDate <= reservation.checkOut) {
                    return true;
                }
            }
        }
        return false;
    };

    return (
        <div className={`flex flex-col h-70 w-60 p-4 bg-white cursor-default border rounded border-purple-500 shadow ${hidden ? 'hidden' : ''}`}>
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
                        className={`text-center rounded
                        ${day === selectedDate?.getDate() && currentMonth === selectedDate?.getMonth() && currentYear === selectedDate?.getFullYear() ? 'bg-purple-400 text-white' : ''} 
                        ${isReserved(day) ? 'bg-red-200 cursor-not-allowed ' : isDisabled(day) ? 'text-gray-400 cursor-not-allowed' : 'cursor-pointer'}`}>
                        {day !== null ? day : ''}
                    </div>))}
            </div>
        </div>
    );
};

export default CustomCalendar;
