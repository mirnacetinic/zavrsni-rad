'use client';
import { useState, useEffect } from "react";
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";

interface Reservation {
    checkIn: Date;
    checkOut: Date;
}

interface CustomCalendarProps {
    hidden: boolean;
    onSelect?: (date: Date | null) => void;
    onTwoSelect?: (dates: [Date | null, Date | null]) => void;
    reservations?: Reservation[];
    prices?: { price: number, from: Date, to: Date, closed: boolean }[];
    selected?: Date | null;
    secondSelected?: Date | null;  
    disabledBefore?: Date;
    disabledAfter?: Date;
    closedDates?: { start: Date, end: Date }[];
}

const CustomCalendar = ({ hidden, onSelect, onTwoSelect, selected, secondSelected, disabledBefore, disabledAfter, reservations, prices, closedDates }: CustomCalendarProps) => {
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

    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [secondSelectedDate, setSecondSelectedDate] = useState<Date | null>(null);
    const [currentDate, setCurrentDate] = useState(selectedDate || now);
    const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
    const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
    const days = generateDays(currentYear, currentMonth);

    useEffect(() => {
        if (selected && !selectedDate) {
            handleDayClick(selected.getDate());
        }
        if (secondSelected && !secondSelectedDate) {
            setSecondSelectedDate(secondSelected);
        }
    }, [selected, selectedDate, secondSelected, secondSelectedDate]);

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
        if (day === null || isDisabled(day) || isClosed(day) || isReserved(day)){
            if(!selectedDate){
                onSelect?.(null);
            }
            return;
        }
        const clickedDate = new Date(currentYear, currentMonth, day);

        if (onSelect) {
            if (selectedDate && clickedDate.getTime() === selectedDate.getTime()) {
                setSelectedDate(null);
                onSelect(null);
            } else {
                setSelectedDate(clickedDate);
                onSelect(clickedDate);
            }
        } else if (onTwoSelect) {
            if (selectedDate && clickedDate.getTime() === selectedDate.getTime()) {
                setSelectedDate(null);
                setSecondSelectedDate(null);
                onTwoSelect([null, null]);
            } else if (clickedDate >= now && (!disabledBefore || clickedDate > disabledBefore) && (!disabledAfter || clickedDate < disabledAfter)) {
                if (!selectedDate) {
                    setSelectedDate(clickedDate);
                    onTwoSelect([clickedDate, secondSelectedDate]);
                } else if (selectedDate && !secondSelectedDate) {
                    setSecondSelectedDate(clickedDate);
                    clickedDate > selectedDate? onTwoSelect([selectedDate, clickedDate]) : onTwoSelect([clickedDate, selectedDate])
                } else {
                    setSelectedDate(clickedDate);
                    setSecondSelectedDate(null);
                    onTwoSelect([clickedDate, null]);
                }
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
        if ((disabledBefore && date <= disabledBefore) || (isNow(currentMonth) && !isFuture(day)) || (disabledAfter && date >= disabledAfter)) return true;

        if (prices) {
            const setPrice = prices.filter((price) => price.from <= date && price.to >= date);
            if (setPrice.length !== 1 || setPrice.find(p=>p.closed)) return true;
            for (const price of prices) {
                if (price.closed) {
                    if (date >= price.from && date <= price.to) return true;
                    if (disabledBefore && price.from > disabledBefore && date > price.to) return true;
                    if (disabledAfter && price.to < disabledAfter && date < price.from) return true;
                    }
                }
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

    const isClosed = (day: number | null) => {
        if (day == null) return false;
        const currentDate = new Date(currentYear, currentMonth, day);
        if (closedDates) {
            for (const closedDate of closedDates) {
                if (currentDate >= closedDate.start && currentDate <= closedDate.end) {
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
                        ${(day === selectedDate?.getDate() || day === secondSelectedDate?.getDate()) && currentMonth === (selectedDate?.getMonth() || secondSelectedDate?.getMonth()) && currentYear === (selectedDate?.getFullYear() || secondSelectedDate?.getFullYear()) ? 'bg-purple-400 text-white' : ''} 
                        ${isReserved(day) ? 'bg-red-200 cursor-not-allowed ' : isClosed(day) ? 'bg-purple-400 ' : isDisabled(day) ? 'text-gray-400 cursor-not-allowed' : 'cursor-pointer'}`}>
                        {day !== null ? day : ''}
                    </div>))}
            </div>
        </div>
    );
};

export default CustomCalendar;
