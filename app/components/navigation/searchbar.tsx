'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import CustomCalendar from "../inputs/customcalendar";

const Searchbar = ({ searchParams } : { searchParams?: { whereTo?: string; checkIn?: string; checkOut?: string; guests?: string } }) => {
    const router = useRouter();
    const [whereTo, setWhereTo] = useState(searchParams?.whereTo || "");
    const [checkIn, setCheckIn] = useState(searchParams?.checkIn || "");
    const [checkOut, setCheckOut] = useState(searchParams?.checkOut || "");
    const [guests, setGuests] = useState(searchParams?.guests || "");
    const [checkInHidden, setCheckInHidden] = useState(true);
    const [checkOutHidden, setCheckOutHidden] = useState(true);

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (whereTo) params.set("whereTo", whereTo);
        if (checkIn) params.set("checkIn", checkIn);
        if (checkOut) params.set("checkOut", checkOut);
        if (guests) params.set("guests", guests);

        router.push(`/accommodations?${params.toString()}`);
    };

    const showCheckIn = () => {
        setCheckInHidden(!checkInHidden);
        setCheckOutHidden(true);
    };

    const showCheckOut = () => {
        setCheckOutHidden(!checkOutHidden);
        setCheckInHidden(true);
    };

    const handleDateSelect = (date: Date | null, setDate: (date: string) => void, hideCalendar: () => void) => {
        if(date){
          setDate(date.toDateString());
          hideCalendar();
        }
        else{ 
          setDate("");
        }
      };

    const checkInDate = checkIn ? new Date(checkIn) : undefined;
    const checkOutDate = checkOut ? new Date(checkOut) : undefined;

    return (
        <div className="z-20">
            <div className="searchbar-container">
                <div className="searchbar rounded md:rounded-full">
                    <div className="flex flex-col md:flex-row items-center justify-between px-4">
                        <div className="searchbar-div">
                            <label htmlFor="whereTo" className="searchbar-label">
                                Where to:
                            </label>
                            <input id="whereTo" type="text" placeholder="Enter destination" className="searchbar-input" value={whereTo}
                                onChange={(e) => setWhereTo(e.target.value)} />
                        </div>
                        <div className="searchbar-div">
                            <label htmlFor="checkIn" className="searchbar-label">
                                Check in:
                            </label>
                            <input readOnly id="checkIn" type="text" placeholder="Select date" className="searchbar-input" value={checkIn}
                                onClick={showCheckIn} onChange={(e) => setCheckIn(e.target.value)} />
                            <div className="absolute mt-16">
                                <CustomCalendar hidden={checkInHidden} onSelect={(date) => handleDateSelect(date, setCheckIn, () => setCheckInHidden(true))} selected={checkInDate} disabledAfter={checkOutDate} />
                            </div>
                        </div>
                        <div className="searchbar-div">
                            <label htmlFor="checkOut" className="searchbar-label">
                                Check out:
                            </label>
                            <input readOnly id="checkOut" type="text" placeholder="Select date" className="searchbar-input" value={checkOut}
                                onClick={showCheckOut} onChange={(e) => setCheckOut(e.target.value)} />
                            <div className="absolute  mt-16">
                                <CustomCalendar hidden={checkOutHidden} onSelect={(date) => handleDateSelect(date, setCheckOut, () => setCheckOutHidden(true))} selected={checkOutDate} disabledBefore={checkInDate} />
                            </div>
                        </div>
                        <div className="searchbar-div">
                            <label htmlFor="guests" className="searchbar-label">
                                Guests:
                            </label>
                            <input id="guests" type="number" min={1} placeholder="Number of guests" className="searchbar-input" value={guests}
                                onChange={(e) => setGuests(e.target.value)} />
                        </div>
                        <div>
                            <button className="searchbar-button" onClick={handleSearch}>
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Searchbar;
