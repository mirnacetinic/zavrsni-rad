'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import CustomCalendar from "../inputs/customcalendar";

const Searchbar = ({ searchParams }: { searchParams?: { whereTo?: string; checkIn?: string; checkOut?: string; guests?: string } }) => {
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

    const handleCheckInSelect = (date: Date) => {
        setCheckIn(date !== null ? date.toDateString() : "");
        setCheckInHidden(true);
    };

    const handleCheckOutSelect = (date: Date) => {
        setCheckOut(date !== null ? date.toDateString() : "");
        setCheckOutHidden(true);
    };

    const checkInDate = checkIn ? new Date(checkIn) : null;
    const checkOutDate = checkOut ? new Date(checkOut) : null;

    return (
        <div>
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
                            <input id="checkIn" type="text" placeholder="Select date" className="searchbar-input" value={checkIn}
                                onClick={showCheckIn} onChange={(e) => setCheckIn(e.target.value)} />
                            <div className="absolute mt-16">
                                <CustomCalendar hidden={checkInHidden} onSelect={handleCheckInSelect} selected={checkIn} disabledAfter={checkOutDate || undefined} />
                            </div>
                        </div>
                        <div className="searchbar-div">
                            <label htmlFor="checkOut" className="searchbar-label">
                                Check out:
                            </label>
                            <input id="checkOut" type="text" placeholder="Select date" className="searchbar-input" value={checkOut}
                                onClick={showCheckOut} onChange={(e) => setCheckOut(e.target.value)} />
                            <div className="absolute mt-16">
                                <CustomCalendar hidden={checkOutHidden} onSelect={handleCheckOutSelect} selected={checkOut} disabledBefore={checkInDate || undefined} />
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
